package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"./db"
	"./session"
	"./utils"
)

const cookieCredsKey = "creds"
const cookieProviderKey = "provider"
const userIDKey = "user_id"

const sessionKey utils.ContextKey = "session"
const userKey utils.ContextKey = "user_id"

const timestampKey = "timestamp"
const csrfKey = "csrf"

const authCookieDuration = 24 * 30 * 2 * time.Hour

const (
	authErr         = "auth_err"
	unknownOrigin   = "unknown_origin"
	invalidParams   = "invalid_params"
	invalidUserType = "invalid_user_type"
	invalidGrade    = "invalid_grade"
	invalidSchoolID = "invalid_school_id"
	missingParam    = "missing_param"
)

func mustAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess := r.Context().Value(sessionKey).(session.Session)
		_userID := sess.Get(userIDKey)
		if _userID == nil { // not signed in
			if client := r.Header.Get("X-Requested-With"); client == "XMLHttpRequest" {
				// axios request
				http.Error(w, authErr, http.StatusUnauthorized)
				return
			}
			cookie, ok := utils.NewCookie(
				utils.CookieInitialLoc,
				"/", true, 15*time.Minute,
				utils.CookieMap{utils.CookieInitialLoc: r.URL.Path})
			if ok {
				http.SetCookie(w, cookie)
				utils.SetLocation(w, "/login")
				w.WriteHeader(http.StatusTemporaryRedirect)
				return
			}
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		// signed in.
		userID := _userID.(uint)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userKey, userID)))
	})
}

func checkCSRF(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess, ok := r.Context().Value(sessionKey).(session.Session)
		if !ok {
			http.Error(w, unknownOrigin, http.StatusBadRequest)
			return
		}
		clientToken := r.Header.Get("X-CSRF-Token")
		tokenSet, ok := getCSRF(sess)

		log.Println("tokenSet: ", tokenSet)

		if clientToken == "" || !ok || !tokenSet[clientToken] {
			http.Error(w, unknownOrigin, http.StatusBadRequest)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func sessionInject(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess := sm.SessionStart(w, r)
		timestamp := sess.Get(timestampKey)
		if timestamp == nil {
			sess.Set(timestampKey, time.Now().Unix())
		} else if (timestamp.(int64) + 3600) < time.Now().Unix() {
			sm.SessionDestroy(w, r)
			sess = sm.SessionStart(w, r)
		}
		log.Println("session injected ", sess.SessionID())
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), sessionKey, sess)))
	})
}

func login(w http.ResponseWriter, r *http.Request) {
	sess := r.Context().Value(sessionKey).(session.Session)
	r.ParseForm()
	username := r.FormValue("username")
	password := r.FormValue("password")
	rememberStr := r.FormValue("remember")

	remember := rememberStr != ""

	if empty(username, password) {
		http.Error(w, invalidParams, http.StatusBadRequest)
		return
	}

	user := db.User{
		Username: username,
		Password: password,
	}
	db.PassHash(&user)
	token, err := db.UserLogin(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	// set user id in session
	sess.Set(userIDKey, user.ID)
	// set persistence cookie
	if remember {
		setPersToken(w, token)
	}
	// return user
	utils.JSON(w, user)
}

// register creates a new user if username id unique.
// expects data:
// {name, username, password, user_type, remember}
func register(w http.ResponseWriter, r *http.Request) {
	sess := r.Context().Value(sessionKey).(session.Session)
	r.ParseForm()
	username := r.FormValue("username")
	password := r.FormValue("password")
	rememberStr := r.FormValue("remember")

	email := r.FormValue("email")
	phone := r.FormValue("phone")

	remember := rememberStr != ""

	if empty(username, password) {
		http.Error(w, invalidParams, http.StatusBadRequest)
		return
	}

	user := db.User{
		Username: username,
		Password: password,
	}
	db.PassHash(&user)

	var contacts []*db.Contact

	if !empty(email) {
		contact := db.Contact{
			Value:       email,
			ContactType: db.EmailType,
		}
		contacts = append(contacts, &contact)
	}

	if !empty(phone) {
		contact := db.Contact{
			Value:       phone,
			ContactType: db.PhoneType,
		}
		contacts = append(contacts, &contact)
	}

	token, err := db.UserRegister(&user, contacts...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	// set user id in session
	sess.Set(userIDKey, user.ID)
	// set persistence cookie
	if remember {
		setPersToken(w, token)
	}
	// return user
	utils.JSON(w, user)
}

func getPostParams(val interface{}, r *http.Request) error {
	decoder := json.NewDecoder(r.Body)
	return decoder.Decode(val)
}

func remember(w http.ResponseWriter, r *http.Request) {
	sess := r.Context().Value(sessionKey).(session.Session)

	cmap, err := utils.GetCookieMap(utils.CookieAuth, r)
	if err != nil || cmap["token"] == "" {
		cookie, ok := utils.ExpiredCookie(utils.CookieAuth, utils.CookieAuthLocation)
		if ok {
			http.SetCookie(w, cookie)
		}
		http.Error(w, authErr, http.StatusUnauthorized)
		return
	}
	token := cmap["token"]
	user, newToken, err := db.UserLoginFromToken(token)
	if err != nil {
		cookie, ok := utils.ExpiredCookie(utils.CookieAuth, utils.CookieAuthLocation)
		if ok {
			http.SetCookie(w, cookie)
		}
		http.Error(w, authErr, http.StatusUnauthorized)
		return
	}

	// set user id in session
	sess.Set(userIDKey, user.ID)
	// update pers token
	setPersToken(w, newToken)
	// return user
	utils.JSON(w, user)
}

func setPersToken(w http.ResponseWriter, token string) {
	persCookie, ok := utils.NewCookie(
		utils.CookieAuth,
		utils.CookieAuthLocation,
		true,
		24*30*time.Hour,
		utils.CookieMap{"token": token})
	if !ok {
		log.Println("err: cookie encode error")
		return
	}
	// set persistence cookie
	http.SetCookie(w, persCookie)
}

func checkUsername(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		http.Error(w, missingParam, http.StatusBadRequest)
		return
	}
	available := (db.UsernameAvailable(username) == nil)
	data := &dataAvailable{Available: available}
	utils.JSON(w, data)
	return
}

func getProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := getUserID(w, r)
	if !ok {
		return
	}
	user, err := db.GetProfile(userID)
	if err != nil {
		http.Error(w, "internal", http.StatusInternalServerError)
		return
	}
	utils.JSON(w, user)
}

func logout(w http.ResponseWriter, r *http.Request) {
	authCookie, okA := utils.ExpiredCookie(utils.CookieAuth, utils.CookieAuthLocation)
	sessCookie, okS := utils.ExpiredCookie(utils.CookieSession, "/")
	if !okA || !okS {
		http.Error(w, "internal", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, authCookie)
	http.SetCookie(w, sessCookie)
}

func getUserID(w http.ResponseWriter, r *http.Request) (uint, bool) {
	_userID := r.Context().Value(userKey)
	if _userID == nil {
		http.Error(w, authErr, http.StatusInternalServerError)
		return 0, false
	}
	userID, ok := _userID.(uint)
	if !ok {
		http.Error(w, authErr, http.StatusInternalServerError)
		return 0, false
	}
	return userID, true
}

func empty(vals ...string) bool {
	for _, val := range vals {
		log.Println(val)
		if len(val) < 1 {
			log.Println("true")
			return true
		}
	}
	return false
}
