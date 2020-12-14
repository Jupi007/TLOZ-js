class Scene {
    private Overworld: Overworld;

    cells = [];

    // Coordinates of the scene in the overworld
    c:number;
    r:number;

    nbRow = 11;
    nbCol = 16;
    cellSize = 50;

    hasEnemies = true;

    constructor(overworld: Overworld, c: number, r: number) {
        this.Overworld = overworld;

        this.c = c;
        this.r = r;

        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = {
                    x: this.cellSize * c,
                    y: this.cellSize * r,
                    width: this.cellSize,
                    height: this.cellSize,
                    brick: "default",
                };
            }
        }

        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = "wall";
            }
        }
        if (this.c == this.Overworld.nbCol-1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol-1][r].brick = "wall";
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = "wall";
            }
        }
        if (this.r == this.Overworld.nbRow-1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow-1].brick = "wall";
            }
        }
    }

    getCell(col, row) { // TODO: Add type (and create a Cell class)
        return this.cells[col][row];
    }
}

class Overworld {
    private Game: Game;

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
                this.map[c][r] = new Scene(this, c, r);
            }
        }
    }

    getSpawnScene(): Scene {
        return this.map[this.spawnSceneColl - 1][this.spawnSceneRow - 1];
    }
}
