import { Game } from "../Game";
import { SpriteLoader } from "../Libraries/Loaders";
import { Direction } from "../Libraries/Direction";
import { Projectile } from "./Projectiles";


export class Arrow extends Projectile {
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

        this.width = Direction.isVertical(direction) ? 20 : 64;
        this.height = Direction.isVertical(direction) ? 64 : 20;

        this.damage = damage;

        this.sprites[Direction.Up] = SpriteLoader.load(
            "./sprites/png/arrow-up.png"
        );
        this.sprites[Direction.Down] = SpriteLoader.load(
            "./sprites/png/arrow-down.png"
        );
        this.sprites[Direction.Right] = SpriteLoader.load(
            "./sprites/png/arrow-right.png"
        );
        this.sprites[Direction.Left] = SpriteLoader.load(
            "./sprites/png/arrow-left.png"
        );

        this.hasPlayerCollision = true;
        this.canBeShieldBlocked = true;

        this.hasEnemiesCollision = false;
    }
}
