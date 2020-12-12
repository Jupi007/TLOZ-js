class Player {
    private Game: Game;

    private _x: number;
    private _y: number;
    private _dx = 0;
    private _dy = 0;

    private _direction = "Down"; // TODO: Use enum Direction {Up, Right, Down, Bottom};

    private _frame = 0;
    private _animationSpeed = 20;

    private _animationStep = 1;
    private _nbAnimationStep = 2;

    private _width = 40;
    private _height = 40;

    private _speed = 2;
    private _speedUp = 3;

    private _hp = 100;
    private _isInvincible = false;
    private _invincibleTime = 0;

    private _score = 0;

    private _imgUp: Array<HTMLImageElement> = [];
    private _imgRight: Array<HTMLImageElement> = [];
    private _imgDown: Array<HTMLImageElement> = [];
    private _imgLeft: Array<HTMLImageElement> = [];

    constructor(game: Game) {
        this.Game = game;

        this._x = this.Game.Landscape.cellSize;
        this._y = this.Game.Landscape.cellSize;

        this._imgUp[1] = new Image();
        this._imgUp[1].src = "./sprites/png/link-up1.png";
        this._imgUp[2] = new Image();
        this._imgUp[2].src = "./sprites/png/link-up2.png";

        this._imgRight[1] = new Image();
        this._imgRight[1].src = "./sprites/png/link-right1.png";
        this._imgRight[2] = new Image();
        this._imgRight[2].src = "./sprites/png/link-right2.png";

        this._imgDown[1] = new Image();
        this._imgDown[1].src = "./sprites/png/link-down1.png";
        this._imgDown[2] = new Image();
        this._imgDown[2].src = "./sprites/png/link-down2.png";

        this._imgLeft[1] = new Image();
        this._imgLeft[1].src = "./sprites/png/link-left1.png";
        this._imgLeft[2] = new Image();
        this._imgLeft[2].src = "./sprites/png/link-left2.png";
    }

    get x(): number {
        return this._x;
    }

    set x(x) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y) {
        this._y = y;
    }

    get dx(): number {
        return this._dx;
    }

    set dx(dx) {
        this._dx = dx;
    }

    get dy(): number {
        return this._dy;
    }

    set dy(dy) {
        this._dy = dy;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get hp(): number {
        return this._hp;
    }

    get score(): number {
        return this._score;
    }

    increaseScore(): void {
        this._score++;

        if (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol <= this._score) {
            alert("You win !");
            document.location.reload();
        }
    }

    draw(): void {
        if (leftPressed || rightPressed || upPressed || downPressed) {
            this._frame += speedUpPressed ? 2 : 1;
        }

        if (this._frame >= this._animationSpeed) {
            this._frame = 0;
            this._animationStep = (this._animationStep+1 > this._nbAnimationStep) ? 1 : this._animationStep+1;
        }

        this.Game.ctx.beginPath();
        this.Game.ctx.drawImage(this["_img" + this._direction][this._animationStep], this._x, this._y, this._width, this._height);
        this.Game.ctx.closePath();
    }

    move(): void {
        this._x += this._dx;
        this._y += this._dy;

        this._dx = 0;
        this._dy = 0;
    }

    collisions(): void {
        if (movingBoxCanvasCollision(this, this.Game.Canvas)) {
            this.Game.changeScene();
        }
    }

    preMove(): void {
        let speed = speedUpPressed ? this._speedUp : this._speed;

        if (!(rightPressed && leftPressed)) {
            if (rightPressed) {
                this._dx = speed;
            } else if (leftPressed) {
                this._dx = -speed;
            }
        }

        if (!(downPressed && upPressed)) {
            if (downPressed) {
                this._dy = speed;
            } else if (upPressed) {
                this._dy = -speed;
            }
        }

        if (upPressed) {
            this._direction = "Up";
        } else if (downPressed) {
            this._direction = "Down";
        }else if (leftPressed) {
            this._direction = "Left";
        } else if (rightPressed) {
            this._direction = "Right";
        }
    }

    takeDamage(damage: number): void {
        if (this._isInvincible) {
            return;
        }

        if (this._hp - damage >= 0) {
            this._hp -= damage;
        } else {
            this._hp = 0;
        }

        this.setInvicibility();

        if (this._hp <= 0) {
            alert("Game Over !");
            document.location.reload();
        }
    }

    takeKnockBack(): void {
        switch (this._direction) {
            case 'Up':
                this._dy = this.Game.Landscape.cellSize;
                break;
            case 'Right':
                this._dx = -this.Game.Landscape.cellSize;
                break;
            case 'Down':
                this._dy = -this.Game.Landscape.cellSize;
                break;
            case 'Left':
                this._dx = this.Game.Landscape.cellSize;
                break;
        }
    }

    setInvicibility(): void {
        this._isInvincible = true;
        this._invincibleTime = performance.now()
    }

    checkInvicibility(): void {
        if (this._isInvincible && this._invincibleTime + 1000 < performance.now()) {
            this._isInvincible = false;
        }
    }
}
