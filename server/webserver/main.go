package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"path/filepath"
	"sync"
	"text/template"

	socketio "github.com/googollee/go-socket.io"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"

	"./db"
	"./idb"
	_ "./memory" // memory driver for sessions
	"./session"
	"./utils"
)

const htmlFolder = "../../app/app"

var sm *session.Manager
var ctx context.Context
var sio *socketio.Server

func main() {
	var addr = flag.String("addr", ":8080", "defines the server's address")
	flag.Parse()

	ctx = context.Background()

	idb.SetupIDB()
	defer idb.CloseIDB()

	setupSocketIO()
	defer closeSocketIO()

	setupMQTTCli()

	setupRoutes()
	setupCookies()
	setupSessions()

	// setup DB
	if err := db.Connect(dbHost, dbPort, dbUser, dbPass, dbName); err != nil {
		log.Fatal("main: db: ", err)
	}
	defer db.Close()

	log.Println("serving at ", *addr)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func setupRoutes() {
	r := mux.NewRouter()

	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir("../../app/app/assets"))))

	auth := r.PathPrefix("/api/auth").Subrouter()
	auth.Use(sessionInject, checkCSRF)
	auth.HandleFunc("/login", login).Methods("POST")
	auth.HandleFunc("/register", register).Methods("POST")
	auth.HandleFunc("/checkUsername/{username}", checkUsername).Methods("GET")
	auth.HandleFunc("/remember", remember).Methods("GET")
	auth.HandleFunc("/logout", logout).Methods("GET")

	api := r.PathPrefix("/api").Headers("X-Requested-With", "XMLHttpRequest").Subrouter()
	api.Use(sessionInject, checkCSRF, mustAuth)
	api.HandleFunc("/ctrl/heater", toggleHeater)

	main := r.PathPrefix("/").HeadersRegexp("Accept", "html").Subrouter()
	main.Use(sessionInject)
	main.PathPrefix("/").Handler(&templateHandler{filename: "index.html"})

	http.Handle("/socket.io/", sio)
	http.Handle("/", r)
}

func setupSocketIO() {
	var err error
	sio, err = socketio.NewServer(nil)
	if err != nil {
		log.Fatal("setting up socketio: ", err)
	}
	sio.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		log.Println("socketio connected: ", s.ID())
		return nil
	})
	sio.OnError("/", func(err error) {
		log.Println("socketio error: ", err)
	})
	sio.OnDisconnect("/", func(s socketio.Conn, msg string) {
		log.Println("socketio disconnect: ", s.ID())
	})
	sio.OnEvent("/", "update_stats", func(s socketio.Conn, msg string) string {
		log.Println("update_stats: ", msg)
		data, err := parseMap(msg)
		if err != nil {
			return `{success: false, message: 'bad_request'}`
		}
		cID, ok := data["cID"]
		clientID, okstr := cID.(string)
		if !ok || !okstr {
			return `{success: false, message: 'bad_request'}`
		}
		log.Println("on update_stats: ", msg)
		return updateStats(clientID)
	})
	go sio.Serve()
	// defer sio.Close()
}

func closeSocketIO() {
	sio.Close()
}

func parseMap(msg string) (map[string]interface{}, error) {
	data := map[string]interface{}{}
	err := json.Unmarshal([]byte(msg), &data)
	return data, err
}

// SioResp is a struct for sio responses
type SioResp struct {
	Status  bool        `json:"status"`
	Message interface{} `json:"message"`
}

func JSON(val interface{}) string {
	data, err := json.Marshal(val)
	if err != nil {
		return `{status:false,message:""}`
	}
	return string(data)
}

func updateStats(clientID string) string {
	stats, err := idb.GetStats(clientID)
	if err != nil {
		return JSON(SioResp{Status: false})
	}
	return JSON(SioResp{Status: true, Message: stats})
}

func setupCookies() {
	hashKey, err := base64.StdEncoding.DecodeString(cookieEncodeKey)
	if err != nil {
		log.Fatal("unable to decode hashKey: ", cookieEncodeKey)
	}
	blockKey, err := base64.StdEncoding.DecodeString(coookieEncryptKey)
	if err != nil {
		log.Fatal("unable to decode blockKey: ", coookieEncryptKey)
	}
	utils.SetSC(securecookie.New(hashKey, blockKey))
}

func setupSessions() {
	var err error
	sm, err = session.NewManager("memory", utils.CookieSession, session.SessionAge)
	if err != nil {
		log.Fatal(err)
	}
	go sm.GC()
}

type templateHandler struct {
	once     sync.Once
	filename string
	templ    *template.Template
}

func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// t.once.Do(func() {
	// TODO return {t.once} optimization
	t.templ = template.Must(template.ParseFiles(filepath.Join(htmlFolder, t.filename)))
	// })
	log.Println("template")
	csrfToken := injectCSRF(w, r)
	log.Println("csrf ", csrfToken)
	t.templ.Execute(w, &struct{ CSRF string }{CSRF: csrfToken})
}

func injectCSRF(w http.ResponseWriter, r *http.Request) string {
	csrfToken := utils.GenerateToken(8)
	sess, ok := r.Context().Value(sessionKey).(session.Session)
	if !ok {
		http.Error(w, "no_session", http.StatusInternalServerError)
		return csrfToken
	}
	var token map[string]bool
	if tVal, ok := sess.Get(csrfKey).(map[string]bool); ok {
		token = tVal
	} else {
		token = make(map[string]bool)
	}
	token[csrfToken] = true

	sess.Set(csrfKey, token)
	return csrfToken
}

func getCSRF(sess session.Session) (map[string]bool, bool) {
	if token, ok := sess.Get(csrfKey).(map[string]bool); ok {
		return token, true
	}
	return nil, false
}
