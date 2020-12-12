class Brick {
    private _img: HTMLImageElement = new Image();
    private _hasCollisions: boolean;

    constructor(src: string, hasCollisions: boolean = false) {
        this._img.src = src;
        this._hasCollisions = hasCollisions;
    }

    get img(): HTMLImageElement {
        return this._img;
    }

    get hasCollisions(): boolean {
        return this._hasCollisions;
    }
}

const defaultBrick = new Brick("./sprites/png/default.png");
const wallBrick = new Brick("./sprites/png/wall.png", true);

class BrickCollection {
    private bricks = {
        "default": defaultBrick,
        "wall": wallBrick,
    };

    get(brick): Brick {
        return this.bricks[brick];
    }
}
