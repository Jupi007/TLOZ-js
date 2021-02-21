import { getRandomIntInclusive } from "./functions.js";
export class SpriteLoader {
    static load(src) {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}
export class AudioLoader {
    static load(src, loop = false) {
        let audio = new Audio(src);
        audio.loop = loop;
        return audio;
    }
}
export class SimpleBox {
}
export var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
;
(function (Direction) {
    function getRandom() {
        switch (getRandomIntInclusive(1, 4)) {
            case 1:
                return Direction.Up;
                break;
            case 2:
                return Direction.Right;
                break;
            case 3:
                return Direction.Down;
                break;
            case 4:
                return Direction.Left;
                break;
        }
    }
    Direction.getRandom = getRandom;
    function getOpposite(direction) {
        switch (direction) {
            case Direction.Up:
                return Direction.Down;
                break;
            case Direction.Down:
                return Direction.Up;
                break;
            case Direction.Left:
                return Direction.Right;
                break;
            case Direction.Right:
                return Direction.Left;
                break;
        }
    }
    Direction.getOpposite = getOpposite;
    function areOpposite(dir1, dir2) {
        if (dir1 === Direction.Up && dir2 === Direction.Down ||
            dir1 === Direction.Down && dir2 === Direction.Up ||
            dir1 === Direction.Right && dir2 === Direction.Left ||
            dir1 === Direction.Left && dir2 === Direction.Right) {
            return true;
        }
        return false;
    }
    Direction.areOpposite = areOpposite;
    function isVertical(direction) {
        switch (direction) {
            case Direction.Up:
            case Direction.Down:
                return true;
                break;
            case Direction.Left:
            case Direction.Right:
                return false;
                break;
        }
    }
    Direction.isVertical = isVertical;
    function isHorizontal(direction) {
        switch (direction) {
            case Direction.Up:
            case Direction.Down:
                return true;
                break;
            case Direction.Left:
            case Direction.Right:
                return false;
                break;
        }
    }
    Direction.isHorizontal = isHorizontal;
})(Direction || (Direction = {}));
export class GameMovingBox extends SimpleBox {
    constructor(game) {
        super();
        this._dx = 0;
        this._dy = 0;
        this.Game = game;
    }
    get dx() {
        return this._dx * this.Game.dt;
    }
    get dy() {
        return this._dy * this.Game.dt;
    }
    get realDx() {
        return this._dx;
    }
    get realDy() {
        return this._dy;
    }
    set dx(dx) {
        this._dx = dx;
    }
    set dy(dy) {
        this._dy = dy;
    }
}
export class MovingBox extends SimpleBox {
    constructor() {
        super(...arguments);
        this.dx = 0;
        this.dy = 0;
    }
}
export class MovingBoxHitBox {
    constructor(box, x, y, width, height) {
        this.Box = box;
        this.hitX = x;
        this.hitY = y;
        this.hitWidth = width;
        this.hitHeight = height;
    }
    get x() {
        return this.Box.x + this.hitX;
    }
    set x(x) {
        this.Box.x = x - this.hitX;
    }
    get y() {
        return this.Box.y + this.hitY;
    }
    set y(y) {
        this.Box.y = y - this.hitY;
    }
    get width() {
        return this.hitWidth;
    }
    get height() {
        return this.hitHeight;
    }
    get dx() {
        return this.Box.dx;
    }
    set dx(dx) {
        this.Box.dx = dx;
    }
    get dy() {
        return this.Box.dy;
    }
    set dy(dy) {
        this.Box.dy = dy;
    }
    get direction() {
        return this.Box.direction;
    }
    set direction(direction) {
        this.Box.direction = direction;
    }
}
