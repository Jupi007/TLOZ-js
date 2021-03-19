import { Collisions } from "./Libraries/Collisions.js";
export class ItemManager {
    constructor(game) {
        this.Game = game;
        this.items = [];
        this.permanentItems = [];
    }
    collisions() {
        this.loopItems((item) => {
            if (Collisions.simpleMovingBox(this.Game.Player, item) ||
                (this.Game.Player.attackObserver.is(true) && Collisions.simpleBox(this.Game.Sword, item))) {
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
    addPermanentItem(item) {
        this.permanentItems.push(item);
    }
    deleteItem(item) {
        let itemIndex = this.items.indexOf(item);
        let permanentItemIndex = this.permanentItems.indexOf(item);
        if (itemIndex > -1) {
            this.items.splice(itemIndex, 1);
        }
        else if (permanentItemIndex > -1) {
            this.permanentItems.splice(permanentItemIndex, 1);
        }
    }
    deleteAllItems() {
        this.items = [];
        this.permanentItems = [];
    }
    loopItems(callback) {
        this.items.forEach((item) => {
            callback(item);
        });
        this.permanentItems.forEach((item) => {
            callback(item);
        });
    }
}
