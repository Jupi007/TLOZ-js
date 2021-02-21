import { SimpleBox } from "./Libraries/Boxes.js";
import { AudioLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Random } from "./Libraries/Random.js";
import { Octorok, BlueOctorok, Moblin, BlueMoblin, Tektite, BlueTektite } from "./Enemies.js";
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
        this.defaultBrick = new Bricks.Default();
        this.defaultWallBrick = new Bricks.Wall();
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
            row.forEach((brick, c) => {
                this.cells[c][r].brick = brick;
            });
        });
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.Viewport.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
}
import { Bricks } from "./Bricks.js";
export class World {
    constructor(game) {
        this.map = [];
        this.Game = game;
        this.nbRow = 3;
        this.nbCol = 3;
        this.spawnSceneColl = 1;
        this.spawnSceneRow = 2;
        this.spawnCellColl = 7;
        this.spawnCellRow = 6;
        for (let c = 0; c < this.nbCol; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this.Game, this, c, r, AudioLoader.load("./sounds/music/overworld.mp3", true));
            }
        }
        this.map[0][0].loadBricks([
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWallBottomRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(),],
            [new Bricks.WhiteWall(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(),],
            [new Bricks.WhiteWall(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWallTopRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.Stairs(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.Stairs(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()]
        ]);
        this.map[0][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[0][0].enemies = [
            new BlueOctorok(this.Game, 2 * 64, 2 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Down),
            new BlueOctorok(this.Game, 5 * 64, 5 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new BlueOctorok(this.Game, 13 * 64, 3 * 64, 4, Random.getOneInt(2) ? Direction.Up : Direction.Down),
        ];
        this.map[1][0].loadBricks([
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(),],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(),],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()]
        ]);
        this.map[1][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[1][0].enemies = [
            new BlueMoblin(this.Game, 5 * 64, 8 * 64, 4, Direction.Up),
            new BlueMoblin(this.Game, 8 * 64, 4 * 64, 4, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new BlueMoblin(this.Game, 10 * 64, 2 * 64, 4, Direction.Down),
        ];
        this.map[2][0].loadBricks([
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWallBottomLeft(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.MonumentTopLeft(), new Bricks.MonumentTopRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteTree(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.MonumentTopLeft(), new Bricks.MonumentTopRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.MonumentBottomLeft(), new Bricks.MonumentBottomRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.MonumentBottomLeft(), new Bricks.MonumentBottomRight(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.Grave(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.DefaultGrey(), new Bricks.WhiteWallTopLeft(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWallTop(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()],
            [new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall(), new Bricks.WhiteWall()]
        ]);
        this.map[2][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[2][0].enemies = [
            new BlueOctorok(this.Game, 5 * 64, 4 * 64, 4, Direction.Down),
            new BlueOctorok(this.Game, 9 * 64, 6 * 64, 4, Direction.Right),
            new BlueOctorok(this.Game, 12 * 64, 3 * 64, 4, Direction.Down),
            new BlueTektite(this.Game, 7 * 64, 7 * 64),
        ];
        this.map[0][1].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Stairs(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Stairs(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.SingleRedWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()]
        ]);
        this.map[0][1].enemies = [
            new Octorok(this.Game, 6 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 4 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 7 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 2 * 64, 3, Direction.Down),
        ];
        this.map[1][1].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall()],
            [new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()]
        ]);
        this.map[1][1].enemies = [
            new Octorok(this.Game, 4 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 3 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 7 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 12 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
        ];
        this.map[2][1].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
        ]);
        this.map[2][1].enemies = [
            new Octorok(this.Game, 3 * 64, 4 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 5 * 64, 6 * 64, 3, Random.getOneInt(2) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 10 * 64, 5 * 64, 3, Random.getOneInt(2) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 14 * 64, 2 * 64, 3, Random.getOneInt(2) ? Direction.Left : Direction.Down),
        ];
        this.map[0][2].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.WallTop()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.SingleWall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()]
        ]);
        this.map[0][2].enemies = [
            new Tektite(this.Game, 3 * 64, 4 * 64),
            new Tektite(this.Game, 5 * 64, 7 * 64),
            new Tektite(this.Game, 10 * 64, 5 * 64),
        ];
        // Spawn scene
        this.map[1][2].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallBottomLeft(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default()],
            [new Bricks.WallTop(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.WallTopLeft(), new Bricks.WallTop()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.WallTop(), new Bricks.Wall(), new Bricks.Wall()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall(), new Bricks.Wall()]
        ]);
        this.map[2][2].loadBricks([
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.WallBottomRight(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.WallTop(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.WallTopRight(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Default(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree()],
            [new Bricks.Wall(), new Bricks.Wall(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree(), new Bricks.Tree()],
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
