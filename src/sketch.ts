///<reference path="../lib/p5.global-mode.d.ts" />

class Boat {
	name:string;
	x:number
	y:number;
	speedX:number;
	speedY:number;
	size:number;
	direction:number;
	constructor(name:string,x:number,y:number){
		this.name = name
		this.x  = x
		this.y  = y
		this.size = 100
		this.direction = PI/2
	}
	draw(){
		imageMode(CENTER)
		image(assets[2],this.x,this.y)
		textSize(32)
		textFont(playerFont)
		textAlign(CENTER)
		//strokeWeight(10)
		//fill(50,50,50)
		text(this.name, this.x, this.y - 70)
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
var projectile = [];
var playerFont;


function setup(){
	createCanvas(window.innerWidth-20,window.innerHeight-20)
	playerFont = loadFont('assets/ArchivoBlack-Regular.ttf')
	assets.push(loadImage('assets/water.png'))
	assets.push(loadImage('assets/ship1.png'))
	assets.push(loadImage('assets/ship2.png'))
	assets.push(loadImage('assets/ship3.png'))
	assets.push(loadImage('assets/ship4.png'))
	assets.push(loadImage('assets/ship5.png'))
	assets.push(loadImage('assets/ship6.png'))
	assets.push(loadImage('assets/cannonBall.png'))
	boats.push(new Boat("Pedro",100,100))
	//boats.push(new Boat("Tal",0,0))
	//boats.push(new Boat("Tal",100,0))
}
function draw(){
	push()
	translate(width/2-boats[0].x,height/2-boats[0].y)
	for(var i = -10; i < 10; i++){
		for(var j = -10; j < 10; j++){
			image(assets[0],128*j, 128*i)
		}
	}
	//Print all boats
	boats.map((boat)=>{
		boat.draw();
	})
	if(keyIsDown(LEFT_ARROW)) { boats[0].x-- }
	if(keyIsDown(RIGHT_ARROW)){ boats[0].x++ }
	if(keyIsDown(UP_ARROW))   { boats[0].y-- }
	if(keyIsDown(DOWN_ARROW)) { boats[0].y++ }
 }
