package main

import "time"

var influxAddr = "http://localhost:8086"
var influxUsername = "admin"
var influxPassword = "root"
var influxDB = "mssrt_ts_1"
var influxDataTbl = "measure"
var influxPrec = "ms"

var mqttBroker = "tcp://localhost:1883"
var mqttClientID = "mrs1"
var mqttUser = "mssrt_cli_1"
var mqttPass = "asdfghjkl"

var mqttDataTopic = "+/dt"
var mqttCmdTopic = "ah/cd"

// counterSpan is the up counter interval in us
var counterSpan = 10 * time.Microsecond

var keyTime = "t"
var keyClient = "client"

var writeBatchSize = 20
