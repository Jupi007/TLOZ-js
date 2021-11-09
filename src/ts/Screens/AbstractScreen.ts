import { Game } from "../Game";

import { StateObserver, AnimationObserver } from "../Libraries/Observers";

export class AbstractScreen {
  Game: Game;

  title: string;
  titleFontSize: string;
  titleColor: string;
  message: string;
  blinkingMessage: boolean;
  showMessageAfter: number;
  backgroundColor: string;

  state: StateObserver;
  messageAnimation: AnimationObserver;

  constructor({ game, state, backgroundColor, title, titleFontSize = "24px", titleColor = "#fff", message, blinkingMessage = true, showMessageAfter = 0 }: {
    game: Game;
    state: StateObserver;
    backgroundColor: string;
    title: string;
    titleFontSize?: string;
    titleColor?: string;
    message: string;
    blinkingMessage?: boolean;
    showMessageAfter?: number;
  }) {
    this.Game = game;

    this.title = title;
    this.titleFontSize = titleFontSize;
    this.titleColor = titleColor;
    this.message = message;
    this.blinkingMessage = blinkingMessage;
    this.showMessageAfter = showMessageAfter;
    this.backgroundColor = backgroundColor;

    this.state = state;
    this.messageAnimation = new AnimationObserver(50, 2);
  }

  draw(): void {
    this.Game.fillRect({
      x: 0,
      y: 0,
      width: this.Game.Canvas.width,
      height: this.Game.Canvas.height,
      color: this.backgroundColor
    });

    this.Game.fillText({
      text: this.title,
      x: this.Game.Canvas.width / 2,
      y: this.Game.Canvas.height / 3,
      color: this.titleColor,
      fontSize: this.titleFontSize,
      textAlign: "center",
      textBaseline: "middle"
    });

    if (
      !this.blinkingMessage ||
      (this.state.currentFrame > this.showMessageAfter && this.messageAnimation.currentAnimationStep === 1)
    ) {
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

    if (this.blinkingMessage && this.state.currentFrame > this.showMessageAfter) {
      this.messageAnimation.update(this.Game.dt);
    }
  }

  updateObservers(): void {
    this.state.update(this.Game.dt);
  }
}
