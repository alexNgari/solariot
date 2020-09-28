package main

import (
	"log"

	idb "github.com/influxdata/influxdb1-client/v2"
)

var icli idb.Client

func setupIDB() {
	conf := idb.HTTPConfig{
		Addr:     influxAddr,
		Username: influxUsername,
		Password: influxPassword,
	}
	var err error
	icli, err = idb.NewHTTPClient(conf)
	if err != nil {
		log.Fatal("creating influxdb client: ", err)
	}
	// defer icli.Close()

	// q := idb.NewQuery("select * from vi", influxDB, influxPrec)
	// if resp, err := icli.Query(q); err == nil && resp.Error() == nil {
	// 	log.Println(resp.Results[0].Series[0].Values)
	// } else {
	// 	log.Println(err)
	// 	log.Println(resp.Error())
	// }
}

func closeIDB() {
	if icli != nil {
		icli.Close()
	}
}

func writeIDB() {
	dbWriting = true
	defer func() {
		dbWriting = false
	}()

	var p *idb.Point
	points, err := idb.NewBatchPoints(idb.BatchPointsConfig{
		Database:  influxDB,
		Precision: influxPrec,
	})
	if err != nil {
		log.Fatal("creating batch points: ", err)
		return
	}
	for i := 0; i <= writeBatchSize; i++ {
		p = <-link
		points.AddPoint(p)
		if i == writeBatchSize {
			i = 0
			log.Println("writing batch to db")
			if err := icli.Write(points); err != nil {
				log.Println("writing batch to db: ", err)
			}
		}
	}
}
