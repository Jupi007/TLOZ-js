class Player extends MovingBox {
    Game: Game;

    width: number;
    height: number;

    speed: number;

    isMoving: boolean;
    isAttack: boolean;

    hp: number;
    maxHp: number;

    isInvincible: boolean;
    invincibleTime: number;
    invincibleDuration: number;
    invincibleAnimation: GameAnimation;

    score: number;

    sprites: HTMLImageElement[][] = [];
    spritesAttack: HTMLImageElement[] = [];
    spritesAnimation: GameAnimation;

    hitBox: MovingBoxHitBox;
    halfLeftHitBox: MovingBoxHitBox;
    halfRightHitBox: MovingBoxHitBox;
    halfUpHitBox: MovingBoxHitBox;
    halfDownHitBox: MovingBoxHitBox;

    hurtSound: HTMLAudioElement;
    dieSound: HTMLAudioElement;
    lowHealthSound: HTMLAudioElement;

    constructor(game: Game) {
        super();

        this.Game = game;

        this.isMoving = false;
        this.isAttack = false;
        this.isInvincible = false;

        this.score = 0;

        this.width = 64;
        this.height = 64;

        this.x = 0;
        this.y = 0;

        this.speed = 5;

        this.maxHp = 6;
        this.hp = this.maxHp;
        this.invincibleDuration = 2000;

        this.direction = Direction.Down;

        this.hitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width,
            this.height / 2
        );

        // HalfHitBoxs are used by the passBetweenHelper() function

        this.halfLeftHitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width / 2,
            this.height / 2
        );

        this.halfRightHitBox = new MovingBoxHitBox(
            this,
            this.width / 2,
            this.height / 2,
            this.width / 2,
            this.height / 2
        );

        this.halfUpHitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width,
            this.height / 4
        );

        this.halfDownHitBox = new MovingBoxHitBox(
            this,
            0,
            (this.height / 4) * 3,
            this.width,
            this.height / 4
        );

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

        this.spritesAnimation = new GameAnimation(6, 2);
        this.invincibleAnimation = new GameAnimation(7, 2);

        this.hurtSound = AudioLoader.load("./sounds/effect/Link_Hurt.wav");
        this.dieSound = AudioLoader.load("./sounds/effect/Link_Die.wav");
        this.lowHealthSound = AudioLoader.load("./sounds/effect/Low_Health.wav", true);
    }

    increaseScore(): void {
        this.score++;

        if (this.Game.World.nbRow * this.Game.World.nbCol <= this.score) {
            this.isInvincible = false;
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.Game.status = GameStatus.Win;
        }
    }

    draw(): void {
        if (this.isMoving && this.Game.status !== GameStatus.Stopped) {
            this.spritesAnimation.requestNewFrameAnimation();
        }

        let sprite = this.isAttack
                   ? this.spritesAttack[this.direction]
                   : this.sprites[this.direction][this.spritesAnimation.currentAnimationStep];

        if (this.isInvincible) {
            this.invincibleAnimation.requestNewFrameAnimation();
            if (this.invincibleAnimation.currentAnimationStep === 2) sprite = new Image();
        }

        this.Game.Viewport.drawImage(
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

    slideSceneAnimationMove(): void {
        if (this.Game.Viewport.dc === 1) {
            this.dx = -this.Game.Viewport.slideSceneAnimationSpeed;
        } else if (this.Game.Viewport.dc === -1) {
            this.dx = this.Game.Viewport.slideSceneAnimationSpeed;
        } else if (this.Game.Viewport.dr === 1) {
            this.dy = -this.Game.Viewport.slideSceneAnimationSpeed;
        } else if (this.Game.Viewport.dr === -1) {
            this.dy = this.Game.Viewport.slideSceneAnimationSpeed;
        }

        movingBoxCanvasCollision(this, this.Game.Viewport);
        this.isMoving = true;
        this.move();
    }

    // Helper to pass between two boxes
    passBetweenBoxesHelper(): void {
        let halfLeftCollision = false;
        let halfRightCollision = false;
        let halfUpCollision = false;
        let halfDownCollision = false;

        this.Game.Viewport.loopCollision((cell, col, row) => {
            if (simpleMovingBoxCollision(this.halfLeftHitBox, cell)) {
                halfLeftCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfRightHitBox, cell)) {
                halfRightCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfUpHitBox, cell)) {
                halfUpCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfDownHitBox, cell)) {
                halfDownCollision = true;
            }
        });

        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            if (halfLeftCollision && !halfRightCollision) {
                this.dx = this.speed;
            }
            else if (!halfLeftCollision && halfRightCollision) {
                this.dx = -this.speed;
            }
        } else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            if (halfUpCollision && !halfDownCollision) {
                this.dy = this.speed;
            }
            else if (!halfUpCollision && halfDownCollision) {
                this.dy = -this.speed;
            }
        }
    }

    collisions(): void {
        if (movingBoxCanvasCollision(this, this.Game.Viewport)) {
            this.Game.Viewport.slideScene(this.direction);
        }

        this.passBetweenBoxesHelper();

        this.Game.Viewport.loopCollision((cell, col, row) => {
            movingBoxCollision(this.hitBox, cell);
        });
    }

    listenEvents(): void {
        this.isAttack = this.Game.EventManager.isAttackPressed
                      ? true
                      : false;

        if (
            (this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) &&
            !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)
        ) {
            if (this.Game.EventManager.isDownPressed) {
                if (!this.Game.EventManager.isAttackPressed) this.dy = this.speed;
                this.direction = Direction.Down;
            }
            else if (this.Game.EventManager.isUpPressed) {
                if (!this.Game.EventManager.isAttackPressed) this.dy = -this.speed;
                this.direction = Direction.Up;
            }
        }
        else if (
            (this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) &&
            !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)
        ) {
            if (this.Game.EventManager.isRightPressed) {
                if (!this.Game.EventManager.isAttackPressed) this.dx = this.speed;
                this.direction = Direction.Right;
            }
            else if (this.Game.EventManager.isLeftPressed) {
                if (!this.Game.EventManager.isAttackPressed) this.dx = -this.speed;
                this.direction = Direction.Left;
            }
        }

        this.isMoving = this.dx != 0 || this.dy != 0
                      ? true
                      : false;
    }

    takeDamage(damage: number): void {
        if (this.isInvincible)  return;

        if (this.hp - damage >= 0) {
            this.hurtSound.play();
            this.hp -= damage;
        } else {
            this.hp = 0;
        }

        this.setInvicibility();

        if (this.hp <= 0) {
            this.isInvincible = false;
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.dieSound.play();
            this.Game.status = GameStatus.GameOver;
        }
        else if (this.hp <= 2) {
            this.lowHealthSound.play();
        }
    }

    takeKnockBack(): void {
        switch (this.direction) {
            case Direction.Up:
                this.dy = this.Game.Viewport.cellSize;
                break;
            case Direction.Right:
                this.dx = -this.Game.Viewport.cellSize;
                break;
            case Direction.Down:
                this.dy = -this.Game.Viewport.cellSize;
                break;
            case Direction.Left:
                this.dx = this.Game.Viewport.cellSize;
                break;
        }

        movingBoxCanvasCollision(this, this.Game.Viewport);
        this.Game.Viewport.loopCollision((cell, col, row) => {
            movingBoxCollision(this, cell);
        });
    }

    setInvicibility(): void {
        this.isInvincible = true;
        this.invincibleTime = performance.now()
    }

    reset(): void {
        this.isMoving = false;

        if (this.isInvincible && this.invincibleTime + this.invincibleDuration < performance.now()) {
            this.isInvincible = false;
        }
    }
}
