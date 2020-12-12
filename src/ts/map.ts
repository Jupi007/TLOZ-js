class Scene {
    private Overworld: Overworld;

    private _cells = [];

    // Coordinates of the scene in the overworld
    private _c:number;
    private _r:number;

    private _nbRow = 11;
    private _nbCol = 16;
    private _cellSize = 50;

    private _hasEnemies = true;

    constructor(overworld: Overworld, c: number, r: number) {
        this.Overworld = overworld;

        this._c = c;
        this._r = r;

        for (let c = 0; c < this._nbCol; c++) {
            this._cells[c] = [];
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[c][r] = {
                    x: this.cellSize * c,
                    y: this.cellSize * r,
                    width: this.cellSize,
                    height: this.cellSize,
                    brick: "default",
                };
            }
        }

        if (this._c == 0) {
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[0][r].brick = "wall";
            }
        }
        if (this._c == this.Overworld.nbCol-1) {
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[this._nbCol-1][r].brick = "wall";
            }
        }
        if (this._r == 0) {
            for (let c = 0; c < this._nbCol; c++) {
                this._cells[c][0].brick = "wall";
            }
        }
        if (this._r == this.Overworld.nbRow-1) {
            for (let c = 0; c < this._nbCol; c++) {
                this._cells[c][this._nbRow-1].brick = "wall";
            }
        }
    }

    cell(col, row) { // TODO: Add type (and create a Cell class)
        return this._cells[col][row];
    }

    get c(): number {
        return this._c;
    }

    get r(): number {
        return this._r;
    }

    get nbRow(): number {
        return this._nbRow;
    }

    get nbCol(): number {
        return this._nbCol;
    }

    get cellSize(): number {
        return this._cellSize;
    }

    get hasEnemies(): boolean {
        return this._hasEnemies;
    }

    set hasEnemies(hasEnemies: boolean) {
        this._hasEnemies = hasEnemies;
    }
}

class Overworld {
    private Game: Game;

    private _map: Scene[][] = [];

    private _nbRow = 3;
    private _nbCol = 3;

    private _spawnSceneColl = 1;
    private _spawnSceneRow = 1;

    constructor(game: Game) {
        this.Game = game;

        for (let c = 0; c < this._nbCol; c++) {
            this._map[c] = [];
            for (let r = 0; r < this._nbRow; r++) {
                this._map[c][r] = new Scene(this, c, r);
            }
        }
    }

    get map(): Scene[][] {
        return this._map;
    }

    get nbCol(): number {
        return this._nbCol;
    }

    get nbRow(): number {
        return this._nbRow;
    }

    getSpawnScene(): Scene {
        return this._map[this._spawnSceneColl - 1][this._spawnSceneRow - 1];
    }
}
