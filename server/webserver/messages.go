package main

type status struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

type userProfile struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Pic   string `json:"pic"`
}

type dataAvailable struct {
	Available bool `json:"available"`
}
