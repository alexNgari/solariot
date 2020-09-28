package idb

import (
	"bytes"
	"html/template"
)

var selectClientLastVIP = `select v,i,v*i from measure where client='{{.ClientID}}' order by time desc limit 1 slimit 1`
var selectClientLastFlowTemp = `select flow,temp from measure where client='{{.ClientID}}' order by time desc limit 1 slimit 1`

type selectClientAmpIntegralParams struct {
	ClientID string
	Field    string
	Count    int
}

var selectClientAmpSIntegral = `select integral({{.Field}}) from (select {{.Field}} from measure where client='{{.ClientID}}' slimit 1) slimit 1`

type selectClientTimeSpanParams struct {
	ClientID string
	Field    string
	TimeUnit string
	Count    int
}

var selectClientTimeSpan = `select sum(elapsed) from (select elapsed({{.Field}},1{{.TimeUnit}}) from measure where client='{{.ClientID}}' order by time desc limit {{.Count}} slimit 1) order by time desc slimit 1`

func compileQuery(tag, query string, params interface{}) (string, error) {
	report, err := template.New(tag).Parse(query)
	if err != nil {
		return "", err
	}
	r := new(bytes.Buffer)
	if err = report.Execute(r, params); err != nil {
		return "", err
	}
	return r.String(), nil
}
