///<reference path="../lib/p5.global-mode.d.ts" />

class Boat {
	name:string;
	id: string; // Player id;
	x:number
	y:number;
	speedX:number;
	speedY:number;
	size:number;
	direction:number;
	speed:number;
	velX:number;
	velY:number;
	lastFrame:number;
	constructor(id: string, name:string,x:number,y:number){
		this.id = id;
		this.name = name
		this.x  = x
		this.y  = y
		this.size = 128
		this.direction = 0
		this.speed = 0
		this.velX = 0
		this.velY = 0
		this.lastFrame = Date.now()
	}
	updateCoords(){
		var time_diff = Date.now() - this.lastFrame;
		this.lastFrame = Date.now();
		var d_y = time_diff/10*this.speed * Math.cos(this.direction)
		var d_x = time_diff/10*this.speed * Math.sin(this.direction)*-1

		this.x += d_x;
		this.y += d_y;
	}
	draw(){
		var oldX = this.x
		var oldY = this.y
		push()
		translate(width/2-this.x,height/2-this.y)
		imageMode(CENTER)
		textSize(20)
		textFont(playerFont)
		textAlign(CENTER)
		text(this.name, 0, - 70)
		rotate(this.direction+radians(180))
		image(assets[2],0,0)
		pop()

		this.updateCoords()

		if (this.x > 3925)
			this.x = 3925
		if (this.x < -3650)
			this.x = -3650
		if (this.y > 3890)
			this.y = 3890
		if (this.y < -3700)
			this.y = -3700
	}
}

class Projectile {
	x:number
	y:number
	speedX:number
	speedY:number
	owner:string
}

var boats = [];
var assets = [];
var bullet = [];
var gameState = {players:[],projectile:[]}
var projectile = [];
var playerFont;
var mapsize = 30;
// var Player = new Boat("",(Math.random()*6000)-3000,(Math.random()*6000)-3000);
var Player = new Boat("myID","",100,100);


function setup(){
	noLoop();
	playerFont = loadFont('assets/ArchivoBlack-Regular.ttf')
	createCanvas(window.innerWidth,window.innerHeight)
	assets.push(loadImage('assets/water.png'))
	assets.push(loadImage('assets/ship1.png'))
	assets.push(loadImage('assets/ship2.png'))
	assets.push(loadImage('assets/ship3.png'))
	assets.push(loadImage('assets/ship4.png'))
	assets.push(loadImage('assets/ship5.png'))
	assets.push(loadImage('assets/ship6.png'))
	assets.push(loadImage('assets/cannonBall.png'))
	assets.push(loadImage('assets/ground.png'))
}

function draw(){
	//translate(width/2-boats[0].x,height/2-boats[0].y)
	translate(Player.x,Player.y)
	for(var i = -35; i < 35; i++){
		for(var j = -35; j < 35; j++){
			imageMode(CENTER)
			image(assets[8],128*j+620, 128*i+400)
		}
	}
	for(var i = -30; i < 30; i++){
		for(var j = -30; j < 30; j++){
			imageMode(CENTER)
			image(assets[0],128*j+570, 128*i+350)
		}
	}


	//Print all boats
	Player.draw()
	gameState.players.map((gs_player)=>{
		// The current boat we are updating
		var boat = boats.filter((b) => b.id == gs_player.id)[0]
		var threshold = 48;

		// Create a new boat if none exists
		if(!boat) {
			console.log("New player has no boat. Adding..")
			boats.push(new Boat(gs_player.id, gs_player.name,gs_player.x,gs_player.y))
			return;
		}

		// Update the old boat
		else if(abs(gs_player.x - boat.x) > threshold || abs(gs_player.y - boat.y)>threshold) {
			console.log(`d_x: ${gs_player.x},${boat.x}, d_y: ${gs_player.y} = ${boat.y}`)
			boat.x = gs_player.x
			boat.y = gs_player.y
			console.log(`Player ${boat.name} became out of sync. Synced`);
		}

		boat.direction  = gs_player.direction
		boat.name  = gs_player.name
		boat.speed = gs_player.speed
	})
	boats.map((boat)=>{
		boat.draw();
	})
	if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) { Player.direction -= 0.04 }
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){ Player.direction += 0.04 }
	if(keyIsDown(UP_ARROW) || keyIsDown(87)) {
		Player.speed = 5
	}
	else {
		Player.speed = 0;
	}
}
