// import "../lib/p5.global-mode"
///<reference path="../lib/p5.d.ts" />
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
	}
	draw(){
		push()
		translate(this.x, this.y)
		box(this.size,this.size,this.size)
		pop()
	}
}

var boats = [];

function setup(){
	createCanvas(800,600,WEBGL)
	background(155)
	boats.push(new Boat("Pedro",100,100))
	boats.push(new Boat("Tal",0,0))
}
function draw(){
	//Camera
	//Print all boats
	boats.map((boat)=>{
		boat.draw();
	})
}
