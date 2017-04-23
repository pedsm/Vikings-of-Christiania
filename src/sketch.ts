///<reference path="../lib/p5.global-mode.d.ts" />

class Boat {
	name:string;
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
	constructor(name:string,x:number,y:number){
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
	updateSpeed(){
		var mov = Date.now() - this.lastFrame;
		this.lastFrame = mov + this.lastFrame;
		this.velY = mov/10*this.speed * Math.cos(this.direction)
		this.velX = mov/10*this.speed * Math.sin(this.direction)*-1
		this.speed = 0
	}
	draw(){
		var oldX = this.x
		var oldY = this.y
		push()
		translate(this.x,this.y)
		textSize(20)
		textFont(playerFont)
		textAlign(CENTER)
		text(this.name, 0, - 70)
		rotate(this.direction)
		imageMode(CENTER)
		image(assets[2],0,0)
		pop()

		this.updateSpeed()

		this.x += this.velX
		this.y += this.velY

/*
		if (this.x > 3925)
			this.x = 3925
		if (this.x < -3650)
			this.x = -3650
		if (this.y > 3890)
			this.y = 3890
		if (this.y < -3700)
			this.y = -3700
*/
mapsize--
if (this.x >= mapsize*128)
	this.x = mapsize*128
if (this.x <= mapsize*-128)
	this.x = mapsize*-128
if (this.y >= mapsize*128)
	this.y = mapsize*128
if (this.y <= mapsize*-128)
	this.y = mapsize*-128
			console.log("x:"+this.x+"\ny:" this.y)
mapsize++
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

var Player = new Boat("",0,0);



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
	assets.push(loadImage('assets/tile_38.png'))
	assets.push(loadImage('assets/tile_41.png'))
	assets.push(loadImage('assets/tile_56.png'))
	assets.push(loadImage('assets/tile_08.png'))
	assets.push(loadImage('assets/tile_37.png'))
	assets.push(loadImage('assets/tile_53.png'))
	assets.push(loadImage('assets/tile_52.png'))
	assets.push(loadImage('assets/tile_36.png'))
	boats.push(new Boat("yo",100,100))
}

function draw(){
	push()
	translate(width/2-Player.x,height/2-Player.y)
	imageMode(CENTER)
	if(frameCount > 10)
		background(46, 204, 113)
	for(var i = mapsize*-1; i <= mapsize; i++){
		for(var j = mapsize*-1; j <= mapsize; j++){
			image(assets[0],128*j, 128*i)
		}
	}
	for(var i = mapsize*-1; i <= mapsize; i++){
			image(assets[9],128*mapsize, 128*i)
			image(assets[10],-128*mapsize, 128*i)
			image(assets[11],128*i, mapsize*-128)
			image(assets[12],128*i, 128*mapsize)
			image(assets[14],128*mapsize, 128*mapsize)
	}

	image(assets[15], -128*mapsize, 128*mapsize)
	image(assets[16], -128*mapsize, -128*mapsize)
	image(assets[13],128*mapsize, -128*mapsize)

	//Print all boats
	gameState.players.map((thing,i)=>{
		if(boats.length == i)
		{
			boats.push(new Boat(thing.name,thing.x,thing.y))
		}
		if(abs(thing.x - boats[i].x) > 10 || abs(thing.y - boats[i].y)>10 || isNaN(boats[i].x)|| isNaN(boats[i].x))
		{
			boats[i].x = thing.x
			boats[i].y = thing.y
			console.log("Synced")
		}
		boats[i].direction  = thing.direction
		boats[i].name  = thing.name
		boats[i].speed = thing.speed
	})
	boats.map((boat)=>{
		boat.draw();
	})
	Player.draw()

	pop()
	//Print all boats


	if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) { Player.direction -= 0.04 }
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){ Player.direction += 0.04 }
	if(keyIsDown(UP_ARROW) || keyIsDown(87))   { Player.speed = 5}
}
