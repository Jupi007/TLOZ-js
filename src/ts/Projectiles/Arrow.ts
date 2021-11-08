import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Projectile } from "./Projectile";


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

        this.sprites[Direction.Up] = this.Game.AssetManager.getImage(
            "./sprites/png/arrow-up.png"
        );
        this.sprites[Direction.Down] = this.Game.AssetManager.getImage(
            "./sprites/png/arrow-down.png"
        );
        this.sprites[Direction.Right] = this.Game.AssetManager.getImage(
            "./sprites/png/arrow-right.png"
        );
        this.sprites[Direction.Left] = this.Game.AssetManager.getImage(
            "./sprites/png/arrow-left.png"
        );

        this.hasPlayerCollision = true;
        this.canBeShieldBlocked = true;

        this.hasEnemiesCollision = false;
    }
}
