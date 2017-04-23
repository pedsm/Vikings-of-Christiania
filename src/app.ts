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

        // Send current full gamestate
        socket.emit('gamestate', {type: 'full_update', data: players})
    })

    socket.on('update_gamestate', (remotePlayer) => {
        var p = players.filter((pl) => pl.id == socket.id)[0];

        if (!remotePlayer || !p) {
            return;
        }

        p.x = remotePlayer.x;
        p.y = remotePlayer.y;
		p.speed = remotePlayer.speed;
        p.direction = remotePlayer.direction;

        io.in('default_room').emit('gamestate', {
            type: 'player_update',
            data:  p
        });
    })

    socket.on('fire', () => {
        console.log("Player fired :)")
        var p = players.filter((pl) => pl.id == socket.id)[0];
        shootProjectile(p);
    });

    socket.on('disconnect', function() {
        players = players.filter((p) => p.id != socket.id);
        io.in('default_room').emit('gamestate', {
            type: 'player_disconnect',
            data:  socket.id
        });
    })
})

function shootProjectile (player) {
    var projectile1 = new Projectile(player.id, player.x, player.y, player.direction - 3*Math.PI/4);
    var projectile2 = new Projectile(player.id, player.x, player.y, player.direction - Math.PI/4);

    projectiles.push(projectile1)
    projectiles.push(projectile2)

    // Announce new projectile to the room
    io.in('default_room').emit('gamestate', {
        type: 'new_projectiles',
        data:  [projectile1, projectile2]
    });
}

function kill(player){
    console.log("You got fragged m8. \n Need more mountain dew and doritos in your diet.");
    player.x = 0;
    player.y = 0;
}

var last_update_time = Date.now();
setInterval(function() {
    // Update the positions of the projectile
    var time_diff = Date.now() - last_update_time;
    last_update_time = Date.now();

    // Update projectile positions
    projectiles.forEach((p) => {
        p.x += time_diff * 1.0 * Math.cos(p.direction);
        p.y += time_diff * 1.0 * Math.sin(p.direction);
    });

    // Check for collisions between players and projectiles
    // TODO make this better by doing dynamic hitbox based on direction of
    // ship. Remember that the ship is not square and can face any
    // direction ;)
    players.forEach((player) => {
        projectiles.forEach((proj) => {
            if (Math.abs(player.x - proj.x) < 50
            &&  Math.abs(player.y - proj.y) < 50
            &&  player.id != proj.source) { // Check that it's not the player's own projectile
                // Player and projectile in same area
                console.log("Player has been hit");
            }
        });
    });

    // Filter out the projectiles that have left the map
    var mapSize = 128 * 60;
    projectiles = projectiles.filter((p) => {
        return Math.abs(p.x) > mapSize || Math.abs(p.y) < mapSize;
    })

}, updateInterval);
