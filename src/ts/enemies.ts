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

    constructor(game: Game, x: number, y: number, width: number, height: number, speed: number, direction: Direction) {
        super(game);

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

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
    passBetweenBoxesHelper(): boolean { return false; }
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
        if (this.Game.Player.hp < this.Game.Player.maxHp && getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(
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

    halfLeftHitBox: MovingBoxHitBox;
    halfRightHitBox: MovingBoxHitBox;
    halfUpHitBox: MovingBoxHitBox;
    halfDownHitBox: MovingBoxHitBox;

    constructor(game: Game, x: number, y: number, width: number, height: number, speed: number, direction: Direction) {
        super(game, x, y, width, height, speed, direction);

        this.state = new StateObserver(EnemieState.ChangeDirection);

        // HalfHitBoxs are used by the passBetweenHelper() function

        // | ** | -- |
        // | ** | -- |

        this.halfLeftHitBox = new MovingBoxHitBox(
            this,
            0,
            0,
            this.width / 2,
            this.height
        );

        // | -- | ** |
        // | -- | ** |

        this.halfRightHitBox = new MovingBoxHitBox(
            this,
            this.width / 2,
            0,
            this.width / 2,
            this.height
        );

        // | ** | ** |
        // | -- | -- |

        this.halfUpHitBox = new MovingBoxHitBox(
            this,
            0,
            0,
            this.width,
            this.height / 2
        );

        // | -- | -- |
        // | ** | ** |

        this.halfDownHitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width,
            this.height / 2
        );
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
                    if (getOneRandom(50)) this.state.setNextState(EnemieState.Attack);
                    if (getOneRandom(50)) this.state.setNextState(EnemieState.ChangeDirection);
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

    // Helper to pass between two boxes
    passBetweenBoxesHelper(): boolean {
        let halfLeftCollision = false;
        let halfRightCollision = false;
        let halfUpCollision = false;
        let halfDownCollision = false;

        this.Game.Viewport.loopCollision((cell, col, row) => {
            if (simpleMovingBoxCollision(this.halfLeftHitBox, cell)) {
                halfLeftCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfRightHitBox, cell)) {
                halfRightCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfUpHitBox, cell)) {
                halfUpCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfDownHitBox, cell)) {
                halfDownCollision = true;
            }
        });


        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            if (halfLeftCollision && !halfRightCollision) {
                this.dx = this.speed;

                return true;
            }
            else if (!halfLeftCollision && halfRightCollision) {
                this.dx = -this.speed;

                return true;
            }
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            if (halfUpCollision && !halfDownCollision) {
                this.dy = this.speed;

                return true;
            }
            else if (!halfUpCollision && halfDownCollision) {
                this.dy = -this.speed;

                return true;
            }
        }

        return false;
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
        super(game, x, y, 64, 64, speed, direction);

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
        this.Game.ProjectileManager.addProjectile(new Projectile(
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

        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(
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
        super(game, x, y, 64, 64, speed, direction);

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

        this.Game.ProjectileManager.addProjectile(new Projectile(
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

        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(
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
        super(game, x, y, 64, 64, 3, Direction.Down);

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
                    this.dx = this.realDy / 2 * ((getOneRandom(2)) ? -1 : 1);
                }
                else {
                    this.dy = this.realDy + (0.1 * this.Game.dt);
                }
                if ((this.state.currentFrame > 60 && getOneRandom(50)) || this.state.currentFrame > 100) this.state.setNextState(EnemieState.Wait);
                break;
            case EnemieState.Wait:
                this.dx = 0;
                this.dy = 0;
                if ((this.state.currentFrame > 30 && getOneRandom(50)) || this.state.currentFrame > 60)  this.state.setNextState(EnemieState.Moving);
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

        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(
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
