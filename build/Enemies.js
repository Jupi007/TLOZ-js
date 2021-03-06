import { MovingBox, MovingBoxHalfHitBoxes } from "./Libraries/Boxes.js";
import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Collisions } from "./Libraries/Collisions.js";
import { Random } from "./Libraries/Random.js";
import { StateObserver, AnimationObserver } from "./Libraries/Observers.js";
import { Heart, Clock } from "./Items.js";
import { Fireball, Arrow } from "./Projectiles.js";
export var EnemyState;
(function (EnemyState) {
    EnemyState[EnemyState["Moving"] = 0] = "Moving";
    EnemyState[EnemyState["ChangeDirection"] = 1] = "ChangeDirection";
    EnemyState[EnemyState["Wait"] = 2] = "Wait";
    EnemyState[EnemyState["Attack"] = 3] = "Attack";
    EnemyState[EnemyState["Killed"] = 4] = "Killed";
})(EnemyState || (EnemyState = {}));
;
export class Enemy extends MovingBox {
    constructor() {
        super();
        this.killedSprites = [];
        this.hasPlayerCollision = true;
        this.hasViewportCollision = true;
        this.hasBricksCollisions = true;
        this.requirePassBetweenBoxHelper = false;
        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");
        this.invincibleObserver = new StateObserver(false);
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
    customCollision() { }
    moveHelper() { return false; }
    takeDamage(damage) {
        if (this.invincibleObserver.is(true) || this.state.is(EnemyState.Killed))
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
        this.invincibleObserver.setNextState(true);
    }
    dropItem() {
        if (this.Game.Player.hp < this.Game.Player.maxHp && Random.getOneInt(3)) {
            this.Game.ItemManager.addItem(new Heart(this.Game, this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (24 / 2)));
            return true;
        }
        return false;
    }
}
export class SimpleMovingEnemy extends Enemy {
    constructor(width, height) {
        super();
        this.sprites = [];
        this.width = width;
        this.height = height;
        this.state = new StateObserver(EnemyState.ChangeDirection);
        this.halfHitBoxes = new MovingBoxHalfHitBoxes(this.hitBox);
        this.requirePassBetweenBoxHelper = true;
    }
    aiThinking() {
        switch (this.state.get()) {
            case EnemyState.Moving:
                if (this.invincibleObserver.is(false)) {
                    switch (this.direction) {
                        case Direction.Down:
                            this.dy = this.speed * this.Game.dt;
                            break;
                        case Direction.Up:
                            this.dy = -this.speed * this.Game.dt;
                            break;
                        case Direction.Right:
                            this.dx = this.speed * this.Game.dt;
                            break;
                        case Direction.Left:
                            this.dx = -this.speed * this.Game.dt;
                            break;
                    }
                }
                if (this.state.currentFrame > 50) {
                    if (Random.getOneInt(25))
                        this.changeDirection();
                    else if (Random.getOneInt(25))
                        this.state.setNextState(EnemyState.Attack);
                }
                break;
            case EnemyState.ChangeDirection:
                if (this.state.currentFrame >= 15 && !this.hasChangedDirection) {
                    this.direction = Direction.getRandom();
                    this.hasChangedDirection = true;
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
    viewportCollision() {
        this.changeDirection();
    }
    bricksCollision() {
        this.changeDirection();
    }
    moveHelper() {
        return Collisions.passBetweenBoxesHelper(this);
    }
    changeDirection() {
        this.state.setNextState(EnemyState.ChangeDirection);
        this.hasChangedDirection = false;
    }
    draw() {
        this.Game.Viewport.currentScene.drawImage(this.sprites[this.direction][this.spritesAnimation.currentAnimationStep], this.x, this.y, this.width, this.height);
    }
    attack() { }
}
export class Octorok extends SimpleMovingEnemy {
    constructor(game, x, y, speed, direction) {
        let width = 64;
        let height = 64;
        super(width, height);
        this.Game = game;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
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
        this.Game.ProjectileManager.addProjectile(new Fireball(this.Game, this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (30 / 2), 8, this.direction, this.damage));
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
        if (Random.getOneInt(3) && !this.Game.Player.invincibleObserver.is(true)) {
            this.Game.ItemManager.addItem(new Clock(this.Game, this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2)));
            return true;
        }
        return false;
    }
}
export class Moblin extends SimpleMovingEnemy {
    constructor(game, x, y, speed, direction) {
        let width = 64;
        let height = 64;
        super(width, height);
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.speed = speed;
        this.direction = direction;
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
    }
    attack() {
        this.Game.ProjectileManager.addProjectile(new Arrow(this.Game, this.x + (this.width / 2) - (24 / 2), this.y + (this.height / 2) - (30 / 2), 8, this.direction, this.damage));
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
        if (Random.getOneInt(3) && !this.Game.Player.invincibleObserver.is(true)) {
            this.Game.ItemManager.addItem(new Clock(this.Game, this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2)));
            return true;
        }
        return false;
    }
}
export class Tektite extends Enemy {
    constructor(game, x, y) {
        super();
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.speed = 6;
        this.direction = Direction.Down;
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
                    this.dx = this.dy / 2 * ((Random.getOneInt(2)) ? -1 : 1);
                }
                else {
                    this.dy = this.dy + (0.1 * this.Game.dt);
                }
                if ((this.state.currentFrame > 60 && Random.getOneInt(50)) || this.state.currentFrame > 100)
                    this.state.setNextState(EnemyState.Wait);
                break;
            case EnemyState.Wait:
                this.dx = 0;
                this.dy = 0;
                if ((this.state.currentFrame > 30 && Random.getOneInt(50)) || this.state.currentFrame > 60)
                    this.state.setNextState(EnemyState.Moving);
                break;
        }
    }
    customCollision() {
        if (Collisions.movingBoxLine(this.hitBox, 0, Direction.Up)) {
            this.dy = this.dy / 2;
        }
        if (Collisions.movingBoxLine(this.hitBox, this.Game.Viewport.height, Direction.Down)) {
            this.state.setNextState(EnemyState.Wait);
        }
        if (Collisions.simpleMovingBoxLine(this.hitBox, 0, Direction.Left)) {
            this.dx = -this.dx;
        }
        if (Collisions.simpleMovingBoxLine(this.hitBox, this.Game.Viewport.width, Direction.Right)) {
            this.dx = -this.dx;
        }
    }
    move() {
        if (this.state.is(EnemyState.Killed))
            return;
        this.y += this.dy * this.Game.dt;
        this.x += this.dx * this.Game.dt;
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
        if (Random.getOneInt(3) && !this.Game.Player.invincibleObserver.is(true)) {
            this.Game.ItemManager.addItem(new Clock(this.Game, this.x + (this.width / 2) - (32 / 2), this.y + (this.height / 2) - (32 / 2)));
            return true;
        }
        return false;
    }
}
