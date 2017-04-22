// import "../lib/p5.global-mode"
///<reference path="../lib/p5.d.ts" />
class Boat {
	name:string;
	speedX:number;
	speedY:number;
	size:number;
	constructor(name:string){
		this.name = name
	}
	draw(){
		box(this.size,this.size,this.size)
	}
}

var boats = [];

function setup(){
	createCanvas(800,600,WEBGL)
	background(155)
	boats.push(new Boat("Pedro"))
}
function draw(){
	rotateX(0.785398)
	rotateY(0.785398)
	// boats[0].draw()
	box(100,100,100)
	// boats.map((boat)=>{
	// 	console.log(boat)
	// 	boat.draw();
	// })
}
