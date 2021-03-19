import { GameState } from "./Game.js";
import { Collisions } from "./Libraries/Collisions.js";
import { EnemyState } from "./Enemies.js";
export class EnemyManager {
    constructor(game) {
        this.enemies = [];
        this.Game = game;
        if (this.Game.Viewport.currentScene.hasEnemies) {
            this.enemies = this.Game.Viewport.currentScene.enemies;
        }
    }
    loopEnemies(callback) {
        this.enemies.forEach((enemy) => {
            callback(enemy);
        });
    }
    removeEnemy(enemy) {
        const enemyIndex = this.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }
        if (this.Game.EnemyManager.enemies.length <= 0) {
            this.Game.Player.increaseScore();
        }
        enemy.dropItem();
    }
    aiThinking() {
        this.loopEnemies((enemy) => {
            enemy.aiThinking();
        });
    }
    collisions() {
        this.loopEnemies((enemy) => {
            if (enemy.hasPlayerCollision && Collisions.movingBoxs(this.Game.Player.hitBox, enemy) && !enemy.state.is(EnemyState.Killed)) {
                enemy.playerCollision();
            }
            let helper = enemy.requirePassBetweenBoxHelper ? Collisions.passBetweenBoxesHelper(this.Game, enemy) : false;
            if (enemy.hasBricksCollisions) {
                this.Game.Viewport.loopCollision((cell, col, row) => {
                    if (Collisions.movingBox(enemy, cell)) {
                        if (!helper)
                            enemy.bricksCollision();
                    }
                });
            }
            enemy.customCollision();
            if (enemy.hasViewportCollision && Collisions.movingBoxCanvas(enemy, this.Game.Viewport)) {
                enemy.viewportCollision();
            }
        });
    }
    move() {
        this.loopEnemies((enemy) => {
            enemy.move();
        });
    }
    draw() {
        this.loopEnemies((enemy) => {
            if (enemy.state.is(EnemyState.Killed)) {
                if (enemy.state.currentFrame <= 10) {
                    this.Game.Viewport.currentScene.drawImage(enemy.killedSprites[1], enemy.x, enemy.y, enemy.width, enemy.height);
                }
                else if (enemy.state.currentFrame <= 20) {
                    this.Game.Viewport.currentScene.drawImage(enemy.killedSprites[2], enemy.x, enemy.y, enemy.width, enemy.height);
                }
                else {
                    this.Game.EnemyManager.removeEnemy(enemy);
                }
                return;
            }
            if (enemy.isInvincibleObserver.is(true)) {
                enemy.invincibleAnimation.update(this.Game.dt);
                if (enemy.invincibleAnimation.currentAnimationStep === 1)
                    enemy.draw();
            }
            else {
                enemy.draw();
            }
            if (this.Game.state.is(GameState.Run))
                enemy.spritesAnimation.update(this.Game.dt);
        });
    }
    updateObservers() {
        this.loopEnemies((enemy) => {
            enemy.state.update(this.Game.dt);
            enemy.isInvincibleObserver.update(this.Game.dt);
            if (enemy.isInvincibleObserver.get() && enemy.isInvincibleObserver.currentFrame > enemy.invincibleDuration) {
                enemy.isInvincibleObserver.setNextState(false);
            }
        });
    }
}
