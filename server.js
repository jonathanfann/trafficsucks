var express = require('express'),
    request = require('request'),
    secrets = require('./config/index.js'),
    oboe = require('oboe'),
    app = express();

var api_key = secrets.api_key;

var trafficViewApiUrl = 'https://api.trafficview.org/event/?api-key=' + api_key;
var baseUrl = trafficViewApiUrl;

function getData(done) {
    request.get(baseUrl, function(err, res) {
        done(err, res);
    })
}

function doThing(events) {
    for (event in events) {
        myHtml = myHtml.concat('<h2>' + event.head.id + '</h2>' +
        '<h3>' + event.locations[0].description + '</h3>' +
        '<p><strong' + event.locations[0].linkLocation.locationList[0].onAddress.county + ' County</strong></p>' +
        '<p>' + event.head.eventType.type + '<br />' +
        '<small>Started: ' + event.head.dates.started + '</small><br />' +
        event.locations[0].description + '<br />')
    }
}

app.get('/', function (req, res) {
    requestGetTraffic();
})

// app.get('/system/:systemId', function (req, res) {
//     baseUrl = trafficViewApiUrl + '&system=' + req.params.systemId + '&format=rf-json';
//     console.log(req.params);
//     getData(function(err, data) {
//         console.log(err);
//         console.log(data);
//         var myArr = JSON.parse(data.body);
//         res.send(
//             '<h1>Events</h1>' +
//             '<h2>' + myArr.trafficEvents.events[0].head.id + '</h2>' +
//             '<h3>' + myArr.trafficEvents.events[0].locations[0].description + '</h3>' +
//             '<p><strong' + myArr.trafficEvents.events[0].locations[0].linkLocation.locationList[0].onAddress.county + ' County</strong></p>' +
//             '<p>' + myArr.trafficEvents.events[0].head.eventType.type + '<br />' +
//             '<small>Started: ' + myArr.trafficEvents.events[0].head.dates.started + '</small><br />' +
//             myArr.trafficEvents.events[0].locations[0].description + '<br />'
//         );
//     });
// })

app.get('/system/:systemId', function (req, res) {
    baseUrl = trafficViewApiUrl + '&system=' + req.params.systemId + '&format=rf-json';
    console.log(req.params);
    getData(function(err, data) {
        // console.log(err);
        // console.log(data);
        var myObj = JSON.parse(data.body);
        // res.send(myObj.trafficEvents.events);
        var myHtml = '<html><head><link href="//fonts.googleapis.com/css?family=Eczar" rel="stylesheet"><style>html,body,h1,h2,h3,h4,h5,p,strong,small {font-family:"Eczar" !important; } html,body { margin:0; padding:0; background:#eeeeee; color:#333333; } h1 { font-size: 40px;}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div style="background:#ffffff; padding:10px 20px;"><h1>' + req.params.systemId + ' Events &amp; Incidents</h1></div><div style="border-top:1px dotted red; padding:20px;">';
        var events = myObj.trafficEvents.events;
        res.write(myHtml);
        for (event = 0; event < events.length; event++) {
            console.log(events[event]);
            res.write(
                '<h2 id="' + events[event].head.id + '">' + events[event].head.id + '</h2>' +
                '<p><strong>' + events[event].head.name + '</strong></p>' +
                '<p>' + events[event].locations[0].description + '</p>' +
                '<p>' + events[event].head.eventType.type + '</p>' +
                '<p><small>Started: ' + events[event].head.dates.started + '</small><br/></p>'
            )
            if (event >= (events.length - 1)) {
                res.write('<hr style="margin-top:20px; height:1px; border:0; background:#d3d3d3; margin-bottom:20px;" /><p><small>&copy; 2017 Jonathan Fann</small></p><p><small>This project is currently under development</small></p></div></body></html>')
                res.end();
            }
        }
    })
})

app.listen(8888);
console.log('listenin\' at 8888 so get hoppin on that browser');
