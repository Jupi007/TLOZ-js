import { GameState } from "./Game.js";
import { Direction } from "./Libraries/Direction.js";
import { Collisions } from "./Libraries/Collisions.js";
import { EnemyState } from "./Enemies.js";
import { EnemyManager } from "./EnemyManager.js";
export class Viewport {
    constructor(game) {
        this.Game = game;
        this.currentWorld = this.Game.Map.getSpawnWorld();
        this.nextWorld = null;
        this.currentScene = this.Game.Map.getSpawnScene();
        this.nextScene = null;
        this.justReachOutPassage = true;
        this.music = this.currentScene.music;
        this.x = 0;
        this.y = 0;
        this.dr = 0;
        this.dc = 0;
        this.slideSceneAnimationSpeed = 10;
    }
    get cellSize() {
        return this.currentScene.cellSize;
    }
    get nbRow() {
        return this.currentScene.nbRow;
    }
    get nbCol() {
        return this.currentScene.nbCol;
    }
    get width() {
        return this.currentScene.cellSize * this.currentScene.nbCol;
    }
    get height() {
        return this.currentScene.cellSize * this.currentScene.nbRow;
    }
    loopCells(callback, scene = this.currentScene) {
        for (let col = 0; col < this.nbCol; col++) {
            for (let row = 0; row < this.nbRow; row++) {
                callback(scene.getCell(col, row), col, row);
            }
        }
    }
    loopCollision(callback) {
        this.loopCells((cell, col, row) => {
            if (cell.brick.hasCollisions) {
                callback(cell, col, row);
            }
        });
    }
    draw() {
        if (this.Game.state.is(GameState.Run) && this.Game.state.isFirstFrame)
            this.music.play();
        this.loopCells((cell, col, row) => {
            this.currentScene.drawImage(cell.brick.sprite, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
        });
        if (this.nextScene !== null) {
            this.loopCells((cell, col, row) => {
                this.nextScene.drawImage(cell.brick.sprite, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
            }, this.nextScene);
        }
    }
    collisions() {
        this.Game.Player.passBetweenBoxesHelper();
        this.loopCollision((cell, col, row) => {
            Collisions.movingBox(this.Game.Player.hitBox, cell);
        });
        this.currentScene.passages.forEach((passage) => {
            if (Collisions.simpleMovingBox(this.Game.Player.hitBox, passage)) {
                if (!this.justReachOutPassage) {
                    this.changeWorld(passage.targetWorldIndex, passage.targetSceneC, passage.targetSceneR);
                }
            }
            else if (this.justReachOutPassage) {
                this.justReachOutPassage = false;
            }
        });
        if (Collisions.movingBoxLine(this.Game.Player, 0, Direction.Up)) {
            this.currentScene.upperEdgeCollision();
        }
        else if (Collisions.movingBoxLine(this.Game.Player, this.Game.Viewport.height, Direction.Down)) {
            this.currentScene.bottomEdgeCollision();
        }
        else if (Collisions.movingBoxLine(this.Game.Player, 0, Direction.Left)) {
            this.currentScene.leftEdgeCollision();
        }
        else if (Collisions.movingBoxLine(this.Game.Player, this.Game.Viewport.width, Direction.Right)) {
            this.currentScene.rightEdgeCollision();
        }
    }
    slideScene(direction) {
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
        if (!(currentSceneCol + this.dc < 0 ||
            currentSceneCol + this.dc > this.currentWorld.nbCol - 1 ||
            currentSceneRow + this.dr < 0 ||
            currentSceneRow + this.dr > this.currentWorld.nbRow - 1)) {
            this.nextScene = this.currentWorld.scenes[currentSceneCol + this.dc][currentSceneRow + this.dr];
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
    slideSceneAnimationMove() {
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
        if ((this.nextScene.y <= 0 && this.dr === 1) ||
            (this.nextScene.y >= 0 && this.dr === -1) ||
            (this.nextScene.x <= 0 && this.dc === 1) ||
            (this.nextScene.x >= 0 && this.dc === -1)) {
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
            });
            this.Game.EnemyManager = new EnemyManager(this.Game);
            this.Game.ProjectileManager.deleteAllProjectiles();
            this.Game.ItemManager.deleteAllItems();
            this.Game.state.setNextState(GameState.Run);
        }
    }
    changeWorld(targetWorldIndex, targetSceneC, targetSceneR, targetCellC = null, targetCellR = null) {
        this.nextWorld = this.Game.Map.worlds[targetWorldIndex];
        this.nextScene = this.nextWorld.scenes[targetSceneC][targetSceneR];
        if (this.music.src != this.nextScene.music.src) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = this.nextScene.music;
            this.music.play();
        }
        this.currentWorld = this.nextWorld;
        this.currentScene = this.nextScene;
        this.Game.EnemyManager.loopEnemies((enemy) => {
            if (enemy.state.is(EnemyState.Killed)) {
                this.Game.EnemyManager.killEnemy(enemy);
            }
        });
        this.Game.EnemyManager = new EnemyManager(this.Game);
        this.Game.ProjectileManager.deleteAllProjectiles();
        this.Game.ItemManager.deleteAllItems();
        if (targetCellC !== null && targetCellR !== null) {
            this.Game.Player.x = targetCellC * this.currentScene.cellSize;
            this.Game.Player.y = targetCellR * this.currentScene.cellSize;
            this.justReachOutPassage = true;
        }
        else {
            this.Game.Player.x = (this.currentScene.nbCol * this.currentScene.cellSize) / 2 - this.Game.Player.width / 2;
            this.Game.Player.y = (this.currentScene.nbRow - 1) * this.currentScene.cellSize;
        }
    }
    slideSceneLoop() {
        this.slideSceneAnimationMove();
        this.Game.Player.slideSceneAnimationMove();
        this.Game.drawGame();
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
}
