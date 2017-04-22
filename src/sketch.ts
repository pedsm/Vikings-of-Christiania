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
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))
	boats.push(new Boat("Tal",100,0))
}
function draw(){
	background(155)
	push()
	translate(width/2-boats[0].x,height/2-boats[0].y)
	//Print all boats
	boats.map((boat)=>{
		boat.draw();
	})
	pop()
	boats[0].y +=1
}
