package idb

import (
	"log"
	"testing"
)

func init() {
	SetupIDB()
}

func TestUpdateStats(t *testing.T) {
	defer CloseIDB()

	data, err := GetStats("ax")
	if err != nil {
		t.Error(err)
	}
	log.Println(data)
	t.Log(data)
}
