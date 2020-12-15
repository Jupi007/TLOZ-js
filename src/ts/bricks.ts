class Brick {
    sprite: HTMLImageElement;
    hasCollisions: boolean;

    constructor(src: string, hasCollisions: boolean = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
    }
}

const defaultBrick = new Brick("./sprites/png/default.png");
const wallBrick = new Brick("./sprites/png/wall.png", true);

class BrickCollection {
    bricks = {
        "default": defaultBrick,
        "wall": wallBrick,
    };

    get(brick): Brick {
        return this.bricks[brick];
    }
}
