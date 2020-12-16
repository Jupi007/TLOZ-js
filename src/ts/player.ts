class Player extends AnimatedMovingBox {
    width = 64;
    height = 64;

    speed = 5;

    isMoving = false;
    isAttack = false;

    hp = 100;
    isInvincible = false;
    invincibleTime = 0;

    score = 0;

    sprites: HTMLImageElement[][] = [];
    spritesAttack: HTMLImageElement[] = [];

    landscapeHitBox: MovingBoxLandscapeHitBox;

    constructor(game: Game) {
        super(game);

        this.x = this.Game.Landscape.cellSize;
        this.y = this.Game.Landscape.cellSize;

        this.direction = Direction.Down;

        this.landscapeHitBox = new MovingBoxLandscapeHitBox(this);

        this.animationSpeed = 8;
        this.nbAnimationStep = 2;

        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/link-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/link-up2.png");
        this.spritesAttack[Direction.Up] = SpriteLoader.load("./sprites/png/link-up-attack.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/link-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/link-right2.png");
        this.spritesAttack[Direction.Right] = SpriteLoader.load("./sprites/png/link-right-attack.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/link-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/link-down2.png");
        this.spritesAttack[Direction.Down] = SpriteLoader.load("./sprites/png/link-down-attack.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/link-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/link-left2.png");
        this.spritesAttack[Direction.Left] = SpriteLoader.load("./sprites/png/link-left-attack.png");
    }

    increaseScore(): void {
        this.score++;

        if (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol <= this.score) {
            alert("You win !");
            document.location.reload();
        }
    }

    draw(): void {
        if (this.isMoving) {
            this.requestNewFrameAnimation();
        }

        let sprite = this.isAttack
                   ? this.spritesAttack[this.direction]
                   : this.sprites[this.direction][this.currentAnimationStep];

        this.Game.Landscape.drawImage(
            sprite,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    move(): void {
        this.x += this.dx;
        this.y += this.dy;

        this.dx = 0;
        this.dy = 0;
    }

    collisions(): void {
        if (simpleMovingBoxCanvasCollision(this, this.Game.Landscape)) {
            this.Game.Landscape.changeScene(this.direction);
        }

        this.Game.Landscape.loopCollision((cell, col, row) => {
            movingBoxCollision(this.landscapeHitBox, cell);
        });
    }

    listenEvents(): void {
        if (this.Game.EventManager.isAttackPressed) {
            this.isAttack = true;
            return;
        }

        this.isAttack = false;

        if ((this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) && !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)) {
            if (this.Game.EventManager.isDownPressed) {
                this.dy = this.speed;
                this.direction = Direction.Down;
            } else if (this.Game.EventManager.isUpPressed) {
                this.dy = -this.speed;
                this.direction = Direction.Up;
            }
        } else if ((this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) && !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)) {
            if (this.Game.EventManager.isRightPressed) {
                this.dx = this.speed;
                this.direction = Direction.Right;
            } else if (this.Game.EventManager.isLeftPressed) {
                this.dx = -this.speed;
                this.direction = Direction.Left;
            }
        }

        this.isMoving =
            this.dx != 0 || this.dy != 0
            ? true
            : false
        ;
    }

    takeDamage(damage: number): void {
        if (this.isInvincible) {
            return;
        }

        if (this.hp - damage >= 0) {
            this.hp -= damage;
        } else {
            this.hp = 0;
        }

        this.setInvicibility();

        if (this.hp <= 0) {
            alert("Game Over !");
            document.location.reload();
        }
    }

    takeKnockBack(): void {
        switch (this.direction) {
            case Direction.Up:
                this.dy = this.Game.Landscape.cellSize;
                break;
            case Direction.Right:
                this.dx = -this.Game.Landscape.cellSize;
                break;
            case Direction.Down:
                this.dy = -this.Game.Landscape.cellSize;
                break;
            case Direction.Left:
                this.dx = this.Game.Landscape.cellSize;
                break;
        }

        movingBoxCanvasCollision(this, this.Game.Landscape);
        this.Game.Landscape.loopCollision((cell, col, row) => {
            movingBoxCollision(this, cell);
        });
    }

    setInvicibility(): void {
        this.isInvincible = true;
        this.invincibleTime = performance.now()
    }

    checkInvicibility(): void {
        if (this.isInvincible && this.invincibleTime + 1000 < performance.now()) {
            this.isInvincible = false;
        }
    }
}
