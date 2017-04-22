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
		translate(width/2-this.x,height/2-this.y)
		imageMode(CENTER)
		textSize(20)
		textFont(playerFont)
		textAlign(CENTER)
		text(this.name, 0, - 70)
		rotate(this.direction+radians(180))
		image(assets[2],0,0)
		pop()

		this.updateSpeed()

		this.x += this.velX
		this.y += this.velY

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
var gameState = []
var projectile = [];
var playerFont;
var mapsize = 30;


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
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))

}

function draw(){
	//translate(width/2-boats[0].x,height/2-boats[0].y)
	translate(boats[0].x,boats[0].y)
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
	boats.map((boat)=>{
		boat.draw();
	})
	if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) { boats[0].direction -= 0.04 }
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){ boats[0].direction += 0.04 }
	if(keyIsDown(UP_ARROW) || keyIsDown(87))   { boats[0].speed = 5}
 }
