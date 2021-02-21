import { Game, GameState } from "./Game.js";

import { Collisions } from "./Libraries/Collisions.js";

import { Enemy, EnemyState } from "./Enemies.js";

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

    killEnemy(enemy: Enemy): void {
        const enemyIndex = this.enemies.indexOf(enemy);

        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }

        if (this.Game.EnemyManager.enemies.length <= 0) {
            this.Game.Player.increaseScore();
        }

        enemy.dropItem();
    }

    aiThinking(): void {
        this.loopEnemies((enemy) => {
            enemy.aiThinking();
        });
    }

    collisions(): void {
        this.loopEnemies((enemy) => {
            if (enemy.hasPlayerCollision && Collisions.movingBoxs(this.Game.Player.hitBox, enemy) && !enemy.state.is(EnemyState.Killed)) {
                enemy.playerCollision();
            }

            if (enemy.hasViewportCollision && Collisions.movingBoxCanvas(enemy, this.Game.Viewport)) {
                enemy.viewportCollision();
            }

            let helper = enemy.passBetweenBoxesHelper();

            if (enemy.hasBricksCollisions) {
                this.Game.Viewport.loopCollision((cell, col, row) => {
                    if (Collisions.movingBox(enemy, cell)) {
                        if (!helper) enemy.bricksCollision();
                    }
                });
            }

            enemy.customCollision();
        });
    }

    move(): void {
        this.loopEnemies((enemy) => {
            enemy.move();
        });
    }

    draw(): void {
        this.loopEnemies((enemy) => {
            if (enemy.state.is(EnemyState.Killed)) {
                if (enemy.state.currentFrame <= 10) {
                    this.Game.Viewport.currentScene.drawImage(
                        enemy.killedSprites[1],
                        enemy.x,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                }
                else if (enemy.state.currentFrame <= 20) {
                    this.Game.Viewport.currentScene.drawImage(
                        enemy.killedSprites[2],
                        enemy.x,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                }
                else {
                    this.Game.EnemyManager.killEnemy(enemy);
                }
                return;
            }

            if (enemy.isInvincibleObserver.is(true)) {
                enemy.invincibleAnimation.update(this.Game.dt);
                if (enemy.invincibleAnimation.currentAnimationStep === 2) return;
            }

            enemy.draw();

            if (this.Game.state.is(GameState.Run)) enemy.spritesAnimation.update(this.Game.dt);
        });
    }

    updateObservers(): void {
        this.loopEnemies((enemy) => {
            enemy.state.update(this.Game.dt);
            enemy.isInvincibleObserver.update(this.Game.dt);

            if (enemy.isInvincibleObserver.get() && enemy.isInvincibleObserver.currentFrame > enemy.invincibleDuration) {
                enemy.isInvincibleObserver.setNextState(false);
            }
        });
    }
}
