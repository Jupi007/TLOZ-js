import { Game } from "../Game";

import { Collisions } from "../Libraries/Collisions";

import { Item } from "../Items/Item";

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
    this.loopItems((item: Item) => {
      if (
        Collisions.simpleMovingBox(this.Game.Player, item) ||
        (this.Game.Player.attackObserver.is(true) &&
          Collisions.simpleBox(this.Game.Sword, item))
      ) {
        item.collisionCallback();
        item.collisionSound.play();
        this.deleteItem(item);
      }
    });
  }

  draw(): void {
    this.loopItems((item: Item) => {
      this.Game.Viewport.currentScene.drawImage({
        sprite: item.sprite,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height
      });
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
