package idb

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/influxdata/influxdb1-client/models"
	idb "github.com/influxdata/influxdb1-client/v2"
)

// ICli is the client
var ICli idb.Client

// SetupIDB starts an influxdb client and connects to the db server
func SetupIDB() {
	conf := idb.HTTPConfig{
		Addr:     influxAddr,
		Username: influxUsername,
		Password: influxPassword,
	}
	var err error
	ICli, err = idb.NewHTTPClient(conf)
	if err != nil {
		log.Fatal("creating influxdb client: ", err)
	}
	// defer ICli.Close()

	// q := idb.NewQuery("select * from vi", influxDB, influxPrec)
	// if resp, err := ICli.Query(q); err == nil && resp.Error() == nil {
	// 	log.Println(resp.Results[0].Series[0].Values)
	// } else {
	// 	log.Println(err)
	// 	log.Println(resp.Error())
	// }
}

// CloseIDB closes the connection
func CloseIDB() {
	if ICli != nil {
		ICli.Close()
	}
}

// Stats is all required stats
type Stats struct {
	V    json.Number
	I    json.Number
	P    json.Number
	AmpH float64
	Flow json.Number
	Temp json.Number
}

// GetStats fetches stats for clientID
func GetStats(clientID string) (Stats, error) {
	// select V,I,P
	var stat Stats

	data, err := runQuery(selectClientLastVIP, struct{ ClientID string }{clientID})
	if err != errNoResults {
		if err != nil {
			return stat, err
		}
		stat.V = data.Values[0][1].(json.Number)
		stat.I = data.Values[0][2].(json.Number)
		stat.P = data.Values[0][3].(json.Number)
	}

	// get AmpS of recent n
	data, err = runQuery(selectClientAmpSIntegral, selectClientAmpIntegralParams{
		ClientID: clientID,
		Field:    "i",
		Count:    2,
	})
	var ampS float64
	log.Println(err)
	if err != errNoResults {
		if err != nil {
			return stat, err
		}

		ampS, err = data.Values[0][1].(json.Number).Float64()
		if err != nil {
			return stat, err
		}
		stat.AmpH = ampS / 3600
		log.Println("ampS: ", ampS)
	}

	data, err = runQuery(selectClientLastFlowTemp, struct{ ClientID string }{clientID})
	if err != errNoResults {
		if err != nil {
			return stat, err
		}
		// get Flow, Temp
		stat.Flow = data.Values[0][1].(json.Number)
		stat.Temp = data.Values[0][2].(json.Number)
	}

	return stat, nil
}

func runQuery(query string, opts interface{}) (models.Row, error) {
	var data models.Row
	str, err := compileQuery("q", query, opts)
	if err != nil {
		return data, errors.New(fmt.Sprint("compiling query: ", err))
	}
	log.Println(str)
	q := idb.NewQuery(str, influxDB, influxPrec)
	resp, err := ICli.Query(q)
	if err != nil || resp.Error() != nil {
		return data, err
	}
	data, err = firstSeries(resp.Results)
	return data, err
}

var errNoResults = errors.New("no results")

func firstSeries(results []idb.Result) (models.Row, error) {
	if len(results) > 0 {
		if len(results[0].Series) > 0 {
			return results[0].Series[0], nil
		}
	}
	return models.Row{}, errNoResults
}
