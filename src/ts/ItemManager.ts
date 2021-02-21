import { Game } from "./Game.js";

import { Collisions } from "./Libraries/Collisions.js";

import { Item } from "./Items.js";

export class ItemManager {
    Game: Game;

    items: Item[];

    constructor(game: Game) {
        this.Game = game;

        this.items = [];
    }

    collisions(): void {
        this.loopItems((item) => {
            if (
                Collisions.movingBoxs(this.Game.Player, item) ||
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

    deleteItem(item: Item): void {
        this.items.splice(this.items.indexOf(item), 1);
    }

    deleteAllItems(): void {
        this.items = [];
    }

    loopItems(callback: Function): void {
        this.items.forEach((item: Item) => {
            callback(item);
        });
    }
}
