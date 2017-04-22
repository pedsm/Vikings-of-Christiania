#!/usr/bin/env/ node

import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';
import {Player, Projectile} from './player';

var verbose = false;
var gameport = 4242;
var app = express();
var server = http.createServer(app);
let players: Array<Player> = [];

console.log("Vikings of Christiana running..");

server.listen(gameport);
console.log(':: Listening on port ' + gameport);

// Serve the root file
app.get('/', function(req, res) {
    res.sendFile('game.html', { root: __dirname + "/../"});
});

// Serve static files (according to pedro?)
app.use(express.static('lib'))
app.use(express.static('comp'))
app.use(express.static('static'))

// Handle a socket connection
io().on('connection', function(socket) {
    // Join the main server;
    players.push()
    socket.join("default_room");

    socket.on('join_game', function(id, message) {
        var player: Player = new Player(socket.id, message.name);
        players.push(player);
    })
})