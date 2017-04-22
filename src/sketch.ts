import "../lib/p5.global-mode"
class Boat {
	name:String;
	speedX:Number;
	speedY:Number;
	cosntructor(input:string){
		this.name = input

	}
}

function setup(){
	createCanvas(800,600,WEBGL)
	background(155)
}
function draw(){
	rotateX(0.785398)
	rotateY(0.785398)
	// fill(100)
	box(100,100,100)
}
