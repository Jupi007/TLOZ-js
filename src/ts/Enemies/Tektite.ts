import { Game } from "../Game";
import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";
import { Random } from "../Libraries/Random";
import { StateObserver, AnimationObserver } from "../Libraries/Observers";
import { Enemy, EnemyState } from "./Enemy";


export class Tektite extends Enemy {
    sprites: HTMLImageElement[];

    speedX: number;
    speedY: number;

    constructor({ game, x, y }: {
        game: Game;
        x: number;
        y: number;
    }) {
        super(game);

        this.x = x;
        this.y = y;

        this.width = 64;
        this.height = 64;

        this.speed = 6;

        this.direction = Direction.Down;

        this.damage = 1;
        this.hp = 1;

        // this.hasPlayerCollision = true;
        this.hasViewportCollision = false;
        this.hasBricksCollisions = false;

        this.sprites = [];
        this.sprites[1] = this.Game.AssetManager.getImage("./sprites/png/tektite1.png");
        this.sprites[2] = this.Game.AssetManager.getImage("./sprites/png/tektite2.png");

        this.spritesAnimation = new AnimationObserver(20, 2);

        this.state = new StateObserver(EnemyState.Wait);
    }

    aiThinking(): void {
        switch (this.state.get()) {
            case EnemyState.Moving:
                if (this.state.isFirstFrame) {
                    this.dy = -6;
                    this.dx = (this.dy / 2) * (Random.getOneInt(2) ? -1 : 1);
                } else {
                    this.dy = this.dy + 0.1 * this.Game.dt;
                }
                if ((this.state.currentFrame > 60 && Random.getOneInt(50)) ||
                    this.state.currentFrame > 100)
                    this.state.setNextState(EnemyState.Wait);
                break;
            case EnemyState.Wait:
                this.dx = 0;
                this.dy = 0;
                if ((this.state.currentFrame > 30 && Random.getOneInt(50)) ||
                    this.state.currentFrame > 60)
                    this.state.setNextState(EnemyState.Moving);
                break;
        }
    }

    customCollision(): void {
        if (Collisions.movingBoxLine(this.hitBox, 0, Direction.Up)) {
            this.dy = this.dy / 2;
        }
        if (Collisions.movingBoxLine(
            this.hitBox,
            this.Game.Viewport.height,
            Direction.Down
        )) {
            this.state.setNextState(EnemyState.Wait);
        }
        if (Collisions.simpleMovingBoxLine(this.hitBox, 0, Direction.Left)) {
            this.dx = -this.dx;
        }
        if (Collisions.simpleMovingBoxLine(
            this.hitBox,
            this.Game.Viewport.width,
            Direction.Right
        )) {
            this.dx = -this.dx;
        }
    }

    move(): void {
        if (this.state.is(EnemyState.Killed))
            return;

        this.y += this.dy * this.Game.dt;
        this.x += this.dx * this.Game.dt;
    }

    draw(): void {
        let sprite: HTMLImageElement;

        switch (this.state.get()) {
            case EnemyState.Moving:
                sprite = this.sprites[1];
                break;
            case EnemyState.Wait:
                sprite = this.sprites[this.spritesAnimation.currentAnimationStep];
                break;

            default:
                break;
        }

        this.Game.Viewport.currentScene.drawImage({
            sprite,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }
}
