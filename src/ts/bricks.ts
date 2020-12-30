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

class DefaultGreyBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/default-grey.png");
    }
}

class StairsBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/stairs.png");
    }
}

class TreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/tree.png", true);
    }
}

class WhiteTreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-tree.png", true);
    }
}

class GraveBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/grave.png", true);
    }
}

class WallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall.png", true);
    }
}

class SingleWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/single-wall.png", true);
    }
}

class SingleRedWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/single-red-wall.png", true);
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

class WhiteWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall.png", true);
    }
}

class WhiteWallTopBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top.png", true);
    }
}

class WhiteWallTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top-right.png", true);
    }
}

class WhiteWallTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top-left.png", true);
    }
}

class WhiteWallBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-bottom-right.png", true);
    }
}

class WhiteWallBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-bottom-left.png", true);
    }
}

class MonumentTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-top-right.png", true);
    }
}

class MonumentTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-top-left.png", true);
    }
}

class MonumentBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-bottom-right.png", true);
    }
}

class MonumentBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-bottom-left.png", true);
    }
}
