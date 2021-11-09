import { Game, GameState } from "../Game";

import { AnimationObserver } from "../Libraries/Observers";

export class Hud {
  Game: Game;

  x: number;
  y: number;

  height: number;
  width: number;

  emptyHeartSprite: HTMLImageElement;
  halfHeartSprite: HTMLImageElement;
  fullHeartSprite: HTMLImageElement;

  currentSceneAnimation: AnimationObserver;

  constructor(game: Game) {
    this.Game = game;

    this.x = 0;
    this.y = 0;

    this.height = 64;

    this.emptyHeartSprite = this.Game.AssetManager.getImage("./sprites/png/empty-heart.png");
    this.halfHeartSprite = this.Game.AssetManager.getImage("./sprites/png/half-heart.png");
    this.fullHeartSprite = this.Game.AssetManager.getImage("./sprites/png/full-heart.png");

    this.currentSceneAnimation = new AnimationObserver(25, 2);
  }

  draw(): void {
    this.fillRect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      color: "#000"
    });

    this.drawHearts();
    this.drawMap();
    this.drawScore();
  }

  drawHearts(): void {
    for (let i = 1; i <= this.Game.Player.maxHp / 2; i++) {
      this.drawImage({
        sprite: this.emptyHeartSprite,
        x: 24 * i + 8 * i,
        y: this.height / 2 - 12,
        width: 24,
        height: 24
      });
    }

    for (let i = 1; i <= this.Game.Player.hp / 2; i++) {
      this.drawImage({
        sprite: this.fullHeartSprite,
        x: 24 * i + 8 * i,
        y: this.height / 2 - 12,
        width: 24,
        height: 24
      });
    }

    if (this.Game.Player.hp % 2 === 1) {
      this.drawImage({
        sprite: this.halfHeartSprite,
        x: 24 * (this.Game.Player.hp / 2 + 1) + 8 * (this.Game.Player.hp / 2 - 1),
        y: this.height / 2 - 12,
        width: 24,
        height: 24
      });
    }
  }

  drawMap(): void {
    let cellHeight =
      (this.height - this.Game.Viewport.currentWorld.nbRow - 1) /
      this.Game.Viewport.currentWorld.nbRow;
    let cellWidth =
      (cellHeight * this.Game.Viewport.width) / this.Game.Viewport.height;

    let x = (this.width - cellWidth * this.Game.Viewport.currentWorld.nbCol + this.Game.Viewport.currentWorld.nbCol - 1) / 2;

    this.Game.Viewport.currentWorld.loopScenes((scene) => {
      let bgColor = "#00a230";

      if (scene.hasPermanentItems) {
        bgColor = "#e2d64a";
      } else if (scene.hasEnemies) {
        bgColor = "#d11c0d";
      }

      this.fillRect({
        x: x + cellWidth * scene.c + 2 * scene.c,
        y: cellHeight * scene.r + 2 * scene.r,
        width: cellWidth,
        height: cellHeight,
        color: bgColor
      });
    });

    if (this.Game.state.isIn(GameState.Run)) {
      if (this.currentSceneAnimation.currentAnimationStep === 1) {
        this.fillRect({
          x: x + cellWidth * this.Game.Viewport.currentScene.c + 2 * this.Game.Viewport.currentScene.c,
          y: cellHeight * this.Game.Viewport.currentScene.r + 2 * this.Game.Viewport.currentScene.r,
          width: cellWidth,
          height: cellHeight,
          color: "rgba(0, 0, 0, 0.3)"
        });
      }

      this.currentSceneAnimation.update(this.Game.dt);
    }
  }

  drawScore(): void {
    this.fillText({
      text: " SCORE: " + this.Game.Player.score + "/" + this.Game.Player.targetScore,
      // text: 'FPS:' + ((1/this.Game.dt)*60).toFixed(0),
      x: this.width - this.height / 2,
      y: this.height / 2,
      color: "#fff",
      textAlign: "right",
      textBaseline: "middle"
    });
  }

  drawImage({ sprite, x, y, width, height }: {
    sprite: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    this.Game.drawImage({ sprite, x: x + this.x, y: y + this.y, width, height });
  }

  fillRect({ x, y, width, height, color }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }): void {
    this.Game.fillRect({ x: x + this.x, y: y + this.y, width, height, color });
  }

  fillText({
    text, x, y, color,
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
    this.Game.fillText({ text, x: x + this.x, y: y + this.y, color, fontSize, textAlign, textBaseline });
  }
}
