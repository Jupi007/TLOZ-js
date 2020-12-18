class Brick {
    sprite: HTMLImageElement;
    hasCollisions: boolean;

    constructor(src: string, hasCollisions: boolean = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
    }
}

class DefaultBrick extends Brick {
    constructor() {
        super("./sprites/png/default.png");
    }
}

class WallBrick extends Brick {
    constructor() {
        super("./sprites/png/wall.png", true);
    }
}
