import { Direction } from "./AbstractClasses.js";
// **********************
// Random helper function
// **********************
export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getOneRandom(number) {
    return getRandomIntInclusive(1, number) === 1;
}
// **************************
// Collision helper functions
// **************************
export var Collisions;
(function (Collisions) {
    function simpleBox(box1, box2) {
        if ((box1.x >= box2.x + box2.width) ||
            (box1.x + box1.width <= box2.x) ||
            (box1.y >= box2.y + box2.height) ||
            (box1.y + box1.height <= box2.y)) {
            return false;
        }
        return true;
    }
    Collisions.simpleBox = simpleBox;
    function simpleMovingBox(movingBox, box2) {
        if ((movingBox.x + movingBox.dx >= box2.x + box2.width) ||
            (movingBox.x + movingBox.dx + movingBox.width <= box2.x) ||
            (movingBox.y + movingBox.dy >= box2.y + box2.height) ||
            (movingBox.y + movingBox.dy + movingBox.height <= box2.y)) {
            return false;
        }
        return true;
    }
    Collisions.simpleMovingBox = simpleMovingBox;
    function movingBox(movingBox, box2) {
        if (this.simpleMovingBox(movingBox, box2)) {
            if (movingBox.dx > 0 && movingBox.x + movingBox.width + movingBox.dx > box2.x && movingBox.x + movingBox.width <= box2.x) {
                movingBox.x = box2.x - movingBox.width;
                movingBox.dx = 0;
            }
            if (movingBox.dx < 0 && movingBox.x + movingBox.dx < box2.x + box2.width && movingBox.x >= box2.x + box2.width) {
                movingBox.x = box2.x + box2.width;
                movingBox.dx = 0;
            }
            if (movingBox.dy > 0 && movingBox.y + movingBox.height + movingBox.dy > box2.y && movingBox.y + movingBox.height <= box2.y) {
                movingBox.y = box2.y - movingBox.height;
                movingBox.dy = 0;
            }
            if (movingBox.dy < 0 && movingBox.y + movingBox.dy < box2.y + box2.height && movingBox.y >= box2.y + box2.height) {
                movingBox.y = box2.y + box2.height;
                movingBox.dy = 0;
            }
            return true;
        }
        return false;
    }
    Collisions.movingBox = movingBox;
    function movingBoxs(movingBox1, movingBox2) {
        if ((movingBox1.x + movingBox1.dx >= movingBox2.x + movingBox2.width + movingBox1.dx) ||
            (movingBox1.x + movingBox1.dx + movingBox1.width <= movingBox2.x + movingBox1.dx) ||
            (movingBox1.y + movingBox1.dy >= movingBox2.y + movingBox2.height + movingBox1.dy) ||
            (movingBox1.y + movingBox1.dy + movingBox1.height <= movingBox2.y + movingBox1.dy)) {
            return false;
        }
        return true;
    }
    Collisions.movingBoxs = movingBoxs;
    function simpleMovingBoxCanvas(movingBox, canvas) {
        if (movingBox.x + movingBox.dx + movingBox.width <= canvas.width &&
            movingBox.x + movingBox.dx >= 0 &&
            movingBox.y + movingBox.dy + movingBox.height <= canvas.height &&
            movingBox.y + movingBox.dy >= 0) {
            return false;
        }
        return true;
    }
    Collisions.simpleMovingBoxCanvas = simpleMovingBoxCanvas;
    function movingBoxCanvas(movingBox, canvas) {
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
    Collisions.movingBoxCanvas = movingBoxCanvas;
    function simpleMovingBoxLine(movingBox, lineCoordinate, direction) {
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
    Collisions.simpleMovingBoxLine = simpleMovingBoxLine;
    function movingBoxLine(movingBox, lineCoordinate, direction) {
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
    Collisions.movingBoxLine = movingBoxLine;
})(Collisions || (Collisions = {}));
