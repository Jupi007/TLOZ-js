class SpriteLoader {
    static load(src: string): HTMLImageElement {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}

abstract class SimpleBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

enum Direction {Up, Right, Down, Left};

abstract class MovingBox extends SimpleBox {
    dx = 0;
    dy = 0;
    direction:Direction;
}

abstract class AnimatedMovingBox extends MovingBox {
    Game: Game;

    currentFrame = 0;
    animationSpeed:number;

    currentAnimationStep = 1;
    nbAnimationStep: number;

    constructor(game: Game) {
        super(); 
        this.Game = game;
    }

    requestNewFrameAnimation(animationSpeedModifier): void {
        if (this.Game.status !== GameStatus.Run) return;

        this.currentFrame += 1 * animationSpeedModifier;

        if (this.currentFrame >= this.animationSpeed) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                ? 1
                : this.currentAnimationStep + 1
            ;
        }
    }
}
