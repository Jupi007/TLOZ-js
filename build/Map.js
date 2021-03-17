import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Random } from "./Libraries/Random.js";
import { Octorok, BlueOctorok, Moblin, BlueMoblin, Tektite, BlueTektite } from "./Enemies.js";
import { HeartReceptacle, Sword as SwordItem } from "./Items.js";
export class Cell extends SimpleBox {
    constructor(x, y, size, brick) {
        super();
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.brick = brick;
    }
}
export class Passage extends SimpleBox {
    constructor(game, scene, c, r, targetWorldIndex, targetSceneC, targetSceneR) {
        super();
        this.Game = game;
        this.Scene = scene;
        this.x = c * this.Scene.cellSize;
        this.y = r * this.Scene.cellSize;
        this.width = this.Scene.cellSize;
        this.height = this.Scene.cellSize;
        this.targetWorldIndex = targetWorldIndex;
        this.targetSceneC = targetSceneC;
        this.targetSceneR = targetSceneR;
    }
}
export class Scene {
    constructor(game, world, c, r, music, defaultBrick, backgroundColor) {
        this.cells = [];
        this.Game = game;
        this.World = world;
        this.nbRow = 11;
        this.nbCol = 16;
        this.cellSize = 64;
        this.enemies = [];
        this.passages = [];
        this.permanentItems = [];
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.r = r;
        this.music = music;
        this.backgroundColor = backgroundColor;
        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(this.cellSize * c, this.cellSize * r, this.cellSize, defaultBrick);
            }
        }
    }
    get width() {
        return this.cellSize * this.nbCol;
    }
    get height() {
        return this.cellSize * this.nbRow;
    }
    get hasEnemies() {
        return this.enemies.length > 0;
    }
    get hasPermanentItems() {
        return this.permanentItems.length > 0;
    }
    getCell(col, row) {
        return this.cells[col][row];
    }
    loadBricks(bricks) {
        bricks.forEach((row, r) => {
            row.forEach((brickName, c) => {
                this.cells[c][r].brick = this.Game.BrickCollection.get(brickName);
            });
        });
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.Viewport.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
    fillRect(x, y, width, height, color) {
        this.Game.Viewport.fillRect(x + this.x, y + this.y, width, height, color);
    }
    upperEdgeCollision() {
        this.Game.Viewport.slideScene(Direction.Up);
    }
    rightEdgeCollision() {
        this.Game.Viewport.slideScene(Direction.Right);
    }
    bottomEdgeCollision() {
        this.Game.Viewport.slideScene(Direction.Down);
    }
    leftEdgeCollision() {
        this.Game.Viewport.slideScene(Direction.Left);
    }
}
export class World {
    constructor(game, nbCol, nbRow, defaultMusic, defaultBrick, defaultBackgroundColor) {
        this.scenes = [];
        this.Game = game;
        this.nbCol = nbCol;
        this.nbRow = nbRow;
        for (let c = 0; c < this.nbCol; c++) {
            this.scenes[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.scenes[c][r] = new Scene(this.Game, this, c, r, defaultMusic, defaultBrick, defaultBackgroundColor);
            }
        }
    }
    loopScenes(callback) {
        this.scenes.forEach((col, c) => {
            col.forEach((scene, r) => {
                callback(scene);
            });
        });
    }
}
export class Map {
    constructor(game) {
        this.Game = game;
        this.spawnWorldIndex = 0;
        this.spawnSceneColl = 1;
        this.spawnSceneRow = 2;
        this.spawnCellColl = 7;
        this.spawnCellRow = 5.5;
        this.worlds = [];
        this.worlds[0] = new World(this.Game, 3, 3, AudioLoader.load("./sounds/music/overworld.mp3", true), this.Game.BrickCollection.get("default"), '#ffd4aa');
        this.worlds[0].scenes[0][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall-br", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default",],
            ["white-wall", "default", "default", "grave", "default", "default", "grave", "default", "default", "grave", "default", "default", "grave", "default", "default", "default",],
            ["white-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["white-wall", "default", "default", "grave", "default", "default", "grave", "default", "default", "grave", "default", "default", "grave", "default", "default", "default"],
            ["white-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["white-wall", "default", "default", "grave", "default", "default", "grave", "default", "default", "default", "default", "default", "grave", "default", "default", "default"],
            ["white-wall", "white-wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "stairs", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "stairs", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.worlds[0].scenes[0][0].backgroundColor = '#747474';
        this.worlds[0].scenes[0][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.worlds[0].scenes[0][0].enemies = [
            new BlueOctorok(this.Game, 2 * 64, 2 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Down),
            new BlueOctorok(this.Game, 5 * 64, 5 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueOctorok(this.Game, 13 * 64, 3 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
        this.worlds[0].scenes[1][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default",],
            ["default", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "default",],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["default", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "default"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["default", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "white-tree", "default", "default", "default"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.worlds[0].scenes[1][0].backgroundColor = '#747474';
        this.worlds[0].scenes[1][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.worlds[0].scenes[1][0].enemies = [
            new BlueMoblin(this.Game, 5 * 64, 8 * 64, 4, Direction.Up),
            new BlueMoblin(this.Game, 8 * 64, 4 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new BlueMoblin(this.Game, 10 * 64, 2 * 64, 4, Direction.Down),
        ];
        this.worlds[0].scenes[2][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "passage", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "white-wall-bl", "white-wall", "white-wall"],
            ["default", "default", "default", "monument-tl", "monument-tr", "default", "default", "white-tree", "default", "default", "monument-tl", "monument-tr", "default", "default", "white-wall", "white-wall"],
            ["default", "default", "default", "monument-bl", "monument-br", "default", "default", "default", "default", "default", "monument-bl", "monument-br", "default", "default", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "grave", "default", "grave", "default", "default", "default", "default", "default", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "white-wall", "white-wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "white-wall-tl", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.worlds[0].scenes[2][0].backgroundColor = '#747474';
        this.worlds[0].scenes[2][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.worlds[0].scenes[2][0].passages = [
            new Passage(this.Game, this.worlds[0].scenes[2][0], 7, 1, 2, 1, 1),
        ];
        this.worlds[0].scenes[2][0].enemies = [
            new BlueOctorok(this.Game, 5 * 64, 4 * 64, 4, Direction.Down),
            new BlueOctorok(this.Game, 9 * 64, 6 * 64, 4, Direction.Right),
            new BlueOctorok(this.Game, 12 * 64, 3 * 64, 4, Direction.Down),
            new BlueTektite(this.Game, 7 * 64, 7 * 64),
        ];
        this.worlds[0].scenes[0][1].loadBricks([
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "stairs", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "stairs", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall-br", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall-bl", "wall"],
            ["wall", "default", "default", "single-red-wall", "single-red-wall", "single-red-wall", "single-red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "wall-bl"],
            ["wall", "default", "default", "default", "default", "default", "default", "default", "single-red-wall", "single-red-wall", "single-red-wall", "default", "default", "default", "default", "default"],
            ["wall", "default", "default", "single-red-wall", "single-red-wall", "single-red-wall", "single-red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["wall", "default", "default", "default", "default", "default", "default", "default", "single-red-wall", "single-red-wall", "single-red-wall", "default", "default", "default", "default", "default"],
            ["wall", "default", "default", "single-red-wall", "single-red-wall", "single-red-wall", "single-red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "wall-tl"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall-tl", "wall"],
            ["wall", "wall", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-tr", "default", "default", "wall-tl", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "default", "default", "wall", "wall", "wall"]
        ]);
        this.worlds[0].scenes[0][1].enemies = [
            new Octorok(this.Game, 6 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 4 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 7 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 2 * 64, 3, Direction.Down),
        ];
        this.worlds[0].scenes[1][1].loadBricks([
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall-br", "default", "default", "default", "default", "default", "default", "wall-bl", "wall-br", "default", "default", "default", "default", "wall-bl", "wall"],
            ["wall-br", "default", "default", "single-wall", "default", "single-wall", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "wall-bl"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["default", "default", "default", "single-wall", "default", "single-wall", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "default"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["wall-tr", "default", "default", "single-wall", "default", "single-wall", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "wall-tl"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "default", "wall-tl", "wall-tr", "default", "default", "default", "default", "wall-tl", "wall"],
            ["wall", "wall", "wall-t", "wall-t", "wall-t", "wall-t", "default", "default", "wall", "wall", "wall-t", "wall-t", "wall-t", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "default", "default", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"]
        ]);
        this.worlds[0].scenes[1][1].enemies = [
            new Octorok(this.Game, 4 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 3 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 12 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
        ];
        this.worlds[0].scenes[2][1].loadBricks([
            ["wall", "wall", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
            ["wall", "wall", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
            ["wall", "wall-br", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall-br", "default", "default", "default", "default", "default", "default", "tree", "default", "default", "default", "tree", "default", "tree", "default", "tree"],
            ["default", "default", "tree", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["default", "default", "default", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["default", "default", "tree", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall-tr", "default", "default", "default", "default", "default", "default", "tree", "default", "default", "default", "tree", "default", "tree", "default", "tree"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall", "wall", "tree", "default", "tree", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall", "wall", "tree", "default", "tree", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
        ]);
        this.worlds[0].scenes[2][1].enemies = [
            new Octorok(this.Game, 3 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 5 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 10 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 14 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Left : Direction.Down),
        ];
        this.worlds[0].scenes[0][2].loadBricks([
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "default", "default", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall-br", "default", "default", "wall", "wall", "wall"],
            ["wall", "wall-br", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall", "wall", "wall"],
            ["wall", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "default", "default", "default", "wall-bl", "wall", "wall"],
            ["wall", "default", "default", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "default", "default", "wall-bl", "wall"],
            ["wall", "default", "default", "default", "single-wall", "default", "default", "single-wall", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["wall", "default", "default", "default", "default", "default", "default", "default", "default", "single-wall", "default", "default", "default", "default", "wall-tl", "wall-t"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "single-wall", "default", "default", "default", "default", "default", "wall-tl", "wall", "wall"],
            ["wall", "wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall", "wall", "wall"],
            ["wall", "wall", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"]
        ]);
        this.worlds[0].scenes[0][2].enemies = [
            new Tektite(this.Game, 3 * 64, 4 * 64),
            new Tektite(this.Game, 5 * 64, 7 * 64),
            new Tektite(this.Game, 10 * 64, 5 * 64),
        ];
        // Spawn scene
        this.worlds[0].scenes[1][2].loadBricks([
            ["wall", "wall", "wall", "wall", "wall", "wall", "default", "default", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "passage", "wall", "wall-br", "default", "default", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall", "wall-br", "default", "default", "default", "default", "default", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall", "wall-br", "default", "default", "default", "default", "default", "default", "wall-bl", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["wall-br", "default", "default", "default", "default", "default", "default", "default", "default", "wall-bl", "wall", "wall", "wall", "wall", "wall", "wall"],
            ["default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default"],
            ["wall-t", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall-tl", "wall-t"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall", "wall"],
            ["wall", "wall", "wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "wall-tl", "wall", "wall"],
            ["wall", "wall", "wall", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall-t", "wall", "wall", "wall"],
            ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"]
        ]);
        this.worlds[0].scenes[1][2].passages = [
            new Passage(this.Game, this.worlds[0].scenes[1][2], 3, 1, 1, 0, 1),
        ];
        this.worlds[0].scenes[2][2].loadBricks([
            ["wall", "wall", "tree", "default", "tree", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall", "wall", "tree", "default", "tree", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall", "wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall", "wall-br", "default", "default", "default", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall-br", "default", "tree", "default", "tree", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["default", "default", "default", "default", "default", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall-t", "default", "tree", "default", "tree", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall", "default", "default", "default", "default", "default", "tree", "default", "default", "tree", "default", "tree", "default", "tree", "default", "tree"],
            ["wall", "wall-tr", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "tree"],
            ["wall", "wall", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
            ["wall", "wall", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree", "tree"],
        ]);
        this.worlds[0].scenes[2][2].enemies = [
            new Moblin(this.Game, 3 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 5 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 10 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 12 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
        this.worlds[1] = new World(this.Game, 1, 2, AudioLoader.load("./sounds/music/death_mountain.mp3", true), this.Game.BrickCollection.get("default"), '#0f0e0b');
        this.worlds[1].scenes[0][0].loadBricks([
            ["red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "fire", "default", "default", "default", "default", "default", "default", "default", "default", "fire", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "default", "default", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall"],
        ]);
        this.worlds[1].scenes[0][0].permanentItems = [
            new SwordItem(this.Game, 8 * 64 - 14, 5 * 64),
        ];
        this.worlds[1].scenes[0][1].loadBricks([
            ["red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "default", "default", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "fire", "default", "default", "default", "default", "default", "default", "default", "default", "fire", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "red-wall"],
            ["red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "default", "default", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall", "red-wall"],
        ]);
        this.worlds[1].scenes[0][1].enemies = [
            new Moblin(this.Game, 1 * 64, 1 * 64, 3, Direction.Down),
            new Moblin(this.Game, 14 * 64, 1 * 64, 3, Direction.Down),
        ];
        this.worlds[1].scenes[0][1].bottomEdgeCollision = function () {
            this.Game.Viewport.changeWorld(false, 0, 1, 2, 3, 1);
        };
        this.worlds[2] = new World(this.Game, 2, 2, AudioLoader.load("./sounds/music/dungeon.mp3", true), this.Game.BrickCollection.get("default-dungeon"), '#078382');
        this.worlds[2].scenes[0][0].loadBricks([
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
        ]);
        this.worlds[2].scenes[0][0].enemies = [
            new BlueOctorok(this.Game, 2 * 64, 2 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Down),
            new BlueOctorok(this.Game, 5 * 64, 5 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueOctorok(this.Game, 13 * 64, 3 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueOctorok(this.Game, 8 * 64, 6 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
        this.worlds[2].scenes[1][0].loadBricks([
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
        ]);
        this.worlds[2].scenes[1][0].permanentItems = [
            new HeartReceptacle(this.Game, 8 * 64 - 13, 5 * 64),
        ];
        this.worlds[2].scenes[0][1].loadBricks([
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
        ]);
        this.worlds[2].scenes[0][1].enemies = [
            new BlueTektite(this.Game, 2 * 64, 2 * 64),
            new BlueTektite(this.Game, 5 * 64, 5 * 64),
            new BlueTektite(this.Game, 13 * 64, 3 * 64),
            new BlueTektite(this.Game, 8 * 64, 6 * 64),
        ];
        this.worlds[2].scenes[1][1].loadBricks([
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon"],
            ["wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "default-dungeon", "default-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon", "wall-dungeon"],
        ]);
        this.worlds[2].scenes[1][1].bottomEdgeCollision = function () {
            this.Game.Viewport.changeWorld(false, 0, 2, 0, 7, 1);
        };
        this.worlds[2].scenes[1][1].enemies = [
            new BlueMoblin(this.Game, 2 * 64, 2 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Down),
            new BlueMoblin(this.Game, 5 * 64, 5 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueMoblin(this.Game, 13 * 64, 3 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
    }
    getSpawnWorld() {
        return this.worlds[this.spawnWorldIndex];
    }
    getSpawnScene() {
        return this.worlds[this.spawnWorldIndex].scenes[this.spawnSceneColl][this.spawnSceneRow];
    }
    loopWorlds(callback) {
        this.worlds.forEach((world, i) => {
            callback(world);
        });
    }
}
