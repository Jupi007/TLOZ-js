import { Game, GameState } from "./Game.js";

import { Direction } from "./Libraries/Direction.js";
import { StateObserver } from "./Libraries/Observers.js";

import { Scene } from "./Map.js";
import { Enemy, EnemyState } from "./Enemies.js";
import { EnemyManager } from "./EnemyManager.js";

export class Viewport {
    Game: Game;
    currentScene: Scene;
    nextScene: Scene;

    x: number;
    y: number;

    dc:number;
    dr:number;

    slideSceneAnimationSpeed: number;

    music: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;
        this.currentScene = this.Game.World.getSpawnScene();
        this.nextScene = null;

        this.music = this.currentScene.music;

        this.x = 0;
        this.y = 0;

        this.dr = 0;
        this.dc = 0;

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
        this.loopCells((cell, col, row) => {
            if (cell.brick.hasCollisions) {
                callback(cell, col, row);
            }
        });
    }

    draw(): void {
        if (this.Game.state.is(GameState.Run) && this.Game.state.isFirstFrame) this.music.play();

        this.loopCells((cell, col, row) => {
            this.currentScene.drawImage(
                cell.brick.sprite,
                this.cellSize * col,
                this.cellSize * row,
                this.cellSize,
                this.cellSize
            );
        });

        if (this.nextScene !== null) {
            this.loopCells((cell, col, row) => {
                this.nextScene.drawImage(
                    cell.brick.sprite,
                    this.cellSize * col,
                    this.cellSize * row,
                    this.cellSize,
                    this.cellSize
                );
            }, this.nextScene);
        }
    }

    slideSceneAnimationMove(): void {
        let speed = this.slideSceneAnimationSpeed * this.Game.dt;

        if (this.dc === 1) {
            this.currentScene.x -= speed;
            this.nextScene.x -= speed;
        }
        else if (this.dc === -1) {
            this.currentScene.x += speed;
            this.nextScene.x += speed;
        }
        else if (this.dr === 1) {
            this.currentScene.y -= speed;
            this.nextScene.y -= speed;
        }
        else if (this.dr === -1) {
            this.currentScene.y += speed;
            this.nextScene.y += speed;
        }

        if (
            (this.nextScene.y <= 0 && this.dr ===  1) ||
            (this.nextScene.y >= 0 && this.dr === -1) ||
            (this.nextScene.x <= 0 && this.dc ===  1) ||
            (this.nextScene.x >= 0 && this.dc === -1)
        ) {
            this.nextScene.y = 0;
            this.nextScene.x = 0;

            this.dr = 0;
            this.dc = 0;

            if (this.music.src != this.nextScene.music.src) {
                this.music.pause();
                this.music.currentTime = 0;
                this.music = this.nextScene.music;
                this.music.play();
            }

            this.currentScene = this.nextScene;
            this.nextScene = null;

            this.Game.EnemyManager.loopEnemies((enemy) => {
                if (enemy.state.is(EnemyState.Killed)) {
                    this.Game.EnemyManager.killEnemy(enemy);
                }
            })
            this.Game.EnemyManager = new EnemyManager(this.Game);
            this.Game.ProjectileManager.deleteAllProjectiles();
            this.Game.ItemManager.deleteAllItems();

            this.Game.state.setNextState(GameState.Run);
        }
    }

    slideSceneLoop(): void {
        this.slideSceneAnimationMove();
        this.Game.Player.slideSceneAnimationMove();

        this.Game.drawGame();
    }

    collisions(): void {
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.Game.drawImage(
            sprite,
            x + this.x,
            y + this.y,
            width,
            height
        );
    }

    slideScene(direction: Direction): void {
        let currentSceneCol = this.currentScene.c;
        let currentSceneRow = this.currentScene.r;

        if (direction === Direction.Left) {
            this.dc = -1;
        }
        else if (direction === Direction.Right) {
            this.dc = 1;
        }
        else if (direction === Direction.Up) {
            this.dr = -1;
        }
        else if (direction === Direction.Down) {
            this.dr = 1;
        }
        else {
            return;
        }

        if ( !(
            currentSceneCol + this.dc < 0 ||
            currentSceneCol + this.dc > this.Game.World.nbCol - 1 ||
            currentSceneRow + this.dr < 0 ||
            currentSceneRow + this.dr > this.Game.World.nbRow - 1
        ) ) {
            this.nextScene = this.Game.World.map[currentSceneCol + this.dc][currentSceneRow + this.dr];

            if (direction === Direction.Left) {
                this.nextScene.x = -this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Right) {
                this.nextScene.x = this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Up) {
                this.nextScene.y = -this.height;
                this.nextScene.x = 0;
            }
            else if (direction === Direction.Down) {
                this.nextScene.y = this.height;
                this.nextScene.x = 0;
            }

            this.Game.Player.dx = 0;
            this.Game.Player.dy = 0;
            this.Game.Player.isAttackObserver.setNextState(false);

            this.Game.useCustomLoop(() => this.slideSceneLoop());

            return;
        }

        this.dc = 0;
        this.dr = 0;
    }
}
