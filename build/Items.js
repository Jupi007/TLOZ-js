import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";
export class Item extends SimpleBox {
    constructor() {
        super();
    }
    collisionCallback() { }
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
        this.collisionSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }
    collisionCallback() {
        this.Game.Player.getImportantItem(this);
        this.Game.Sword.isEnabled = true;
    }
}
export class HeartReceptacle extends Item {
    constructor(game, x, y) {
        super();
        this.Game = game;
        this.x = x;
        this.y = y;
        this.width = 26;
        this.height = 26;
        this.sprite = SpriteLoader.load("./sprites/png/heart-receptacle.png");
        this.collisionSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }
    collisionCallback() {
        this.Game.Player.getImportantItem(this);
        this.Game.Player.maxHp += 2;
        this.Game.Player.hp = this.Game.Player.maxHp;
    }
}
