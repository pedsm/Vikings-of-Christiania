
export class Player {
    name: string;
    id: string;
    hp: number;
    score: number;
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
        this.score = 0;
        this.direction = 0;
        this.hp = 100;
    }
}

export class Projectile {
    source: string;
    x: number;
    y: number;
    direction: number;
    speed: number;
    constructor (playerId: string, x: number, y: number, direction: number) {
        this.source = playerId;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    updateProjectile(time: number) {
        this.x += this.speed * Math.cos(this.direction) * time;
        this.y += this.speed * Math.sin(this.direction) * time;
    }
}
