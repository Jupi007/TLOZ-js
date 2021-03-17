import { Game } from "../Game.js";

import { SimpleBox, MovingBox, MovingBoxHitBox, Canvas } from "./Boxes.js";
import { Direction } from "./Direction.js";

export namespace Collisions {
    export function simpleBox(box1: SimpleBox, box2: SimpleBox): boolean {
        if (
            (box1.x >= box2.x + box2.width) ||
            (box1.x + box1.width <= box2.x) ||
            (box1.y >= box2.y + box2.height) ||
            (box1.y + box1.height <= box2.y)
        ) {
            return false;
        }

        return true;
    }

    export function simpleMovingBox(movingBox: MovingBox|MovingBoxHitBox, box2: SimpleBox): boolean {
        let box1 = {
            x: movingBox.x,
            y: movingBox.y,
            width: movingBox.width,
            height: movingBox.height
        };

        if (movingBox.dx > 0) {
            box1.width += movingBox.dx;
        }
        else if (movingBox.dx < 0) {
            box1.x -= Math.abs(movingBox.dx);
            box1.width += Math.abs(movingBox.dx);
        }

        if (movingBox.dy > 0) {
            box1.height += movingBox.dy;
        }
        else if (movingBox.dy < 0) {
            box1.y -= Math.abs(movingBox.dy);
            box1.height += Math.abs(movingBox.dy);
        }

        return this.simpleBox(box1, box2);
    }

    export function movingBox(movingBox: MovingBox|MovingBoxHitBox, box2: SimpleBox): boolean {
        if (this.simpleMovingBox(movingBox, box2)) {
            if (movingBox.dx > 0 && movingBox.x + movingBox.width <= box2.x) {
                movingBox.dx = box2.x - (movingBox.x + movingBox.width);
            }
            else if (movingBox.dx < 0 && movingBox.x >= box2.x + box2.width) {
                movingBox.dx = (box2.x + box2.width) - movingBox.x;
            }
            if (movingBox.dy > 0 && movingBox.y + movingBox.height <= box2.y) {
                movingBox.dy = box2.y - (movingBox.y + movingBox.height);
            }
            else if (movingBox.dy < 0 && movingBox.y >= box2.y + box2.height) {
                movingBox.dy = (box2.y + box2.height) - movingBox.y;
            }

            return true;
        }

        return false;
    }

    export function movingBoxs(movingBox1: MovingBox|MovingBoxHitBox, movingBox2: MovingBox|MovingBoxHitBox): boolean {
        if (
            (movingBox1.x + movingBox1.dx >= movingBox2.x + movingBox2.width + movingBox1.dx) ||
            (movingBox1.x + movingBox1.dx + movingBox1.width <= movingBox2.x + movingBox1.dx) ||
            (movingBox1.y + movingBox1.dy >= movingBox2.y + movingBox2.height + movingBox1.dy) ||
            (movingBox1.y + movingBox1.dy + movingBox1.height <= movingBox2.y + movingBox1.dy)
        ) {
            return false;
        }
        return true;
    }

    export function simpleMovingBoxCanvas(movingBox: MovingBox|MovingBoxHitBox, canvas: Canvas): boolean {
        if (
            movingBox.x + movingBox.dx + movingBox.width <= canvas.width &&
            movingBox.x + movingBox.dx >= 0 &&
            movingBox.y + movingBox.dy + movingBox.height <= canvas.height &&
            movingBox.y + movingBox.dy >= 0
        ) {
            return false;
        }

        return true;
    }

    export function movingBoxCanvas(movingBox: MovingBox|MovingBoxHitBox, canvas: Canvas): boolean {
        if (this.simpleMovingBoxCanvas(movingBox, canvas)) {
            if (movingBox.x + movingBox.dx + movingBox.width > canvas.width) {
                movingBox.dx = 0;
                movingBox.x = canvas.width - movingBox.width;
            }
            if (movingBox.x + movingBox.dx < 0) {
                movingBox.dx = 0;
                movingBox.x = 0;
            }
            if (movingBox.y + movingBox.dy + movingBox.height > canvas.height) {
                movingBox.dy = 0;
                movingBox.y = canvas.height - movingBox.height;
            }
            if (movingBox.y + movingBox.dy < 0) {
                movingBox.dy = 0;
                movingBox.y = 0;
            }

            return true;
        }

        return false;
    }

    export function simpleMovingBoxLine(movingBox: MovingBox|MovingBoxHitBox, lineCoordinate: number, direction: Direction): boolean {
        switch (direction) {
            case Direction.Up:
                if (movingBox.y + movingBox.dy < lineCoordinate) {
                    return true;
                }
                break;
            case Direction.Down:
                if (movingBox.y + movingBox.dy + movingBox.height > lineCoordinate) {
                    return true;
                }
                break;
            case Direction.Left:
                if (movingBox.x + movingBox.dx < lineCoordinate) {
                    return true;
                }
                break;
            case Direction.Right:
                if (movingBox.x + movingBox.dx + movingBox.width > lineCoordinate) {
                    return true;
                }
                break;
        }

        return false;
    }

    export function movingBoxLine(movingBox: MovingBox|MovingBoxHitBox, lineCoordinate: number, direction: Direction): boolean {
        if (this.simpleMovingBoxLine(movingBox, lineCoordinate, direction)) {
            switch (direction) {
                case Direction.Up:
                    movingBox.y = lineCoordinate + 1;
                    movingBox.dy = 0;
                    break;
                case Direction.Down:
                    movingBox.y = lineCoordinate - movingBox.height;
                    movingBox.dy = 0;
                    break;
                case Direction.Left:
                    movingBox.x = lineCoordinate + 1;
                    movingBox.dx = 0;
                    break;
                case Direction.Right:
                    movingBox.x = lineCoordinate - movingBox.width;
                    movingBox.dx = 0;
                    break;
            }

            return true;
        }

        return false;
    }

    export function passBetweenBoxesHelper(Game: Game, box: any): boolean { // TODO: create specific object
        let halfLeftCollision = false;
        let halfRightCollision = false;
        let halfUpCollision = false;
        let halfDownCollision = false;

        Game.Viewport.loopCollision((cell, col, row) => {
            if (Collisions.simpleMovingBox(box.halfHitBoxes.halfLeftHitBox, cell)) {
                halfLeftCollision = true;
            }
            if (Collisions.simpleMovingBox(box.halfHitBoxes.halfRightHitBox, cell)) {
                halfRightCollision = true;
            }
            if (Collisions.simpleMovingBox(box.halfHitBoxes.halfUpHitBox, cell)) {
                halfUpCollision = true;
            }
            if (Collisions.simpleMovingBox(box.halfHitBoxes.halfDownHitBox, cell)) {
                halfDownCollision = true;
            }
        });


        if (box.direction === Direction.Up || box.direction === Direction.Down) {
            if (halfLeftCollision && !halfRightCollision) {
                box.dx = box.speed * Game.dt;

                return true;
            }
            else if (!halfLeftCollision && halfRightCollision) {
                box.dx = -box.speed * Game.dt;

                return true;
            }
        }
        else if (box.direction === Direction.Left || box.direction === Direction.Right) {
            if (halfUpCollision && !halfDownCollision) {
                box.dy = box.speed * Game.dt;

                return true;
            }
            else if (!halfUpCollision && halfDownCollision) {
                box.dy = -box.speed * Game.dt;

                return true;
            }
        }

        return false;
    }
}
