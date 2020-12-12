class Landscape {
    private Game: Game;
    private Scene: Scene;

    constructor(game: Game, scene: Scene) {
        this.Game = game;
        this.Scene = scene;
    }

    get currentScene(): Scene {
        return this.Scene;
    }

    get cellSize(): number {
        return this.Scene.cellSize;
    }

    get nbRow(): number {
        return this.Scene.nbRow;
    }

    get nbCol(): number {
        return this.Scene.nbCol;
    }

    get width(): number {
        return this.Scene.cellSize * this.Scene.nbCol;
    }

    get height(): number {
        return this.Scene.cellSize * this.Scene.nbRow;
    }

    loopCells(callback: Function): void {
        for (let col = 0; col < this.nbCol; col++) {
            for (let row = 0; row < this.nbRow; row++) {
                callback(col, row);
            }
        }
    }

    draw(): void {
        this.loopCells((col, row) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                this.Game.BrickCollection.get(this.Scene.cell(col, row).brick).img,
                this.cellSize * col,
                this.cellSize * row,
                this.cellSize,
                this.cellSize
            );
            this.Game.ctx.closePath();
        });
    }

    collisions(): void {
        this.loopCells((col, row) => {
            if (this.Game.BrickCollection.get(this.Scene.cell(col, row).brick).hasCollisions) {
                movingBoxCollision(this.Game.Player, this.Scene.cell(col, row));

                this.Game.Enemies.loopEnemies((enemy) => {
                    if (movingBoxCollision(enemy, this.Scene.cell(col, row))) {
                        if (enemy.dirY == "Up") {
                            enemy.dirY = "Down";
                        } else {
                            enemy.dirY = "Up";
                        }
                    }
                });
            }
        });
    }
}
