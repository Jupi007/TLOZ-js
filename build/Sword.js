import { AudioLoader, SpriteLoader } from "./Libraries/Loaders.js";
import { Direction } from "./Libraries/Direction.js";
import { Collisions } from "./Libraries/Collisions.js";
import { Sword as SwordProjectile } from "./Projectiles.js";
import { SimpleBox } from "./Libraries/Boxes.js";
export class Sword extends SimpleBox {
    constructor(game) {
        super();
        this.sprites = [];
        this.Game = game;
        this.swordWidth = 64;
        this.swordHeight = 28;
        this.swordHandleWidth = 16;
        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/sword-up.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/sword-right.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/sword-down.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/sword-left.png");
        this.slashSound = AudioLoader.load("./sounds/effect/Sword_Slash.wav");
        this.flyingSound = AudioLoader.load("./sounds/effect/Sword_Shoot.wav");
        this.isFlying = false;
        this.isEnabled = false;
        this.damage = 1;
    }
    get direction() {
        return this.Game.Player.direction;
    }
    get x() {
        if (this.direction === Direction.Up) {
            return this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Down) {
            return this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Left) {
            return this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
        }
        else if (this.direction === Direction.Right) {
            return this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
        }
    }
    get y() {
        if (this.direction === Direction.Up) {
            return this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
        }
        else if (this.direction === Direction.Down) {
            return this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth;
        }
        else if (this.direction === Direction.Left) {
            return this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Right) {
            return this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
        }
    }
    get width() {
        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            return this.swordHeight;
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            return this.swordWidth;
        }
    }
    get height() {
        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            return this.swordWidth;
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            return this.swordHeight;
        }
    }
    draw() {
        if (!this.isEnabled)
            return;
        if (this.Game.Player.attackObserver.get()) {
            this.Game.Viewport.drawImage(this.sprites[this.direction], this.x, this.y, this.width, this.height);
        }
    }
    drawWin() {
        this.Game.Viewport.drawImage(this.sprites[Direction.Up], this.Game.Player.x, this.Game.Player.y - this.swordWidth, this.swordHeight, this.swordWidth);
    }
    collisions() {
        if (!this.isEnabled)
            return;
        if (this.Game.Player.attackObserver.get()) {
            this.Game.EnemyManager.loopEnemies((enemy) => {
                if (Collisions.simpleMovingBox(enemy.hitBox, this)) {
                    enemy.takeDamage(this.damage);
                }
            });
        }
    }
    listenEvents() {
        if (!this.isEnabled)
            return;
        if (this.Game.Player.attackObserver.get() && this.Game.Player.attackObserver.isFirstFrame) {
            this.slashSound.play();
        }
        if (!this.isFlying
            && this.Game.Player.attackObserver.getLastFrame()
            && !this.Game.Player.attackObserver.get()
            && this.Game.Player.isFullLife) {
            this.flyingSound.play();
            this.isFlying = true;
            this.Game.ProjectileManager.addProjectile(new SwordProjectile(this.Game, this.x, this.y, this.Game.Player.speed * 3, this.direction, this.damage));
        }
    }
}
