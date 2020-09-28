package memory

import (
	"container/list"
	"errors"
	"fmt"
	"sync"
	"time"

	"../session"
)

var provider = &Provider{list: list.New()}

// SessionStore implements session.Session
type SessionStore struct {
	sid      string
	accessed time.Time
	value    map[interface{}]interface{}
}

// Get returns value for key from SessionStore value map
func (s *SessionStore) Get(key interface{}) interface{} {
	provider.SessionUpdate(s.sid)
	if val, ok := s.value[key]; ok {
		return val
	}
	return nil
}

// Set sets key->value
func (s *SessionStore) Set(key, value interface{}) error {
	s.value[key] = value
	provider.SessionUpdate(s.sid)
	return nil
}

// Delete removes key
func (s *SessionStore) Delete(key interface{}) error {
	delete(s.value, key)
	provider.SessionUpdate(s.sid)
	return nil
}

// SessionID returns the SessionStore sid
func (s *SessionStore) SessionID() string {
	return s.sid
}

// Provider implements session.Provider
type Provider struct {
	lock     sync.Mutex
	sessions map[string]*list.Element
	list     *list.List
}

// SessionInit creates session sid
func (p *Provider) SessionInit(sid string) (session.Session, error) {
	p.lock.Lock()
	defer p.lock.Unlock()
	v := make(map[interface{}]interface{}, 0)
	sess := &SessionStore{sid: sid, accessed: time.Now(), value: v}
	elem := p.list.PushBack(sess)
	p.sessions[sid] = elem
	return sess, nil
}

// SessionRead gets session sid
func (p *Provider) SessionRead(sid string) (session.Session, error) {
	if elem, ok := p.sessions[sid]; ok {
		return elem.Value.(*SessionStore), nil
	}
	sess, err := p.SessionInit(sid)
	return sess, err
}

// SessionDestroy deletes session sid
func (p *Provider) SessionDestroy(sid string) error {
	if elem, ok := p.sessions[sid]; ok {
		delete(p.sessions, sid)
		p.list.Remove(elem)
		return nil
	}
	return errors.New(fmt.Sprint("no session with id ", sid))
}

// SessionGC starts GC
func (p *Provider) SessionGC(maxlifetime int64) {
	p.lock.Lock()
	defer p.lock.Unlock()

	for {
		elem := p.list.Back()
		if elem == nil {
			break
		}
		if elem.Value.(*SessionStore).accessed.Unix()+maxlifetime < time.Now().Unix() {
			p.list.Remove(elem)
			delete(p.sessions, elem.Value.(*SessionStore).sid)
		} else {
			break
		}
	}
}

// SessionUpdate moves session sid to front of list
func (p *Provider) SessionUpdate(sid string) error {
	p.lock.Lock()
	defer p.lock.Unlock()

	if elem, ok := p.sessions[sid]; ok {
		elem.Value.(*SessionStore).accessed = time.Now()
		p.list.MoveToFront(elem)
		return nil
	}
	return nil
}

func init() {
	provider.sessions = make(map[string]*list.Element, 0)
	session.Register("memory", provider)
}
