// **********************
// Random helper function
// **********************

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// **************************
// Collision helper functions
// **************************

function simpleMovingBoxCollision(movingBox, box2): boolean { // TODO: implement interface
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
function movingBoxCollision(movingBox, box2): boolean {
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
            movingBox.dy = 0;
        }
        if (movingBox.dx < 0 && movingBox.x + movingBox.dx < box2.x + box2.width && movingBox.x >= box2.x + box2.width) {
            movingBox.x = box2.x + box2.width;
            movingBox.dx = 0;
            movingBox.dy = 0;
        }
        if (movingBox.dy > 0 && movingBox.y + movingBox.height + movingBox.dy > box2.y && movingBox.y + movingBox.height <= box2.y) {
            movingBox.y = box2.y - movingBox.height;
            movingBox.dy = 0;
            movingBox.dx = 0;
        }
        if (movingBox.dy < 0 && movingBox.y + movingBox.dy < box2.y + box2.height && movingBox.y >= box2.y + box2.height) {
            movingBox.y = box2.y + box2.height;
            movingBox.dy = 0;
            movingBox.dx = 0;
        }

        return true;
    }
}

function movingBoxsCollision(movingBox1, movingBox2): boolean {
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

function simpleCanvasCollision(box, canvas): boolean {
    if (
        box.x + box.dx + box.width <= canvas.width &&
        box.x + box.dx >= 0 &&
        box.y + box.dy + box.height <= canvas.height &&
        box.y + box.dy >= 0
    ) {
        return false;
    } else {
        return true;
    }
}

function movingBoxCanvasCollision(box, canvas): boolean {
    if (!simpleCanvasCollision(box, canvas)) {
        return false;
    } else {
        if (box.x + box.dx + box.width > canvas.width) {
            box.dx = 0;
            box.x = canvas.width - box.width;
        }
        if (box.x + box.dx < 0) {
            box.dx = 0;
            box.x = 0;
        }
        if (box.y + box.dy + box.height > canvas.height) {
            box.dy = 0;
            box.y = canvas.height - box.height;
        }
        if (box.y + box.dy < 0) {
            box.dy = 0;
            box.y = 0;
        }

        return true;
    }
}
