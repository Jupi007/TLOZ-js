import { Game } from "../Game";
import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";
import { Item } from "./Item";


export class Sword extends Item {
    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 28;
        this.height = 64;

        this.sprite = SpriteLoader.load("./sprites/png/sword-up.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getImportantItem(this);
        this.Game.Sword.isEnabled = true;
    }
}
