import { Game } from "../Game";
import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";
import { Item } from "./Item";


export class HeartReceptacle extends Item {
    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 26;
        this.height = 26;

        this.sprite = SpriteLoader.load("./sprites/png/heart-receptacle.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getImportantItem(this);
        this.Game.Player.maxHp += 2;
        this.Game.Player.recoverHealth();
    }
}
