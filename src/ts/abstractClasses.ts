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

namespace Direction {
    export function getRandom(): Direction {
        switch (getRandomIntInclusive(1, 4)) {
            case 1:
                return Direction.Up;
                break;
            case 2:
                return Direction.Right;
                break;
            case 3:
                return Direction.Down;
                break;
            case 4:
                return Direction.Left;
                break;
        }
    }

    export function getOpposite(direction: Direction): Direction {
        switch (direction) {
            case Direction.Up:
                return Direction.Down;
                break;
            case Direction.Down:
                return Direction.Up;
                break;
            case Direction.Left:
                return Direction.Right;
                break;
            case Direction.Right:
                return Direction.Left;
                break;
        }
    }

    export function areOpposite(dir1:Direction, dir2:Direction): boolean {
        if (
            dir1 === Direction.Up && dir2 === Direction.Down ||
            dir1 === Direction.Down && dir2 === Direction.Up ||
            dir1 === Direction.Right && dir2 === Direction.Left ||
            dir1 === Direction.Left && dir2 === Direction.Right
        ) {
            return true;
        }

        return false;
    }
}

abstract class MovingBox extends SimpleBox {
    dx = 0;
    dy = 0;
    direction:Direction;
}

class MovingBoxHitBox {
    Box: MovingBox;

    hitX: number;
    hitY: number;
    hitWidth: number;
    hitHeight: number;

    constructor(box: MovingBox, x: number, y: number, width: number, height: number) {
        this.Box = box;
        this.hitX = x;
        this.hitY = y;
        this.hitWidth = width;
        this.hitHeight = height;
    }

    get x(): number {
        return this.Box.x + this.hitX;
    }
    set x(x: number) {
        this.Box.x = x - this.hitX;
    }

    get y(): number {
        return this.Box.y + this.hitY;
    }
    set y(y: number) {
        this.Box.y = y - this.hitY;
    }

    get width(): number {
        return this.hitWidth;
    }

    get height(): number {
        return this.hitHeight;
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
