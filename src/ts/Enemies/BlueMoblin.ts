import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Random } from "../Libraries/Random";
import { Clock } from "../Items/Clock";
import { Moblin } from "./Moblin";


export class BlueMoblin extends Moblin {
    constructor({ game, x, y, speed, direction }: {
        game: Game;
        x: number;
        y: number;
        speed: number;
        direction: Direction;
    }) {
        super({ game, x, y, speed, direction });

        this.damage = 2;
        this.hp = 2;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-up1.png"
        );
        this.sprites[Direction.Up][2] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-up2.png"
        );

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-down1.png"
        );
        this.sprites[Direction.Down][2] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-down2.png"
        );

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-right1.png"
        );
        this.sprites[Direction.Right][2] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-right2.png"
        );

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-left1.png"
        );
        this.sprites[Direction.Left][2] = this.Game.AssetManager.getImage(
            "./sprites/png/blue-moblin-left2.png"
        );
    }

    dropItem(): boolean {
        if (super.dropItem())
            return true;

        if (Random.getOneInt(3) && !this.Game.Player.invincibleObserver.is(true)) {
            this.Game.ItemManager.addItem(
                new Clock({
                    game: this.Game,
                    x: this.x + this.width / 2 - 32 / 2,
                    y: this.y + this.height / 2 - 32 / 2
                })
            );
            return true;
        }

        return false;
    }
}
