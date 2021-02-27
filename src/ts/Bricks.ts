import { SpriteLoader } from "./Libraries/Loaders.js";

export class Brick {
    sprite: HTMLImageElement;
    hasCollisions: boolean;

    constructor() {
        this.hasCollisions = false;
    }
}

export class BrickCollection {
    static get(brick: string): Brick {
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

export namespace Bricks {
    export class Passage extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/passage.png");
        }
    }

    export class Default extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default.png");
        }
    }

    export class DefaultGrey extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default-grey.png");
        }
    }

    export class Stairs extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/stairs.png");
        }
    }

    export class Tree extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/tree.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteTree extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-tree.png");
            this.hasCollisions = true;
        }
    }

    export class Grave extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/grave.png");
            this.hasCollisions = true;
        }
    }

    export class Wall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall.png");
            this.hasCollisions = true;
        }
    }

    export class SingleWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-wall.png");
            this.hasCollisions = true;
        }
    }

    export class SingleRedWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-red-wall.png");
            this.hasCollisions = true;
        }
    }

    export class WallTop extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top.png");
            this.hasCollisions = true;
        }
    }

    export class WallTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-right.png");
            this.hasCollisions = true;
        }
    }

    export class WallTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-left.png");
            this.hasCollisions = true;
        }
    }

    export class WallBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }

    export class WallBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWall extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWallTop extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWallTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-right.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWallTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-left.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWallBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }

    export class WhiteWallBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }

    export class MonumentTopRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-right.png");
            this.hasCollisions = true;
        }
    }

    export class MonumentTopLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-left.png");
            this.hasCollisions = true;
        }
    }

    export class MonumentBottomRight extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-right.png");
            this.hasCollisions = true;
        }
    }

    export class MonumentBottomLeft extends Brick {
        constructor() {
            super();
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-left.png");
            this.hasCollisions = true;
        }
    }
}
