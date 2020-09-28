package main

import (
	"encoding/json"
	"log"
	"testing"
)

func TestJson(t *testing.T) {
	jsonText, err := json.Marshal(userProfile{
		Name:  "Name",
		Email: "email",
		Pic:   "pic",
	})
	if err != nil {
		t.Error(err)
	}
	log.Println(string(jsonText))
}
