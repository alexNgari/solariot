package db

import (
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"time"

	"../utils"
)

// ErrNoUser is an unregistered username error
var ErrNoUser = errors.New("no_user")

// ErrWrongPassword is returned when there is no record with the username and pass_hash
var ErrWrongPassword = errors.New("wrong_password")

// ErrWrongToken is returned when login by token fails
var ErrWrongToken = errors.New("wrong_token")

// ErrUsernameNotAvailable indicates the username is already in use
var ErrUsernameNotAvailable = errors.New("username_taken")

// ErrInternal indicates an internal server error
var ErrInternal = errors.New("err_internal")

// UserLogin logs in the given user. Returns the persistence token and an error
func UserLogin(user *User) (string, error) {
	token := utils.GenerateToken(16)
	expiry := persistenceTokenExpiry()
	log.Println("rem token ", token)

	var users uint
	db.Model(&User{}).Where("username = ?", user.Username).Count(&users)
	if users == 0 {
		return "", ErrNoUser
	}
	var oldUser User
	db.Where("username = ? AND pass_hash = ?", user.Username, user.PassHash).First(&oldUser)
	if oldUser.ID == 0 {
		return "", ErrWrongPassword
	}
	var rem PersistenceToken
	db.Model(&oldUser).Related(&rem)
	rem.Token = token
	rem.Expiry = expiry
	db.Save(rem)
	*user = oldUser
	return token, nil
}

// UserLoginFromToken logs in user via persistence token. Returns user, token, error
func UserLoginFromToken(token string) (*User, string, error) {
	var rem PersistenceToken
	var user User
	db.Where("token = ? AND expiry > ?", token, time.Now()).First(&rem)
	if rem.ID == 0 {
		return nil, "", ErrWrongToken
	}
	db.Model(&rem).Related(&user)
	if user.ID == 0 {
		db.Delete(&rem)
		return nil, "", ErrWrongToken
	}

	token = utils.GenerateToken(16)
	expiry := persistenceTokenExpiry()

	rem.Token = token
	rem.Expiry = expiry
	db.Save(rem)
	return &user, token, nil
}

// UserRegister registers a new user.
// contacts can be empty
func UserRegister(user *User, contacts ...*Contact) (t string, e error) {
	// check if username is available
	if err := UsernameAvailable(user.Username); err != nil {
		return "", err
	}
	// create user
	if err := db.Create(user).Error; err != nil {
		return "", fmt.Errorf("creating user: %v", err)
	}
	defer func() {
		if e != nil {
			db.Delete(user)
		}
	}()

	// transaction to create contacts
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	if err := tx.Error; err != nil {
		return "", fmt.Errorf("tx begin: %v", err)
	}
	for _, contact := range contacts {
		contact.UserID = user.ID
		if err := tx.Create(contact).Error; err != nil {
			tx.Rollback()
			return "", fmt.Errorf("creating contact %s: %v", contact.Value, err)
		}
	}
	if err := tx.Commit().Error; err != nil {
		return "", fmt.Errorf("tx commit: %v", err)
	}

	// generate token
	token := utils.GenerateToken(16)
	expiry := persistenceTokenExpiry()

	rem := PersistenceToken{
		Token:  token,
		Expiry: expiry,
		UserID: user.ID,
	}

	if err := db.Create(&rem).Error; err != nil {
		return "", fmt.Errorf("creating token: %v", err)
	}
	return token, nil
}

// UsernameAvailable checks if the username is available. Returns error if username not available
func UsernameAvailable(username string) error {
	var count uint
	db.Model(&User{}).Where("username = ?", username).Count(&count)
	if count > 0 {
		return ErrUsernameNotAvailable
	}
	return nil
}

func persistenceTokenExpiry() time.Time {
	return time.Now().Add(24 * 30 * time.Hour)
}

// PassHash sets passhash to base64 encoded, sha256 hash of string password of user
func PassHash(user *User) bool {
	if user == nil || len(user.Password) < 1 {
		return false
	}
	hash := sha256.New()
	_, err := hash.Write([]byte(user.Password))
	if err != nil {
		log.Printf("hashing password %s: %v", user.Password, err)
		return false
	}
	user.PassHash = base64.StdEncoding.EncodeToString(hash.Sum(nil))
	return true
}

// GetProfile returns a user
func GetProfile(userID uint) (*User, error) {
	var user User
	if err := db.First(&user, user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetProfileByUsername returns a user
func GetProfileByUsername(username string) (*User, error) {
	var user User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUsersFromUsernames gets a list of users from a list of usernames
func GetUsersFromUsernames(usernames []string) ([]User, error) {
	var users = make([]User, len(usernames))
	if err := db.Where("username in (?)", usernames).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}
