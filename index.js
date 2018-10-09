'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const rp = require('request-promise');
const {base64encode, base64decode} = require('nodejs-base64');
const uuid1 = require('uuid/v1');
const _config = require('./_config').config;

const app = express();
const PORT = 8050;
let accessToken = "";

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(nocache());
app.use(express.static('static'));

app.listen(PORT, function () {
    console.log("Server is listening on " + PORT);
});

app.get('/', function (req, res) {

    const sessionId = req.cookies['NODEJSSESSION'];

    if (sessionId) {
        res.sendFile('static/home.html', {root: __dirname});
    } else {
        res.sendFile('static/login.html', {root: __dirname});
    }

})

app.get('/callback', function (req, res) {

    const authCode = req.query.code;

    obtainAccessToken(authCode).then(function (token) {
        accessToken = token;
        let session = uuid1();
        res.setHeader('Set-Cookie', [`NODEJSSESSION=${session}`]);
        res.sendFile('static/home.html', {root: __dirname});
    }).catch(function (err) {
        res.sendFile('static/login.html', {root: __dirname});
    })
});

app.get('/posts', function (req, res) {

    let options = {
        method: 'GET',
        uri: _config.GRAPH_API,
        headers: {
            "Authorization": "Bearer ".concat(accessToken)
        }
    };

    rp(options)
        .then(function (body) {
            res.json(body);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
});

app.post('/logout', function (req, res) {

    res.clearCookie('NODEJSSESSION');
    res.sendFile('static/login.html', {root: __dirname});

})

function obtainAccessToken (code) {

    return new Promise(function (resolve, reject) {

        const authStr = _config.APP_ID.concat(":").concat(_config.SECRET);

        let options = {
            method: 'POST',
            uri: _config.ACCESS_TOKEN_URL,
            body: {
                grant_type: "authorization_code",
                client_id: _config.APP_ID,
                redirect_uri: _config.REDIRECT_URL,
                code: code.concat("#_=_")
            },
            json:true,
            headers: {
                "Authorization": "Basic ".concat(base64encode(authStr))
            }
        };

        rp(options)
            .then(function (body) {
            resolve(body.access_token);
        }).catch(function (err) {
            reject(err);
        })

    })
}