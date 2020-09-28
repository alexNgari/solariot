package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var mqttCli mqtt.Client

var heaterStatus = true

var logger mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	clientName := strings.Split(msg.Topic(), "/")[0]
	log.Printf("cli: %s, topic: %s, msg: %s\n", clientName, msg.Topic(), msg.Payload())
}

func setupMQTTCli() {
	opts := mqtt.NewClientOptions().AddBroker(mqttBroker)
	opts.SetClientID(mqttClientID)
	opts.SetDefaultPublishHandler(logger)
	opts.SetUsername(mqttUser)
	opts.SetPassword(mqttPass)

	mqttCli = mqtt.NewClient(opts)
	if token := mqttCli.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal("client connect: ", token.Error())
	} else {
		log.Println("connected to server")
	}
}

func toggleHeater(w http.ResponseWriter, r *http.Request) {
	// TODO you can do better, Lyson
	var msg = "ON"
	if heaterStatus {
		msg = "OFF"
	}
	heaterStatus = !heaterStatus

	sendCmd("ax", "heater", msg)
}

func sendCmd(client, subtopic, msg string) {
	topic := fmt.Sprintf("%s/cd/%s", client, subtopic)
	token := mqttCli.Publish(topic, 0, false, msg)
	if token.Wait() && token.Error() != nil {
		log.Printf("publish msg %s to %s: %v\n", msg, topic, token.Error())
	}
}
