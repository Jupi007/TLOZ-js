class Cell extends SimpleBox {
    brick: Brick;

    constructor(x: number, y: number, size: number, brick: Brick) {
        super();

        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.brick = brick;
    }
}

class Scene {
    Game: Game;
    Overworld: Overworld;

    cells: Cell[][] = [];

    x:number;
    y:number;

    // Coordinates of the scene in the overworld
    c:number;
    r:number;

    nbRow = 11;
    nbCol = 16;
    cellSize = 64;

    hasEnemies = true;

    music: HTMLAudioElement;

    constructor(game: Game, overworld: Overworld, c: number, r: number) {
        this.Game = game;
        this.Overworld = overworld;

        this.x = 0;
        this.y = 0;

        this.c = c;
        this.r = r;

        this.music = AudioLoader.load("./sounds/music/overworld.mp3", true);

        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(
                    this.cellSize * c,
                    this.cellSize * r,
                    this.cellSize,
                    new DefaultBrick()
                );
            }
        }

        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = new WallBrick();
            }
        }
        if (this.c == this.Overworld.nbCol-1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol-1][r].brick = new WallBrick();
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = new WallBrick();
            }
        }
        if (this.r == this.Overworld.nbRow-1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow-1].brick = new WallBrick();
            }
        }
    }

    getCell(col: number, row: number): Cell {
        return this.cells[col][row];
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.Game.Landscape.drawImage(
            sprite,
            x + this.x,
            y + this.y,
            width,
            height
        );
    }
}

class Overworld {
    Game: Game;

    map: Scene[][] = [];

    nbRow = 3;
    nbCol = 3;

    spawnSceneColl = 1;
    spawnSceneRow = 1;

    constructor(game: Game) {
        this.Game = game;

        for (let c = 0; c < this.nbCol; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this.Game, this, c, r);
            }
        }

        this.map[1][1].music = AudioLoader.load("./sounds/music/dungeon.mp3", true);
    }

    getSpawnScene(): Scene {
        return this.map[this.spawnSceneColl - 1][this.spawnSceneRow - 1];
    }
}
