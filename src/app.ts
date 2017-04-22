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
    res.sendFile(__dirname + '/game.html');
});
app.get('/static/*', function(req, res, next) {
    var file = req.params[0];

    if(verbose) console.log('\t :: Express :: file requested : ' + file);

    res.sendFile(__dirname + '/static/' + file);
});
