///<reference path="../lib/p5.global-mode.d.ts" />

class Boat {
	name:string;
	x:number
	y:number;
	speedX:number;
	speedY:number;
	size:number;
	constructor(name:string,x:number,y:number){
		this.name = name
		this.x  = x
		this.y  = y
		this.size = 100
	}
	draw(){
		imageMode(CENTER)
		image(assets[0],this.x,this.y)
	}
}

var boats = [];
var assets = [];
var bullet = [];


function setup(){
	createCanvas(window.innerWidth-20,window.innerHeight-20)
	assets.push(loadImage('assets/ship1.png'))
	assets.push(loadImage('assets/ship2.png'))
	assets.push(loadImage('assets/ship3.png'))
	assets.push(loadImage('assets/ship4.png'))
	assets.push(loadImage('assets/ship5.png'))
	assets.push(loadImage('assets/ship6.png'))
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))
	boats.push(new Boat("Tal",100,0))
}
function draw(){
	translate(width/2-boats[0].x,height/2-boats[0].y)
	//Print all boats
	background(0,0,150)
	boats.map((boat)=>{
		boat.draw();
	})
	if(keyIsDown(LEFT_ARROW)) { boats[0].x-- }
	if(keyIsDown(RIGHT_ARROW)) { boats[0].x++ }
	if(keyIsDown(UP_ARROW)) { boats[0].y-- }
	if(keyIsDown(DOWN_ARROW)) { boats[0].y++ }
 }
