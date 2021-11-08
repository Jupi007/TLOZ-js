import { Game } from "../Game";
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

        this.sprite = this.Game.AssetManager.getImage("./sprites/png/heart-receptacle.png");
        this.collisionSound = this.Game.AssetManager.getSound("./sounds/effect/Fanfare.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getImportantItem(this);
        this.Game.Player.maxHp += 2;
        this.Game.Player.recoverHealth();
    }
}
