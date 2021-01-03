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

    enemies: Enemy[];

    music: HTMLAudioElement;

    defaultBrick: Brick;
    defaultWallBrick: Brick;

    constructor(game: Game, overworld: World, c: number, r: number, music: HTMLAudioElement) {
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

    get hasEnemies(): boolean {
        return this.enemies.length > 0;
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

        this.map[0][0].loadBricks([
            [new WhiteWallBrick(), new WhiteWallBrick(),            new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ],
            [new WhiteWallBrick(), new WhiteWallBrick(),            new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ],
            [new WhiteWallBrick(), new WhiteWallBottomRightBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick(),    ],
            [new WhiteWallBrick(), new DefaultGreyBrick(),          new DefaultGreyBrick(),  new GraveBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(), new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(),       new DefaultGreyBrick(),       new GraveBrick(),             new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick(),    ],
            [new WhiteWallBrick(), new DefaultGreyBrick(),          new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(), new DefaultGreyBrick(),          new DefaultGreyBrick(),  new GraveBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(), new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(),       new DefaultGreyBrick(),       new GraveBrick(),             new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(), new DefaultGreyBrick(),          new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(), new DefaultGreyBrick(),          new DefaultGreyBrick(),  new GraveBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new GraveBrick(),             new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(), new WhiteWallTopRightBrick(),    new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(), new WhiteWallBrick(),            new WhiteWallTopBrick(), new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),new WhiteWallTopBrick(),  new StairsBrick(),        new WhiteWallTopBrick(),      new WhiteWallTopBrick(),      new WhiteWallTopBrick(),      new WhiteWallTopBrick(),     new WhiteWallTopBrick(),        new WhiteWallTopBrick()    ],
            [new WhiteWallBrick(), new WhiteWallBrick(),            new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new StairsBrick(),        new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ]
        ]);
        this.map[0][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[0][0].enemies = [
            new BlueOctorok(
                this.Game,
                2 * 64,
                2 * 64,
                4,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Down
            ),
            new BlueOctorok(
                this.Game,
                5 * 64,
                5 * 64,
                4,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new BlueOctorok(
                this.Game,
                13 * 64,
                3 * 64,
                4,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
        ];

        this.map[1][0].loadBricks([
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick(),    ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new WhiteTreeBrick(),     new DefaultGreyBrick(),   new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(), new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(),       new DefaultGreyBrick(),       new WhiteTreeBrick(),         new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick(),    ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new WhiteTreeBrick(),     new DefaultGreyBrick(),   new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(), new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(),       new DefaultGreyBrick(),       new WhiteTreeBrick(),         new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new WhiteTreeBrick(),     new DefaultGreyBrick(),   new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(), new DefaultGreyBrick(),   new WhiteTreeBrick(),     new DefaultGreyBrick(),       new DefaultGreyBrick(),       new WhiteTreeBrick(),         new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),       new DefaultGreyBrick(),      new DefaultGreyBrick(),         new DefaultGreyBrick()     ],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallTopBrick(), new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),      new WhiteWallTopBrick(),      new WhiteWallTopBrick(),      new WhiteWallTopBrick(),     new WhiteWallTopBrick(),        new WhiteWallTopBrick()    ],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),         new WhiteWallBrick(),        new WhiteWallBrick(),           new WhiteWallBrick()       ]
        ]);
        this.map[1][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[1][0].enemies = [
            new BlueOctorok(
                this.Game,
                5 * 64,
                8 * 64,
                4,
                Direction.Up
            ),
            new BlueOctorok(
                this.Game,
                8 * 64,
                4 * 64,
                4,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new BlueOctorok(
                this.Game,
                10 * 64,
                2 * 64,
                4,
                Direction.Down
            ),
        ];

        this.map[2][0].loadBricks([
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),          new WhiteWallBrick(),           new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),          new WhiteWallBrick(),            new WhiteWallBrick(),         new WhiteWallBrick(),           new WhiteWallBrick(),           new WhiteWallBrick()],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),          new WhiteWallBrick(),           new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),          new WhiteWallBrick(),            new WhiteWallBrick(),         new WhiteWallBrick(),           new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),        new DefaultGreyBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),        new DefaultGreyBrick(),          new DefaultGreyBrick(),       new WhiteWallBottomLeftBrick(), new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new MonumentTopLeftBrick(),    new MonumentTopRightBrick(),    new DefaultGreyBrick(),   new DefaultGreyBrick(),   new WhiteTreeBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),   new MonumentTopLeftBrick(),    new MonumentTopRightBrick(),     new DefaultGreyBrick(),       new DefaultGreyBrick(),         new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new MonumentBottomLeftBrick(), new MonumentBottomRightBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new MonumentBottomLeftBrick(), new MonumentBottomRightBrick(),  new DefaultGreyBrick(),       new DefaultGreyBrick(),         new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),        new DefaultGreyBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),        new DefaultGreyBrick(),          new DefaultGreyBrick(),       new DefaultGreyBrick(),         new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),        new DefaultGreyBrick(),         new DefaultGreyBrick(),   new GraveBrick(),         new DefaultGreyBrick(), new GraveBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),        new DefaultGreyBrick(),          new DefaultGreyBrick(),       new DefaultGreyBrick(),         new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),        new DefaultGreyBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),        new DefaultGreyBrick(),          new DefaultGreyBrick(),       new DefaultGreyBrick(),         new WhiteWallBrick(),           new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),  new DefaultGreyBrick(),        new DefaultGreyBrick(),         new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(), new DefaultGreyBrick(),   new DefaultGreyBrick(),   new DefaultGreyBrick(),        new DefaultGreyBrick(),          new DefaultGreyBrick(),       new WhiteWallTopLeftBrick(),    new WhiteWallBrick(),           new WhiteWallBrick()],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallTopBrick(), new WhiteWallTopBrick(),       new WhiteWallTopBrick(),        new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),new WhiteWallTopBrick(),  new WhiteWallTopBrick(),  new WhiteWallTopBrick(),       new WhiteWallTopBrick(),         new WhiteWallTopBrick(),      new WhiteWallBrick(),           new WhiteWallBrick(),           new WhiteWallBrick()],
            [new WhiteWallBrick(),   new WhiteWallBrick(),   new WhiteWallBrick(),    new WhiteWallBrick(),          new WhiteWallBrick(),           new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),   new WhiteWallBrick(),     new WhiteWallBrick(),     new WhiteWallBrick(),          new WhiteWallBrick(),            new WhiteWallBrick(),         new WhiteWallBrick(),           new WhiteWallBrick(),           new WhiteWallBrick()]
        ]);
        this.map[2][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[2][0].enemies = [
            new BlueOctorok(
                this.Game,
                5 * 64,
                4 * 64,
                4,
                Direction.Down
            ),
            new BlueOctorok(
                this.Game,
                9 * 64,
                6 * 64,
                4,
                Direction.Right
            ),
            new BlueOctorok(
                this.Game,
                12 * 64,
                3 * 64,
                4,
                Direction.Down
            ),
        ];

        this.map[0][1].loadBricks([
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),    new WallBrick(),          new StairsBrick(),        new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick(),           new WallBrick()          ],
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),    new WallBrick(),          new StairsBrick(),        new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick(),           new WallBrick()          ],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new WallBottomLeftBrick(), new WallBrick()          ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick(),        new WallBottomLeftBrick()],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(),  new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick(),        new DefaultBrick()       ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick(),        new DefaultBrick()       ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(),  new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick(),        new DefaultBrick()       ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick(),        new WallTopLeftBrick()   ],
            [new WallBrick(), new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(), new DefaultBrick(),       new DefaultBrick(),       new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new WallTopLeftBrick(),    new WallBrick()          ],
            [new WallBrick(), new WallBrick(),            new WallTopBrick(), new WallTopBrick(),       new WallTopBrick(),       new WallTopBrick(),       new WallTopBrick(),       new WallTopBrick(), new WallTopBrick(),       new WallTopBrick(),       new WallTopRightBrick(),   new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallBrick(),           new WallBrick()          ],
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),          new WallBrick(),    new WallBrick(),          new WallBrick(),          new WallBrick(),           new DefaultBrick(), new DefaultBrick(), new WallBrick(),        new WallBrick(),           new WallBrick()          ]
        ]);
        this.map[0][1].enemies = [
            new Octorok(
                this.Game,
                6 * 64,
                4 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new Octorok(
                this.Game,
                4 * 64,
                6 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new Octorok(
                this.Game,
                7 * 64,
                2 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                13 * 64,
                2 * 64,
                3,
                Direction.Down
            ),
        ];

        this.map[1][1].loadBricks([
            [new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),           new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),           new WallBrick(),           new WallBrick()          ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),           new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),           new WallBrick(),           new WallBrick()          ],
            [new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new WallBottomLeftBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new WallBottomLeftBrick(), new WallBrick()          ],
            [new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(),        new DefaultBrick(),        new WallBottomLeftBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick()       ],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick()       ],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick()       ],
            [new WallTopRightBrick(),    new DefaultBrick(),         new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(),        new DefaultBrick(),        new WallTopLeftBrick()   ],
            [new WallBrick(),            new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new WallTopLeftBrick(),    new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),        new WallTopLeftBrick(),    new WallBrick()          ],
            [new WallBrick(),            new WallBrick(),            new WallTopBrick(), new WallTopBrick(),    new WallTopBrick(), new WallTopBrick(),    new DefaultBrick(), new DefaultBrick(),    new WallBrick(),           new WallBrick(),            new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),    new WallBrick(),           new WallBrick(),           new WallBrick()          ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new DefaultBrick(), new DefaultBrick(),    new WallBrick(),           new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),           new WallBrick(),           new WallBrick()          ]
        ]);
        this.map[1][1].enemies = [
            new Octorok(
                this.Game,
                4 * 64,
                5 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                10 * 64,
                3 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                13 * 64,
                7 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                12 * 64,
                6 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
        ];

        this.map[2][1].loadBricks([
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick(),    new TreeBrick()],
            [new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(),         new DefaultBrick(),         new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallTopRightBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
            [new WallBrick(),            new WallBrick(),            new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick(),    new DefaultBrick(), new TreeBrick()],
        ]);
        this.map[2][1].enemies = [
            new Octorok(
                this.Game,
                3 * 64,
                4 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new Octorok(
                this.Game,
                5 * 64,
                6 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new Octorok(
                this.Game,
                10 * 64,
                5 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                14 * 64,
                2 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Left : Direction.Down
            ),
        ];

        this.map[0][2].loadBricks([
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new WallBottomLeftBrick(), new WallBrick()   ],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick()],
            [new WallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new WallTopLeftBrick(),    new WallTopBrick()],
            [new WallBrick(), new WallTopRightBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(),    new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(), new DefaultBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new WallBrick(),            new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),    new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),    new WallTopBrick(), new WallTopBrick(),    new WallTopBrick(),         new WallTopBrick(), new WallTopBrick(), new WallBrick(),           new WallBrick(),           new WallBrick()   ],
            [new WallBrick(), new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),    new WallBrick(),       new WallBrick(),    new WallBrick(),       new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),           new WallBrick(),           new WallBrick()   ]
        ]);
        this.map[0][2].enemies = [
            new Octorok(
                this.Game,
                3 * 64,
                4 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left
            ),
            new Octorok(
                this.Game,
                5 * 64,
                7 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                10 * 64,
                5 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
        ];

        // Spawn scene
        this.map[1][2].loadBricks([
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),            new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new WallBottomRightBrick(), new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new WallBottomLeftBrick(), new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ],
            [new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),     new DefaultBrick()],
            [new WallTopBrick(),         new DefaultBrick(),         new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopBrick()],
            [new WallBrick(),            new WallTopRightBrick(),    new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),         new DefaultBrick(), new DefaultBrick(), new DefaultBrick(),        new DefaultBrick(),        new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallTopBrick(),         new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),         new WallTopBrick(), new WallTopBrick(), new WallTopBrick(),        new WallTopBrick(),        new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(),        new WallBrick()   ],
            [new WallBrick(),            new WallBrick(),            new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),            new WallBrick(),    new WallBrick(),    new WallBrick(),           new WallBrick(),           new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),    new WallBrick(),        new WallBrick()   ]
        ]);

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
        this.map[2][2].enemies = [
            new Octorok(
                this.Game,
                3 * 64,
                5 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                5 * 64,
                7 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                10 * 64,
                5 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
            new Octorok(
                this.Game,
                12 * 64,
                7 * 64,
                3,
                getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down
            ),
        ];
    }

    getSpawnScene(): Scene {
        return this.map[this.spawnSceneColl][this.spawnSceneRow];
    }

    loopScenes(callback: Function): void {
        this.map.forEach((col, c) => {
            col.forEach((scene, r) => {
                callback(scene);
            });
        });
    }
}
