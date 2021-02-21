import { SpriteLoader } from "./Libraries/Loaders.js";
export class Brick {
    constructor(src, hasCollisions = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
    }
}
export var Bricks;
(function (Bricks) {
    class Default extends Brick {
        constructor() {
            super("./sprites/png/bricks/default.png");
        }
    }
    Bricks.Default = Default;
    class DefaultGrey extends Brick {
        constructor() {
            super("./sprites/png/bricks/default-grey.png");
        }
    }
    Bricks.DefaultGrey = DefaultGrey;
    class Stairs extends Brick {
        constructor() {
            super("./sprites/png/bricks/stairs.png");
        }
    }
    Bricks.Stairs = Stairs;
    class Tree extends Brick {
        constructor() {
            super("./sprites/png/bricks/tree.png", true);
        }
    }
    Bricks.Tree = Tree;
    class WhiteTree extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-tree.png", true);
        }
    }
    Bricks.WhiteTree = WhiteTree;
    class Grave extends Brick {
        constructor() {
            super("./sprites/png/bricks/grave.png", true);
        }
    }
    Bricks.Grave = Grave;
    class Wall extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall.png", true);
        }
    }
    Bricks.Wall = Wall;
    class SingleWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/single-wall.png", true);
        }
    }
    Bricks.SingleWall = SingleWall;
    class SingleRedWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/single-red-wall.png", true);
        }
    }
    Bricks.SingleRedWall = SingleRedWall;
    class WallTop extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top.png", true);
        }
    }
    Bricks.WallTop = WallTop;
    class WallTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top-right.png", true);
        }
    }
    Bricks.WallTopRight = WallTopRight;
    class WallTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-top-left.png", true);
        }
    }
    Bricks.WallTopLeft = WallTopLeft;
    class WallBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-bottom-right.png", true);
        }
    }
    Bricks.WallBottomRight = WallBottomRight;
    class WallBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/wall-bottom-left.png", true);
        }
    }
    Bricks.WallBottomLeft = WallBottomLeft;
    class WhiteWall extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall.png", true);
        }
    }
    Bricks.WhiteWall = WhiteWall;
    class WhiteWallTop extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top.png", true);
        }
    }
    Bricks.WhiteWallTop = WhiteWallTop;
    class WhiteWallTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top-right.png", true);
        }
    }
    Bricks.WhiteWallTopRight = WhiteWallTopRight;
    class WhiteWallTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-top-left.png", true);
        }
    }
    Bricks.WhiteWallTopLeft = WhiteWallTopLeft;
    class WhiteWallBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-bottom-right.png", true);
        }
    }
    Bricks.WhiteWallBottomRight = WhiteWallBottomRight;
    class WhiteWallBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/white-wall-bottom-left.png", true);
        }
    }
    Bricks.WhiteWallBottomLeft = WhiteWallBottomLeft;
    class MonumentTopRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-top-right.png", true);
        }
    }
    Bricks.MonumentTopRight = MonumentTopRight;
    class MonumentTopLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-top-left.png", true);
        }
    }
    Bricks.MonumentTopLeft = MonumentTopLeft;
    class MonumentBottomRight extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-bottom-right.png", true);
        }
    }
    Bricks.MonumentBottomRight = MonumentBottomRight;
    class MonumentBottomLeft extends Brick {
        constructor() {
            super("./sprites/png/bricks/monument-bottom-left.png", true);
        }
    }
    Bricks.MonumentBottomLeft = MonumentBottomLeft;
})(Bricks || (Bricks = {}));
