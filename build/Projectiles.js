import { GameMovingBox, Direction } from "./AbstractClasses.js";
import { StateObserver } from "./Observers.js";
export var ProjectileState;
(function (ProjectileState) {
    ProjectileState[ProjectileState["Moving"] = 0] = "Moving";
    ProjectileState[ProjectileState["ShieldBlocked"] = 1] = "ShieldBlocked";
})(ProjectileState || (ProjectileState = {}));
export class Projectile extends GameMovingBox {
    constructor(game, x, y, width, height, speed, direction, sprite, hasPlayerCollision, canBeShieldBlocked, playerCollisionCallback, hasEnemiesCollision, enemiesCollisionCallback, deleteCallback) {
        super(game);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.sprite = sprite;
        this.hasPlayerCollision = hasPlayerCollision;
        this.canBeShieldBlocked = canBeShieldBlocked;
        this.playerCollisionCallback = playerCollisionCallback;
        this.hasEnemiesCollision = hasEnemiesCollision;
        this.enemiesCollisionCallback = enemiesCollisionCallback;
        this.deleteCallback = deleteCallback;
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
        this.state = new StateObserver(ProjectileState.Moving);
    }
}
