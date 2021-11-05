import { Game } from "./Game";

export class Panes {
  Game: Game;

  speed: number;
  position: number;

  constructor(game: Game) {
    this.Game = game;

    this.speed = 8;
    this.position = 0;
  }

  get isAnimationFinished(): boolean {
    return this.position > this.Game.Canvas.width / 2;
  }

  reset(): void {
    this.position = 0;
  }

  drawOpen(): void {
    this.Game.fillRect(
      -this.position,
      0,
      this.Game.Canvas.width / 2,
      this.Game.Canvas.height,
      "#000"
    );

    this.Game.fillRect(
      this.Game.Canvas.width / 2 + this.position,
      0,
      this.Game.Canvas.width / 2,
      this.Game.Canvas.height,
      "#000"
    );

    this.position += this.speed * this.Game.dt;
  }

  drawClose(): void {
    this.Game.fillRect(
      -(this.Game.Canvas.width / 2) + this.position,
      0,
      this.Game.Canvas.width / 2,
      this.Game.Canvas.height,
      "#000"
    );

    this.Game.fillRect(
      this.Game.Canvas.width - this.position,
      0,
      this.Game.Canvas.width / 2,
      this.Game.Canvas.height,
      "#000"
    );

    this.position += this.speed * this.Game.dt;
  }
}
