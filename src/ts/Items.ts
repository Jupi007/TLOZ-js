import { Game } from "./Game.js";

import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";

export class Item extends SimpleBox {
    Game: Game;

    sprite: HTMLImageElement;
    collisionSound: HTMLAudioElement;

    constructor() {
        super();
    }
}

export class Heart extends Item {
    constructor(game: Game, x: number, y: number) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 24;
        this.height = 24;

        this.sprite = SpriteLoader.load('./sprites/png/full-heart.png');
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Heart.wav");
    }

    collisionCallback(): void {
        this.Game.Player.recoverHealth(2);
    }
}

export class Clock extends Item {
    constructor(game: Game, x: number, y: number) {
        super();

        this.Game = game;

        this.x = x;
        this.y = y;

        this.width = 32;
        this.height = 32;

        this.sprite = SpriteLoader.load('./sprites/png/clock.png');
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Item.wav");
    }

    collisionCallback(): void {
        this.Game.Player.getInvicibility(400);
    }
}
