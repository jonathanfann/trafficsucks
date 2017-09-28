var express = require('express'),
    request = require('request'),
    secrets = require('./config/index.js'),
    nunjucks = require('nunjucks'),
    app = express();

var api_key = secrets.api_key;

var trafficViewApiUrl = 'https://api.trafficview.org/event/?api-key=' + api_key;
var baseUrl = trafficViewApiUrl;

function getData(done) {
    request.get(baseUrl, function(err, res) {
        done(err, res);
    });
}

// function parseJson(json) {
//     for (event in json.trafficEvents) {
//         res.send(event)
//     }
// }

app.get('/', function (req, res) {
    requestGetTraffic();
})

app.get('/system/:systemId', function (req, res) {
    baseUrl = trafficViewApiUrl + '&system=' + req.params.systemId + '&format=rf-json';
    console.log(req.params);
    getData(function(err, data) {
        console.log(err);
        console.log(data);
        var myArr = JSON.parse(data.body);
        res.send(
            '<h1>Events</h1>' +
            '<h2>' + myArr.trafficEvents.events[0].head.id + '</h2>' +
            '<h3>' + myArr.trafficEvents.events[0].locations[0].description + '</h3>' +
            '<p><strong' + myArr.trafficEvents.events[0].locations[0].linkLocation.locationList[0].onAddress.county + ' County</strong></p>' +
            '<p>' + myArr.trafficEvents.events[0].head.eventType.type + '<br />' +
            '<small>Started: ' + myArr.trafficEvents.events[0].head.dates.started + '</small><br />' +
            myArr.trafficEvents.events[0].locations[0].description + '<br />'
        );
    });
})

app.listen(8888);
console.log('listenin\' at 8888 so get hoppin on that browser');










/* TODO: make it loop then dump results */
