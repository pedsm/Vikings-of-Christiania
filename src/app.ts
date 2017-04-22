#!/usr/bin/env/ node

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import {Player, Projectile} from './player';

var verbose = false;
var gameport = 4242;
var app = express();
var server = http.createServer(app);
let players: Array<Player> = [];
let projectiles: Array<Projectile> = [];
let updateInterval: number = 1000/50; // Number of ms between updates.
var io = socketio(server);

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
io.on('connection', function(socket) {
    // Join the main server;
    players.push()
    socket.join("default_room")

    socket.on('join_game', function(message) {
        console.log(`:: Player ${message.name} has joined the game`)
        var player: Player = new Player(socket.id, message.name);
        players.push(player);
    })

    socket.on('disconnect', function() {
        players = players.filter((p) => p.id != socket.id);
    })
})

// Send the gamestate to everyone
setInterval(function() {
    io.emit('default_room',
    {
        'players': players,
        'projectiles': projectiles
    });
}, updateInterval);
