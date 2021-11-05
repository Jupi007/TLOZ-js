import { Game } from "../Game";

import { SimpleBox } from "../Libraries/Boxes";

export class Item extends SimpleBox {
  Game: Game;

  sprite: HTMLImageElement;
  collisionSound: HTMLAudioElement;

  constructor() {
    super();
  }

  collisionCallback(): void { }
}
