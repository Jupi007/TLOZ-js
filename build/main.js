class Brick {
    constructor(src, hasCollisions = false) {
        this._img = new Image();
        this._img.src = src;
        this._hasCollisions = hasCollisions;
    }
    get img() {
        return this._img;
    }
    get hasCollisions() {
        return this._hasCollisions;
    }
}
const defaultBrick = new Brick("./sprites/png/default.png");
const wallBrick = new Brick("./sprites/png/wall.png", true);
class BrickCollection {
    constructor() {
        this.bricks = {
            "default": defaultBrick,
            "wall": wallBrick,
        };
    }
    get(brick) {
        return this.bricks[brick];
    }
}

class Enemies {
    constructor(game) {
        this._img = new Image();
        this._nbEnemies = 3;
        this._enemies = []; // TODO: Change type to array when Ennemie class is created
        this.Game = game;
        this._img.src = "./sprites/png/goomba.png";
        if (this.Game.Landscape.currentScene.hasEnemies) {
            for (var i = 0; i < this._nbEnemies; i++) {
                this._enemies[i] = {
                    x: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.width - (this.Game.Landscape.cellSize + 60)),
                    y: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.height - (this.Game.Landscape.cellSize + 60)),
                    dx: 0,
                    dy: 0,
                    speed: getRandomIntInclusive(1, 3),
                    dirY: getRandomIntInclusive(0, 1) ? "Up" : "Down",
                    width: 40,
                    height: 40,
                    isKilled: false,
                };
            }
        }
    }
    get enemies() {
        return this._enemies;
    }
    loopEnemies(callback) {
        this._enemies.forEach((enemy) => {
            callback(enemy);
        });
    }
    killEnemy(enemy) {
        const enemyIndex = this._enemies.indexOf(enemy);
        if (enemyIndex > -1) {
            this._enemies.splice(enemyIndex, 1);
        }
        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
            this.Game.Landscape.currentScene.hasEnemies = false;
        }
    }
    draw() {
        this.loopEnemies((enemy) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this._img, enemy.x, enemy.y, enemy.width, enemy.height);
            this.Game.ctx.closePath();
        });
    }
    collisions() {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy)) {
                this.Game.Player.takeDamage(20);
                this.Game.Player.takeKnockBack();
            }
            if (movingBoxCanvasCollision(enemy, this.Game.Canvas)) {
                if (enemy.dirY == "Up") {
                    enemy.dirY = "Down";
                }
                else {
                    enemy.dirY = "Up";
                }
            }
        });
    }
    preMove() {
        this.loopEnemies((enemy) => {
            enemy.dx = 0;
            if (enemy.dirY == "Down") {
                enemy.dy = enemy.speed;
            }
            else {
                enemy.dy = -enemy.speed;
            }
        });
    }
    move() {
        this.loopEnemies((enemy) => {
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
        });
    }
}

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var speedUpPressed = false;
var attackPressed = false;
document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = true;
            break;
        case 37:
            leftPressed = true;
            break;
        case 38:
            upPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
        case 83:
            speedUpPressed = true;
            break;
        case 81:
            attackPressed = true;
            break;
    }
    e.preventDefault();
}, false);
document.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = false;
            break;
        case 37:
            leftPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        case 83:
            speedUpPressed = false;
            break;
        case 81:
            attackPressed = false;
            break;
    }
    e.preventDefault();
}, false);

// **********************
// Random helper function
// **********************
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// **************************
// Collision helper functions
// **************************
function simpleMovingBoxCollision(movingBox, box2) {
    if ((movingBox.x + movingBox.dx >= box2.x + box2.width) ||
        (movingBox.x + movingBox.dx + movingBox.width <= box2.x) ||
        (movingBox.y + movingBox.dy >= box2.y + box2.height) ||
        (movingBox.y + movingBox.dy + movingBox.height <= box2.y)) {
        return false;
    }
    return true;
}
function movingBoxCollision(movingBox, box2) {
    if ((movingBox.x + movingBox.dx >= box2.x + box2.width) ||
        (movingBox.x + movingBox.dx + movingBox.width <= box2.x) ||
        (movingBox.y + movingBox.dy >= box2.y + box2.height) ||
        (movingBox.y + movingBox.dy + movingBox.height <= box2.y)) {
        return false;
    }
    else {
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
function movingBoxsCollision(movingBox1, movingBox2) {
    if ((movingBox1.x + movingBox1.dx >= movingBox2.x + movingBox2.width + movingBox1.dx) ||
        (movingBox1.x + movingBox1.dx + movingBox1.width <= movingBox2.x + movingBox1.dx) ||
        (movingBox1.y + movingBox1.dy >= movingBox2.y + movingBox2.height + movingBox1.dy) ||
        (movingBox1.y + movingBox1.dy + movingBox1.height <= movingBox2.y + movingBox1.dy)) {
        return false;
    }
    return true;
}
function movingBoxCanvasCollision(box, canvas) {
    if (box.x + box.dx + box.width <= canvas.width &&
        box.x + box.dx >= 0 &&
        box.y + box.dy + box.height <= canvas.height &&
        box.y + box.dy >= 0) {
        return false;
    }
    else {
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

class Game {
    constructor(canvas) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");
        this.Overworld = new Overworld(this);
        this.BrickCollection = new BrickCollection();
        this.Landscape = new Landscape(this, this.Overworld.getSpawnScene());
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);
        this.Canvas.width = this.Landscape.width;
        this.Canvas.height = this.Landscape.height;
    }
    changeScene() {
        let c = this.Landscape.currentScene.c; // TODO: Rename vars names
        let r = this.Landscape.currentScene.r;
        this.Overworld.map[c][r] = this.Landscape.currentScene; // TODO: ???? what is it ????
        let dc = 0;
        let dr = 0;
        if (leftPressed && !rightPressed && !upPressed && !downPressed) {
            dc = -1;
        }
        else if (!leftPressed && rightPressed && !upPressed && !downPressed) {
            dc = 1;
        }
        else if (!leftPressed && !rightPressed && upPressed && !downPressed) {
            dr = -1;
        }
        else if (!leftPressed && !rightPressed && !upPressed && downPressed) {
            dr = 1;
        }
        else {
            this.Player.dx = 0;
            this.Player.dy = 0;
            return;
        }
        if (!(c + dc < 0 || c + dc > this.Overworld.nbCol - 1 || r + dr < 0 || r + dr > this.Overworld.nbRow - 1)) {
            this.Landscape = new Landscape(this, this.Overworld.map[c + dc][r + dr]);
            this.Enemies = new Enemies(this);
            if (leftPressed) {
                this.Player.x = this.Canvas.width - this.Player.width;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            }
            else if (rightPressed) {
                this.Player.x = 0;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            }
            else if (upPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = this.Canvas.height - this.Player.height;
            }
            else if (downPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = 0;
            }
            this.Player.dx = 0;
            this.Player.dy = 0;
        }
    }
    drawHud() {
        this.ctx.font = "16px Ubuntu";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("HP: " + this.Player.hp + " Score: " + this.Player.score + "/" + (this.Overworld.nbRow * this.Overworld.nbCol), 8, 20);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.Player.checkInvicibility();
        this.Sword.events();
        this.Landscape.draw();
        this.Enemies.draw();
        this.Player.draw();
        this.Sword.draw();
        this.drawHud();
        this.Player.preMove();
        this.Enemies.preMove();
        this.Player.collisions();
        this.Sword.collisions();
        this.Enemies.collisions();
        this.Landscape.collisions();
        this.Player.move();
        this.Enemies.move();
        this.Sword.reset();
    }
}

class Landscape {
    constructor(game, scene) {
        this.Game = game;
        this.Scene = scene;
    }
    get currentScene() {
        return this.Scene;
    }
    get cellSize() {
        return this.Scene.cellSize;
    }
    get nbRow() {
        return this.Scene.nbRow;
    }
    get nbCol() {
        return this.Scene.nbCol;
    }
    get width() {
        return this.Scene.cellSize * this.Scene.nbCol;
    }
    get height() {
        return this.Scene.cellSize * this.Scene.nbRow;
    }
    loopCells(callback) {
        for (let col = 0; col < this.nbCol; col++) {
            for (let row = 0; row < this.nbRow; row++) {
                callback(col, row);
            }
        }
    }
    draw() {
        this.loopCells((col, row) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this.Game.BrickCollection.get(this.Scene.cell(col, row).brick).img, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
            this.Game.ctx.closePath();
        });
    }
    collisions() {
        this.loopCells((col, row) => {
            if (this.Game.BrickCollection.get(this.Scene.cell(col, row).brick).hasCollisions) {
                movingBoxCollision(this.Game.Player, this.Scene.cell(col, row));
                this.Game.Enemies.loopEnemies((enemy) => {
                    if (movingBoxCollision(enemy, this.Scene.cell(col, row))) {
                        if (enemy.dirY == "Up") {
                            enemy.dirY = "Down";
                        }
                        else {
                            enemy.dirY = "Up";
                        }
                    }
                });
            }
        });
    }
}

class Scene {
    constructor(overworld, c, r) {
        this._cells = [];
        this._nbRow = 11;
        this._nbCol = 16;
        this._cellSize = 50;
        this._hasEnemies = true;
        this.Overworld = overworld;
        this._c = c;
        this._r = r;
        for (let c = 0; c < this._nbCol; c++) {
            this._cells[c] = [];
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[c][r] = {
                    x: this.cellSize * c,
                    y: this.cellSize * r,
                    width: this.cellSize,
                    height: this.cellSize,
                    brick: "default",
                };
            }
        }
        if (this._c == 0) {
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[0][r].brick = "wall";
            }
        }
        if (this._c == this.Overworld.nbCol - 1) {
            for (let r = 0; r < this._nbRow; r++) {
                this._cells[this._nbCol - 1][r].brick = "wall";
            }
        }
        if (this._r == 0) {
            for (let c = 0; c < this._nbCol; c++) {
                this._cells[c][0].brick = "wall";
            }
        }
        if (this._r == this.Overworld.nbRow - 1) {
            for (let c = 0; c < this._nbCol; c++) {
                this._cells[c][this._nbRow - 1].brick = "wall";
            }
        }
    }
    cell(col, row) {
        return this._cells[col][row];
    }
    get c() {
        return this._c;
    }
    get r() {
        return this._r;
    }
    get nbRow() {
        return this._nbRow;
    }
    get nbCol() {
        return this._nbCol;
    }
    get cellSize() {
        return this._cellSize;
    }
    get hasEnemies() {
        return this._hasEnemies;
    }
    set hasEnemies(hasEnemies) {
        this._hasEnemies = hasEnemies;
    }
}
class Overworld {
    constructor(game) {
        this._map = [];
        this._nbRow = 3;
        this._nbCol = 3;
        this._spawnSceneColl = 1;
        this._spawnSceneRow = 1;
        this.Game = game;
        for (let c = 0; c < this._nbCol; c++) {
            this._map[c] = [];
            for (let r = 0; r < this._nbRow; r++) {
                this._map[c][r] = new Scene(this, c, r);
            }
        }
    }
    get map() {
        return this._map;
    }
    get nbCol() {
        return this._nbCol;
    }
    get nbRow() {
        return this._nbRow;
    }
    getSpawnScene() {
        return this._map[this._spawnSceneColl - 1][this._spawnSceneRow - 1];
    }
}

class Player {
    constructor(game) {
        this._dx = 0;
        this._dy = 0;
        this._direction = "Down"; // TODO: Use enum Direction {Up, Right, Down, Bottom};
        this._frame = 0;
        this._animationSpeed = 20;
        this._animationStep = 1;
        this._nbAnimationStep = 2;
        this._width = 40;
        this._height = 40;
        this._speed = 2;
        this._speedUp = 3;
        this._hp = 100;
        this._isInvincible = false;
        this._invincibleTime = 0;
        this._score = 0;
        this._imgUp = [];
        this._imgRight = [];
        this._imgDown = [];
        this._imgLeft = [];
        this.Game = game;
        this._x = this.Game.Landscape.cellSize;
        this._y = this.Game.Landscape.cellSize;
        this._imgUp[1] = new Image();
        this._imgUp[1].src = "./sprites/png/link-up1.png";
        this._imgUp[2] = new Image();
        this._imgUp[2].src = "./sprites/png/link-up2.png";
        this._imgRight[1] = new Image();
        this._imgRight[1].src = "./sprites/png/link-right1.png";
        this._imgRight[2] = new Image();
        this._imgRight[2].src = "./sprites/png/link-right2.png";
        this._imgDown[1] = new Image();
        this._imgDown[1].src = "./sprites/png/link-down1.png";
        this._imgDown[2] = new Image();
        this._imgDown[2].src = "./sprites/png/link-down2.png";
        this._imgLeft[1] = new Image();
        this._imgLeft[1].src = "./sprites/png/link-left1.png";
        this._imgLeft[2] = new Image();
        this._imgLeft[2].src = "./sprites/png/link-left2.png";
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
    get dx() {
        return this._dx;
    }
    set dx(dx) {
        this._dx = dx;
    }
    get dy() {
        return this._dy;
    }
    set dy(dy) {
        this._dy = dy;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get hp() {
        return this._hp;
    }
    get score() {
        return this._score;
    }
    increaseScore() {
        this._score++;
        if (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol <= this._score) {
            alert("You win !");
            document.location.reload();
        }
    }
    draw() {
        if (leftPressed || rightPressed || upPressed || downPressed) {
            this._frame += speedUpPressed ? 2 : 1;
        }
        if (this._frame >= this._animationSpeed) {
            this._frame = 0;
            this._animationStep = (this._animationStep + 1 > this._nbAnimationStep) ? 1 : this._animationStep + 1;
        }
        this.Game.ctx.beginPath();
        this.Game.ctx.drawImage(this["_img" + this._direction][this._animationStep], this._x, this._y, this._width, this._height);
        this.Game.ctx.closePath();
    }
    move() {
        this._x += this._dx;
        this._y += this._dy;
        this._dx = 0;
        this._dy = 0;
    }
    collisions() {
        if (movingBoxCanvasCollision(this, this.Game.Canvas)) {
            this.Game.changeScene();
        }
    }
    preMove() {
        let speed = speedUpPressed ? this._speedUp : this._speed;
        if (!(rightPressed && leftPressed)) {
            if (rightPressed) {
                this._dx = speed;
            }
            else if (leftPressed) {
                this._dx = -speed;
            }
        }
        if (!(downPressed && upPressed)) {
            if (downPressed) {
                this._dy = speed;
            }
            else if (upPressed) {
                this._dy = -speed;
            }
        }
        if (upPressed) {
            this._direction = "Up";
        }
        else if (downPressed) {
            this._direction = "Down";
        }
        else if (leftPressed) {
            this._direction = "Left";
        }
        else if (rightPressed) {
            this._direction = "Right";
        }
    }
    takeDamage(damage) {
        if (this._isInvincible) {
            return;
        }
        if (this._hp - damage >= 0) {
            this._hp -= damage;
        }
        else {
            this._hp = 0;
        }
        this.setInvicibility();
        if (this._hp <= 0) {
            alert("Game Over !");
            document.location.reload();
        }
    }
    takeKnockBack() {
        switch (this._direction) {
            case 'Up':
                this._dy = this.Game.Landscape.cellSize;
                break;
            case 'Right':
                this._dx = -this.Game.Landscape.cellSize;
                break;
            case 'Down':
                this._dy = -this.Game.Landscape.cellSize;
                break;
            case 'Left':
                this._dx = this.Game.Landscape.cellSize;
                break;
        }
    }
    setInvicibility() {
        this._isInvincible = true;
        this._invincibleTime = performance.now();
    }
    checkInvicibility() {
        if (this._isInvincible && this._invincibleTime + 1000 < performance.now()) {
            this._isInvincible = false;
        }
    }
}

class Sword {
    constructor(game) {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this._swordWidth = 32;
        this._swordHeight = 14;
        this._imgUp = new Image();
        this._imgRight = new Image();
        this._imgDown = new Image();
        this._imgLeft = new Image();
        this.Game = game;
        this._imgUp.src = "./sprites/png/sword-up.png";
        this._imgRight.src = "./sprites/png/sword-right.png";
        this._imgDown.src = "./sprites/png/sword-down.png";
        this._imgLeft.src = "./sprites/png/sword-left.png";
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    draw() {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            this.Game.ctx.beginPath();
            if (upPressed) {
                this.Game.ctx.drawImage(this._imgUp, this._x, this._y, this._width, this._height);
            }
            else if (downPressed) {
                this.Game.ctx.drawImage(this._imgDown, this._x, this._y, this._width, this._height);
            }
            else if (leftPressed) {
                this.Game.ctx.drawImage(this._imgLeft, this._x, this._y, this._width, this._height);
            }
            else if (rightPressed) {
                this.Game.ctx.drawImage(this._imgRight, this._x, this._y, this._width, this._height);
            }
            this.Game.ctx.closePath();
        }
    }
    collisions() {
        if (attackPressed) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }
    events() {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            if (upPressed) {
                this._x = this.Game.Player.x + (this.Game.Player.width - this._swordHeight) / 2;
                this._y = this.Game.Player.y - this._swordWidth;
                this._width = this._swordHeight;
                this._height = this._swordWidth;
            }
            else if (downPressed) {
                this._x = this.Game.Player.x + (this.Game.Player.width - this._swordHeight) / 2;
                this._y = this.Game.Player.y + this.Game.Player.width;
                this._width = this._swordHeight;
                this._height = this._swordWidth;
            }
            else if (leftPressed) {
                this._x = this.Game.Player.x - this._swordWidth;
                this._y = this.Game.Player.y + (this.Game.Player.height - this._swordHeight) / 2;
                this._width = this._swordWidth;
                this._height = this._swordHeight;
            }
            else if (rightPressed) {
                this._x = this.Game.Player.x + this.Game.Player.width;
                this._y = this.Game.Player.y + (this.Game.Player.height - this._swordHeight) / 2;
                this._width = this._swordWidth;
                this._height = this._swordHeight;
            }
        }
    }
    reset() {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
    }
}
