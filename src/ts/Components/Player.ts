import { Game, GameState } from "../Game";
import { Item } from "../Items/Item";

import {
  MovingBox,
  MovingBoxHitBox,
  MovingBoxHalfHitBoxes
} from "../Libraries/Boxes";
import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";
import { StateObserver, AnimationObserver } from "../Libraries/Observers";

export class Player extends MovingBox {
  Game: Game;

  speed: number;

  movingObserver: StateObserver;
  attackObserver: StateObserver;

  diedObserver: StateObserver;
  diedAnimation: AnimationObserver;

  hp: number;
  maxHp: number;

  invincibleObserver: StateObserver;
  defaultInvincibleDuration: number;
  invincibleDuration: number;
  invincibleAnimation: AnimationObserver;

  knockBackObserver: StateObserver;
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

  halfHitBoxes: MovingBoxHalfHitBoxes;

  hurtSound: HTMLAudioElement;
  dieSound: HTMLAudioElement;
  lowHealthSound: HTMLAudioElement;
  fanfareSound: HTMLAudioElement;

  constructor(game: Game) {
    super();

    this.Game = game;

    this.movingObserver = new StateObserver(false);
    this.attackObserver = new StateObserver(false);

    this.diedObserver = new StateObserver(false);
    this.diedAnimation = new AnimationObserver(8, 4);

    this.invincibleObserver = new StateObserver(false);
    this.defaultInvincibleDuration = 150;
    this.invincibleDuration = 0;

    this.knockBackObserver = new StateObserver(false);
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

    this.hitBox = new MovingBoxHitBox({
      box: this,
      x: 0,
      y: this.height / 2,
      width: this.width,
      height: this.height / 2
    });

    this.halfHitBoxes = new MovingBoxHalfHitBoxes(this.hitBox);

    this.sprites[Direction.Up] = [];
    this.sprites[Direction.Up][1] = this.Game.AssetManager.getImage(
      "./sprites/png/link-up1.png"
    );
    this.sprites[Direction.Up][2] = this.Game.AssetManager.getImage(
      "./sprites/png/link-up2.png"
    );
    this.attackSprites[Direction.Up] = this.Game.AssetManager.getImage(
      "./sprites/png/link-up-attack.png"
    );

    this.sprites[Direction.Right] = [];
    this.sprites[Direction.Right][1] = this.Game.AssetManager.getImage(
      "./sprites/png/link-right1.png"
    );
    this.sprites[Direction.Right][2] = this.Game.AssetManager.getImage(
      "./sprites/png/link-right2.png"
    );
    this.attackSprites[Direction.Right] = this.Game.AssetManager.getImage(
      "./sprites/png/link-right-attack.png"
    );

    this.sprites[Direction.Down] = [];
    this.sprites[Direction.Down][1] = this.Game.AssetManager.getImage(
      "./sprites/png/link-down1.png"
    );
    this.sprites[Direction.Down][2] = this.Game.AssetManager.getImage(
      "./sprites/png/link-down2.png"
    );
    this.attackSprites[Direction.Down] = this.Game.AssetManager.getImage(
      "./sprites/png/link-down-attack.png"
    );

    this.sprites[Direction.Left] = [];
    this.sprites[Direction.Left][1] = this.Game.AssetManager.getImage(
      "./sprites/png/link-left1.png"
    );
    this.sprites[Direction.Left][2] = this.Game.AssetManager.getImage(
      "./sprites/png/link-left2.png"
    );
    this.attackSprites[Direction.Left] = this.Game.AssetManager.getImage(
      "./sprites/png/link-left-attack.png"
    );

    this.winSprite = this.Game.AssetManager.getImage("./sprites/png/link-win.png");

    this.killedSprites[1] = this.Game.AssetManager.getImage("./sprites/png/killed1.png");
    this.killedSprites[2] = this.Game.AssetManager.getImage("./sprites/png/killed2.png");

    this.spritesAnimation = new AnimationObserver(6, 2);
    this.invincibleAnimation = new AnimationObserver(5, 2);

    this.hurtSound = this.Game.AssetManager.getSound("./sounds/effect/Link_Hurt.wav");
    this.dieSound = this.Game.AssetManager.getSound("./sounds/effect/Link_Die.wav");
    this.lowHealthSound = this.Game.AssetManager.getSound("./sounds/effect/Low_Health.wav", true);
    this.fanfareSound = this.Game.AssetManager.getSound("./sounds/effect/Fanfare.wav");
  }

  get isFullLife(): boolean {
    return this.hp === this.maxHp;
  }

  draw(): void {
    let sprite = this.attackObserver.get()
      ? this.attackSprites[this.direction]
      : this.sprites[this.direction][
      this.spritesAnimation.currentAnimationStep
      ];

    if (this.invincibleObserver.get()) {
      this.invincibleAnimation.update(this.Game.dt);
      if (this.invincibleAnimation.currentAnimationStep === 2)
        sprite = new Image();
    }

    this.Game.Viewport.drawImage({
      sprite,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    });

    if (
      this.movingObserver.is(true) &&
      !this.Game.state.is(GameState.Stopped)
    ) {
      this.spritesAnimation.update(this.Game.dt);
    }
  }

  drawWin(): void {
    this.Game.Viewport.drawImage({
      sprite: this.winSprite,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    });
  }

  drawGameOver(): void {
    if (this.diedObserver.currentFrame <= 125) {
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
    } else if (this.diedObserver.currentFrame <= 145) {
      let sprite: HTMLImageElement;

      if (this.diedObserver.currentFrame <= 135) {
        sprite = this.killedSprites[1];
      }
      else {
        sprite = this.killedSprites[2];
      }

      this.Game.Viewport.currentScene.drawImage({
        sprite,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      });
    }
    this.diedObserver.update(this.Game.dt);
  }

  move(): void {
    this.x += this.dx;
    this.y += this.dy;

    this.dx = 0;
    this.dy = 0;
  }

  collisions(): void { }

  listenEvents(): void {
    if (this.knockBackObserver.is(true)) {
      this.movingObserver.setNextState(false);
      this.attackObserver.setNextState(false);

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

      Collisions.movingBoxCanvas(this.hitBox, this.Game.Viewport);
      return;
    }

    if (this.Game.Sword.isEnabled)
      this.attackObserver.setNextState(this.Game.EventManager.isAttackPressed);

    if (
      (this.Game.EventManager.isDownPressed ||
        this.Game.EventManager.isUpPressed) &&
      !(
        this.Game.EventManager.isDownPressed &&
        this.Game.EventManager.isUpPressed
      )
    ) {
      if (this.Game.EventManager.isDownPressed) {
        if (this.attackObserver.is(false)) this.dy = this.speed * this.Game.dt;
        this.direction = Direction.Down;
      } else if (this.Game.EventManager.isUpPressed) {
        if (this.attackObserver.is(false)) this.dy = -this.speed * this.Game.dt;
        this.direction = Direction.Up;
      }
    } else if (
      (this.Game.EventManager.isRightPressed ||
        this.Game.EventManager.isLeftPressed) &&
      !(
        this.Game.EventManager.isRightPressed &&
        this.Game.EventManager.isLeftPressed
      )
    ) {
      if (this.Game.EventManager.isRightPressed) {
        if (this.attackObserver.is(false)) this.dx = this.speed * this.Game.dt;
        this.direction = Direction.Right;
      } else if (this.Game.EventManager.isLeftPressed) {
        if (this.attackObserver.is(false)) this.dx = -this.speed * this.Game.dt;
        this.direction = Direction.Left;
      }
    }

    this.movingObserver.setNextState(this.dx != 0 || this.dy != 0);
  }

  increaseScore(): void {
    this.score++;

    if (this.score >= this.targetScore) {
      this.invincibleObserver.setNextState(false);
      this.attackObserver.setNextState(false);
      this.movingObserver.setNextState(false);

      this.Game.Viewport.music.pause();
      this.lowHealthSound.pause();
      this.fanfareSound.play();

      this.Game.state.setNextState(GameState.Win);
    }
  }

  takeDamage(damage: number): void {
    if (this.invincibleObserver.get()) return;

    this.hurtSound.play();
    this.takeKnockBack();

    if (this.hp - damage >= 0) {
      this.hp -= damage;
      this.getInvicibility();
    } else {
      this.hp = 0;
    }

    if (this.hp <= 0) {
      this.diedObserver.setNextState(false);

      this.invincibleObserver.setNextState(false);
      this.movingObserver.setNextState(false);
      this.attackObserver.setNextState(false);

      this.Game.Viewport.music.pause();
      this.lowHealthSound.pause();

      this.dieSound.play();

      this.Game.state.setNextState(GameState.GameOver);
    } else if (this.hp <= 2) {
      this.lowHealthSound.play();
    }
  }

  recoverHealth(hp: number = this.maxHp): void {
    this.hp += hp;

    if (this.hp > this.maxHp) this.hp = this.maxHp;
    if (this.hp > 2) {
      this.lowHealthSound.pause();
      this.lowHealthSound.currentTime = 0;
    }
  }

  takeKnockBack(direction: Direction = this.direction): void {
    this.direction = direction;
    this.knockBackObserver.setNextState(true);
  }

  getInvicibility(duration: number = this.defaultInvincibleDuration): void {
    this.invincibleDuration = duration;
    this.invincibleObserver.setNextState(true);
  }

  getImportantItem(item: Item) {
    this.obtainedItem = item;

    this.Game.Viewport.music.pause();
    this.Game.Viewport.music.currentTime = 0;

    this.Game.useCustomLoop(() => this.getImportantItemLoop());
  }

  getImportantItemDraw() {
    this.Game.Viewport.drawImage({
      sprite: this.winSprite,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    });
    this.Game.Viewport.drawImage({
      sprite: this.obtainedItem.sprite,
      x: this.x,
      y: this.y - this.obtainedItem.height,
      width: this.obtainedItem.width,
      height: this.obtainedItem.height
    });

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
    this.movingObserver.update(this.Game.dt);
    this.attackObserver.update(this.Game.dt);
    this.invincibleObserver.update(this.Game.dt);
    this.knockBackObserver.update(this.Game.dt);

    if (
      this.knockBackObserver.is(true) &&
      this.knockBackObserver.currentFrame > this.knockBackDuration
    ) {
      this.knockBackObserver.setNextState(false);
    }

    if (
      this.invincibleObserver.get() &&
      this.invincibleObserver.currentFrame > this.invincibleDuration
    ) {
      this.invincibleObserver.setNextState(false);
    }
  }
}
