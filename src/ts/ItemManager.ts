import { Game } from "./Game.js";

import { Collisions } from "./Libraries/Collisions.js";

import { Item } from "./Items.js";

export class ItemManager {
    Game: Game;

    items: Item[];
    permanentItems: Item[];

    constructor(game: Game) {
        this.Game = game;

        this.items = [];
        this.permanentItems = [];
    }

    collisions(): void {
        this.loopItems((item) => {
            if (
                Collisions.movingBoxs(this.Game.Player.hitbox, item.hitbox) ||
                (this.Game.Player.isAttackObserver.is(true) && Collisions.simpleBox(this.Game.Sword, item))
            ) {
                item.collisionCallback();
                item.collisionSound.play();
                this.deleteItem(item);
            }
        });
    }

    draw(): void {
        this.loopItems((item) => {
            this.Game.Viewport.currentScene.drawImage(
                item.sprite,
                item.x,
                item.y,
                item.width,
                item.height
            );
        });
    }

    addItem(item: Item): void {
        this.items.push(item);
    }

    addPermanentItem(item: Item): void {
        this.permanentItems.push(item);
    }

    deleteItem(item: Item): void {
        let itemIndex = this.items.indexOf(item);
        let permanentItemIndex = this.permanentItems.indexOf(item);
        
        if (itemIndex > -1) {
            this.items.splice(itemIndex, 1);
        } else if (permanentItemIndex > -1) {
            this.permanentItems.splice(permanentItemIndex, 1);
        }
    }

    deleteAllItems(): void {
        this.items = [];
        this.permanentItems = [];
    }

    loopItems(callback: Function): void {
        this.items.forEach((item: Item) => {
            callback(item);
        });
        this.permanentItems.forEach((item: Item) => {
            callback(item);
        });
    }
}
