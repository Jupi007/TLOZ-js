import { SpriteLoader } from "./Libraries/Loaders.js";
export class Brick {
    constructor() {
        this.hasCollisions = false;
    }
}
export class BrickCollection {
    static get(brick) {
        switch (brick) {
            case "passage":
                return new Bricks.Passage();
                break;
            case "default":
                return new Bricks.Default();
                break;
            case "default-grey":
                return new Bricks.DefaultGrey();
                break;
            case "stairs":
                return new Bricks.Stairs();
                break;
            case "tree":
                return new Bricks.Tree();
                break;
            case "white-tree":
                return new Bricks.WhiteTree();
                break;
            case "grave":
                return new Bricks.Grave();
                break;
            case "wall":
                return new Bricks.Wall();
                break;
            case "single-wall":
                return new Bricks.SingleWall();
                break;
            case "single-red-wall":
                return new Bricks.SingleRedWall();
                break;
            case "wall-t":
                return new Bricks.WallTop();
                break;
            case "wall-tr":
                return new Bricks.WallTopRight();
                break;
            case "wall-tl":
                return new Bricks.WallTopLeft();
                break;
            case "wall-br":
                return new Bricks.WallBottomRight();
                break;
            case "wall-bl":
                return new Bricks.WallBottomLeft();
                break;
            case "white-wall":
                return new Bricks.WhiteWall();
                break;
            case "white-wall-t":
                return new Bricks.WhiteWallTop();
                break;
            case "white-wall-tr":
                return new Bricks.WhiteWallTopRight();
                break;
            case "white-wall-tl":
                return new Bricks.WhiteWallTopLeft();
                break;
            case "white-wall-br":
                return new Bricks.WhiteWallBottomRight();
                break;
            case "white-wall-bl":
                return new Bricks.WhiteWallBottomLeft();
                break;
            case "monument-tr":
                return new Bricks.MonumentTopRight();
                break;
            case "monument-tl":
                return new Bricks.MonumentTopLeft();
                break;
            case "monument-br":
                return new Bricks.MonumentBottomRight();
                break;
            case "monument-bl":
                return new Bricks.MonumentBottomLeft();
                break;
            default:
                throw "Brick " + brick + " not found";
                break;
        }
    }
}
export var Bricks;
(function (Bricks) {
    class Passage extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/passage.png");
        }
    }
    Bricks.Passage = Passage;
    class Default extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default.png");
        }
    }
    Bricks.Default = Default;
    class DefaultGrey extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default-grey.png");
        }
    }
    Bricks.DefaultGrey = DefaultGrey;
    class Stairs extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/stairs.png");
        }
    }
    Bricks.Stairs = Stairs;
    class Tree extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/tree.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Tree = Tree;
    class WhiteTree extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-tree.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteTree = WhiteTree;
    class Grave extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/grave.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Grave = Grave;
    class Wall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Wall = Wall;
    class SingleWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.SingleWall = SingleWall;
    class SingleRedWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-red-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.SingleRedWall = SingleRedWall;
    class WallTop extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTop = WallTop;
    class WallTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTopRight = WallTopRight;
    class WallTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTopLeft = WallTopLeft;
    class WallBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallBottomRight = WallBottomRight;
    class WallBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallBottomLeft = WallBottomLeft;
    class WhiteWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWall = WhiteWall;
    class WhiteWallTop extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTop = WhiteWallTop;
    class WhiteWallTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTopRight = WhiteWallTopRight;
    class WhiteWallTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTopLeft = WhiteWallTopLeft;
    class WhiteWallBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallBottomRight = WhiteWallBottomRight;
    class WhiteWallBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallBottomLeft = WhiteWallBottomLeft;
    class MonumentTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentTopRight = MonumentTopRight;
    class MonumentTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentTopLeft = MonumentTopLeft;
    class MonumentBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentBottomRight = MonumentBottomRight;
    class MonumentBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentBottomLeft = MonumentBottomLeft;
})(Bricks || (Bricks = {}));
