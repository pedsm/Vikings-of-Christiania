#!/usr/bin/env/ node

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import {Player, Projectile, Spectator, User} from './player';
import {consts} from './consts';

var verbose = false;
var gameport = 4242;
var app = express();
var server = http.createServer(app);
let players: Array<Player> = [];
let spectators: Array<Spectator> = [];
let projectiles: Array<Projectile> = [];
let updateInterval: number = 1000/60; // Number of ms between updates.
var io = socketio(server);

console.log("Vikings of Christiana running..");

server.listen(gameport);
console.log(':: Listening on port ' + gameport);

// Serve the index file
app.get('/', function(req, res) {
    res.sendFile('game.html', { root: __dirname + "/../"});
});

// Serve static files on the root.
app.use(express.static('lib'))
app.use(express.static('comp'))
app.use(express.static('static'))

var getPlayerById = (id: string) => {
    var p = players.filter((pl) => pl.id == id);
    return p.length > 0 ? p[0] : null;
}

var getSpectatorById = (id: string) => {
    var s = spectators.filter((s) => s.id == id);
    return s.length > 0 ? s[0] : null;
}

var getUserById = (id: string) => {
    var p = getPlayerById(id);
    var s = getSpectatorById(id);
    return p || s;
}

// Wait for a websockets connection
io.on('connection', function(socket) {

    // Send game constants to the user
    socket.emit('consts', consts)

    // Broadcast the player's chat messages to the room.
    // All users can chat regardless of whether they play or not.
    socket.on('chat', function(message) {
        var u:User = getUserById(socket.id) || {'id': socket.id, 'name': 'Anonymous'}

        if (u) {
            io.in('default_room').emit('chat',
                {
                    'type': message,
                    'contents': `<b>${u.name}</b>: ${message}`
                })
        }
    });

    // Wait for the user to request to join a game
    socket.on('join_game', function(player_details) {

        // Add them to the default room
        socket.join("default_room")
        console.log(`:: Player ${player_details.name} has joined the game`)

        // If the user is a normal player then add them to the game
        if (player_details.isSpectator) {
            var spectator = new Spectator(socket.id, player_details.name);
            spectators.push(spectator);

            io.in('default_room').emit('chat',
                { 'type': 'player_join',
                'contents': `<span class="player_join"><b>${spectator.name}</b> has joined the game as a spectator</span>` }
            );
        } else {
            var player: Player = new Player(socket.id, player_details.name);
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

    // When a player sends their gamestate
    socket.on('update_gamestate', (remotePlayer) => {
        var p = getPlayerById(socket.id)
        if (!p || !remotePlayer) {
            console.log("Invalid player tried to update_gamestate")
            return;
        }

        console.log(p);

        // Any of the attributes may be updated independently
        p.x = remotePlayer.x;
        p.y = remotePlayer.y;
		p.speed = remotePlayer.speed;
        p.direction = remotePlayer.direction;

        // Broadcast the players new details to the room
        io.in('default_room').emit('gamestate', {
            type: 'player_update',
            data:  p
        });
    })

    // When the user disconnects
    socket.on('disconnect', function() {
        var player = getPlayerById(socket.id);
        if (!player) { return; }

        // Remove player from the gamestate
        players = players.filter((p) => p.id != socket.id);

        // Broadcast to clients the the player has disconnected
        io.in('default_room').emit('gamestate', {
            type: 'player_disconnect',
            data:  socket.id
        });

        // Broadcast to the chatroom that the player has left
        io.in('default_room').emit('chat',
            {
                'type': 'player_join',
                'contents': `<span class="player_leave"><b>${player.name}</b> has left the game :(`
            });
    })
})

// Shoot a projectile for the player
function shootProjectile (player) {
    if(player == undefined) {
        return
    }
    var projectile1 = new Projectile(player.id, player.x, player.y, -player.direction - 3*Math.PI/4);
    var projectile2 = new Projectile(player.id, player.x, player.y, -player.direction - Math.PI/4);
    projectile1.updateProjectile(0.4);
    projectile2.updateProjectile(0.4);

    projectiles.push(projectile1)
    projectiles.push(projectile2)

    // Broadcast projectiles to the room
    io.in('default_room').emit('gamestate', {
        type: 'new_projectiles',
        data:  [projectile1, projectile2]
    });

    // Handles some weird case where server and client have
    // a different sense of direction
    projectile1.direction+=Math.PI;
    projectile2.direction+=Math.PI;
}

// Update the state of the game on the server periodically.
// Check for collisions and clean up missing projectiles etc.
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

            // If a collision...
            if (Math.abs(player.x - proj.x) < 100
            &&  Math.abs(player.y - proj.y) < 100
            &&  player.id != proj.source) { // Check that it's not the player's own projectile

			// Remove projectile
			// TODO broadcast in player death
			projectiles = projectiles.filter((p)=>p!=proj);

			// Player and projectile are in the same area so we'll subtract health.
			player.hp -= consts.bulletDamage;

			// If a player dies
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
				'contents': `<span class="player_kill"><b>${player.name}</b> has been killed by ${killer.name}</span>` })

			} else {
				io.in('default_room').emit('gamestate', {
					type: 'player_update',
					data:  player
				});
			}
		}
        });
    });

    // Filter out the projectiles that have left the map
    var mapSize = 128 * 60;
    projectiles = projectiles.filter((p) => {
        return Math.abs(p.x) > mapSize || Math.abs(p.y) < mapSize;
    })

}, updateInterval);
