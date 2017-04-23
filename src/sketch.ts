///<reference path="../lib/p5.global-mode.d.ts" />

class Boat {
	name:string;
	id: string; // Player id;
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
	constructor(id: string, name:string,x:number,y:number){
		this.id = id;
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
	updateCoords(){
		var time_diff = Date.now() - this.lastFrame;
		this.lastFrame = Date.now();
		var d_y = time_diff/10*this.speed * Math.cos(this.direction)
		var d_x = time_diff/10*this.speed * Math.sin(this.direction)*-1

		this.x += d_x;
		this.y += d_y;
	}
	draw(){
		var oldX = this.x
		var oldY = this.y
		push()
		translate(this.x,this.y)
		textSize(20)
		fill(0)
		textFont(playerFont)
		textAlign(CENTER)
		text(this.name, 0, -70)
		rotate(this.direction)
		imageMode(CENTER)
		image(assets[2],0,0)
		pop()

		this.updateCoords()
		mapsize--
		if (this.x >= mapsize*128)
			this.x = mapsize*128
		if (this.x <= mapsize*-128)
			this.x = mapsize*-128
		if (this.y >= mapsize*128)
			this.y = mapsize*128
		if (this.y <= mapsize*-128)
			this.y = mapsize*-128
		mapsize++
	}
}

class Projectile {
	x:number
	y:number
	speedX:number
	speedY:number
	speed:number
	owner:string
	dir:number
	lastUp:number
	constructor(x,y,dir){
		this.x = x
		this.y = y
		this.dir = dir
		this.speed = 0.005
		this.lastUp = Date.now()
	}
	move(){
		var time_diff = Date.now() - this.lastUp
		this.speedX = time_diff*this.speed * Math.cos(this.dir)
		this.speedY = time_diff*this.speed * Math.sin(this.dir)*-1

		this.x += this.speedX
		this.y += this.speedY
		push()
		translate(this.x,this.y)
		imageMode(CENTER)
		image(assets[7],0,0)
		pop()
		bullets = bullets.filter((b)=>{return !(b.x > 128*mapsize || b.y > 128*mapsize || b.y < -128*mapsize || b.x < -128*mapsize)})
	}
}
let CENTER = "center"
let LEFT_ARROW = 37
let RIGHT_ARROW = 39
let UP_ARROW = 38

var boats = [];
var assets = [];
var bullets = [];
var gameState = {players:[],projectile:[]}
var projectile = [];
var playerFont;
var mapsize = 30;
var fire = ()=>{}

// var Player = new Boat("myId", "",(Math.random()*6000)-3000,(Math.random()*6000)-3000);
var Player = new Boat("myID","",100,100);


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
	assets.push(loadImage('assets/tile_38.png'))
	assets.push(loadImage('assets/tile_41.png'))
	assets.push(loadImage('assets/tile_56.png'))
	assets.push(loadImage('assets/tile_08.png'))
	assets.push(loadImage('assets/tile_37.png'))
	assets.push(loadImage('assets/tile_53.png'))
	assets.push(loadImage('assets/tile_52.png'))
	assets.push(loadImage('assets/tile_36.png'))
}

function draw(){
	push()
	translate(width/2-Player.x,height/2-Player.y)
	imageMode(CENTER)
	if(frameCount > 10)
		background(46, 204, 113)

		for(var i = mapsize*-1; i <= mapsize; i++){
			for(var j = mapsize*-1; j <= mapsize; j++){
				image(assets[0],128*j+(frameCount%120)*128/120, 128*i)
			}
		}
	for(var i = mapsize*-1; i <= mapsize; i++){
			image(assets[9],128*mapsize, 128*i)
			image(assets[10],-128*mapsize, 128*i)
			image(assets[11],128*i, mapsize*-128)
			image(assets[12],128*i, 128*mapsize)
			image(assets[14],128*mapsize, 128*mapsize)
	}

	image(assets[15], -128*mapsize, 128*mapsize)
	image(assets[16], -128*mapsize, -128*mapsize)
	image(assets[13],128*mapsize, -128*mapsize)
	fill(46, 204, 113)
	noStroke()
	rect(128*(mapsize+0.5),-128*(mapsize+0.5),128,128*(mapsize+0.5)*2)

	//Print all boats
	gameState.players.map((gs_player)=>{
		// The current boat we are updating
		var boat = boats.filter((b) => b.id == gs_player.id)[0]
		var threshold = 48;

		// Create a new boat if none exists
		if(!boat) {
			console.log("New player has no boat. Adding..")
			boats.push(new Boat(gs_player.id, gs_player.name,gs_player.x,gs_player.y))
			return;
		}

		// Update the old boat
		else if(abs(gs_player.x - boat.x) > threshold || abs(gs_player.y - boat.y)>threshold) {
			console.log(`d_x: ${gs_player.x},${boat.x}, d_y: ${gs_player.y} = ${boat.y}`)
			boat.x = gs_player.x
			boat.y = gs_player.y
			console.log(`Player ${boat.name} became out of sync. Synced`);
		}

		boat.direction  = gs_player.direction
		boat.name  = gs_player.name
		boat.speed = gs_player.speed
	})
	boats.map((boat:Boat)=>{ boat.draw(); })
	bullets.map((bullet:Projectile)=>{ bullet.move() ; })
	Player.draw()

	pop()
	//Print all boats


	if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) { Player.direction -= 0.04 }
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){ Player.direction += 0.04 }
	if(keyIsDown(UP_ARROW) || keyIsDown(87)) {
		Player.speed = 5
	}
	else {
		Player.speed = 0;
	}
}
var timer = 2000;
var lastShot = 0;
function keyPressed()
{
	if(keyCode == 32 && Date.now() - lastShot > timer)
	{
		console.log("Shot")
		fire()
		lastShot =  Date.now()
	}
}
function shootBullet(x,y,dir)
{
	bullets.push(new Projectile(x,y,dir))
}
