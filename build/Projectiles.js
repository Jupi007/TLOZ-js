import { MovingBox } from "./Libraries/Boxes.js";
import { SpriteLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { StateObserver } from "./Libraries/Observers.js";
export var ProjectileState;
(function (ProjectileState) {
    ProjectileState[ProjectileState["Moving"] = 0] = "Moving";
    ProjectileState[ProjectileState["ShieldBlocked"] = 1] = "ShieldBlocked";
})(ProjectileState || (ProjectileState = {}));
export class Projectile extends MovingBox {
    constructor(speed, direction) {
        super();
        this.speed = speed;
        this.direction = direction;
        switch (this.direction) {
            case Direction.Up:
                this.dy = -this.speed;
                break;
            case Direction.Right:
                this.dx = this.speed;
                break;
            case Direction.Down:
                this.dy = this.speed;
                break;
            case Direction.Left:
                this.dx = -this.speed;
                break;
        }
        this.sprites = [];
        this.state = new StateObserver(ProjectileState.Moving);
    }
    playerCollisionCallback() {
        this.Game.Player.takeDamage(this.damage);
    }
    enemiesCollisionCallback(enemy) {
        enemy.takeDamage(this.damage);
    }
    deleteCallback() { }
}
export class Fireball extends Projectile {
    constructor(game, x, y, speed, direction, damage) {
        super(speed, direction);
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 30;
        this.damage = damage;
        this.sprite = SpriteLoader.load("./sprites/png/fireball.png");
        this.sprites[Direction.Up] = this.sprite;
        this.sprites[Direction.Down] = this.sprite;
        this.sprites[Direction.Right] = this.sprite;
        this.sprites[Direction.Left] = this.sprite;
        this.hasPlayerCollision = true;
        this.canBeShieldBlocked = true;
        this.hasEnemiesCollision = false;
    }
}
export class Arrow extends Projectile {
    constructor(game, x, y, speed, direction, damage) {
        super(speed, direction);
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = Direction.isVertical(direction) ? 20 : 64;
        this.height = Direction.isVertical(direction) ? 64 : 20;
        this.damage = damage;
        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/arrow-up.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/arrow-down.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/arrow-right.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/arrow-left.png");
        this.hasPlayerCollision = true;
        this.canBeShieldBlocked = true;
        this.hasEnemiesCollision = false;
    }
}
export class Sword extends Projectile {
    constructor(game, x, y, speed, direction, damage) {
        super(speed, direction);
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = Direction.isVertical(direction) ? 28 : 64;
        this.height = Direction.isVertical(direction) ? 64 : 28;
        this.damage = damage;
        this.sprites = this.Game.Sword.sprites;
        this.hasPlayerCollision = false;
        this.canBeShieldBlocked = false;
        this.hasEnemiesCollision = true;
    }
    deleteCallback() {
        this.Game.Sword.isFlying = false;
    }
}
