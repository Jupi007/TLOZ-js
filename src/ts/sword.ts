class Sword {
    private Game: Game;

    private _x = 0;
    private _y = 0;

    private _width= 0;
    private _height= 0;

    private _swordWidth = 32;
    private _swordHeight = 14;

    private _imgUp: HTMLImageElement = new Image();
    private _imgRight: HTMLImageElement = new Image();
    private _imgDown: HTMLImageElement = new Image();
    private _imgLeft: HTMLImageElement = new Image();

    constructor(game: Game) {
        this.Game = game;

        this._imgUp.src = "./sprites/png/sword-up.png";
        this._imgRight.src = "./sprites/png/sword-right.png";
        this._imgDown.src = "./sprites/png/sword-down.png";
        this._imgLeft.src = "./sprites/png/sword-left.png";
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    draw(): void {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            this.Game.ctx.beginPath();
            if (upPressed) {
                this.Game.ctx.drawImage(
                    this._imgUp,
                    this._x,
                    this._y,
                    this._width,
                    this._height
                );
            } else if (downPressed) {
                this.Game.ctx.drawImage(
                    this._imgDown,
                    this._x,
                    this._y,
                    this._width,
                    this._height
                );
            } else if (leftPressed) {
                this.Game.ctx.drawImage(
                    this._imgLeft,
                    this._x,
                    this._y,
                    this._width,
                    this._height
                );
            } else if (rightPressed) {
                this.Game.ctx.drawImage(
                    this._imgRight,
                    this._x,
                    this._y,
                    this._width,
                    this._height
                );
            }
            this.Game.ctx.closePath();
        }
    }

    collisions(): void {
        if (attackPressed) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }

    events(): void {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            if (upPressed) {
               this._x = this.Game.Player.x + (this.Game.Player.width - this._swordHeight) / 2;
               this._y = this.Game.Player.y - this._swordWidth;
               this._width = this._swordHeight;
               this._height = this._swordWidth;
           } else if (downPressed) {
               this._x = this.Game.Player.x + (this.Game.Player.width - this._swordHeight) / 2;
               this._y = this.Game.Player.y + this.Game.Player.width;
               this._width = this._swordHeight;
               this._height = this._swordWidth;
           } else if (leftPressed) {
                this._x = this.Game.Player.x - this._swordWidth;
                this._y = this.Game.Player.y + (this.Game.Player.height - this._swordHeight) / 2;
                this._width = this._swordWidth;
                this._height = this._swordHeight;
            } else if (rightPressed) {
                this._x = this.Game.Player.x + this.Game.Player.width;
                this._y = this.Game.Player.y + (this.Game.Player.height - this._swordHeight) / 2;
                this._width = this._swordWidth;
                this._height = this._swordHeight;
            }
        }
    }

    reset(): void {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
    }
}
