var express = require('express'),
    request = require('request'),
    secrets = require('./config/secrets'),
    app = express();

var client_id = secrets.client_id,
    client_secret = secrets.client_secret,
    redirect_uri = 'http://localhost:8888/callback',
    authorization_code,
    access_token;

var authorize = function() {
    request
        .get('https://accounts.spotify.com/authorize', {
            'auth': {
                'client_id': client_id,
                'response_type': 'code',
                'redirect_uri': redirect_uri
            }
        })
        .on('response', function(res) {
            console.log(res);
            authorization_code = res.code;
        })
};

var token = function () {
    if (authorization_code != null) {
        request.post('https://accounts.spotify.com/api/token', {
            'auth': {
                'grant_type': authorization_code
            }
        })
    } else {
        console.log('aint set the auth code');
    }
};

app.get('/', function (req, res) {
    authorize();
    res.send('hello world');
})

app.get('/callback', function (req, res) {
    access_token = req.query.code;
    token();
    console.log('aw yeah that callback tho');
    res.send('yay' + access_token);
})

app.listen(8888);
console.log('listenin\' at 8888 so get hoppin on that browser');
