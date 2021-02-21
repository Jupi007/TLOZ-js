import { Random } from "./Random.js";
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
        switch (Random.getIntInclusive(1, 4)) {
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
