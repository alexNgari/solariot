package db

import (
	"log"
	"testing"
)

// db
const dbHost = "localhost"
const dbPort = "5432"
const dbUser = "thelmn"
const dbPass = "asdfghjkl"
const dbName = "mssrt_dt_1"

func init() {
	// setup DB
	if err := Connect(dbHost, dbPort, dbUser, dbPass, dbName); err != nil {
		log.Fatal("db_test: ", err)
	}
	// defer Close()
}

func TestUserRegisterLogin(t *testing.T) {
	username := "user2"
	password := "asdfghjkl"
	email := "user1@example.com"

	user := User{
		Username: username,
		Name:     "User One",
		Password: password,
	}
	PassHash(&user)
	contact := Contact{
		Value:       email,
		ContactType: EmailType,
	}

	token, err := UserRegister(&user, &contact)
	if err != nil {
		t.Error("registering user: ", err)
		t.FailNow()
	}

	var testUser User
	db.Where("username = ?", username).First(&testUser)
	if testUser.ID == 0 {
		t.Errorf("registered user not found")
	}

	var testContacts []Contact
	db.Model(&testUser).Related(&testContacts)
	if count := len(testContacts); count != 1 {
		t.Error("expecting 1 contact. found ", count)
	}

	if val := testContacts[0].Value; val != email {
		t.Errorf("expecting contact email %s. found %s", email, val)
	}

	var testToken PersistenceToken
	db.Model(&testUser).Related(&testToken)
	if val := testToken.Token; val != token {
		t.Errorf("expecting token %s. found %s", token, val)
	}

	// login test
	loginUser := User{
		Username: username,
		Password: password,
	}
	PassHash(&loginUser)
	token, err = UserLogin(&loginUser)
	if err != nil {
		t.Error("unable to login with credentials: ", err)
	}

	wrongUser := User{
		Username: username,
		Password: "klerklerk./e",
	}
	PassHash(&wrongUser)
	log.Println("passhash: ", wrongUser.PassHash)
	_, err = UserLogin(&wrongUser)
	if err == nil {
		t.Error("should not login with wrong password")
	}

	loggedInUser, token, err := UserLoginFromToken(token)
	if err != nil {
		t.Error("unable to login with token: ", err)
	}
	if loginUser.ID != loggedInUser.ID {
		t.Errorf("logged in users do not match. first login: %d, second try: %d", loginUser.ID, loggedInUser.ID)
	}

	// username available test
	if err = UsernameAvailable(username); err == nil {
		t.Errorf("username still available after registering")
	}

	Delete(&user)
	Delete(&contact)
	Delete(&testToken)

	Close()
}
