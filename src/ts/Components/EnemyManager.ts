import { Game, GameState } from "../Game";

import { Collisions } from "../Libraries/Collisions";

import { Enemy, EnemyState } from "../Enemies/Enemy";

export class EnemyManager {
  Game: Game;

  enemies: Enemy[] = [];

  constructor(game: Game) {
    this.Game = game;

    if (this.Game.Viewport.currentScene.hasEnemies) {
      this.enemies = this.Game.Viewport.currentScene.enemies;
    }
  }

  loopEnemies(callback: Function): void {
    this.enemies.forEach((enemy: Enemy) => {
      callback(enemy);
    });
  }

  aiThinking(): void {
    this.loopEnemies((enemy: Enemy) => {
      enemy.aiThinking();
    });
  }

  collisions(): void {
    this.loopEnemies((enemy: Enemy) => {
      if (
        enemy.hasPlayerCollision &&
        Collisions.movingBoxs(this.Game.Player.hitBox, enemy.hitBox) &&
        !enemy.state.is(EnemyState.Killed)
      ) {
        enemy.playerCollision();
      }

      let moveHelper = enemy.moveHelper();

      if (enemy.hasBricksCollisions) {
        this.Game.Viewport.loopCollision((cell) => {
          if (Collisions.movingBox(enemy.hitBox, cell)) {
            if (!moveHelper) enemy.bricksCollision();
          }
        });
      }

      enemy.customCollision();

      if (
        enemy.hasViewportCollision &&
        Collisions.movingBoxCanvas(enemy.hitBox, this.Game.Viewport)
      ) {
        enemy.viewportCollision();
      }
    });
  }

  move(): void {
    this.loopEnemies((enemy: Enemy) => {
      enemy.move();
    });
  }

  draw(): void {
    this.loopEnemies((enemy: Enemy) => {
      if (enemy.state.is(EnemyState.Killed)) {
        if (enemy.state.currentFrame <= 10) {
          this.Game.Viewport.currentScene.drawImage({
            sprite: enemy.killedSprites[1],
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
          });
        } else if (enemy.state.currentFrame <= 20) {
          this.Game.Viewport.currentScene.drawImage({
            sprite: enemy.killedSprites[2],
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
          });
        } else {
          enemy.isKilledAnimationFinished = true;
        }
        return;
      }

      if (enemy.invincibleObserver.is(true)) {
        enemy.invincibleAnimation.update(this.Game.dt);
        if (enemy.invincibleAnimation.currentAnimationStep === 1) enemy.draw();
      } else {
        enemy.draw();
      }

      if (this.Game.state.is(GameState.Run))
        enemy.spritesAnimation.update(this.Game.dt);
    });
  }

  removeKilled(forceRemoving: boolean = false): void {
    this.loopEnemies((enemy: Enemy) => {
      if (enemy.isKilledAnimationFinished || (forceRemoving && enemy.state.is(EnemyState.Killed))) {
        const enemyIndex = this.enemies.indexOf(enemy);

        if (enemyIndex > -1) {
          this.enemies.splice(enemyIndex, 1);
        }

        if (this.Game.EnemyManager.enemies.length <= 0) {
          this.Game.Player.increaseScore();
        }

        enemy.dropItem();
      }
    });
  }

  updateObservers(): void {
    this.loopEnemies((enemy: Enemy) => {
      enemy.state.update(this.Game.dt);
      enemy.invincibleObserver.update(this.Game.dt);

      if (
        enemy.invincibleObserver.get() &&
        enemy.invincibleObserver.currentFrame > enemy.invincibleDuration
      ) {
        enemy.invincibleObserver.setNextState(false);
      }
    });
  }
}
