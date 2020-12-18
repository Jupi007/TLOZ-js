class SpriteLoader {
    static load(src: string): HTMLImageElement {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}

class AudioLoader {
    static load(src: string, loop:boolean = false): HTMLAudioElement {
        let audio = new Audio(src);
        audio.loop = loop;
        return audio;
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

    requestNewFrameAnimation(animationSpeedModifier: number = 1): void {
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

class MovingBoxLandscapeHitBox {
    Box: MovingBox;

    constructor(player: MovingBox) {
        this.Box = player
    }

    get x(): number {
        return this.Box.x;
    }
    set x(x: number) {
        this.Box.x = x;
    }

    get y(): number {
        return this.Box.y + this.Box.height / 2;
    }
    set y(y: number) {
        this.Box.y = y - this.Box.height / 2;
    }

    get width(): number {
        return this.Box.width;
    }

    get height(): number {
        return this.Box.height / 2;
    }

    get dx(): number {
        return this.Box.dx;
    }
    set dx(dx: number) {
        this.Box.dx = dx;
    }

    get dy(): number {
        return this.Box.dy;
    }
    set dy(dy: number) {
        this.Box.dy = dy;
    }

    get direction(): number {
        return this.Box.direction;
    }
    set direction(direction: number) {
        this.Box.direction = direction;
    }
}
