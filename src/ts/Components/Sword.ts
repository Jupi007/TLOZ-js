import { Game } from "../Game";

import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";
import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";

import { Sword as SwordProjectile } from "../Projectiles/Sword";
import { SimpleBox } from "../Libraries/Boxes";
import { Enemy } from "../Enemies/Enemy";

export class Sword extends SimpleBox {
  Game: Game;

  swordWidth: number;
  swordHeight: number;

  swordHandleWidth: number;

  sprites: HTMLImageElement[] = [];

  slashSound: HTMLAudioElement;
  flyingSound: HTMLAudioElement;

  isFlying: boolean;
  isEnabled: boolean;

  damage: number;

  hasHit: boolean;

  constructor(game: Game) {
    super();

    this.Game = game;

    this.swordWidth = 64;
    this.swordHeight = 28;
    this.swordHandleWidth = 16;

    this.sprites[Direction.Up] = SpriteLoader.load(
      "./sprites/png/sword-up.png"
    );
    this.sprites[Direction.Right] = SpriteLoader.load(
      "./sprites/png/sword-right.png"
    );
    this.sprites[Direction.Down] = SpriteLoader.load(
      "./sprites/png/sword-down.png"
    );
    this.sprites[Direction.Left] = SpriteLoader.load(
      "./sprites/png/sword-left.png"
    );

    this.slashSound = AudioLoader.load("./sounds/effect/Sword_Slash.wav");
    this.flyingSound = AudioLoader.load("./sounds/effect/Sword_Shoot.wav");

    this.isFlying = false;
    this.isEnabled = false;

    this.damage = 1;

    this.hasHit = false;
  }

  get direction(): number {
    return this.Game.Player.direction;
  }

  get x(): number {
    if (this.direction === Direction.Up) {
      return (
        this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2
      );
    } else if (this.direction === Direction.Down) {
      return (
        this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2
      );
    } else if (this.direction === Direction.Left) {
      return this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
    }
    return this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
  }

  get y(): number {
    if (this.direction === Direction.Up) {
      return this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
    } else if (this.direction === Direction.Down) {
      return (
        this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth
      );
    } else if (this.direction === Direction.Left) {
      return (
        this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2
      );
    }

    return (
      this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2
    );
  }

  get width(): number {
    if (this.direction === Direction.Up || this.direction === Direction.Down) {
      return this.swordHeight;
    }

    return this.swordWidth;
  }

  get height(): number {
    if (this.direction === Direction.Up || this.direction === Direction.Down) {
      return this.swordWidth;
    }

    return this.swordHeight;
  }

  draw(): void {
    if (!this.isEnabled) return;

    if (this.Game.Player.attackObserver.get()) {
      this.Game.Viewport.drawImage({
        sprite: this.sprites[this.direction],
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      });
    }
  }

  drawWin(): void {
    this.Game.Viewport.drawImage({
      sprite: this.sprites[Direction.Up],
      x: this.Game.Player.x,
      y: this.Game.Player.y - this.swordWidth,
      width: this.swordHeight,
      height: this.swordWidth
    });
  }

  collisions(): void {
    if (!this.isEnabled) return;

    if (this.Game.Player.attackObserver.get()) {
      this.Game.EnemyManager.loopEnemies((enemy: Enemy) => {
        if (Collisions.simpleMovingBox(enemy.hitBox, this)) {
          enemy.takeDamage(this.damage);
          this.hasHit = true;
        }
      });
    }
  }

  listenEvents(): void {
    if (!this.isEnabled) return;

    if (
      this.Game.Player.attackObserver.get() &&
      this.Game.Player.attackObserver.isFirstFrame
    ) {
      this.slashSound.play();
      this.hasHit = false;
    }

    if (
      !this.isFlying &&
      this.Game.Player.attackObserver.getLastFrame() &&
      !this.Game.Player.attackObserver.get() &&
      !this.hasHit &&
      this.Game.Player.isFullLife
    ) {
      this.flyingSound.play();

      this.isFlying = true;

      this.Game.ProjectileManager.addProjectile(
        new SwordProjectile({
          game: this.Game,
          x: this.x,
          y: this.y,
          speed: this.Game.Player.speed * 3,
          direction: this.direction,
          damage: this.damage
        })
      );
    }
  }
}
