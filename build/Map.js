import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Random } from "./Libraries/Random.js";
import { Octorok, BlueOctorok, Moblin, BlueMoblin, Tektite, BlueTektite } from "./Enemies.js";
import { BrickCollection } from "./Bricks.js";
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
export class Scene {
    constructor(game, overworld, c, r, music) {
        this.cells = [];
        this.Game = game;
        this.World = overworld;
        this.nbRow = 11;
        this.nbCol = 16;
        this.cellSize = 64;
        this.enemies = [];
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.r = r;
        this.music = music;
        this.defaultBrick = BrickCollection.get("default");
        this.defaultWallBrick = BrickCollection.get("wall");
        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(this.cellSize * c, this.cellSize * r, this.cellSize, this.defaultBrick);
            }
        }
        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = this.defaultWallBrick;
            }
        }
        if (this.c == this.World.nbCol - 1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol - 1][r].brick = this.defaultWallBrick;
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = this.defaultWallBrick;
            }
        }
        if (this.r == this.World.nbRow - 1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow - 1].brick = this.defaultWallBrick;
            }
        }
    }
    get hasEnemies() {
        return this.enemies.length > 0;
    }
    getCell(col, row) {
        return this.cells[col][row];
    }
    loadBricks(bricks) {
        bricks.forEach((row, r) => {
            row.forEach((brickName, c) => {
                this.cells[c][r].brick = BrickCollection.get(brickName);
            });
        });
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.Viewport.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
}
export class World {
    constructor(game) {
        this.map = [];
        this.Game = game;
        this.nbRow = 3;
        this.nbCol = 3;
        this.spawnSceneColl = 1;
        this.spawnSceneRow = 2;
        this.spawnCellColl = 7;
        this.spawnCellRow = 5.5;
        for (let c = 0; c < this.nbCol; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this.Game, this, c, r, AudioLoader.load("./sounds/music/overworld.mp3", true));
            }
        }
        this.map[0][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall-br", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey",],
            ["white-wall", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "default-grey",],
            ["white-wall", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "grave", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "white-wall-tr", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "stairs", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "stairs", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.map[0][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[0][0].enemies = [
            new BlueOctorok(this.Game, 2 * 64, 2 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Down),
            new BlueOctorok(this.Game, 5 * 64, 5 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueOctorok(this.Game, 13 * 64, 3 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
        this.map[1][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey",],
            ["default-grey", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "default-grey",],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["default-grey", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "default-grey"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["default-grey", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "default-grey"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.map[1][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[1][0].enemies = [
            new BlueMoblin(this.Game, 5 * 64, 8 * 64, 4, Direction.Up),
            new BlueMoblin(this.Game, 8 * 64, 4 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new BlueMoblin(this.Game, 10 * 64, 2 * 64, 4, Direction.Down),
        ];
        this.map[2][0].loadBricks([
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "white-wall-bl", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "monument-tl", "monument-tr", "default-grey", "default-grey", "white-tree", "default-grey", "default-grey", "monument-tl", "monument-tr", "default-grey", "default-grey", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "monument-bl", "monument-br", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "monument-bl", "monument-br", "default-grey", "default-grey", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "grave", "default-grey", "grave", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "white-wall", "white-wall"],
            ["default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "default-grey", "white-wall-tl", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall-t", "white-wall", "white-wall", "white-wall"],
            ["white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall", "white-wall"]
        ]);
        this.map[2][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[2][0].enemies = [
            new BlueOctorok(this.Game, 5 * 64, 4 * 64, 4, Direction.Down),
            new BlueOctorok(this.Game, 9 * 64, 6 * 64, 4, Direction.Right),
            new BlueOctorok(this.Game, 12 * 64, 3 * 64, 4, Direction.Down),
            new BlueTektite(this.Game, 7 * 64, 7 * 64),
        ];
        this.map[0][1].loadBricks([
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
        this.map[0][1].enemies = [
            new Octorok(this.Game, 6 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 4 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 7 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 2 * 64, 3, Direction.Down),
        ];
        this.map[1][1].loadBricks([
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
        this.map[1][1].enemies = [
            new Octorok(this.Game, 4 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 3 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 12 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
        ];
        this.map[2][1].loadBricks([
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
        this.map[2][1].enemies = [
            new Octorok(this.Game, 3 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 5 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 10 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 14 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Left : Direction.Down),
        ];
        this.map[0][2].loadBricks([
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
        this.map[0][2].enemies = [
            new Tektite(this.Game, 3 * 64, 4 * 64),
            new Tektite(this.Game, 5 * 64, 7 * 64),
            new Tektite(this.Game, 10 * 64, 5 * 64),
        ];
        // Spawn scene
        this.map[1][2].loadBricks([
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
        this.map[2][2].loadBricks([
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
        this.map[2][2].enemies = [
            new Moblin(this.Game, 3 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 5 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 10 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Moblin(this.Game, 12 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
    }
    getSpawnScene() {
        return this.map[this.spawnSceneColl][this.spawnSceneRow];
    }
    loopScenes(callback) {
        this.map.forEach((col, c) => {
            col.forEach((scene, r) => {
                callback(scene);
            });
        });
    }
}
