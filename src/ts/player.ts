class Player extends MovingBox {
    Game: Game;

    speed: number;

    isMovingObserver: StateObserver;
    isAttackObserver: StateObserver;
    isDiedObserver: StateObserver;
    isKnockbackObserver: StateObserver;

    hp: number;
    maxHp: number;

    isInvincibleObserver: StateObserver;
    invincibleDuration: number;
    invincibleAnimation: AnimationObserver;

    score: number;
    targetScore: number;

    sprites: HTMLImageElement[][] = [];
    spritesAnimation: AnimationObserver;

    attackSprites: HTMLImageElement[] = [];
    killedSprites: HTMLImageElement[] = [];
    winSprite: HTMLImageElement;

    hitBox: MovingBoxHitBox;
    halfLeftHitBox: MovingBoxHitBox;
    halfRightHitBox: MovingBoxHitBox;
    halfUpHitBox: MovingBoxHitBox;
    halfDownHitBox: MovingBoxHitBox;

    hurtSound: HTMLAudioElement;
    dieSound: HTMLAudioElement;
    lowHealthSound: HTMLAudioElement;
    getHealthSound: HTMLAudioElement;
    fanfareSound: HTMLAudioElement;

    constructor(game: Game) {
        super();

        this.Game = game;

        this.isMovingObserver = new StateObserver(false);
        this.isAttackObserver = new StateObserver(false);
        this.isInvincibleObserver = new StateObserver(false);
        this.isDiedObserver = new StateObserver(false);
        this.isKnockbackObserver = new StateObserver(false);

        this.score = 0;
        this.targetScore = 0;

        this.width = 64;
        this.height = 64;

        this.x = 0;
        this.y = 0;

        this.speed = 5;

        this.maxHp = 6;
        this.hp = this.maxHp;
        this.invincibleDuration = 200;

        this.direction = Direction.Up;

        // | -- | -- |
        // | -- | -- |
        // | ** | ** |
        // | ** | ** |

        this.hitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width,
            this.height / 2
        );

        // HalfHitBoxs are used by the passBetweenHelper() function

        // | -- | -- |
        // | -- | -- |
        // | ** | -- |
        // | ** | -- |

        this.halfLeftHitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width / 2,
            this.height / 2
        );

        // | -- | -- |
        // | -- | -- |
        // | -- | ** |
        // | -- | ** |

        this.halfRightHitBox = new MovingBoxHitBox(
            this,
            this.width / 2,
            this.height / 2,
            this.width / 2,
            this.height / 2
        );

        // | -- | -- |
        // | -- | -- |
        // | ** | ** |
        // | -- | -- |

        this.halfUpHitBox = new MovingBoxHitBox(
            this,
            0,
            this.height / 2,
            this.width,
            this.height / 4
        );

        // | -- | -- |
        // | -- | -- |
        // | -- | -- |
        // | ** | ** |

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
        this.attackSprites[Direction.Up] = SpriteLoader.load("./sprites/png/link-up-attack.png");

        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/link-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/link-right2.png");
        this.attackSprites[Direction.Right] = SpriteLoader.load("./sprites/png/link-right-attack.png");

        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/link-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/link-down2.png");
        this.attackSprites[Direction.Down] = SpriteLoader.load("./sprites/png/link-down-attack.png");

        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/link-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/link-left2.png");
        this.attackSprites[Direction.Left] = SpriteLoader.load("./sprites/png/link-left-attack.png");

        this.winSprite = SpriteLoader.load("./sprites/png/link-win.png");

        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");

        this.spritesAnimation = new AnimationObserver(6, 2);
        this.invincibleAnimation = new AnimationObserver(7, 2);

        this.hurtSound = AudioLoader.load("./sounds/effect/Link_Hurt.wav");
        this.dieSound = AudioLoader.load("./sounds/effect/Link_Die.wav");
        this.lowHealthSound = AudioLoader.load("./sounds/effect/Low_Health.wav", true);
        this.getHealthSound = AudioLoader.load("./sounds/effect/Get_Heart.wav");
        this.fanfareSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }

    get isFullLife(): boolean {
        return this.hp === this.maxHp;
    }

    draw(): void {
        let sprite = this.isAttackObserver.get()
                   ? this.attackSprites[this.direction]
                   : this.sprites[this.direction][this.spritesAnimation.currentAnimationStep];

        if (this.isInvincibleObserver.get()) {
            this.invincibleAnimation.update();
            if (this.invincibleAnimation.currentAnimationStep === 2) sprite = new Image();
        }

        this.Game.Viewport.drawImage(
            sprite,
            this.x,
            this.y,
            this.width,
            this.height
        );

        if (this.isMovingObserver.get() && !this.Game.state.is(GameState.Stopped)) {
            this.spritesAnimation.update();
        }
    }

    drawWin(): void {
        this.Game.Viewport.drawImage(
            this.winSprite,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    drawGameOver(): void {
        if (this.isDiedObserver.currentFrame <= 125) {
            if (this.isDiedObserver.currentFrame % 8 === 0) {
                switch (this.Game.Player.direction) {
                    case Direction.Up:
                        this.Game.Player.direction = Direction.Right;
                        break;
                    case Direction.Right:
                        this.Game.Player.direction = Direction.Down;
                        break;
                    case Direction.Down:
                        this.Game.Player.direction = Direction.Left;
                        break;
                    case Direction.Left:
                        this.Game.Player.direction = Direction.Up;
                        break;
                }
            }

            this.Game.Player.draw();
        }
        else if (this.isDiedObserver.currentFrame <= 135) {
            this.Game.Viewport.currentScene.drawImage(
                this.killedSprites[1],
                this.Game.Player.x,
                this.Game.Player.y,
                this.Game.Player.width,
                this.Game.Player.height
            );
        }
        else if (this.isDiedObserver.currentFrame <= 145) {
            this.Game.Viewport.currentScene.drawImage(
                this.killedSprites[2],
                this.Game.Player.x,
                this.Game.Player.y,
                this.Game.Player.width,
                this.Game.Player.height
            );
        }
        this.isDiedObserver.update();
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
        this.isAttackObserver.set(this.Game.EventManager.isAttackPressed ? true : false);

        if (
            (this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) &&
            !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)
        ) {
            if (this.Game.EventManager.isDownPressed) {
                if (this.isAttackObserver.is(false) this.dy = this.speed;
                this.direction = Direction.Down;
            }
            else if (this.Game.EventManager.isUpPressed) {
                if (this.isAttackObserver.is(false) this.dy = -this.speed;
                this.direction = Direction.Up;
            }
        }
        else if (
            (this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) &&
            !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)
        ) {
            if (this.Game.EventManager.isRightPressed) {
                if (this.isAttackObserver.is(false) this.dx = this.speed;
                this.direction = Direction.Right;
            }
            else if (this.Game.EventManager.isLeftPressed) {
                if (this.isAttackObserver.is(false) this.dx = -this.speed;
                this.direction = Direction.Left;
            }
        }

        this.isMovingObserver.set((this.dx != 0 || this.dy != 0) ? true : false);
    }

    increaseScore(): void {
        this.score++;

        if (this.score >= this.targetScore) {
            this.isInvincibleObserver.set(false);
            this.isAttackObserver.set(false);
            this.isMovingObserver.set(false);

            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.fanfareSound.play();

            this.Game.state.set(GameState.Win);
        }
    }

    takeDamage(damage: number): void {
        if (this.isInvincibleObserver.get())  return;

        this.hurtSound.play();
        this.takeKnockBack();

        if (this.hp - damage >= 0) {
            this.hp -= damage;
            this.setInvicibility();
        } else {
            this.hp = 0;
        }

        if (this.hp <= 0) {
            this.isDiedObserver.set(false);

            this.isInvincibleObserver.set(false);
            this.Game.Player.isMovingObserver.set(false);
            this.Game.Player.isAttackObserver.set(false);

            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();

            this.dieSound.play();

            this.Game.state.set(GameState.GameOver);
        }
        else if (this.hp <= 2) {
            this.lowHealthSound.play();
        }
    }

    recoverHealth(hp): void {
        this.hp += hp;

        if (this.hp > this.maxHp) this.hp = this.maxHp;
        if (this.hp > 2) {
            this.lowHealthSound.pause();
            this.lowHealthSound.currentTime = 0;
        }

        this.getHealthSound.play()
    }

    takeKnockBack(): void {
        switch (this.direction) {
            case Direction.Up:
                this.dy = this.Game.Viewport.cellSize * 2;
                break;
            case Direction.Right:
                this.dx = -this.Game.Viewport.cellSize * 2;
                break;
            case Direction.Down:
                this.dy = -this.Game.Viewport.cellSize * 2;
                break;
            case Direction.Left:
                this.dx = this.Game.Viewport.cellSize * 2;
                break;
        }

        movingBoxCanvasCollision(this, this.Game.Viewport);
        this.Game.Viewport.loopCollision((cell, col, row) => {
            movingBoxCollision(this, cell);
        });
    }

    setInvicibility(): void {
        this.isInvincibleObserver.set(true);
    }

    updateObservers(): void {
        this.isMovingObserver.update();
        this.isAttackObserver.update();
        this.isInvincibleObserver.update();

        if (this.isInvincibleObserver.get() && this.isInvincibleObserver.currentFrame > this.invincibleDuration) {
            this.isInvincibleObserver.set(false);
        }
    }
}
