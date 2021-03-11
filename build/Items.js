import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";
export class Item extends SimpleBox {
    constructor() {
        super();
    }
}
export class Heart extends Item {
    constructor(game, x, y) {
        super();
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.sprite = SpriteLoader.load('./sprites/png/full-heart.png');
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Heart.wav");
    }
    collisionCallback() {
        this.Game.Player.recoverHealth(2);
    }
}
export class Clock extends Item {
    constructor(game, x, y) {
        super();
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.sprite = SpriteLoader.load('./sprites/png/clock.png');
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Item.wav");
    }
    collisionCallback() {
        this.Game.Player.getInvicibility(400);
    }
}
export class Sword extends Item {
    constructor(game, x, y) {
        super();
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 64;
        this.sprite = SpriteLoader.load("./sprites/png/sword-up.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Get_Item.wav");
    }
    collisionCallback() {
        this.Game.Sword.isEnabled = true;
    }
}
