import { Game } from "../Game";

import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";

import { Projectile, ProjectileState } from "../Projectiles/Projectile";

export class ProjectileManager {
  Game: Game;

  projectiles: Projectile[];

  shieldSound: HTMLAudioElement;

  constructor(game: Game) {
    this.Game = game;

    this.projectiles = [];

    this.shieldSound = this.Game.AssetManager.getSound("./sounds/effect/Shield.wav");
  }

  collisions(): void {
    this.loopProjectiles((projectile: Projectile) => {
      if (projectile.state.is(ProjectileState.ShieldBlocked)) return;

      if (projectile.hasEnemiesCollision) {
        this.Game.EnemyManager.loopEnemies((enemy) => {
          if (Collisions.movingBoxs(enemy, projectile.hitBox)) {
            if (projectile.enemiesCollisionCallback !== null)
              projectile.enemiesCollisionCallback(enemy);
            this.deleteProjectile(projectile);
          }
        });
      }

      if (projectile.hasPlayerCollision) {
        if (Collisions.movingBoxs(this.Game.Player.hitBox, projectile.hitBox)) {
          if (
            projectile.canBeShieldBlocked &&
            this.Game.Player.movingObserver.is(false) &&
            this.Game.Player.attackObserver.is(false) &&
            Direction.areOpposite(
              this.Game.Player.direction,
              projectile.direction
            )
          ) {
            this.shieldSound.play();
            projectile.state.setNextState(ProjectileState.ShieldBlocked);
            return;
          }

          if (projectile.playerCollisionCallback !== null)
            projectile.playerCollisionCallback();
          this.deleteProjectile(projectile);
        }
      }

      if (Collisions.movingBoxCanvas(projectile.hitBox, this.Game.Viewport)) {
        this.deleteProjectile(projectile);
      }
    });
  }

  move(): void {
    this.loopProjectiles((projectile: Projectile) => {
      switch (projectile.state.get()) {
        case ProjectileState.Moving:
          projectile.x += projectile.dx * this.Game.dt;
          projectile.y += projectile.dy * this.Game.dt;
          break;

        case ProjectileState.ShieldBlocked:
          if (Direction.isVertical(projectile.direction)) {
            projectile.x += (projectile.dy / 2) * this.Game.dt;
            projectile.y -= (projectile.dy / 2) * this.Game.dt;
          } else {
            projectile.x -= (projectile.dx / 2) * this.Game.dt;
            projectile.y += (projectile.dx / 2) * this.Game.dt;
          }
          break;
      }
    });
  }

  draw(): void {
    this.loopProjectiles((projectile: Projectile) => {
      this.Game.Viewport.currentScene.drawImage({
        sprite: projectile.sprites[projectile.direction],
        x: projectile.x,
        y: projectile.y,
        width: projectile.width,
        height: projectile.height
      });
    });
  }

  updateObservers(): void {
    this.loopProjectiles((projectile: Projectile) => {
      projectile.state.update(this.Game.dt);

      if (
        projectile.state.is(ProjectileState.ShieldBlocked) &&
        projectile.state.currentFrame > 20
      ) {
        this.deleteProjectile(projectile);
      }
    });
  }

  addProjectile(projectile: Projectile): void {
    this.projectiles.push(projectile);
  }

  deleteProjectile(projectile: Projectile): void {
    if (projectile.deleteCallback !== null) projectile.deleteCallback();
    this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
  }

  deleteAllProjectiles(): void {
    this.loopProjectiles((projectile: Projectile) => {
      if (projectile.deleteCallback !== null) projectile.deleteCallback();
    });

    this.projectiles = [];
  }

  loopProjectiles(callback: Function): void {
    this.projectiles.forEach((projectile: Projectile) => {
      callback(projectile);
    });
  }
}
