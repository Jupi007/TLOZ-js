class Enemy extends AnimatedMovingBox {
    speed: number;

    sprites: HTMLImageElement[][] = [];

    constructor(x: number, y: number, speed: number, direction: Direction) {
        super();

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
    }

    invertDirection(): void {
        if (this.direction == Direction.Up) {
            this.direction = Direction.Down;
        } else {
            this.direction = Direction.Up;
        }
    }
}

class Goomba extends Enemy {
    constructor(x: number, y: number, speed: number, direction: Direction) {
        super(x, y, speed, direction);

        this.width = 40;
        this.height = 40;

        this.animationSpeed = 20;
        this.nbAnimationStep = 2;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/goomba1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/goomba2.png");


        this.sprites[Direction.Down] = this.sprites[Direction.Up];
    }
}

class Enemies {
    private Game: Game;

    img: HTMLImageElement = new Image();

    nbEnemies = 3;
    enemies: Enemy[] = [];

    constructor(game: Game) {
        this.Game = game;

        if (this.Game.Landscape.currentScene.hasEnemies) {
            for (var i = 0; i < this.nbEnemies; i++) {
                this.enemies[i] = new Goomba(
                    getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.width - (this.Game.Landscape.cellSize + 60)),
                    getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.height - (this.Game.Landscape.cellSize + 60)),
                    getRandomIntInclusive(1, 3),
                    getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
                );
            }
        }
    }

    loopEnemies(callback: Function): void {
        this.enemies.forEach((enemy: Enemy) => {
            callback(enemy);
        });
    }

    killEnemy(enemy: Enemy): void {
        const enemyIndex = this.enemies.indexOf(enemy);

        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }

        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
            this.Game.Landscape.currentScene.hasEnemies = false;
        }
    }

    draw(): void {
        this.loopEnemies((enemy) => {
            enemy.requestNewFrameAnimation(enemy.speed);

            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                enemy.sprites[enemy.direction][enemy.currentAnimationStep],
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
            this.Game.ctx.closePath();
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy)) {
                this.Game.Player.takeDamage(20);
                this.Game.Player.takeKnockBack();
            }

            if (movingBoxCanvasCollision(enemy, this.Game.Canvas)) {
                enemy.invertDirection();
            }
        });

        this.Game.Landscape.loopCollision((cell, col, row) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxCollision(enemy, cell)) {
                    enemy.invertDirection();
                }
            });
        });
    }

    listenEvents(): void {
        this.loopEnemies((enemy) => {
            enemy.dx = 0;

            if (enemy.direction == Direction.Down) {
                enemy.dy = enemy.speed;
            } else {
                enemy.dy = -enemy.speed;
            }
        });
    }

    move(): void {
        this.loopEnemies((enemy) => {
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
        });
    }
}
