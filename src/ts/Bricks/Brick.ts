import { Game } from "../Game";


export class Brick {
    Game: Game;

    private _sprite: HTMLImageElement;
    hasCollisions: boolean;

    constructor(game: Game) {
        this.Game = game;

        this.hasCollisions = false;
    }

    public get sprite(): HTMLImageElement {
        return this._sprite;
    }

    public set sprite(value: HTMLImageElement) {
        this._sprite = value;
    }
}
