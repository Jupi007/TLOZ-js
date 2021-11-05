import { Game, GameState } from "./Game";
import { Direction } from "./Libraries/Direction";

import { StateObserver } from "./Libraries/Observers";

export enum InventoryState {
  Visible,
  Hidden,
  ShowAnimation,
  HideAnimation
}

export class Inventory {
  Game: Game;

  y: number;

  width: number;
  height: number;

  animationSpeed: number;

  state: StateObserver;

  constructor(game: Game) {
    this.Game = game;

    this.y = -this.Game.Canvas.height;

    this.width = this.Game.Canvas.width;
    this.height = this.Game.Canvas.height;

    this.animationSpeed = 12;

    this.state = new StateObserver(InventoryState.Hidden);
  }

  move(): void {
    if (this.state.is(InventoryState.ShowAnimation)) {
      if (this.y < 0) {
        this.y += this.Game.dt * this.animationSpeed;
        this.Game.Viewport.y += this.Game.dt * this.animationSpeed;
        this.Game.Hud.y += this.Game.dt * this.animationSpeed;
      } else {
        this.y = 0;
        this.state.setNextState(InventoryState.Visible);
      }
    } else if (this.state.is(InventoryState.HideAnimation)) {
      if (this.y > -this.height) {
        this.y -= this.Game.dt * this.animationSpeed;
        this.Game.Viewport.y -= this.Game.dt * this.animationSpeed;
        this.Game.Hud.y -= this.Game.dt * this.animationSpeed;
      } else {
        this.y = -this.height;
        this.Game.Viewport.y = this.Game.Hud.height;
        this.Game.Hud.y = 0;
        this.state.setNextState(InventoryState.Hidden);
        this.Game.state.setNextState(GameState.Run);
      }
    }
  }

  draw(): void {
    if (
      this.state.isIn(
        InventoryState.ShowAnimation,
        InventoryState.HideAnimation
      )
    )
      this.Game.drawGame();

    this.fillRect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      color: "#000"
    });

    this.fillText({
      text: "Inventory",
      x: this.width / 2,
      y: this.height / 3,
      color: "#fff",
      fontSize: "24px",
      textAlign: "center",
      textBaseline: "middle"
    });

    this.fillText(
      { text: "Q", x: this.width / 2 - 10, y: (this.height / 3) * 2, color: "#fff", fontSize: "24px", textAlign: "right", textBaseline: "middle" });

    if (this.Game.Sword.isEnabled) {
      this.drawImage(
        this.Game.Sword.sprites[Direction.Up],
        this.width / 2 + 10,
        (this.height / 3) * 2 - this.Game.Sword.swordWidth / 2,
        this.Game.Sword.swordHeight,
        this.Game.Sword.swordWidth
      );
    } else {
      this.fillRect({
        x: this.width / 2 + 10,
        y: (this.height / 3) * 2 - this.Game.Sword.swordWidth / 2,
        width: this.Game.Sword.swordHeight,
        height: this.Game.Sword.swordWidth,
        color: "grey"
      });
    }

    this.state.update(this.Game.dt);
  }

  drawImage(
    sprite: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.Game.drawImage(sprite, x, y + this.y, width, height);
  }

  fillRect({
    x,
    y,
    width,
    height,
    color
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }): void {
    this.Game.fillRect({
      x,
      y: y + this.y,
      width,
      height,
      color
    });
  }

  fillText({
    text,
    x,
    y,
    color,
    fontSize = "16px",
    textAlign = "left",
    textBaseline = "alphabetic"
  }: {
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
  }): void {
    this.Game.fillText({
      text,
      x,
      y: y + this.y,
      color,
      fontSize,
      textAlign,
      textBaseline
    });
  }
}
