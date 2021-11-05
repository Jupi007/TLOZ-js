import { Game } from "../Game";
import { SpriteLoader } from "../Libraries/Loaders";
import { Random } from "../Libraries/Random";
import { Clock } from "../Items/Clock";
import { Tektite } from "./Tektite";


export class BlueTektite extends Tektite {
    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super({ game, x, y });

        this.damage = 2;

        this.sprites = [];
        this.sprites[1] = SpriteLoader.load("./sprites/png/blue-tektite1.png");
        this.sprites[2] = SpriteLoader.load("./sprites/png/blue-tektite2.png");
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
