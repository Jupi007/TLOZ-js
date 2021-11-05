import { Game } from "./Game";
import { SpriteLoader } from "./Libraries/Loaders";
import { AnimationObserver } from "./Libraries/Observers";

export class Brick {
  Game: Game;

  private _sprite: HTMLImageElement;
  hasCollisions: boolean;

  constructor(game: Game) {
    this.Game = game;

    this.hasCollisions = false;
  }

  public get sprite(): HTMLImageElement {
    return this._sprite;
  }

  public set sprite(value: HTMLImageElement) {
    this._sprite = value;
  }
}

export class AnimatedBrick extends Brick {
  sprites: HTMLImageElement[] = [];
  spritesAnimation: AnimationObserver;

  constructor(game: Game) {
    super(game);
  }
}

export class BrickCollection {
  Game: Game;

  constructor(game: Game) {
    this.Game = game;
  }

  get(brick: string): Brick {
    switch (brick) {
      case "passage":
        return new Bricks.Passage(this.Game);
        break;
      case "default":
        return new Bricks.Default(this.Game);
        break;
      case "default-dungeon":
        return new Bricks.DefaultDungeon(this.Game);
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
      case "wall-dungeon":
        return new Bricks.WallDungeon(this.Game);
        break;
      case "red-wall":
        return new Bricks.RedWall(this.Game);
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

export namespace Bricks {
  export class Passage extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/passage.png");
    }
  }

  export class Default extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/default.png");
    }
  }

  export class DefaultDungeon extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/default-dungeon.png"
      );
    }
  }

  export class Stairs extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/stairs.png");
    }
  }

  export class Tree extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/tree.png");
      this.hasCollisions = true;
    }
  }

  export class WhiteTree extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/white-tree.png");
      this.hasCollisions = true;
    }
  }

  export class Grave extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/grave.png");
      this.hasCollisions = true;
    }
  }

  export class Wall extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/wall.png");
      this.hasCollisions = true;
    }
  }

  export class WallDungeon extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/wall-dungeon.png");
      this.hasCollisions = true;
    }
  }

  export class RedWall extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/red-wall.png");
      this.hasCollisions = true;
    }
  }

  export class SingleWall extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/single-wall.png");
      this.hasCollisions = true;
    }
  }

  export class SingleRedWall extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/single-red-wall.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WallTop extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/wall-top.png");
      this.hasCollisions = true;
    }
  }

  export class WallTopRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/wall-top-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WallTopLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/wall-top-left.png");
      this.hasCollisions = true;
    }
  }

  export class WallBottomRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/wall-bottom-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WallBottomLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/wall-bottom-left.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WhiteWall extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load("/sprites/png/bricks/white-wall.png");
      this.hasCollisions = true;
    }
  }

  export class WhiteWallTop extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/white-wall-top.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WhiteWallTopRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/white-wall-top-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WhiteWallTopLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/white-wall-top-left.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WhiteWallBottomRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/white-wall-bottom-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class WhiteWallBottomLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/white-wall-bottom-left.png"
      );
      this.hasCollisions = true;
    }
  }

  export class MonumentTopRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/monument-top-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class MonumentTopLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/monument-top-left.png"
      );
      this.hasCollisions = true;
    }
  }

  export class MonumentBottomRight extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/monument-bottom-right.png"
      );
      this.hasCollisions = true;
    }
  }

  export class MonumentBottomLeft extends Brick {
    constructor(game: Game) {
      super(game);

      this.sprite = SpriteLoader.load(
        "/sprites/png/bricks/monument-bottom-left.png"
      );
      this.hasCollisions = true;
    }
  }

  export class Fire extends AnimatedBrick {
    constructor(game: Game) {
      super(game);

      this.hasCollisions = true;

      this.sprites[1] = SpriteLoader.load("/sprites/png/bricks/fire1.png");
      this.sprites[2] = SpriteLoader.load("/sprites/png/bricks/fire2.png");

      this.spritesAnimation = new AnimationObserver(10, 2);
    }

    public get sprite(): HTMLImageElement {
      let sprite = this.sprites[this.spritesAnimation.currentAnimationStep];
      this.spritesAnimation.update(this.Game.dt);

      return sprite;
    }
  }
}
