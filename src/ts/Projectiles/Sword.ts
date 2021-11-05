import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Projectile } from "./Projectile";


export class Sword extends Projectile {
    constructor({ game, x, y, speed, direction, damage }: {
        game: Game;
        x: number;
        y: number;
        speed: number;
        direction: Direction;
        damage: number;
    }) {
        super({ speed, direction });

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

    deleteCallback(): void {
        this.Game.Sword.isFlying = false;
    }
}
