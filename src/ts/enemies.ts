enum EnemieState {Moving, ChangeDirection, Wait, Attack, Killed};

class Enemy extends GameMovingBox {
    hp: number;
    speed: number;
    damage: number;

    hasPlayerCollision: boolean;
    hasViewportCollision: boolean;
    hasBricksCollisions: boolean;

    spritesAnimation: AnimationObserver;

    killedSprites: HTMLImageElement[] = [];

    isInvincibleObserver: StateObserver;
    invincibleDuration: number;
    invincibleAnimation: AnimationObserver;

    state: StateObserver;

    dieSound: HTMLAudioElement;
    hitSound: HTMLAudioElement;

    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game);

        this.Game = game;

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;

        this.hasPlayerCollision = true;
        this.hasViewportCollision = true;
        this.hasBricksCollisions = true;

        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");

        this.isInvincibleObserver = new StateObserver(false);
        this.invincibleDuration = 25;
        this.invincibleAnimation = new AnimationObserver(7, 2);

        this.dieSound = AudioLoader.load("./sounds/effect/Enemy_Die.wav");
        this.hitSound = AudioLoader.load("./sounds/effect/Enemy_Hit.wav");
    }

    aiThinking(): void {}
    move(): void {
        this.y += this.dy;
        this.x += this.dx;
        this.dx = 0;
        this.dy = 0;
    }

    draw(): void {}

    playerCollision(): void {
        this.Game.Player.takeDamage(this.damage);
    }
    viewportCollision(): void {}
    bricksCollision(): void {}
    customCollision(): void {}

    takeDamage(damage): void {
        if (this.isInvincibleObserver.is(true) || this.state.is(EnemieState.Killed)) return;

        this.hp -= damage;

        if (this.hp <= 0) {
            this.dieSound.play();
            this.state.setNextState(EnemieState.Killed)
            return;
        }

        this.getInvicibility();
        this.hitSound.play();
    }

    getInvicibility(): void {
        this.isInvincibleObserver.setNextState(true);
    }

    dropItem(): boolean {
        if (this.Game.Player.hp < this.Game.Player.maxHp && getRandomIntInclusive(1, 3) === 1) {
            this.Game.Items.addItem(new Item(
                this.x + (this.width / 2) - (24 / 2),
                this.y + (this.height / 2) - (24 / 2),
                24,
                24,
                SpriteLoader.load('./sprites/png/full-heart.png'),
                () => this.Game.Player.recoverHealth(2),
                AudioLoader.load("./sounds/effect/Get_Heart.wav")
            ));
            return true;
        }

        return false;
    }
}

class SimpleMovingEnemy extends Enemy {
    sprites: HTMLImageElement[][] = [];

    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.state = new StateObserver(EnemieState.ChangeDirection);
    }

    aiThinking(): void {
        switch (this.state.get()) {
            case EnemieState.Moving:
                if (this.isInvincibleObserver.is(false)) {
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
                }
                if (this.state.currentFrame > 50) {
                    if (getRandomIntInclusive(1, 50) === 1) this.state.setNextState(EnemieState.Attack);
                    if (getRandomIntInclusive(1, 200) === 1) this.state.setNextState(EnemieState.ChangeDirection);
                }
                break;
            case EnemieState.ChangeDirection:
                if (this.state.isFirstFrame) {
                    this.direction = Direction.getRandom();
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemieState.Moving);
                }
                break;
            case EnemieState.Attack:
                if (this.state.isFirstFrame) {
                    this.attack();
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemieState.Moving);
                }
                break;

            default:
                break;
        }
    }

    viewportCollision(): void {
        this.changeDirection();
    }
    bricksCollision(): void {
        this.changeDirection();
    }

    changeDirection(): void {
        this.state.setNextState(EnemieState.ChangeDirection);
    }

    draw(): void {
        this.Game.Viewport.currentScene.drawImage(
            this.sprites[this.direction][this.spritesAnimation.currentAnimationStep],
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    attack(): void {}
}

class Octorok extends SimpleMovingEnemy {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.width = 64;
        this.height = 64;

        this.damage = 1;
        this.hp = 1;

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
    }

    attack(): void {
        this.Game.Projectiles.addProjectile(new Projectile(
            this.Game,
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
            false, // Disable collisions on Enemies
            null,
            null,
        ));
    }
}

class BlueOctorok extends Octorok {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.damage = 2;
        this.hp = 2;

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

    dropItem(): boolean {
        if (super.dropItem()) return true;

        if (getRandomIntInclusive(1, 3) === 1) {
            this.Game.Items.addItem(new Item(
                this.x + (this.width / 2) - (32 / 2),
                this.y + (this.height / 2) - (32 / 2),
                32,
                32,
                SpriteLoader.load('./sprites/png/clock.png'),
                () => this.Game.Player.getInvicibility(400),
                AudioLoader.load("./sounds/effect/Get_Item.wav")
            ));
            return true;
        }

        return false;
    }
}

class Moblin extends SimpleMovingEnemy {
    arrowSprites: HTMLImageElement[];

    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.width = 64;
        this.height = 64;

        this.damage = 1;
        this.hp = 1;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/moblin-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/moblin-up2.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/moblin-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/moblin-down2.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/moblin-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/moblin-right2.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/moblin-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/moblin-left2.png");

        this.spritesAnimation = new AnimationObserver(25 / speed, 2);

        this.arrowSprites = [];
        this.arrowSprites[Direction.Up] = SpriteLoader.load("./sprites/png/arrow-up.png");
        this.arrowSprites[Direction.Down] = SpriteLoader.load("./sprites/png/arrow-down.png");
        this.arrowSprites[Direction.Right] = SpriteLoader.load("./sprites/png/arrow-right.png");
        this.arrowSprites[Direction.Left] = SpriteLoader.load("./sprites/png/arrow-left.png");
    }

    attack(): void {
        let width = (this.direction === Direction.Up || this.direction === Direction.Down) ? 20 : 64;
        let height = (this.direction === Direction.Up || this.direction === Direction.Down) ? 64 : 20;

        this.Game.Projectiles.addProjectile(new Projectile(
            this.Game,
            this.x + (this.width / 2) - (24 / 2),
            this.y + (this.height / 2) - (30 / 2),
            width,
            height,
            8,
            this.direction,
            this.arrowSprites[this.direction],
            true, // Enable collision on Player
            true, // Enable shield block
            (player) => player.takeDamage(this.damage),
            false, // Disable collisions on Enemies
            null,
            null,
        ));
    }
}

class BlueMoblin extends Moblin {
    constructor(game: Game, x: number, y: number, speed: number, direction: Direction) {
        super(game, x, y, speed, direction);

        this.damage = 2;
        this.hp = 2;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/blue-moblin-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/blue-moblin-up2.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/blue-moblin-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/blue-moblin-down2.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/blue-moblin-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/blue-moblin-right2.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/blue-moblin-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/blue-moblin-left2.png");
    }

    dropItem(): boolean {
        if (super.dropItem()) return true;

        if (getRandomIntInclusive(1, 3) === 1) {
            this.Game.Items.addItem(new Item(
                this.x + (this.width / 2) - (32 / 2),
                this.y + (this.height / 2) - (32 / 2),
                32,
                32,
                SpriteLoader.load('./sprites/png/clock.png'),
                () => this.Game.Player.getInvicibility(400),
                AudioLoader.load("./sounds/effect/Get_Item.wav")
            ));
            return true;
        }

        return false;
    }
}

class Tektite extends Enemy {
    sprites: HTMLImageElement[];

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 3, Direction.Down);

        this.width = 64;
        this.height = 64;

        this.damage = 1;
        this.hp = 1;

        // this.hasPlayerCollision = true;
        this.hasViewportCollision = false;
        this.hasBricksCollisions = false;

        this.sprites = [];
        this.sprites[1] = SpriteLoader.load("./sprites/png/tektite1.png");
        this.sprites[2] = SpriteLoader.load("./sprites/png/tektite2.png");

        this.spritesAnimation = new AnimationObserver(20, 2);

        this.state = new StateObserver(EnemieState.Wait);
    }

    aiThinking(): void {
        switch (this.state.get()) {
            case EnemieState.Moving:
                if (this.state.isFirstFrame) {
                    this.dy = -6;
                    this.dx = this.realDy / 2 * ((getRandomIntInclusive(1, 2) === 1) ? -1 : 1);
                }
                else {
                    this.dy = this.realDy + (0.1 * this.Game.dt);
                }
                if ((this.state.currentFrame > 60 && getRandomIntInclusive(1, 50) === 1) || this.state.currentFrame > 100) this.state.setNextState(EnemieState.Wait);
                break;
            case EnemieState.Wait:
                this.dx = 0;
                this.dy = 0;
                if ((this.state.currentFrame > 30 && getRandomIntInclusive(1, 50) === 1) || this.state.currentFrame > 60)  this.state.setNextState(EnemieState.Moving);
                break;
        }
    }

    customCollision(): void {
        if (movingBoxLineCollision(this, 0, Direction.Up)) {
            this.dy = this.realDy / 2;
        }
        if (movingBoxLineCollision(this, this.Game.Viewport.height, Direction.Down)) {
            this.state.setNextState(EnemieState.Wait);
        }
        if (simpleMovingBoxLineCollision(this, 0, Direction.Left)) {
            this.dx = -this.realDx;
        }
        if (simpleMovingBoxLineCollision(this, this.Game.Viewport.width, Direction.Right)) {
            this.dx = -this.realDx;
        }
    }

    move(): void {
        if (this.state.is(EnemieState.Killed)) return;

        this.y += this.dy;
        this.x += this.dx;
    }

    draw(): void {
        let sprite: HTMLImageElement;

        switch (this.state.get()) {
            case EnemieState.Moving:
                sprite = this.sprites[1];
                break;
            case EnemieState.Wait:
                sprite = this.sprites[this.spritesAnimation.currentAnimationStep];
                break;

            default:
                break;
        }

        this.Game.Viewport.currentScene.drawImage(
            sprite,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

class BlueTektite extends Tektite {
    constructor(game: Game, x: number, y: number) {
        super(game, x, y);

        this.damage = 2;

        this.sprites = [];
        this.sprites[1] = SpriteLoader.load("./sprites/png/blue-tektite1.png");
        this.sprites[2] = SpriteLoader.load("./sprites/png/blue-tektite2.png");
    }

    dropItem(): boolean {
        if (super.dropItem()) return true;

        if (getRandomIntInclusive(1, 3) === 1) {
            this.Game.Items.addItem(new Item(
                this.x + (this.width / 2) - (32 / 2),
                this.y + (this.height / 2) - (32 / 2),
                32,
                32,
                SpriteLoader.load('./sprites/png/clock.png'),
                () => this.Game.Player.getInvicibility(400),
                AudioLoader.load("./sounds/effect/Get_Item.wav")
            ));
            return true;
        }

        return false;
    }
}

class Enemies {
    Game: Game;

    enemies: Enemy[] = [];

    constructor(game: Game) {
        this.Game = game;

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
        const enemyIndex = this.enemies.indexOf(enemy);

        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }

        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
        }

        enemy.dropItem();
    }

    aiThinking(): void {
        this.loopEnemies((enemy) => {
            enemy.aiThinking();
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (enemy.hasPlayerCollision && movingBoxsCollision(this.Game.Player.hitBox, enemy) && !enemy.state.is(EnemieState.Killed)) {
                enemy.playerCollision();
            }

            if (enemy.hasViewportCollision && movingBoxCanvasCollision(enemy, this.Game.Viewport)) {
                enemy.viewportCollision();
            }

            if (enemy.hasBricksCollisions) {
                this.Game.Viewport.loopCollision((cell, col, row) => {
                    if (movingBoxCollision(enemy, cell)) {
                        enemy.bricksCollision();
                    }
                });
            }

            enemy.customCollision();
        });
    }

    move(): void {
        this.loopEnemies((enemy) => {
            enemy.move();
        });
    }

    draw(): void {
        this.loopEnemies((enemy) => {
            if (enemy.state.is(EnemieState.Killed)) {
                if (enemy.state.currentFrame <= 10) {
                    this.Game.Viewport.currentScene.drawImage(
                        enemy.killedSprites[1],
                        enemy.x,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                }
                else if (enemy.state.currentFrame <= 20) {
                    this.Game.Viewport.currentScene.drawImage(
                        enemy.killedSprites[2],
                        enemy.x,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                }
                else {
                    this.Game.Enemies.killEnemy(enemy);
                }
                return;
            }

            if (enemy.isInvincibleObserver.is(true)) {
                enemy.invincibleAnimation.update(this.Game.dt);
                if (enemy.invincibleAnimation.currentAnimationStep === 2) return;
            }

            enemy.draw();

            if (this.Game.state.is(GameState.Run)) enemy.spritesAnimation.update(this.Game.dt);
        });
    }

    updateObservers(): void {
        this.loopEnemies((enemy) => {
            enemy.state.update(this.Game.dt);
            enemy.isInvincibleObserver.update(this.Game.dt);

            if (enemy.isInvincibleObserver.get() && enemy.isInvincibleObserver.currentFrame > enemy.invincibleDuration) {
                enemy.isInvincibleObserver.setNextState(false);
            }
        });
    }
}
