package main

const oauthState = "3PkJxwjo+A6aeTFkHxyM7D8LUF0wk8tBf9wMWBdMyFs=" // use per request state
const oauthGoogleClientID = "597582706377-di5s6r5754fj545ovcse3ef8fn9qlurc.apps.googleusercontent.com"
const oauthGoogleSecret = "2WXp4O5exV8V-ML8ycQ8VjDG"
const oauthFacebookClientID = "2201832636804556"
const oauthFacebookSecret = "31b6ce15854224294168657f54e3003e"

const cookieEncodeKey = "Z9v9rfx9LvZ3whOj5oxlh/9FgQBtKXp9erqwjg5UakE="
const coookieEncryptKey = "HKy31OEYFdTmO7qe2qqK2H++SGvAIZegXhujDVRQqrc="

// db
const dbHost = "127.0.0.1"
const dbPort = "5432"
const dbUser = "thelmn"
const dbPass = "asdfghjkl"
const dbName = "mssrt_dt_1"

var mqttBroker = "tcp://localhost:1883"
var mqttClientID = "mrs2"
var mqttUser = "mssrt_cli_1"
var mqttPass = "asdfghjkl"

var mqttDataTopic = "+/dt"
var mqttCmdTopic = "ax/cd"
