import { MovingBoxHitBox, GameMovingBox, SpriteLoader, AudioLoader, Direction } from "./AbstractClasses.js";
import { getOneRandom, Collisions } from "./functions.js";
import { StateObserver, AnimationObserver } from "./Observers.js";
import { Item } from "./Items.js";
import { Projectile } from "./Projectiles.js";
export var EnemyState;
(function (EnemyState) {
    EnemyState[EnemyState["Moving"] = 0] = "Moving";
    EnemyState[EnemyState["ChangeDirection"] = 1] = "ChangeDirection";
    EnemyState[EnemyState["Wait"] = 2] = "Wait";
    EnemyState[EnemyState["Attack"] = 3] = "Attack";
    EnemyState[EnemyState["Killed"] = 4] = "Killed";
})(EnemyState || (EnemyState = {}));
;
export class Enemy extends GameMovingBox {
    constructor(game, x, y, width, height, speed, direction) {
        super(game);
        this.killedSprites = [];
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
    aiThinking() { }
    move() {
        this.y += this.dy;
        this.x += this.dx;
        this.dx = 0;
        this.dy = 0;
    }
    draw() { }
    playerCollision() {
        this.Game.Player.takeDamage(this.damage);
    }
    viewportCollision() { }
    bricksCollision() { }
    passBetweenBoxesHelper() { return false; }
    customCollision() { }
    takeDamage(damage) {
        if (this.isInvincibleObserver.is(true) || this.state.is(EnemyState.Killed))
            return;
        this.hp -= damage;
        if (this.hp <= 0) {
            this.dieSound.play();
            this.state.setNextState(EnemyState.Killed);
            return;
        }
        this.getInvicibility();
        this.hitSound.play();
    }
    getInvicibility() {
        this.isInvincibleObserver.setNextState(true);
    }
    dropItem() {
        if (this.Game.Player.hp < this.Game.Player.maxHp && getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (24 / 2), 24, 24, SpriteLoader.load('./sprites/png/full-heart.png'), () => this.Game.Player.recoverHealth(2), AudioLoader.load("./sounds/effect/Get_Heart.wav")));
            return true;
        }
        return false;
    }
}
export class SimpleMovingEnemy extends Enemy {
    constructor(game, x, y, width, height, speed, direction) {
        super(game, x, y, width, height, speed, direction);
        this.sprites = [];
        this.state = new StateObserver(EnemyState.ChangeDirection);
        // HalfHitBoxs are used by the passBetweenHelper() function
        // | ** | -- |
        // | ** | -- |
        this.halfLeftHitBox = new MovingBoxHitBox(this, 0, 0, this.width / 2, this.height);
        // | -- | ** |
        // | -- | ** |
        this.halfRightHitBox = new MovingBoxHitBox(this, this.width / 2, 0, this.width / 2, this.height);
        // | ** | ** |
        // | -- | -- |
        this.halfUpHitBox = new MovingBoxHitBox(this, 0, 0, this.width, this.height / 2);
        // | -- | -- |
        // | ** | ** |
        this.halfDownHitBox = new MovingBoxHitBox(this, 0, this.height / 2, this.width, this.height / 2);
    }
    aiThinking() {
        switch (this.state.get()) {
            case EnemyState.Moving:
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
                    if (getOneRandom(50))
                        this.state.setNextState(EnemyState.Attack);
                    if (getOneRandom(50))
                        this.state.setNextState(EnemyState.ChangeDirection);
                }
                break;
            case EnemyState.ChangeDirection:
                if (this.state.isFirstFrame) {
                    this.direction = Direction.getRandom();
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemyState.Moving);
                }
                break;
            case EnemyState.Attack:
                if (this.state.isFirstFrame) {
                    this.attack();
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemyState.Moving);
                }
                break;
            default:
                break;
        }
    }
    // Helper to pass between two boxes
    passBetweenBoxesHelper() {
        let halfLeftCollision = false;
        let halfRightCollision = false;
        let halfUpCollision = false;
        let halfDownCollision = false;
        this.Game.Viewport.loopCollision((cell, col, row) => {
            if (Collisions.simpleMovingBox(this.halfLeftHitBox, cell)) {
                halfLeftCollision = true;
            }
            if (Collisions.simpleMovingBox(this.halfRightHitBox, cell)) {
                halfRightCollision = true;
            }
            if (Collisions.simpleMovingBox(this.halfUpHitBox, cell)) {
                halfUpCollision = true;
            }
            if (Collisions.simpleMovingBox(this.halfDownHitBox, cell)) {
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
    viewportCollision() {
        this.changeDirection();
    }
    bricksCollision() {
        this.changeDirection();
    }
    changeDirection() {
        this.state.setNextState(EnemyState.ChangeDirection);
    }
    draw() {
        this.Game.Viewport.currentScene.drawImage(this.sprites[this.direction][this.spritesAnimation.currentAnimationStep], this.x, this.y, this.width, this.height);
    }
    attack() { }
}
export class Octorok extends SimpleMovingEnemy {
    constructor(game, x, y, speed, direction) {
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
    attack() {
        this.Game.ProjectileManager.addProjectile(new Projectile(this.Game, this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (30 / 2), 24, 30, 8, this.direction, SpriteLoader.load("./sprites/png/fireball.png"), true, // Enable collision on Player
        true, // Enable shield block
        (player) => player.takeDamage(this.damage), false, // Disable collisions on Enemies
        null, null));
    }
}
export class BlueOctorok extends Octorok {
    constructor(game, x, y, speed, direction) {
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
    dropItem() {
        if (super.dropItem())
            return true;
        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2), 32, 32, SpriteLoader.load('./sprites/png/clock.png'), () => this.Game.Player.getInvicibility(400), AudioLoader.load("./sounds/effect/Get_Item.wav")));
            return true;
        }
        return false;
    }
}
export class Moblin extends SimpleMovingEnemy {
    constructor(game, x, y, speed, direction) {
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
    attack() {
        let width = (this.direction === Direction.Up || this.direction === Direction.Down) ? 20 : 64;
        let height = (this.direction === Direction.Up || this.direction === Direction.Down) ? 64 : 20;
        this.Game.ProjectileManager.addProjectile(new Projectile(this.Game, this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (30 / 2), width, height, 8, this.direction, this.arrowSprites[this.direction], true, // Enable collision on Player
        true, // Enable shield block
        (player) => player.takeDamage(this.damage), false, // Disable collisions on Enemies
        null, null));
    }
}
export class BlueMoblin extends Moblin {
    constructor(game, x, y, speed, direction) {
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
    dropItem() {
        if (super.dropItem())
            return true;
        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2), 32, 32, SpriteLoader.load('./sprites/png/clock.png'), () => this.Game.Player.getInvicibility(400), AudioLoader.load("./sounds/effect/Get_Item.wav")));
            return true;
        }
        return false;
    }
}
export class Tektite extends Enemy {
    constructor(game, x, y) {
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
        this.state = new StateObserver(EnemyState.Wait);
    }
    aiThinking() {
        switch (this.state.get()) {
            case EnemyState.Moving:
                if (this.state.isFirstFrame) {
                    this.dy = -6;
                    this.dx = this.realDy / 2 * ((getOneRandom(2)) ? -1 : 1);
                }
                else {
                    this.dy = this.realDy + (0.1 * this.Game.dt);
                }
                if ((this.state.currentFrame > 60 && getOneRandom(50)) || this.state.currentFrame > 100)
                    this.state.setNextState(EnemyState.Wait);
                break;
            case EnemyState.Wait:
                this.dx = 0;
                this.dy = 0;
                if ((this.state.currentFrame > 30 && getOneRandom(50)) || this.state.currentFrame > 60)
                    this.state.setNextState(EnemyState.Moving);
                break;
        }
    }
    customCollision() {
        if (Collisions.movingBoxLine(this, 0, Direction.Up)) {
            this.dy = this.realDy / 2;
        }
        if (Collisions.movingBoxLine(this, this.Game.Viewport.height, Direction.Down)) {
            this.state.setNextState(EnemyState.Wait);
        }
        if (Collisions.simpleMovingBoxLine(this, 0, Direction.Left)) {
            this.dx = -this.realDx;
        }
        if (Collisions.simpleMovingBoxLine(this, this.Game.Viewport.width, Direction.Right)) {
            this.dx = -this.realDx;
        }
    }
    move() {
        if (this.state.is(EnemyState.Killed))
            return;
        this.y += this.dy;
        this.x += this.dx;
    }
    draw() {
        let sprite;
        switch (this.state.get()) {
            case EnemyState.Moving:
                sprite = this.sprites[1];
                break;
            case EnemyState.Wait:
                sprite = this.sprites[this.spritesAnimation.currentAnimationStep];
                break;
            default:
                break;
        }
        this.Game.Viewport.currentScene.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
}
export class BlueTektite extends Tektite {
    constructor(game, x, y) {
        super(game, x, y);
        this.damage = 2;
        this.sprites = [];
        this.sprites[1] = SpriteLoader.load("./sprites/png/blue-tektite1.png");
        this.sprites[2] = SpriteLoader.load("./sprites/png/blue-tektite2.png");
    }
    dropItem() {
        if (super.dropItem())
            return true;
        if (getOneRandom(3)) {
            this.Game.ItemManager.addItem(new Item(this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2), 32, 32, SpriteLoader.load('./sprites/png/clock.png'), () => this.Game.Player.getInvicibility(400), AudioLoader.load("./sounds/effect/Get_Item.wav")));
            return true;
        }
        return false;
    }
}
