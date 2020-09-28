package db

import (
	"fmt"
	"log"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres" // postgres driver dialect
)

var db *gorm.DB

// Connect connects to db and assigns db object
func Connect(host, port, user, password, dbName string) error {
	var err error
	db, err = gorm.Open(
		"postgres",
		fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			host, port, user, password, dbName))
	if err == nil {
		// db.LogMode(true)
		autoMigrate()
	}
	return err
}

// Close closes the db connection if available. Call should be deferred after Connect() in main
func Close() {
	log.Println("closing")
	if db != nil {
		db.Close()
	}
}

func autoMigrate() {
	if db != nil {
		db.AutoMigrate(
			&User{},
			&Contact{},
			&PersistenceToken{},
		)
	}
}

// User is a user's auth details
type User struct {
	gorm.Model
	Username string `gorm:"not null" json:"username"`
	Password string `gorm:"-" json:"-"`
	PassHash string `gorm:"not null" json:"-"`
	Name     string `gorm:"not null" json:"name"`
	UserType uint   `gorm:"default:0" json:"user_type"`
}

// Contact allows a user to have multiple contacts
type Contact struct {
	gorm.Model
	UserID      uint `gorm:"not null"`
	User        User
	ContactType uint   `gorm:"not null"` // 0-email 1-phone
	Value       string `gorm:"not null"`
	IsVerified  bool   `gorm:"default:false"`
}

const (
	// EmailType is an email contact
	EmailType uint = iota
	// PhoneType is a Phone contact
	PhoneType
)

// PersistenceToken logs remember tokens for each user device
type PersistenceToken struct {
	gorm.Model
	UserID uint
	User   User
	Token  string `gorm:"not null"`
	Device string
	Expiry time.Time `gorm:"not null"`
}

// Delete wraps check for primary key not blank before delete
func Delete(value interface{}) {
	if !db.NewRecord(value) {
		db.Delete(value)
	}
}
