enum OctorokState {Moving, ChangeDirection, Attack};

class Enemy extends MovingBox {
    Game: Game;
    speed: number;
    damage: number;

    landscapeHitBox: MovingBoxHitBox;

    sprites: HTMLImageElement[][] = [];
    spritesAnimation: AnimationObserver;

    state: StateObserver;

    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
    }
}

class Octorok extends Enemy {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.width = 64;
        this.height = 64;

        this.damage = 1;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/octorok-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/octorok-up2.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/octorok-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/octorok-down2.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/octorok-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/octorok-right2.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/octorok-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/octorok-left2.png");

        this.spritesAnimation = new AnimationObserver(20 / speed, 2);

        this.state = new StateObserver(OctorokState.ChangeDirection);
    }

    aiThinking(): void {
        switch (this.state.get()) {
            case OctorokState.Moving:
                switch (this.direction) {
                    case Direction.Down:
                        this.dy = this.speed;
                        break;
                    case Direction.Up:
                        this.dy = -this.speed;
                        break;
                    case Direction.Right:
                        this.dx = this.speed;
                        break;
                    case Direction.Left:
                        this.dx = -this.speed;
                        break;
                }
                if (this.state.currentFrame > 50) {
                    if (getRandomIntInclusive(1, 50) === 1) this.state.set(OctorokState.Attack);
                    if (getRandomIntInclusive(1, 200) === 1) this.state.set(OctorokState.ChangeDirection);
                }
                break;
            case OctorokState.ChangeDirection:
                if (this.state.currentFrame === 20) {
                    this.direction = getRandomDirection();
                }
                if (this.state.currentFrame > 30) {
                    this.state.set(OctorokState.Moving);
                }
                break;
            case OctorokState.Attack:
                if (this.state.currentFrame === 20) {
                    this.Game.Projectiles.addProjectile(new Projectile(
                        this.x + (this.width / 2) - (24 / 2),
                        this.y + (this.height / 2) - (30 / 2),
                        24,
                        30,
                        8,
                        this.direction,
                        SpriteLoader.load("./sprites/png/fireball.png"),
                        true, // Enable collision on Player
                        true, // Enable shield block
                        (player) => player.takeDamage(this.damage),
                        false, // Disable collisions on Ennemies
                        null,
                        null,
                    ));
                }
                if (this.state.currentFrame > 30) {
                    this.state.set(OctorokState.Moving);
                }
                break;

            default:
                break;
        }
    }

    changeDirection(): void {
        this.state.set(OctorokState.ChangeDirection);
    }
}

class BlueOctorok extends Octorok {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.damage = 2;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/blue-octorok-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/blue-octorok-up2.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/blue-octorok-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/blue-octorok-down2.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/blue-octorok-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/blue-octorok-right2.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/blue-octorok-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/blue-octorok-left2.png");
    }
}

class Enemies {
    Game: Game;

    enemies: Enemy[] = [];

    dieSound: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;

        this.dieSound = AudioLoader.load("./sounds/effect/Enemy_Die.wav");

        if (this.Game.Viewport.currentScene.hasEnemies) {
            this.enemies = this.Game.Viewport.currentScene.enemies;
        }
    }

    loopEnemies(callback: Function): void {
        this.enemies.forEach((enemy: Enemy) => {
            callback(enemy);
        });
    }

    killEnemy(enemy: Enemy): void {
        this.dieSound.play();

        const enemyIndex = this.enemies.indexOf(enemy);

        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }

        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
        }

        if (this.Game.Player.hp < this.Game.Player.maxHp && getRandomIntInclusive(1, 4) === 1) {
            this.Game.Items.addItem(new Item(
                enemy.x + (enemy.width / 2) - (24 / 2),
                enemy.y + (enemy.height / 2) - (24 / 2),
                24,
                24,
                SpriteLoader.load('./sprites/png/full-heart.png'),
                () => this.Game.Player.recoverHealth(2)
            ));
        }
    }

    aiThinking(): void {
        this.loopEnemies((enemy) => {
            enemy.aiThinking();
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player.hitBox, enemy)) {
                this.Game.Player.takeDamage(enemy.damage);
            }

            if (movingBoxCanvasCollision(enemy, this.Game.Viewport)) {
                enemy.changeDirection();
            }
        });

        this.Game.Viewport.loopCollision((cell, col, row) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxCollision(enemy, cell)) {
                    enemy.changeDirection();
                }
            });
        });
    }

    move(): void {
        this.loopEnemies((enemy) => {
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
            enemy.dx = 0;
            enemy.dy = 0;
        });
    }

    draw(): void {
        this.loopEnemies((enemy) => {
            this.Game.Viewport.currentScene.drawImage(
                enemy.sprites[enemy.direction][enemy.spritesAnimation.currentAnimationStep],
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );

            if (this.Game.state.is(GameState.Run)) enemy.spritesAnimation.update();
        });
    }

    updateObservers(): void {
        this.loopEnemies((enemy) => {
            enemy.state.update();
        });
    }
}
