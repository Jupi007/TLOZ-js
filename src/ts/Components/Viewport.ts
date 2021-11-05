import { Game, GameState } from "../Game";

import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";

import { World } from "../Map/World";
import { Scene } from "../Map/Scene";
import { Passage } from "../Map/Passage";
import { Cell } from "../Map/Cell";
import { EnemyManager } from "./EnemyManager";

export class Viewport {
  Game: Game;

  currentWorld: World | null;
  nextWorld: World | null;

  currentScene: Scene | null;
  nextScene: Scene | null;

  slideSceneDirection: Direction;

  targetCellR: number | null;
  targetCellC: number | null;
  changeWorldFromPassage: boolean;
  changeWorldToPassage: boolean;
  justReachOutPassage: boolean;

  x: number;
  y: number;

  slideSceneAnimationSpeed: number;

  music: HTMLAudioElement;

  constructor(game: Game) {
    this.Game = game;

    this.currentWorld = this.Game.Map.getSpawnWorld();
    this.nextWorld = null;

    this.currentScene = this.Game.Map.getSpawnScene();
    this.nextScene = null;

    this.justReachOutPassage = false;

    this.music = this.currentScene.music;

    this.x = 0;
    this.y = 0;

    this.slideSceneAnimationSpeed = 10;
  }

  get cellSize(): number {
    return this.currentScene.cellSize;
  }

  get nbRow(): number {
    return this.currentScene.nbRow;
  }

  get nbCol(): number {
    return this.currentScene.nbCol;
  }

  get width(): number {
    return this.currentScene.cellSize * this.currentScene.nbCol;
  }

  get height(): number {
    return this.currentScene.cellSize * this.currentScene.nbRow;
  }

  loopCells(callback: Function, scene: Scene = this.currentScene): void {
    for (let col = 0; col < this.nbCol; col++) {
      for (let row = 0; row < this.nbRow; row++) {
        callback(scene.getCell(col, row), col, row);
      }
    }
  }

  loopCollision(callback: Function): void {
    this.loopCells((cell: Cell, col: number, row: number) => {
      if (cell.brick.hasCollisions) {
        callback(cell, col, row);
      }
    });
  }

  draw(): void {
    if (this.Game.state.is(GameState.Run) && this.Game.state.isFirstFrame)
      this.music.play();

    this.currentScene.fillRect({
      x: 0,
      y: 0,
      width: this.currentScene.width,
      height: this.currentScene.height,
      color: this.currentScene.backgroundColor
    });

    this.loopCells((cell: Cell, col: number, row: number) => {
      this.currentScene.drawImage({
        sprite: cell.brick.sprite,
        x: this.cellSize * col,
        y: this.cellSize * row,
        width: this.cellSize,
        height: this.cellSize
      });
    });

    if (this.nextScene !== null) {
      this.nextScene.fillRect({
        x: 0,
        y: 0,
        width: this.nextScene.width,
        height: this.nextScene.height,
        color: this.nextScene.backgroundColor
      });

      this.loopCells((cell: Cell, col: number, row: number) => {
        this.nextScene.drawImage({
          sprite: cell.brick.sprite,
          x: this.cellSize * col,
          y: this.cellSize * row,
          width: this.cellSize,
          height: this.cellSize
        });
      }, this.nextScene);
    }
  }

  collisions(): void {
    Collisions.passBetweenBoxesHelper(this.Game.Player);

    this.loopCollision((cell: Cell) => {
      Collisions.movingBox(this.Game.Player.hitBox, cell);
    });

    if (!this.Game.Player.knockBackObserver.is(true)) {
      this.currentScene.passages.forEach((passage: Passage) => {
        if (Collisions.simpleMovingBox(this.Game.Player.hitBox, passage)) {
          if (!this.justReachOutPassage) {
            this.changeWorld(
              true,
              passage.targetWorldIndex,
              passage.targetSceneC,
              passage.targetSceneR
            );
          }
        } else if (this.justReachOutPassage) {
          this.justReachOutPassage = false;
        }
      });

      if (Collisions.movingBoxLine(this.Game.Player, 0, Direction.Up)) {
        this.currentScene.upperEdgeCollision();
      } else if (
        Collisions.movingBoxLine(
          this.Game.Player,
          this.Game.Viewport.height,
          Direction.Down
        )
      ) {
        this.currentScene.bottomEdgeCollision();
      } else if (
        Collisions.movingBoxLine(this.Game.Player, 0, Direction.Left)
      ) {
        this.currentScene.leftEdgeCollision();
      } else if (
        Collisions.movingBoxLine(
          this.Game.Player,
          this.Game.Viewport.width,
          Direction.Right
        )
      ) {
        this.currentScene.rightEdgeCollision();
      }
    }
  }

  slideScene(direction: Direction): void {
    this.slideSceneDirection = direction;

    let currentSceneCol = this.currentScene.c;
    let currentSceneRow = this.currentScene.r;

    let dc = 0;
    let dr = 0;

    switch (direction) {
      case Direction.Left:
        dc = -1;
        break;

      case Direction.Right:
        dc = 1;
        break;

      case Direction.Up:
        dr = -1;
        break;

      case Direction.Down:
        dr = 1;
        break;
    }

    if (
      currentSceneCol + dc < 0 ||
      currentSceneCol + dc > this.currentWorld.nbCol - 1 ||
      currentSceneRow + dr < 0 ||
      currentSceneRow + dr > this.currentWorld.nbRow - 1
    ) {
      return;
    }

    this.nextScene = this.currentWorld.scenes[currentSceneCol + dc][
      currentSceneRow + dr
    ];

    switch (direction) {
      case Direction.Left:
        this.nextScene.x = -this.width;
        this.nextScene.y = 0;
        break;

      case Direction.Right:
        this.nextScene.x = this.width;
        this.nextScene.y = 0;
        break;

      case Direction.Up:
        this.nextScene.y = -this.height;
        this.nextScene.x = 0;
        break;

      case Direction.Down:
        this.nextScene.y = this.height;
        this.nextScene.x = 0;
        break;
    }

    this.Game.Player.dx = 0;
    this.Game.Player.dy = 0;
    this.Game.Player.attackObserver.setNextState(false);

    this.Game.useCustomLoop(() => this.slideSceneLoop());
  }

  slideSceneMove(): void {
    let speed = this.slideSceneAnimationSpeed * this.Game.dt;

    switch (this.slideSceneDirection) {
      case Direction.Left:
        this.currentScene.x += speed;
        this.nextScene.x += speed;
        break;

      case Direction.Right:
        this.currentScene.x -= speed;
        this.nextScene.x -= speed;
        break;

      case Direction.Up:
        this.currentScene.y += speed;
        this.nextScene.y += speed;
        break;

      case Direction.Down:
        this.currentScene.y -= speed;
        this.nextScene.y -= speed;
        break;
    }

    if (
      (this.nextScene.y <= 0 && this.slideSceneDirection === Direction.Down) ||
      (this.nextScene.y >= 0 && this.slideSceneDirection === Direction.Up) ||
      (this.nextScene.x <= 0 && this.slideSceneDirection === Direction.Right) ||
      (this.nextScene.x >= 0 && this.slideSceneDirection === Direction.Left)
    ) {
      this.nextScene.y = 0;
      this.nextScene.x = 0;

      if (this.music.src !== this.nextScene.music.src) {
        this.music.pause();
        this.music.currentTime = 0;
        this.music = this.nextScene.music;
        this.music.play();
      }

      this.currentScene.permanentItems = this.Game.ItemManager.permanentItems;

      this.currentScene = this.nextScene;
      this.nextScene = null;

      this.Game.EnemyManager.removeKilled(true);
      this.Game.EnemyManager = new EnemyManager(this.Game);
      this.Game.ProjectileManager.deleteAllProjectiles();
      this.Game.ItemManager.deleteAllItems();
      this.Game.ItemManager.permanentItems = this.currentScene.permanentItems;

      this.Game.state.setNextState(GameState.Run);
    }
  }

  slideScenePlayerMove(): void {
    switch (this.slideSceneDirection) {
      case Direction.Left:
        this.Game.Player.dx = this.slideSceneAnimationSpeed * this.Game.dt;
        break;

      case Direction.Right:
        this.Game.Player.dx = -this.slideSceneAnimationSpeed * this.Game.dt;
        break;

      case Direction.Up:
        this.Game.Player.dy = this.slideSceneAnimationSpeed * this.Game.dt;
        break;

      case Direction.Down:
        this.Game.Player.dy = -this.slideSceneAnimationSpeed * this.Game.dt;
        break;
    }

    Collisions.movingBoxCanvas(this.Game.Player, this);
    this.Game.Player.move();
  }

  slideSceneLoop(): void {
    this.slideSceneMove();
    this.slideScenePlayerMove();

    this.Game.drawGame();
  }

  changeWorld(
    fromPassage: boolean,
    targetWorldIndex: number,
    targetSceneC: number,
    targetSceneR: number,
    targetCellC: number | null = null,
    targetCellR: number | null = null
  ): void {
    this.changeWorldFromPassage = fromPassage;
    this.changeWorldToPassage =
      targetCellC !== null && targetCellR !== null ? true : false;

    this.targetCellC = targetCellC;
    this.targetCellR = targetCellR;

    this.nextWorld = this.Game.Map.worlds[targetWorldIndex];
    this.nextScene = this.nextWorld.scenes[targetSceneC][targetSceneR];

    this.music.pause();
    this.music.currentTime = 0;
    this.music = this.nextScene.music;
    this.music.play();

    this.currentScene.permanentItems = this.Game.ItemManager.permanentItems;

    this.currentWorld = this.nextWorld;
    this.currentScene = this.nextScene;
    this.nextWorld = null;
    this.nextScene = null;

    this.Game.EnemyManager.removeKilled(true);

    this.Game.EnemyManager = new EnemyManager(this.Game);
    this.Game.ProjectileManager.deleteAllProjectiles();
    this.Game.ItemManager.deleteAllItems();
    this.Game.ItemManager.permanentItems = this.currentScene.permanentItems;

    if (this.changeWorldToPassage) {
      this.Game.Player.x = this.targetCellC * this.currentScene.cellSize;
      this.Game.Player.y = this.targetCellR * this.currentScene.cellSize;

      this.targetCellC = 0;
      this.targetCellR = 0;

      this.justReachOutPassage = true;
    } else {
      this.Game.Player.x =
        (this.currentScene.nbCol * this.currentScene.cellSize) / 2 -
        this.Game.Player.width / 2;
      this.Game.Player.y =
        (this.currentScene.nbRow - 1) * this.currentScene.cellSize;
    }
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
}
