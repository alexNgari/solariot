package main

import (
	"bytes"
	"log"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	idb "github.com/influxdata/influxdb1-client/v2"
)

var mqttCli mqtt.Client

var link chan *idb.Point
var dbWriting = false

var lastTime time.Time

var logger mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	clientName := strings.Split(msg.Topic(), "/")[0]
	metrics := bytes.Split(msg.Payload(), []byte(","))
	log.Printf("cli: %s, topic: %s, msg: %s\n", clientName, msg.Topic(), msg.Payload())

	tags := map[string]string{
		keyClient: clientName,
	}
	fields := map[string]interface{}{}
	var pTime time.Time

	for _, metric := range metrics {
		set := bytes.Split(metric, []byte(":"))
		if len(set) != 2 {
			log.Printf("malformed metric: %s\n", string(metric))
			return
		}
		k := string(set[0])
		if k == keyTime {
			ms, err := strconv.Atoi(string(set[1])) // absolute time in ms
			if err != nil {
				log.Printf("malformed point time: %s, %v\n", string(metric), err)
				return
			}
			ns := int64(ms) * int64(time.Millisecond)
			pTime = time.Unix(0, ns)
			log.Println(pTime)
			continue
		}
		v, err := strconv.ParseFloat(string(set[1]), 64)
		if err != nil {
			log.Printf("malformed metric value: %s\n", string(metric))
			return
		}
		fields[k] = v
	}

	p, err := idb.NewPoint(influxDataTbl, tags, fields, pTime)
	if err != nil {
		log.Println("creating point: ", err)
		return
	}
	link <- p
}

func main() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	link = make(chan *idb.Point, 128)
	setupIDB()
	defer closeIDB()

	setupMQTTCli()

	// wait until the terminal is terminated by SIGINT or SIGTERM to exit
	<-c
}

func setupMQTTCli() {
	opts := mqtt.NewClientOptions().AddBroker(mqttBroker)
	opts.SetClientID(mqttClientID)
	opts.SetDefaultPublishHandler(logger)
	opts.SetUsername(mqttUser)
	opts.SetPassword(mqttPass)

	opts.OnConnect = func(c mqtt.Client) {
		if token := c.Subscribe(mqttDataTopic, 0, logger); token.Wait() && token.Error() != nil {
			log.Fatal("onConnect: ", token.Error())
		} else {
			if !dbWriting {
				go writeIDB()
			}
		}
	}
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal("client connect: ", token.Error())
	} else {
		log.Println("connected to server")
	}

}
