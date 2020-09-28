package session

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"
	"time"

	"../utils"
)

var provides = make(map[string]Provider)

// SessionAge of 1 hour
const SessionAge = 3600
const cookieKey = "session"

// Manager is a session manager
type Manager struct {
	cookie   string
	lock     sync.Mutex
	provider Provider
	lifetime int64
}

func (m *Manager) sessionID() string {
	b := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return base64.URLEncoding.EncodeToString(b)
}

// SessionStart checks for existing session for the user or creates a new one
func (m *Manager) SessionStart(w http.ResponseWriter, r *http.Request) (session Session) {
	m.lock.Lock()
	defer m.lock.Unlock()
	cookieMap, err := utils.GetCookieMap(utils.CookieSession, r) // TODO: defer to Authorization header if cookie not present
	if err != nil || cookieMap[cookieKey] == "" {
		sid := m.sessionID()
		session, _ = m.provider.SessionInit(sid)
		cookie, ok := utils.NewCookie(
			utils.CookieSession,
			"/",
			true,
			SessionAge*time.Second,
			utils.CookieMap{cookieKey: url.QueryEscape(sid)})
		if ok {
			http.SetCookie(w, cookie)
		}
		return
	}
	sid, _ := url.QueryUnescape(cookieMap[cookieKey])
	session, _ = m.provider.SessionRead(sid)
	return
}

// SessionDestroy destroys the session
func (m *Manager) SessionDestroy(w http.ResponseWriter, r *http.Request) {
	cookieMap, err := utils.GetCookieMap(utils.CookieSession, r) // TODO: defer to Authorization header if cookie not present
	if err != nil {
		return
	}
	sid, ok := cookieMap[cookieKey]
	if !ok || sid == "" {
		return
	}
	m.lock.Lock()
	defer m.lock.Unlock()
	m.provider.SessionDestroy(sid)
	http.SetCookie(w, &http.Cookie{
		Name:     utils.CookieSession,
		Path:     "/",
		Expires:  time.Now(),
		HttpOnly: true,
		MaxAge:   -1})
}

// GC starts a garbage collect timer
func (m *Manager) GC() {
	m.lock.Lock()
	defer m.lock.Unlock()
	m.provider.SessionGC(m.lifetime)
	time.AfterFunc(time.Duration(m.lifetime), func() {
		m.GC()
	})
}

// NewManager creates a new manager or returns error if providerName does not match supported providers
func NewManager(providerName, cookie string, lifetime int64) (*Manager, error) {
	provider, ok := provides[providerName]
	if !ok {
		return nil, fmt.Errorf("session: newManager: unknown provider %s", providerName)
	}
	return &Manager{provider: provider, cookie: cookie, lifetime: lifetime}, nil
}

// Provider is a storage provider
type Provider interface {
	SessionInit(sid string) (Session, error)
	SessionRead(sid string) (Session, error)
	SessionDestroy(sid string) error
	SessionGC(maxlifetime int64)
}

// Session is a session interface providing set, get, delete value and get current sesion id
type Session interface {
	Set(key, value interface{}) error
	Get(key interface{}) interface{}
	Delete(key interface{}) error
	SessionID() string
}

// Register makes a provider available throught the provided name
// If the provider is nil or the name is already registered it panics
func Register(name string, provider Provider) {
	if provider == nil {
		panic("session: register: provider should not be nil")
	}
	if _, exists := provides[name]; exists {
		panic(fmt.Sprintf("session: register: called twice for %s", name))
	}
	provides[name] = provider
}
