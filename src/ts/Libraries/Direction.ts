import { Random } from "./Random.js";

export enum Direction {Up, Right, Down, Left};

export namespace Direction {
    export function getRandom(): Direction {
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

    export function getOpposite(direction: Direction): Direction {
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

    export function areOpposite(dir1:Direction, dir2:Direction): boolean {
        if (
            dir1 === Direction.Up && dir2 === Direction.Down ||
            dir1 === Direction.Down && dir2 === Direction.Up ||
            dir1 === Direction.Right && dir2 === Direction.Left ||
            dir1 === Direction.Left && dir2 === Direction.Right
        ) {
            return true;
        }

        return false;
    }

    export function isVertical(direction: Direction): boolean {
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

    export function isHorizontal(direction: Direction): boolean {
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
}
