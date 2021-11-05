import { Game } from "../Game";
import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";
import { Item } from "./Item";


export class Clock extends Item {
    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 32;
        this.height = 32;

        this.sprite = SpriteLoader.load("./sprites/png/clock.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Item.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getInvicibility(400);
    }
}
