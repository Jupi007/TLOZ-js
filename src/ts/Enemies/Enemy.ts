import { Game } from "../Game";

import { MovingBox } from "../Libraries/Boxes";
import { Random } from "../Libraries/Random";
import { StateObserver, AnimationObserver } from "../Libraries/Observers";

import { Heart } from "../Items/Heart";

export enum EnemyState {
  Moving,
  ChangeDirection,
  Wait,
  Attack,
  Killed
}

export class Enemy extends MovingBox {
  Game: Game;

  hp: number;
  speed: number;
  damage: number;

  isKilledAnimationFinished: boolean;

  hasPlayerCollision: boolean;
  hasViewportCollision: boolean;
  hasBricksCollisions: boolean;
  requirePassBetweenBoxHelper: boolean;

  spritesAnimation: AnimationObserver;

  killedSprites: HTMLImageElement[] = [];

  invincibleObserver: StateObserver;
  invincibleDuration: number;
  invincibleAnimation: AnimationObserver;

  state: StateObserver;

  dieSound: HTMLAudioElement;
  hitSound: HTMLAudioElement;

  constructor(game: Game) {
    super();

    this.Game = game;

    this.hasPlayerCollision = true;
    this.hasViewportCollision = true;
    this.hasBricksCollisions = true;
    this.requirePassBetweenBoxHelper = false;

    this.isKilledAnimationFinished = false;

    this.killedSprites[1] = this.Game.AssetManager.getImage("./sprites/png/killed1.png");
    this.killedSprites[2] = this.Game.AssetManager.getImage("./sprites/png/killed2.png");

    this.invincibleObserver = new StateObserver(false);
    this.invincibleDuration = 25;
    this.invincibleAnimation = new AnimationObserver(7, 2);

    this.dieSound = this.Game.AssetManager.getSound("./sounds/effect/Enemy_Die.wav");
    this.hitSound = this.Game.AssetManager.getSound("./sounds/effect/Enemy_Hit.wav");
  }

  aiThinking(): void { }
  move(): void {
    this.y += this.dy;
    this.x += this.dx;
    this.dx = 0;
    this.dy = 0;
  }

  draw(): void { }

  playerCollision(): void {
    this.Game.Player.takeDamage(this.damage);
  }
  viewportCollision(): void { }
  bricksCollision(): void { }
  customCollision(): void { }
  moveHelper(): boolean {
    return false;
  }

  takeDamage(damage): void {
    if (this.invincibleObserver.is(true) || this.state.is(EnemyState.Killed))
      return;

    this.hp -= damage;

    if (this.hp <= 0) {
      this.dieSound.play();
      this.state.setNextState(EnemyState.Killed);
      return;
    }

    this.getInvicibility();
    this.hitSound.play();
  }

  getInvicibility(): void {
    this.invincibleObserver.setNextState(true);
  }

  dropItem(): boolean {
    if (this.Game.Player.hp < this.Game.Player.maxHp && Random.getOneInt(3)) {
      this.Game.ItemManager.addItem(
        new Heart({
          game: this.Game,
          x: this.x + this.width / 2 - 24 / 2,
          y: this.y + this.height / 2 - 24 / 2
        })
      );
      return true;
    }

    return false;
  }
}


