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
		rectMode(CENTER)
		rect(this.x,this.y,this.size,this.size)
	}
}

var boats = [];

function setup(){
	createCanvas(800,600)
	background(155)
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))
}
function draw(){
	//Camera
	translate(width/2 + boats[0].x-boats[0].size,height/2 + boats[0].y - boats[0].size)
	//Print all boats
	boats.map((boat)=>{
		boat.draw();
	})
}
