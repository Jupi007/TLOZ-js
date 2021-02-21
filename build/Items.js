import { SimpleBox } from "./AbstractClasses.js";
export class Item extends SimpleBox {
    constructor(x, y, width, height, sprite, collisionCallback, collisionSound) {
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
