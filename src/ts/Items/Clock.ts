import { Game } from "../Game";
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

        this.sprite = this.Game.AssetManager.getImage("./sprites/png/clock.png");
        this.collisionSound = this.Game.AssetManager.getSound("./sounds/effect/Get_Item.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getInvicibility(400);
    }
}
