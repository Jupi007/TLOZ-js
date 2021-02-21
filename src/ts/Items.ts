import { SimpleBox } from "./Libraries/Boxes.js";

export class Item extends SimpleBox {
    sprite: HTMLImageElement;
    collisionCallback: Function;
    collisionSound: HTMLAudioElement;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        sprite: HTMLImageElement,
        collisionCallback: Function,
        collisionSound: HTMLAudioElement
    ) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.collisionCallback = collisionCallback;
        this.collisionSound = collisionSound;
    }
}
