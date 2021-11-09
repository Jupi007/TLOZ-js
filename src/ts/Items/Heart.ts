import { Game } from "../Game";
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

        this.sprite = this.Game.AssetManager.getImage("./sprites/png/full-heart.png");
        this.collisionSound = this.Game.AssetManager.getSound("./sounds/effect/Get_Heart.wav");
    }

    collisionCallback(): void {
        this.Game.Player.recoverHealth(2);
    }
}
