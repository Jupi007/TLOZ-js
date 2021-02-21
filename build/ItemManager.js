import { Collisions } from "./functions.js";
export class ItemManager {
    constructor(game) {
        this.Game = game;
        this.items = [];
    }
    collisions() {
        this.loopItems((item) => {
            if (Collisions.movingBoxs(this.Game.Player, item) ||
                (this.Game.Player.isAttackObserver.is(true) && Collisions.simpleBox(this.Game.Sword, item))) {
                item.collisionCallback();
                item.collisionSound.play();
                this.deleteItem(item);
            }
        });
    }
    draw() {
        this.loopItems((item) => {
            this.Game.Viewport.currentScene.drawImage(item.sprite, item.x, item.y, item.width, item.height);
        });
    }
    addItem(item) {
        this.items.push(item);
    }
    deleteItem(item) {
        this.items.splice(this.items.indexOf(item), 1);
    }
    deleteAllItems() {
        this.items = [];
    }
    loopItems(callback) {
        this.items.forEach((item) => {
            callback(item);
        });
    }
}
