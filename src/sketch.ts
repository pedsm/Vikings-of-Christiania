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
	constructor(name:string,x:number,y:number){
		this.name = name
		this.x  = x
		this.y  = y
		this.size = 100
		this.direction = 0
		this.speed = 0
		this.velX = 0
		this.velY = 0
	}
	updateSpeed(){
		this.velY = this.speed * Math.cos(this.direction)
		this.velX = this.speed * Math.sin(this.direction)*-1
		console.log(this.velX)
		this.speed = 0
	}
	draw(){
		this.updateSpeed()
		this.x += this.velX
		this.y += this.velY
		push()
		translate(width/2-this.x,height/2-this.y)
		imageMode(CENTER)
		textSize(32)
		textFont(playerFont)
		textAlign(CENTER)
		text(this.name, 0, - 70)
#		rotate(this.direction+radians(180))
		image(assets[2],0,0)
		pop()
#	}
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
<<<<<<< HEAD
var bullet = [];
var gameState = []
=======
var projectile = [];
var playerFont;
>>>>>>> 99cc5ae530b2f9388dd8aed8d65df810a6b93371


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
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))

}

function draw(){
	//translate(width/2-boats[0].x,height/2-boats[0].y)
	translate(boats[0].x,boats[0].y)
	for(var i = -10; i < 10; i++){
		for(var j = -10; j < 10; j++){
			image(assets[0],128*j, 128*i)
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
