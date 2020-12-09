class Scene {
    constructor(Overworld, c, r) {
        this.Overworld = Overworld;

        this.cells = [];

        this.c = c;
        this.r = r;

        this.nbRow = 15;
        this.nbColl = 30;
        this.cellSize = 50;

        this.enemies = true;

        for (let c = 0; c < this.nbColl; c++) {
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
        if (this.c == this.Overworld.nbColl-1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbColl-1][r].brick = "wall";
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbColl; c++) {
                this.cells[c][0].brick = "wall";
            }
        }
        if (this.r == this.Overworld.nbRow-1) {
            for (let c = 0; c < this.nbColl; c++) {
                this.cells[c][this.nbRow-1].brick = "wall";
            }
        }
    }
}

class Overworld {
    constructor(Game) {
        this.Game = Game;

        this.map = [];

        this.nbRow = 3;
        this.nbColl = 3;

        this.spawnColl = 1;
        this.spawnRow = 1;
        this.spawnX = 1;
        this.spawnY = 1;

        for (let c = 0; c < this.nbColl; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this, c, r);
            }
        }
    }

    getSpawnScene() {
        return this.map[this.spawnColl - 1][this.spawnRow - 1];
    }
}
