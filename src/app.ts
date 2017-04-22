#!/usr/bin/env/ node

import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';

var verbose = false;
var gameport = 4242;
var app = express();
var server = http.createServer(app);

console.log("Vikings of Christiana running..");

server.listen(gameport);
console.log(':: Listening on port ' + gameport);

app.get('/', function(req, res) {
    res.sendFile('game.html', { root: __dirname + "/../"});
});

// Serve static files (according to pedro?)
app.use(express.static('lib'))
app.use(express.static('comp'))
app.use(express.static('static'))
