// **********************
// Random helper function
// **********************

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOneRandom(number: number): boolean {
    return getRandomIntInclusive(1, number) === 1;
}

// **************************
// Collision helper functions
// **************************
function simpleBoxCollision(box1: SimpleBox, box2: SimpleBox): boolean {
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

function simpleMovingBoxCollision(movingBox: MovingBox, box2: SimpleBox): boolean {
    if (
        (movingBox.x + movingBox.dx >= box2.x + box2.width) ||
        (movingBox.x + movingBox.dx + movingBox.width <= box2.x) ||
        (movingBox.y + movingBox.dy >= box2.y + box2.height) ||
        (movingBox.y + movingBox.dy + movingBox.height <= box2.y)
    ) {
        return false;
    }

    return true;
}

function movingBoxCollision(movingBox: MovingBox, box2: SimpleBox): boolean {
    if (
        (movingBox.x + movingBox.dx >= box2.x + box2.width) ||
        (movingBox.x + movingBox.dx + movingBox.width <= box2.x) ||
        (movingBox.y + movingBox.dy >= box2.y + box2.height) ||
        (movingBox.y + movingBox.dy + movingBox.height <= box2.y)
    ) {
        return false;
    } else {
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
}

function movingBoxsCollision(movingBox1: MovingBox, movingBox2): boolean {
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

function simpleMovingBoxCanvasCollision(movingBox: MovingBox, canvas: SimpleBox): boolean {
    if (
        movingBox.x + movingBox.dx + movingBox.width <= canvas.width &&
        movingBox.x + movingBox.dx >= 0 &&
        movingBox.y + movingBox.dy + movingBox.height <= canvas.height &&
        movingBox.y + movingBox.dy >= 0
    ) {
        return false;
    } else {
        return true;
    }
}

function movingBoxCanvasCollision(movingBox: MovingBox, canvas: SimpleBox): boolean {
    if (!simpleMovingBoxCanvasCollision(movingBox, canvas)) {
        return false;
    } else {
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
}

function simpleMovingBoxLineCollision(movingBox: MovingBox, lineCoordinate: number, direction: Direction): boolean {
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
}

function movingBoxLineCollision(movingBox: MovingBox, lineCoordinate: number, direction: Direction): boolean {
    if (!simpleMovingBoxLineCollision(movingBox, lineCoordinate, direction)) {
        return false;
    }
    else {
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
}
