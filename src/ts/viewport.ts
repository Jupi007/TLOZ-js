class Viewport {
    Game: Game;
    currentScene: Scene;
    nextScene: Scene;

    x: number;
    y: number;

    dc:number;
    dr:number;

    slideSceneAnimationSpeed: number;

    music: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;
        this.currentScene = this.Game.World.getSpawnScene();
        this.nextScene = null;

        this.music = this.currentScene.music;
        this.music.play();

        this.x = 0;
        this.y = 0;

        this.dr = 0;
        this.dc = 0;

        this.slideSceneAnimationSpeed = 10;
    }

    get cellSize(): number {
        return this.currentScene.cellSize;
    }

    get nbRow(): number {
        return this.currentScene.nbRow;
    }

    get nbCol(): number {
        return this.currentScene.nbCol;
    }

    get width(): number {
        return this.currentScene.cellSize * this.currentScene.nbCol;
    }

    get height(): number {
        return this.currentScene.cellSize * this.currentScene.nbRow;
    }

    loopCells(callback: Function, scene: Scene = this.currentScene): void {
        for (let col = 0; col < this.nbCol; col++) {
            for (let row = 0; row < this.nbRow; row++) {
                callback(scene.getCell(col, row), col, row);
            }
        }
    }

    loopCollision(callback: Function): void {
        this.loopCells((cell, col, row) => {
            if (cell.brick.hasCollisions) {
                callback(cell, col, row);
            }
        });
    }

    draw(): void {
        this.loopCells((cell, col, row) => {
            this.currentScene.drawImage(
                cell.brick.sprite,
                this.cellSize * col,
                this.cellSize * row,
                this.cellSize,
                this.cellSize
            );
        });

        if (this.nextScene !== null) {
            this.loopCells((cell, col, row) => {
                this.nextScene.drawImage(
                    cell.brick.sprite,
                    this.cellSize * col,
                    this.cellSize * row,
                    this.cellSize,
                    this.cellSize
                );
            }, this.nextScene);
        }
    }

    slideSceneAnimationMove(): void {
        if (this.dc === 1) {
            this.currentScene.x -= this.slideSceneAnimationSpeed;
            this.nextScene.x -= this.slideSceneAnimationSpeed;
        }
        else if (this.dc === -1) {
            this.currentScene.x += this.slideSceneAnimationSpeed;
            this.nextScene.x += this.slideSceneAnimationSpeed;
        }
        else if (this.dr === 1) {
            this.currentScene.y -= this.slideSceneAnimationSpeed;
            this.nextScene.y -= this.slideSceneAnimationSpeed;
        }
        else if (this.dr === -1) {
            this.currentScene.y += this.slideSceneAnimationSpeed;
            this.nextScene.y += this.slideSceneAnimationSpeed;
        }

        if (
            (this.nextScene.y <= 0 && this.dr ===  1) ||
            (this.nextScene.y >= 0 && this.dr === -1) ||
            (this.nextScene.x <= 0 && this.dc ===  1) ||
            (this.nextScene.x >= 0 && this.dc === -1)
        ) {
            this.nextScene.y = 0;
            this.nextScene.x = 0;

            this.dr = 0;
            this.dc = 0;

            if (this.music.src != this.nextScene.music.src) {
                this.music.pause();
                this.music.currentTime = 0;
                this.music = this.nextScene.music;
                this.music.play();
            }

            this.currentScene = this.nextScene;
            this.nextScene = null;

            this.Game.Enemies = new Enemies(this.Game);
            this.Game.Projectiles.deleteAllProjectiles();

            this.Game.status = GameStatus.Run;
        }
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

    slideScene(direction: Direction): void {
        let currentSceneCol = this.currentScene.c;
        let currentSceneRow = this.currentScene.r;

        if (direction === Direction.Left) {
            this.dc = -1;
        }
        else if (direction === Direction.Right) {
            this.dc = 1;
        }
        else if (direction === Direction.Up) {
            this.dr = -1;
        }
        else if (direction === Direction.Down) {
            this.dr = 1;
        }
        else {
            return;
        }

        if ( !(
            currentSceneCol + this.dc < 0 ||
            currentSceneCol + this.dc > this.Game.World.nbCol - 1 ||
            currentSceneRow + this.dr < 0 ||
            currentSceneRow + this.dr > this.Game.World.nbRow - 1
        ) ) {
            this.nextScene = this.Game.World.map[currentSceneCol + this.dc][currentSceneRow + this.dr];

            if (direction === Direction.Left) {
                this.nextScene.x = -this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Right) {
                this.nextScene.x = this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Up) {
                this.nextScene.y = -this.height;
                this.nextScene.x = 0;
            }
            else if (direction === Direction.Down) {
                this.nextScene.y = this.height;
                this.nextScene.x = 0;
            }

            this.Game.Player.dx = 0;
            this.Game.Player.dy = 0;

            this.Game.status = GameStatus.SlideScene;

            return;
        }

        this.dc = 0;
        this.dr = 0;
    }
}
