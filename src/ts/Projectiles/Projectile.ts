import { Game } from "../Game";
import { Enemy } from "../Enemies/Enemy";

import { MovingBox } from "../Libraries/Boxes";
import { Direction } from "../Libraries/Direction";
import { StateObserver } from "../Libraries/Observers";

export enum ProjectileState {
  Moving,
  ShieldBlocked
}

export class Projectile extends MovingBox {
  Game: Game;

  speed: number;

  damage: number;

  sprites: HTMLImageElement[];

  hasPlayerCollision: boolean;
  canBeShieldBlocked: boolean;

  hasEnemiesCollision: boolean;

  state: StateObserver;

  constructor({ speed, direction }: {
    speed: number;
    direction: Direction;
  }) {
    super();

    this.speed = speed;
    this.direction = direction;

    switch (this.direction) {
      case Direction.Up:
        this.dy = -this.speed;
        break;
      case Direction.Right:
        this.dx = this.speed;
        break;
      case Direction.Down:
        this.dy = this.speed;
        break;
      case Direction.Left:
        this.dx = -this.speed;
        break;
    }

    this.sprites = [];

    this.state = new StateObserver(ProjectileState.Moving);
  }

  playerCollisionCallback(): void {
    this.Game.Player.takeDamage(this.damage);
  }

  enemiesCollisionCallback(enemy: Enemy): void {
    enemy.takeDamage(this.damage);
  }

  deleteCallback(): void { }
}
