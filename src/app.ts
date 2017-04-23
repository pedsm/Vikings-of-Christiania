#!/usr/bin/env/ node

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import {Player, Projectile} from './player';
import {consts} from './consts';


var verbose = false;
var gameport = 4242;
var app = express();
var server = http.createServer(app);
let players: Array<Player> = [];
let projectiles: Array<Projectile> = [];
let updateInterval: number = 1000/60; // Number of ms between updates.
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

    // Send the user the consts
    socket.emit('consts', consts)

    socket.on('chat', function(message) {
        var p = players.filter((pl) => pl.id == socket.id)[0];
        io.in('default_room').emit('chat', {'type': message, 'contents': `<b>${p.name}</b>: ${message}`})
    })

    socket.on('join_game', function(message) {
        // Join the main server;
        socket.join("default_room")

        console.log(`:: Player ${message.name} has joined the game`)

        if (!message.spectator) {
            var player: Player = new Player(socket.id, message.name);
            players.push(player);

            io.in('default_room').emit('chat',
                { 'type': 'player_join',
                'contents': `<span class="player_join"><b>${player.name}</b> has joined the game</span>` }
            );

            socket.on('fire', () => {
                var p = players.filter((pl) => pl.id == socket.id)[0];
                console.log(`Player ${p.name} fired :)`)
                shootProjectile(p);
            });
        }

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


    socket.on('disconnect', function() {
        var player_obj = players.filter((p)=>p.id==socket.id)[0];
        if (!player_obj) {
            return;
        }
        var player_name = player_obj.name;
        players = players.filter((p) => p.id != socket.id);


        // Tell clients
        io.in('default_room').emit('gamestate', {
            type: 'player_disconnect',
            data:  socket.id
        });

        // Tell the chat
        io.in('default_room').emit('chat',
            { 'type': 'player_join',
            'contents': `<span class="player_leave"><b>${player_name}</b> has left the game :(`});
    })
})

function shootProjectile (player) {
    var projectile1 = new Projectile(player.id, player.x, player.y, -player.direction - 3*Math.PI/4);
    var projectile2 = new Projectile(player.id, player.x, player.y, -player.direction - Math.PI/4);
    projectile1.updateProjectile(0.4);
    projectile2.updateProjectile(0.4);

    projectiles.push(projectile1)
    projectiles.push(projectile2)

    // Announce new projectile to the room
    io.in('default_room').emit('gamestate', {
        type: 'new_projectiles',
        data:  [projectile1, projectile2]
    });

    // Handles some weird ass bug where server and client have
    // a different sense of direction
    projectile1.direction+=Math.PI;
    projectile2.direction+=Math.PI;
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
        p.updateProjectile(time_diff);
    });

    // Check for collisions between players and projectiles
    // TODO make this better by doing dynamic hitbox based on direction of
    // ship. Remember that the ship is not square and can face any
    // direction ;)
    players.forEach((player) => {
        projectiles.forEach((proj) => {
            if (Math.abs(player.x - proj.x) < 100
            &&  Math.abs(player.y - proj.y) < 100
            &&  player.id != proj.source) { // Check that it's not the player's own projectile

                // Remove projectile
                // TODO broadcast in player death
                projectiles = projectiles.filter((p)=>p!=proj);

                // Player and projectile are in the same area so we'll subtract health.
                player.hp -= consts.bulletDamage;
                
                if (player.hp <= 0) {
                    console.log(`Player ${player.name} has been killed`);
                    players = players.filter((p)=>p.id!=player.id);
                    io.in('default_room').emit('gamestate',
                    {
                        'type': 'player_killed',
                        'data': {
                            'player': player,
                            'projectile': proj
                        }
                    });

                    // Add points to the killer
                    var killer = players.filter((p)=>p.id==proj.source)[0];
                    if (killer) {
                        killer.score += 100;
                    }

                    io.in('default_room').emit('chat',
                        { 'type': 'player_kill',
                        'contents': `<span class="player_kill"><b>${player.name}</b> has been killed by ${killer.name}</span>` }

                }

                else {
                    io.in('default_room').emit('gamestate', {
                        type: 'player_update',
                        data:  player
                    });
                }

                console.log("Player has been hit");
            }
        });
    });

    if (projectiles.length > 0) {
        //console.log(`${projectiles[0].x}, ${projectiles[0].y}`);
    }

    // Filter out the projectiles that have left the map
    var mapSize = 128 * 60;
    projectiles = projectiles.filter((p) => {
        return Math.abs(p.x) > mapSize || Math.abs(p.y) < mapSize;
    })

}, updateInterval);
