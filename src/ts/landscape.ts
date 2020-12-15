class Landscape {
    Game: Game;
    Scene: Scene;

    x: number;
    y: number;

    constructor(game: Game, scene: Scene) {
        this.Game = game;
        this.Scene = scene;

        this.x = 0;
        this.y = 0;
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
                callback(this.Scene.getCell(col, row), col, row);
            }
        }
    }

    loopCollision(callback: Function): void {
        this.loopCells((cell, col, row) => {
            if (this.Game.BrickCollection.get(cell.brick).hasCollisions) {
                callback(cell, col, row);
            }
        });
    }

    draw(): void {
        this.loopCells((cell, col, row) => {
            this.drawImage(
                this.Game.BrickCollection.get(cell.brick).sprite,
                this.cellSize * col,
                this.cellSize * row,
                this.cellSize,
                this.cellSize
            );
        });
    }

    collisions(): void {
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.Game.drawImage(
            sprite,
            x + this.x,
            y + this.y,
            width,
            height
        );
    }
}
