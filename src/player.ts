

export class Player {
    name: string;
    x: float;
    y: float;
    direction: float;
    speed: float;
    constructor (playerName: string) {
        this.name = playerName;
    }
}

export class Projectile {
    source: Player
    x: float;
    y: float;
    direction: float;
    speed: float;
    contructor (sourcePlayer: Player) {
        this.source = sourcePlayer;    
    }
    updateProjectile(time: float) {
        this.x += this.speed * Math.cos(this.direction) * time;
        this.y += this.speed * Math.sin(this.direction) * time;
    }
}

