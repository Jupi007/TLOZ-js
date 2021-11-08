import { Game } from "../Game";
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

        this.sprite = this.Game.AssetManager.getImage("./sprites/png/sword-up.png");
        this.collisionSound = this.Game.AssetManager.getSound("./sounds/effect/Fanfare.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getImportantItem(this);
        this.Game.Sword.isEnabled = true;
    }
}
