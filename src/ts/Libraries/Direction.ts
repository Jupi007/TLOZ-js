import { Random } from "./Random";

export enum Direction {
  Up,
  Right,
  Down,
  Left
}

export namespace Direction {
  export function getRandom(): Direction {
    switch (Random.getIntInclusive(1, 4)) {
      case 1:
        return Direction.Up;

      case 2:
        return Direction.Right;

      case 3:
        return Direction.Down;

      case 4:
      default:
        return Direction.Left;
    }
  }

  export function getOpposite(direction: Direction): Direction {
    switch (direction) {
      case Direction.Up:
        return Direction.Down;

      case Direction.Down:
        return Direction.Up;

      case Direction.Left:
        return Direction.Right;

      case Direction.Right:
      default:
        return Direction.Left;
        break;
    }
  }

  export function areOpposite(dir1: Direction, dir2: Direction): boolean {
    if (
      (dir1 === Direction.Up && dir2 === Direction.Down) ||
      (dir1 === Direction.Down && dir2 === Direction.Up) ||
      (dir1 === Direction.Right && dir2 === Direction.Left) ||
      (dir1 === Direction.Left && dir2 === Direction.Right)
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

      case Direction.Left:
      case Direction.Right:
      default:
        return false;
    }
  }

  export function isHorizontal(direction: Direction): boolean {
    switch (direction) {
      case Direction.Up:
      case Direction.Down:
        return true;

      case Direction.Left:
      case Direction.Right:
      default:
        return false;
    }
  }
}
