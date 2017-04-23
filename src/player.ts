
export class Player {
    name: string;
    id: string;
    x: number;
    y: number;
	speed: number;
    direction: number;
    constructor (id: string, playerName: string) {
        this.id = id;
        this.name = playerName;

        // TODO: make this more intelligent
        // Sets the location between +-10;
        this.x = 20*Math.random() - 10;
        this.y = 20*Math.random() - 10;
        this.direction = 0;
    }
}

export class Projectile {
    source: string;
    x: number;
    y: number;
    direction: number;
    speed: number;
    contructor (playerId: string) {
        this.source = playerId;
    }
    updateProjectile(time: number) {
        this.x += this.speed * Math.cos(this.direction) * time;
        this.y += this.speed * Math.sin(this.direction) * time;
    }
}
