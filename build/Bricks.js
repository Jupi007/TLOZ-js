import { SpriteLoader } from "./Libraries/Loaders.js";
import { AnimationObserver } from "./Libraries/Observers.js";
export class Brick {
    constructor(game) {
        this.Game = game;
        this.hasCollisions = false;
    }
    get sprite() {
        return this._sprite;
    }
    set sprite(value) {
        this._sprite = value;
    }
}
export class AnimatedBrick extends Brick {
    constructor(game) {
        super(game);
        this.sprites = [];
    }
}
export class BrickCollection {
    constructor(game) {
        this.Game = game;
    }
    get(brick) {
        switch (brick) {
            case "passage":
                return new Bricks.Passage(this.Game);
                break;
            case "default":
                return new Bricks.Default(this.Game);
                break;
            case "default-grey":
                return new Bricks.DefaultGrey(this.Game);
                break;
            case "default-dark":
                return new Bricks.DefaultDark(this.Game);
                break;
            case "stairs":
                return new Bricks.Stairs(this.Game);
                break;
            case "tree":
                return new Bricks.Tree(this.Game);
                break;
            case "white-tree":
                return new Bricks.WhiteTree(this.Game);
                break;
            case "grave":
                return new Bricks.Grave(this.Game);
                break;
            case "wall":
                return new Bricks.Wall(this.Game);
                break;
            case "wall-dark":
                return new Bricks.WallDark(this.Game);
                break;
            case "single-wall":
                return new Bricks.SingleWall(this.Game);
                break;
            case "single-red-wall":
                return new Bricks.SingleRedWall(this.Game);
                break;
            case "wall-t":
                return new Bricks.WallTop(this.Game);
                break;
            case "wall-tr":
                return new Bricks.WallTopRight(this.Game);
                break;
            case "wall-tl":
                return new Bricks.WallTopLeft(this.Game);
                break;
            case "wall-br":
                return new Bricks.WallBottomRight(this.Game);
                break;
            case "wall-bl":
                return new Bricks.WallBottomLeft(this.Game);
                break;
            case "white-wall":
                return new Bricks.WhiteWall(this.Game);
                break;
            case "white-wall-t":
                return new Bricks.WhiteWallTop(this.Game);
                break;
            case "white-wall-tr":
                return new Bricks.WhiteWallTopRight(this.Game);
                break;
            case "white-wall-tl":
                return new Bricks.WhiteWallTopLeft(this.Game);
                break;
            case "white-wall-br":
                return new Bricks.WhiteWallBottomRight(this.Game);
                break;
            case "white-wall-bl":
                return new Bricks.WhiteWallBottomLeft(this.Game);
                break;
            case "monument-tr":
                return new Bricks.MonumentTopRight(this.Game);
                break;
            case "monument-tl":
                return new Bricks.MonumentTopLeft(this.Game);
                break;
            case "monument-br":
                return new Bricks.MonumentBottomRight(this.Game);
                break;
            case "monument-bl":
                return new Bricks.MonumentBottomLeft(this.Game);
                break;
            case "fire":
                return new Bricks.Fire(this.Game);
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
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/passage.png");
        }
    }
    Bricks.Passage = Passage;
    class Default extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default.png");
        }
    }
    Bricks.Default = Default;
    class DefaultGrey extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default-grey.png");
        }
    }
    Bricks.DefaultGrey = DefaultGrey;
    class DefaultDark extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/default-dark.png");
        }
    }
    Bricks.DefaultDark = DefaultDark;
    class Stairs extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/stairs.png");
        }
    }
    Bricks.Stairs = Stairs;
    class Tree extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/tree.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Tree = Tree;
    class WhiteTree extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-tree.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteTree = WhiteTree;
    class Grave extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/grave.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Grave = Grave;
    class Wall extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.Wall = Wall;
    class WallDark extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-dark.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallDark = WallDark;
    class SingleWall extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.SingleWall = SingleWall;
    class SingleRedWall extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/single-red-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.SingleRedWall = SingleRedWall;
    class WallTop extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTop = WallTop;
    class WallTopRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTopRight = WallTopRight;
    class WallTopLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallTopLeft = WallTopLeft;
    class WallBottomRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallBottomRight = WallBottomRight;
    class WallBottomLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WallBottomLeft = WallBottomLeft;
    class WhiteWall extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWall = WhiteWall;
    class WhiteWallTop extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTop = WhiteWallTop;
    class WhiteWallTopRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTopRight = WhiteWallTopRight;
    class WhiteWallTopLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallTopLeft = WhiteWallTopLeft;
    class WhiteWallBottomRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallBottomRight = WhiteWallBottomRight;
    class WhiteWallBottomLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/white-wall-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.WhiteWallBottomLeft = WhiteWallBottomLeft;
    class MonumentTopRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentTopRight = MonumentTopRight;
    class MonumentTopLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-top-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentTopLeft = MonumentTopLeft;
    class MonumentBottomRight extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-right.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentBottomRight = MonumentBottomRight;
    class MonumentBottomLeft extends Brick {
        constructor(game) {
            super(game);
            this.sprite = SpriteLoader.load("./sprites/png/bricks/monument-bottom-left.png");
            this.hasCollisions = true;
        }
    }
    Bricks.MonumentBottomLeft = MonumentBottomLeft;
    class Fire extends AnimatedBrick {
        constructor(game) {
            super(game);
            this.hasCollisions = true;
            this.sprites[1] = SpriteLoader.load("./sprites/png/bricks/fire1.png");
            this.sprites[2] = SpriteLoader.load("./sprites/png/bricks/fire2.png");
            this.spritesAnimation = new AnimationObserver(10, 2);
        }
        get sprite() {
            let sprite = this.sprites[this.spritesAnimation.currentAnimationStep];
            this.spritesAnimation.update(this.Game.dt);
            return sprite;
        }
    }
    Bricks.Fire = Fire;
})(Bricks || (Bricks = {}));
