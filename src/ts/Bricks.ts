import { SpriteLoader } from "./Libraries/Loaders.js";

export class Brick {
    sprite: HTMLImageElement;
    hasCollisions: boolean;

    constructor(src: string, hasCollisions: boolean = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
    }
}

export namespace Bricks {
    export class Default extends Brick {
        constructor() {
            super("./sprites/png/bricks/default.png");
        }
    }

    export class DefaultGrey extends Brick {
        constructor() {
            super("./sprites/png/bricks/default-grey.png");
        }
    }

    export class Stairs extends Brick {
        constructor() {
            super("./sprites/png/bricks/stairs.png");
        }
    }

    export class Tree extends Brick {
        constructor() {
            super("./sprites/png/bricks/tree.png", true);
        }
    }

    export class WhiteTree extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-tree.png", true);
        }
    }

    export class Grave extends Brick {
        constructor() {
            super("./sprites/png/bricks/grave.png", true);
        }
    }

    export class Wall extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall.png", true);
        }
    }

    export class SingleWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/single-wall.png", true);
        }
    }

    export class SingleRedWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/single-red-wall.png", true);
        }
    }

    export class WallTop extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top.png", true);
        }
    }

    export class WallTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top-right.png", true);
        }
    }

    export class WallTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top-left.png", true);
        }
    }

    export class WallBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-bottom-right.png", true);
        }
    }

    export class WallBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-bottom-left.png", true);
        }
    }

    export class WhiteWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall.png", true);
        }
    }

    export class WhiteWallTop extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top.png", true);
        }
    }

    export class WhiteWallTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top-right.png", true);
        }
    }

    export class WhiteWallTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top-left.png", true);
        }
    }

    export class WhiteWallBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-bottom-right.png", true);
        }
    }

    export class WhiteWallBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-bottom-left.png", true);
        }
    }

    export class MonumentTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-top-right.png", true);
        }
    }

    export class MonumentTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-top-left.png", true);
        }
    }

    export class MonumentBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-bottom-right.png", true);
        }
    }

    export class MonumentBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-bottom-left.png", true);
        }
    }
}
