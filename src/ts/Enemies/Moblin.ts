import { Game } from "../Game";
import { SpriteLoader } from "../Libraries/Loaders";
import { Direction } from "../Libraries/Direction";
import { AnimationObserver } from "../Libraries/Observers";
import { Arrow } from "../Projectiles/Arrow";
import { SimpleMovingEnemy } from "./SimpleMovingEnemy";


export class Moblin extends SimpleMovingEnemy {
    constructor({ game, x, y, speed, direction }: {
        game: Game;
        x: number;
        y: number;
        speed: number;
        direction: Direction;
    }) {
        super({
            width: 64,
            height: 64
        });

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
        this.sprites[Direction.Up][1] = SpriteLoader.load(
            "./sprites/png/moblin-up1.png"
        );
        this.sprites[Direction.Up][2] = SpriteLoader.load(
            "./sprites/png/moblin-up2.png"
        );

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load(
            "./sprites/png/moblin-down1.png"
        );
        this.sprites[Direction.Down][2] = SpriteLoader.load(
            "./sprites/png/moblin-down2.png"
        );

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load(
            "./sprites/png/moblin-right1.png"
        );
        this.sprites[Direction.Right][2] = SpriteLoader.load(
            "./sprites/png/moblin-right2.png"
        );

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load(
            "./sprites/png/moblin-left1.png"
        );
        this.sprites[Direction.Left][2] = SpriteLoader.load(
            "./sprites/png/moblin-left2.png"
        );

        this.spritesAnimation = new AnimationObserver(25 / speed, 2);
    }

    attack(): void {
        this.Game.ProjectileManager.addProjectile(
            new Arrow({
                game: this.Game,
                x: this.x + this.width / 2 - 24 / 2,
                y: this.y + this.height / 2 - 30 / 2,
                speed: 8,
                direction: this.direction,
                damage: this.damage
            })
        );
    }
}
