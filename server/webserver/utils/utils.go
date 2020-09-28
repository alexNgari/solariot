package utils

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/gorilla/securecookie"
)

// ContextKey defines a string type for {http.Request.Context}
type ContextKey string

var sc *securecookie.SecureCookie

// SetSC sets this packages sc
func SetSC(s *securecookie.SecureCookie) {
	sc = s
}

// CookieAuth is the auth(persistence) cookie name
const CookieAuth = "MEM"

// CookieAuthLocation is the location for the persistence token
const CookieAuthLocation = "/api/auth/remember"

// CookieInitialLoc is the initialLocation cookie name
const CookieInitialLoc = "RE_LOC"

// CookieSession is the session cookie name
const CookieSession = "SESS"

// CookieCSRF is the anti-csrf token cookie name
const CookieCSRF = "ACT"

// CookieExpiryKey is the cookie expiry key name
const CookieExpiryKey = "expiry"

// timeFormat is the default format used by {time.Now()}
const timeFormat = "2006-01-02 15:04:05.999999999 -0700 MST"

// ErrCookieExpired is returned by {GetCookieMap()} when the cookie is expired
var ErrCookieExpired = errors.New("cookie is expired")

var specialCharRegexp = regexp.MustCompile(`[^\w\d]`)

// CookieMap is a map[string]string that holds a cookie's data
type CookieMap map[string]string

func setExpiry(data CookieMap, duration time.Duration) {
	expiry := string(0)
	if duration > 0 {
		expiry = fmt.Sprint(time.Now().Add(duration).Unix())
	}
	data["expiry"] = expiry
}

// ExpiredCookie expires the cookie {name} at {path}
func ExpiredCookie(name string, path string) (*http.Cookie, bool) {
	data := make(CookieMap)
	return NewCookie(name, path, true, -1*time.Second, data)
}

// NewCookie creates a cookie that expires after {duration}
// MaxAge=0 means no 'Max-Age' attribute specified.
// MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'
// MaxAge>0 means Max-Age attribute present and given in seconds
func NewCookie(name string, path string, httpOnly bool, duration time.Duration, data CookieMap) (*http.Cookie, bool) {
	setExpiry(data, duration)
	if encoded, err := sc.Encode(name, data); err == nil {
		return &http.Cookie{
			Name:     name,
			Value:    encoded,
			Path:     path,
			HttpOnly: httpOnly,
			MaxAge:   int(duration / time.Second),
		}, true
	}
	return nil, false
}

// GetCookieMap extract data from request {r} or fails and returns (nil, err)
func GetCookieMap(name string, r *http.Request) (amap CookieMap, err error) {
	defer func() {
		log.Printf("cookie %s map err: %v\n ", name, err)
	}()
	cookie, err := r.Cookie(name)
	if err != nil {
		return nil, err
	}
	data := make(CookieMap)
	if err := sc.Decode(name, cookie.Value, &data); err != nil {
		return nil, err
	}
	rawExp, ok := data[CookieExpiryKey]
	if !ok {
		return nil, errors.New("cookie damaged")
	}
	intExp, err := strconv.ParseInt(rawExp, 10, 64)
	if err != nil {
		return nil, err
	}
	expiry := time.Unix(intExp, 0)
	if expiry.Unix() < time.Now().Unix() {
		return nil, ErrCookieExpired
	}
	return data, nil
}

// SetLocation sets the redirect location of the {http.ResponseWriter}
func SetLocation(w http.ResponseWriter, path string) {
	w.Header().Set("Location", path)
}

// SetLocationWithError is similar to SetLocation but sets an error query param with the content {errString}
func SetLocationWithError(w http.ResponseWriter, path string, errString string) {
	w.Header().Set("Location", fmt.Sprintf("%s?error=%s", path, errString))
}

// GenerateToken generates a string from n random bytes
func GenerateToken(n int) string {
	b := make([]byte, n)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

const jsonErr = "json_err"

// JSON write json of val to w or sets StatusInternalServerError if marshalling fails
func JSON(w http.ResponseWriter, val interface{}) {
	data, err := json.Marshal(val)
	if err != nil {
		http.Error(w, jsonErr, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

// CleanSpecialChar replaces all non-(words+digits+_) with _
func CleanSpecialChar(src, repl string) string {
	return specialCharRegexp.ReplaceAllString(src, repl)
}
