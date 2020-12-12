class Enemies {
    private Game: Game;

    private _img: HTMLImageElement = new Image();

    private _nbEnemies = 3;
    private _enemies: any = []; // TODO: Change type to array when Ennemie class is created

    constructor(game: Game) {
        this.Game = game;

        this._img.src = "./sprites/png/goomba.png";

        if (this.Game.Landscape.currentScene.hasEnemies) {
            for (var i = 0; i < this._nbEnemies; i++) {
                this._enemies[i] = {
                    x: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.width - (this.Game.Landscape.cellSize + 60)),
                    y: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.height - (this.Game.Landscape.cellSize + 60)),
                    dx: 0,
                    dy: 0,
                    speed: getRandomIntInclusive(1, 3),
                    dirY: getRandomIntInclusive(0, 1) ? "Up" : "Down",
                    width: 40,
                    height: 40,
                    isKilled: false,
                };
            }
        }
    }

    get enemies(): any { // TODO: Change type to array when Ennemie class is created
        return this._enemies;
    }

    loopEnemies(callback: Function): void {
        this._enemies.forEach((enemy) => {
            callback(enemy);
        });
    }

    killEnemy(enemy): void { // TODO: Change enemy type to Ennemie when class is created
        const enemyIndex = this._enemies.indexOf(enemy);

        if (enemyIndex > -1) {
            this._enemies.splice(enemyIndex, 1);
        }

        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
            this.Game.Landscape.currentScene.hasEnemies = false;
        }
    }

    draw(): void {
        this.loopEnemies((enemy) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                this._img,
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height
            );
            this.Game.ctx.closePath();
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy)) {
                this.Game.Player.takeDamage(20);
                this.Game.Player.takeKnockBack();
            }

            if (movingBoxCanvasCollision(enemy, this.Game.Canvas)) {
                if (enemy.dirY == "Up") {
                    enemy.dirY = "Down";
                } else {
                    enemy.dirY = "Up";
                }
            }
        });
    }

    preMove(): void {
        this.loopEnemies((enemy) => {
            enemy.dx = 0;

            if (enemy.dirY == "Down") {
                enemy.dy = enemy.speed;
            } else {
                enemy.dy = -enemy.speed;
            }
        });
    }

    move(): void {
        this.loopEnemies((enemy) => {
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
        });
    }
}
