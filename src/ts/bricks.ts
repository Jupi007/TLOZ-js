class Brick {
    img: HTMLImageElement;
    hasCollisions: boolean;

    constructor(src: string, hasCollisions: boolean = false) {
        this.img = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
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
