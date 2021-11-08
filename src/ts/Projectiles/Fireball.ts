import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Projectile } from "./Projectile";


export class Fireball extends Projectile {
    sprite: HTMLImageElement;

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

        this.width = 24;
        this.height = 30;

        this.damage = damage;

        this.sprite = this.Game.AssetManager.getImage("./sprites/png/fireball.png");

        this.sprites[Direction.Up] = this.sprite;
        this.sprites[Direction.Down] = this.sprite;
        this.sprites[Direction.Right] = this.sprite;
        this.sprites[Direction.Left] = this.sprite;

        this.hasPlayerCollision = true;
        this.canBeShieldBlocked = true;

        this.hasEnemiesCollision = false;
    }
}
