import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { AnimationObserver } from "../Libraries/Observers";
import { Fireball } from "../Projectiles/Fireball";
import { SimpleMovingEnemy } from "./SimpleMovingEnemy";


export class Octorok extends SimpleMovingEnemy {
    constructor({ game, x, y, speed, direction }: {
        game: Game;
        x: number;
        y: number;
        speed: number;
        direction: Direction;
    }) {
        super({ game, width: 64, height: 64 });

        this.x = x;
        this.y = y;

        this.speed = speed;

        this.direction = direction;

        this.damage = 1;
        this.hp = 1;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-up1.png"
        );
        this.sprites[Direction.Up][2] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-up2.png"
        );

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-down1.png"
        );
        this.sprites[Direction.Down][2] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-down2.png"
        );

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-right1.png"
        );
        this.sprites[Direction.Right][2] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-right2.png"
        );

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-left1.png"
        );
        this.sprites[Direction.Left][2] = this.Game.AssetManager.getImage(
            "./sprites/png/octorok-left2.png"
        );

        this.spritesAnimation = new AnimationObserver(20 / speed, 2);
    }

    attack(): void {
        this.Game.ProjectileManager.addProjectile(
            new Fireball({
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
