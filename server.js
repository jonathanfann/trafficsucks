var express = require('express'),
    request = require('request'),
    secrets = require('./config/index.js'),
    nunjucks = require('nunjucks'),
    app = express();

var api_key = secrets.api_key;

var trafficViewApiUrl = 'api.trafficview.org/event/?api-key=' + api_key;

function getData(done) {
    request.get(trafficViewApiUrl, function(err, res) {
        done(err, res);
    });
}

app.get('/', function (req, res) {
    getData(function(err, data) {
        console.log(err);
        console.log(data);
        res.send(data.body);
    });
})

app.get('/system/:systemId', function (req, res) {
  res.send(req.params);
})

app.listen(8888);
console.log('listenin\' at 8888 so get hoppin on that browser');
