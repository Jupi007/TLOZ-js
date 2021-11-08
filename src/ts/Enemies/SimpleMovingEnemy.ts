import { MovingBoxHalfHitBoxes } from "../Libraries/Boxes";
import { Direction } from "../Libraries/Direction";
import { Collisions } from "../Libraries/Collisions";
import { Random } from "../Libraries/Random";
import { StateObserver } from "../Libraries/Observers";
import { Enemy, EnemyState } from "./Enemy";
import { Game } from "../Game";


export class SimpleMovingEnemy extends Enemy {
    hasChangedDirection: boolean;

    sprites: HTMLImageElement[][] = [];

    halfHitBoxes: MovingBoxHalfHitBoxes;

    constructor({ game, width, height }: {
        game: Game;
        width: number;
        height: number;
    }) {
        super(game);

        this.width = width;
        this.height = height;

        this.state = new StateObserver(EnemyState.ChangeDirection);

        this.halfHitBoxes = new MovingBoxHalfHitBoxes(this.hitBox);

        this.requirePassBetweenBoxHelper = true;
    }

    aiThinking(): void {
        switch (this.state.get()) {
            case EnemyState.Moving:
                if (this.invincibleObserver.is(false)) {
                    switch (this.direction) {
                        case Direction.Down:
                            this.dy = this.speed * this.Game.dt;
                            break;
                        case Direction.Up:
                            this.dy = -this.speed * this.Game.dt;
                            break;
                        case Direction.Right:
                            this.dx = this.speed * this.Game.dt;
                            break;
                        case Direction.Left:
                            this.dx = -this.speed * this.Game.dt;
                            break;
                    }
                }
                if (this.state.currentFrame > 50) {
                    if (Random.getOneInt(25))
                        this.changeDirection();
                    else if (Random.getOneInt(25))
                        this.state.setNextState(EnemyState.Attack);
                }
                break;
            case EnemyState.ChangeDirection:
                if (this.state.currentFrame >= 15 && !this.hasChangedDirection) {
                    this.direction = Direction.getRandom();
                    this.hasChangedDirection = true;
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemyState.Moving);
                }
                break;
            case EnemyState.Attack:
                if (this.state.isFirstFrame) {
                    this.attack();
                }
                if (this.state.currentFrame > 30) {
                    this.state.setNextState(EnemyState.Moving);
                }
                break;

            default:
                break;
        }
    }

    viewportCollision(): void {
        this.changeDirection();
    }
    bricksCollision(): void {
        this.changeDirection();
    }
    moveHelper(): boolean {
        return Collisions.passBetweenBoxesHelper(this);
    }

    changeDirection(): void {
        this.state.setNextState(EnemyState.ChangeDirection);
        this.hasChangedDirection = false;
    }

    draw(): void {
        this.Game.Viewport.currentScene.drawImage({
            sprite: this.sprites[this.direction][this.spritesAnimation.currentAnimationStep],
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }

    attack(): void { }
}
