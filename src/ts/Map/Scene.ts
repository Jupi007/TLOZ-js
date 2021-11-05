import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Enemy } from "../Enemies/Enemy";
import { Brick } from "../Bricks/Brick";
import { Item } from "../Items/Item";
import { Cell } from "./Cell";
import { Passage } from "./Passage";
import { World } from "./World";


export class Scene {
    Game: Game;
    World: World;

    cells: Cell[][] = [];

    x: number;
    y: number;

    // Coordinates of the scene in the world
    c: number;
    r: number;

    nbRow: number;
    nbCol: number;
    cellSize: number;

    enemies: Enemy[];
    passages: Passage[];
    permanentItems: Item[];

    music: HTMLAudioElement;

    defaultBrick: Brick;
    defaultWallBrick: Brick;

    backgroundColor: string;

    constructor({ game, world, c, r, music, defaultBrick, backgroundColor }: {
        game: Game;
        world: World;
        c: number;
        r: number;
        music: HTMLAudioElement;
        defaultBrick: Brick;
        backgroundColor: string;
    }) {
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
                this.cells[c][r] = new Cell({
                    x: this.cellSize * c,
                    y: this.cellSize * r,
                    size: this.cellSize,
                    brick: defaultBrick
                });
            }
        }
    }

    public get width(): number {
        return this.cellSize * this.nbCol;
    }

    public get height(): number {
        return this.cellSize * this.nbRow;
    }

    get hasEnemies(): boolean {
        return this.enemies.length > 0;
    }

    get hasPermanentItems(): boolean {
        return this.permanentItems.length > 0;
    }

    getCell(col: number, row: number): Cell {
        return this.cells[col][row];
    }

    loadBricks(bricks: any[][]): void {
        bricks.forEach((row, r) => {
            row.forEach((brickName, c) => {
                this.cells[c][r].brick = this.Game.BrickCollection.get(brickName);
            });
        });
    }

    drawImage({ sprite, x, y, width, height }: {
        sprite: HTMLImageElement;
        x: number;
        y: number;
        width: number;
        height: number;
    }): void {
        this.Game.Viewport.drawImage({ sprite, x: x + this.x, y: y + this.y, width, height });
    }

    fillRect({ x, y, width, height, color }: {
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
    }): void {
        this.Game.Viewport.fillRect({ x: x + this.x, y: y + this.y, width, height, color });
    }

    upperEdgeCollision(): void {
        this.Game.Viewport.slideScene(Direction.Up);
    }

    rightEdgeCollision(): void {
        this.Game.Viewport.slideScene(Direction.Right);
    }

    bottomEdgeCollision(): void {
        this.Game.Viewport.slideScene(Direction.Down);
    }

    leftEdgeCollision(): void {
        this.Game.Viewport.slideScene(Direction.Left);
    }
}
