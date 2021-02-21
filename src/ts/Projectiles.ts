import { Game } from "./Game.js"

import { GameMovingBox } from "./Libraries/Boxes.js";
import { Direction } from "./Libraries/Direction.js";
import { StateObserver } from "./Libraries/Observers.js";

export enum ProjectileState {Moving, ShieldBlocked}

export class Projectile extends GameMovingBox {
    speed: number;

    sprite: HTMLImageElement;

    hasPlayerCollision: boolean;
    canBeShieldBlocked: boolean;
    playerCollisionCallback: Function;

    hasEnemiesCollision: boolean;
    enemiesCollisionCallback: Function;

    deleteCallback: Function;

    state: StateObserver;

    constructor(
        game: Game,
        x: number,
        y: number,
        width: number,
        height: number,
        speed: number,
        direction: Direction,
        sprite: HTMLImageElement,
        hasPlayerCollision: boolean,
        canBeShieldBlocked: boolean,
        playerCollisionCallback: Function,
        hasEnemiesCollision: boolean,
        enemiesCollisionCallback: Function,
        deleteCallback: Function
    ) {
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

        this.state = new StateObserver(ProjectileState.Moving)
    }
}
