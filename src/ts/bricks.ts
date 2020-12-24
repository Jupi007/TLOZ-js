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
        super("./sprites/png/bricks/default.png");
    }
}

class TreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/tree.png", true);
    }
}

class WallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall.png", true);
    }
}

class WallTopBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top.png", true);
    }
}

class WallTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top-right.png", true);
    }
}

class WallTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top-left.png", true);
    }
}

class WallBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-bottom-right.png", true);
    }
}

class WallBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-bottom-left.png", true);
    }
}
