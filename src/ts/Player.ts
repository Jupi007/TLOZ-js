import { Game, GameState } from "./Game.js";
import { Item } from "./Items.js";

import { MovingBox, MovingBoxHitBox, MovingBoxHalfHitBoxes } from "./Libraries/Boxes.js";
import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Collisions } from "./Libraries/Collisions.js";
import { StateObserver, AnimationObserver } from "./Libraries/Observers.js";

export class Player extends MovingBox {
    Game: Game;

    speed: number;

    isMovingObserver: StateObserver;
    isAttackObserver: StateObserver;

    isDiedObserver: StateObserver;
    diedAnimation: AnimationObserver;

    hp: number;
    maxHp: number;

    isInvincibleObserver: StateObserver;
    defaultInvincibleDuration: number;
    invincibleDuration: number;
    invincibleAnimation: AnimationObserver;

    isKnockBackObserver: StateObserver;
    knockBackSpeed: number;
    knockBackDuration: number;

    score: number;
    targetScore: number;

    obtainedItem: Item;

    sprites: HTMLImageElement[][] = [];
    spritesAnimation: AnimationObserver;

    attackSprites: HTMLImageElement[] = [];
    killedSprites: HTMLImageElement[] = [];
    winSprite: HTMLImageElement;

    hitBox: MovingBoxHitBox;
    halfHitBoxes: MovingBoxHalfHitBoxes;

    hurtSound: HTMLAudioElement;
    dieSound: HTMLAudioElement;
    lowHealthSound: HTMLAudioElement;
    fanfareSound: HTMLAudioElement;

    constructor(game: Game) {
        super();

        this.Game = game;

        this.isMovingObserver = new StateObserver(false);
        this.isAttackObserver = new StateObserver(false);

        this.isDiedObserver = new StateObserver(false);
        this.diedAnimation = new AnimationObserver(8, 4);

        this.isInvincibleObserver = new StateObserver(false);
        this.defaultInvincibleDuration = 150;
        this.invincibleDuration = 0;

        this.isKnockBackObserver = new StateObserver(false);
        this.knockBackDuration = 10;
        this.knockBackSpeed = 15;

        this.score = 0;
        this.targetScore = 0;

        this.width = 64;
        this.height = 64;

        this.x = 0;
        this.y = 0;

        this.speed = 5;

        this.maxHp = 6;
        this.hp = this.maxHp;

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

        this.halfHitBoxes = new MovingBoxHalfHitBoxes(this.hitBox);

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
            this.invincibleAnimation.update(this.Game.dt);
            if (this.invincibleAnimation.currentAnimationStep === 2) sprite = new Image();
        }

        this.Game.Viewport.drawImage(
            sprite,
            this.x,
            this.y,
            this.width,
            this.height
        );

        if (this.isMovingObserver.is(true) && !this.Game.state.is(GameState.Stopped)) {
            this.spritesAnimation.update(this.Game.dt);
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
            switch (this.diedAnimation.currentAnimationStep) {
                case 1:
                    this.direction = Direction.Down;
                    break;
                case 2:
                    this.direction = Direction.Left;
                    break;
                case 3:
                    this.direction = Direction.Up;
                    break;
                case 4:
                    this.direction = Direction.Right;
                    break;
            }

            this.draw();
            this.diedAnimation.update(this.Game.dt);
        }
        else if (this.isDiedObserver.currentFrame <= 135) {
            this.Game.Viewport.currentScene.drawImage(
                this.killedSprites[1],
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        else if (this.isDiedObserver.currentFrame <= 145) {
            this.Game.Viewport.currentScene.drawImage(
                this.killedSprites[2],
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        this.isDiedObserver.update(this.Game.dt);
    }

    move(): void {
        this.x += this.dx;
        this.y += this.dy;

        this.dx = 0;
        this.dy = 0;
    }

    collisions(): void {}

    listenEvents(): void {
        if (this.isKnockBackObserver.is(true)) {
            this.isMovingObserver.setNextState(false);
            this.isAttackObserver.setNextState(false);

            switch (this.direction) {
                case Direction.Up:
                    this.dy = this.knockBackSpeed * this.Game.dt;
                    break;
                case Direction.Right:
                    this.dx = -this.knockBackSpeed * this.Game.dt;
                    break;
                case Direction.Down:
                    this.dy = -this.knockBackSpeed * this.Game.dt;
                    break;
                case Direction.Left:
                    this.dx = this.knockBackSpeed * this.Game.dt;
                    break;
            }

            Collisions.movingBoxCanvas(this.hitbox, this.Game.Viewport);
            return;
        }

        if (this.Game.Sword.isEnabled) this.isAttackObserver.setNextState(this.Game.EventManager.isAttackPressed);

        if (
            (this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) &&
            !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)
        ) {
            if (this.Game.EventManager.isDownPressed) {
                if (this.isAttackObserver.is(false)) this.dy = this.speed * this.Game.dt;
                this.direction = Direction.Down;
            }
            else if (this.Game.EventManager.isUpPressed) {
                if (this.isAttackObserver.is(false)) this.dy = -this.speed * this.Game.dt;
                this.direction = Direction.Up;
            }
        }
        else if (
            (this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) &&
            !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)
        ) {
            if (this.Game.EventManager.isRightPressed) {
                if (this.isAttackObserver.is(false)) this.dx = this.speed * this.Game.dt;
                this.direction = Direction.Right;
            }
            else if (this.Game.EventManager.isLeftPressed) {
                if (this.isAttackObserver.is(false)) this.dx = -this.speed * this.Game.dt;
                this.direction = Direction.Left;
            }
        }

        this.isMovingObserver.setNextState((this.dx != 0 || this.dy != 0));
    }

    increaseScore(): void {
        this.score++;

        if (this.score >= this.targetScore) {
            this.isInvincibleObserver.setNextState(false);
            this.isAttackObserver.setNextState(false);
            this.isMovingObserver.setNextState(false);

            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.fanfareSound.play();

            this.Game.state.setNextState(GameState.Win);
        }
    }

    takeDamage(damage: number): void {
        if (this.isInvincibleObserver.get())  return;

        this.hurtSound.play();
        this.takeKnockBack();

        if (this.hp - damage >= 0) {
            this.hp -= damage;
            this.getInvicibility();
        } else {
            this.hp = 0;
        }

        if (this.hp <= 0) {
            this.isDiedObserver.setNextState(false);

            this.isInvincibleObserver.setNextState(false);
            this.isMovingObserver.setNextState(false);
            this.isAttackObserver.setNextState(false);

            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();

            this.dieSound.play();

            this.Game.state.setNextState(GameState.GameOver);
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
    }

    takeKnockBack(direction: Direction = this.direction): void {
        this.direction = direction;
        this.isKnockBackObserver.setNextState(true);
    }

    getInvicibility(duration: number = this.defaultInvincibleDuration): void {
        this.invincibleDuration = duration;
        this.isInvincibleObserver.setNextState(true);
    }
    
    getImportantItem(item: Item) {
        this.obtainedItem = item;

        this.Game.Viewport.music.pause();
        this.Game.Viewport.music.currentTime = 0;

        this.Game.useCustomLoop(() => this.getImportantItemLoop());
    }

    getImportantItemDraw() {
        this.Game.Viewport.drawImage(
            this.winSprite,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.Game.Viewport.drawImage(
            this.obtainedItem.sprite,
            this.x,
            this.y - this.obtainedItem.height,
            this.obtainedItem.width,
            this.obtainedItem.height
        );

        if (this.Game.state.currentFrame > 120) {
            this.Game.Viewport.music.play();
            this.Game.state.setNextState(GameState.Run);
        }        
    }

    getImportantItemLoop(): void {
        this.Game.drawGameWithoutPlayer();
        this.getImportantItemDraw();
    }

    updateObservers(): void {
        this.isMovingObserver.update(this.Game.dt);
        this.isAttackObserver.update(this.Game.dt);
        this.isInvincibleObserver.update(this.Game.dt);
        this.isKnockBackObserver.update(this.Game.dt);

        if (this.isKnockBackObserver.is(true) && this.isKnockBackObserver.currentFrame > this.knockBackDuration) {
            this.isKnockBackObserver.setNextState(false);
        }

        if (this.isInvincibleObserver.get() && this.isInvincibleObserver.currentFrame > this.invincibleDuration) {
            this.isInvincibleObserver.setNextState(false);
        }
    }
}
