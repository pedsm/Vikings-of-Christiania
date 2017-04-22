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
let updateInterval: number = 1000/30; // Number of ms between updates.
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

    socket.on('join_game', function(message) {
        // Join the main server;
        socket.join("default_room")

        console.log(`:: Player ${message.name} has joined the game`)
        var player: Player = new Player(socket.id, message.name);
        players.push(player);
    })

    socket.on('update_gamestate', (remotePlayer) => {
        var p = players.filter((pl) => pl.id == socket.id)[0];
        players = players.filter((p) => p.id != socket.id);

        if (!remotePlayer || !p) {
            return;
        }
        p.x = remotePlayer.x;
        p.y = remotePlayer.y;
        p.direction = remotePlayer.direction;
		players.push(p)
    })

    socket.on('disconnect', function() {
        players = players.filter((p) => p.id != socket.id);
    })
})

function kill(player){
    console.log("You got fragged m8. \n Need more mountain dew and doritos in your diet.");
    player.x = 0;
    player.y = 0;
}

// Send the gamestate to everyone
setInterval(function() {
    io.in('default_room').emit('gamestate',
    {
        'players': players,
        'projectiles': projectiles
    }
    );

    //collision with projectiles
    // function detectCollision(player){
    //     projectiles.map((bullet)=>{
    //         if(bullet.x > player.x-64 && bullet.y < player.x+64 &&
    //            bullet.y > player.y-64 && bullet.y < player.y+64)
    //         {
    //             player.kill;
    //         }
    //     })
    // }
    // players.forEach(detectCollision)

}, updateInterval);
