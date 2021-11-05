import { Game } from "../Game";

import { StateObserver, AnimationObserver } from "../Libraries/Observers";

export class AbstractScreen {
  Game: Game;

  title: string;
  message: string;
  showMessageAfter: number;
  backgroundColor: string;

  state: StateObserver;
  messageAnimation: AnimationObserver;

  constructor(
    game: Game,
    state: StateObserver,
    backgroundColor: string,
    title: string,
    message: string,
    showMessageAfter: number = 0
  ) {
    this.Game = game;

    this.title = title;
    this.message = message;
    this.showMessageAfter = showMessageAfter;
    this.backgroundColor = backgroundColor;

    this.state = state;
    this.messageAnimation = new AnimationObserver(50, 2);
  }

  draw(): void {
    this.Game.fillRect(
      0,
      0,
      this.Game.Canvas.width,
      this.Game.Canvas.height,
      this.backgroundColor
    );

    this.Game.fillText({
      text: this.title,
      x: this.Game.Canvas.width / 2,
      y: this.Game.Canvas.height / 3,
      color: "#fff",
      fontSize: "24px",
      textAlign: "center",
      textBaseline: "middle"
    });

    if (this.state.currentFrame > this.showMessageAfter) {
      if (this.messageAnimation.currentAnimationStep === 1) {
        this.Game.fillText({
          text: this.message,
          x: this.Game.Canvas.width / 2,
          y: this.Game.Canvas.height / 3 * 2,
          color: "#fff",
          fontSize: "16px",
          textAlign: "center",
          textBaseline: "middle"
        });
      }
      this.messageAnimation.update(this.Game.dt);
    }
  }

  updateObservers(): void {
    this.state.update(this.Game.dt);
  }
}
