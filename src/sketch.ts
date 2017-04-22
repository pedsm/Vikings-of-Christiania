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
		image(assets[0],this.x,this.y)
	}
}

var boats = [];
var assets = [];


function setup(){
	createCanvas(800,600)
	background(155)
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))
	assets.push(loadImage('assets/ship1.png'))
	assets.push(loadImage('assets/ship2.png'))
	assets.push(loadImage('assets/ship3.png'))
	assets.push(loadImage('assets/ship4.png'))
	assets.push(loadImage('assets/ship5.png'))
	assets.push(loadImage('assets/ship6.png'))
}
function draw(){
	//Camera
	//Print all boats
	boats.map((boat)=>{
		boat.draw();
	})
}
