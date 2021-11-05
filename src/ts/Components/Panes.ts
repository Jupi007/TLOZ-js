import { Game } from "../Game";

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
    this.Game.fillRect({
      x: -this.position,
      y: 0,
      width: this.Game.Canvas.width / 2,
      height: this.Game.Canvas.height,
      color: "#000"
    });

    this.Game.fillRect({
      x: this.Game.Canvas.width / 2 + this.position,
      y: 0,
      width: this.Game.Canvas.width / 2,
      height: this.Game.Canvas.height,
      color: "#000"
    });

    this.position += this.speed * this.Game.dt;
  }

  drawClose(): void {
    this.Game.fillRect({
      x: -(this.Game.Canvas.width / 2) + this.position,
      y: 0,
      width: this.Game.Canvas.width / 2,
      height: this.Game.Canvas.height,
      color: "#000"
    });

    this.Game.fillRect({
      x: this.Game.Canvas.width - this.position,
      y: 0,
      width: this.Game.Canvas.width / 2,
      height: this.Game.Canvas.height,
      color: "#000"
    });

    this.position += this.speed * this.Game.dt;
  }
}
