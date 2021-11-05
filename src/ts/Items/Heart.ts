import { Game } from "../Game";
import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";
import { Item } from "./Item";


export class Heart extends Item {
    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 24;
        this.height = 24;

        this.sprite = SpriteLoader.load("./sprites/png/full-heart.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Heart.wav");
    }

    collisionCallback(): void {
        this.Game.Player.recoverHealth(2);
    }
}
