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
    World: World;

    cells: Cell[][] = [];

    x:number;
    y:number;

    // Coordinates of the scene in the overworld
    c:number;
    r:number;

    nbRow: number;
    nbCol: number;
    cellSize: number;

    hasEnemies: boolean;

    music: HTMLAudioElement;

    defaultBrick: Brick;
    defaultWallBrick: Brick;

    constructor(game: Game, overworld: World, c: number, r: number, music: HTMLAudioElement) {
        this.Game = game;
        this.World = overworld;

        this.nbRow = 11;
        this.nbCol = 16;
        this.cellSize = 64;

        this.hasEnemies = false;

        this.x = 0;
        this.y = 0;

        this.c = c;
        this.r = r;

        this.music = music;

        this.defaultBrick = new DefaultBrick();
        this.defaultWallBrick = new WallBrick();

        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(
                    this.cellSize * c,
                    this.cellSize * r,
                    this.cellSize,
                    this.defaultBrick
                );
            }
        }

        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = this.defaultWallBrick;
            }
        }
        if (this.c == this.World.nbCol-1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol-1][r].brick = this.defaultWallBrick;
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = this.defaultWallBrick;
            }
        }
        if (this.r == this.World.nbRow-1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow-1].brick = this.defaultWallBrick;
            }
        }
    }

    getCell(col: number, row: number): Cell {
        return this.cells[col][row];
    }

    loadBricks(bricks: Brick[][]): void {
        bricks.forEach((row, r) => {
            row.forEach((brick, c) => {
                this.cells[c][r].brick = brick;
            });
        });
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.Game.Viewport.drawImage(
            sprite,
            x + this.x,
            y + this.y,
            width,
            height
        );
    }
}

class World {
    Game: Game;

    map: Scene[][] = [];

    nbRow: number;
    nbCol: number;

    spawnSceneColl: number;
    spawnSceneRow: number;
    spawnCellColl: number;
    spawnCellRow: number;

    constructor(game: Game) {
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
                this.map[c][r] = new Scene(
                    this.Game,
                    this,
                    c,
                    r,
                    AudioLoader.load("./sounds/music/overworld.mp3", true)
                );
            }
        }

        this.map[1][1].music = AudioLoader.load("./sounds/music/dungeon.mp3", true);

        this.map[1][2].loadBricks([
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new WallBottomLeftBrick(), new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopBrick()],
            [new WallTopBrick(),         new WallTopRightBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallTopBrick(),         new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),         new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),        new WallTopBrick(),        new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ]
        ]);
        this.map[1][2].hasEnemies = false;

        this.map[2][2].loadBricks([
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(),         new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallTopBrick(),         new DefaultBrick(),         new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick()],
        ]);
    }

    getSpawnScene(): Scene {
        return this.map[this.spawnSceneColl][this.spawnSceneRow];
    }
}
