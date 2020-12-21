class Enemy extends MovingBox {
    Game: Game;
    speed: number;

    landscapeHitBox: MovingBoxLandscapeHitBox;

    sprites: HTMLImageElement[][] = [];
    spritesAnimation: GameAnimation;

    dieSound: HTMLAudioElement;

    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;

        this.landscapeHitBox = new MovingBoxLandscapeHitBox(this);
    }

    invertDirection(): void {
        if (this.direction == Direction.Up) {
            this.direction = Direction.Down;
        } else {
            this.direction = Direction.Up;
        }
    }
}

class Octorok extends Enemy {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.width = 64;
        this.height = 64;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/octorok-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/octorok-up2.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/octorok-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/octorok-down2.png");

        this.spritesAnimation = new GameAnimation(20 / speed, 2);

        this.dieSound = AudioLoader.load("./sounds/effect/Enemy_Die.wav");
    }
}

class Enemies {
    Game: Game;

    img: HTMLImageElement = new Image();

    nbEnemies = 3;
    enemies: Enemy[] = [];

    constructor(game: Game) {
        this.Game = game;

        if (this.Game.Landscape.currentScene.hasEnemies) {
            for (var i = 0; i < this.nbEnemies; i++) {
                this.enemies[i] = new Octorok(
                    this.Game,
                    getRandomIntInclusive(this.Game.Landscape.cellSize * 2, this.Game.Landscape.width - (this.Game.Landscape.cellSize * 2)),
                    getRandomIntInclusive(this.Game.Landscape.cellSize * 2, this.Game.Landscape.height - (this.Game.Landscape.cellSize * 2)),
                    getRandomIntInclusive(1, 2),
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
        enemy.dieSound.play();

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
            if (this.Game.status === GameStatus.Run) enemy.spritesAnimation.requestNewFrameAnimation(enemy.speed);


            this.Game.Landscape.currentScene.drawImage(
                enemy.sprites[enemy.direction][enemy.spritesAnimation.currentAnimationStep],
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy) && !this.Game.Player.isInvincible) {
                this.Game.Player.takeDamage(1);
                this.Game.Player.takeKnockBack();
            }

            if (movingBoxCanvasCollision(enemy, this.Game.Landscape)) {
                enemy.invertDirection();
            }
        });

        this.Game.Landscape.loopCollision((cell, col, row) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxCollision(enemy.landscapeHitBox, cell)) {
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
