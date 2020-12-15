class SpriteLoader {
    static load(src) {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}
class SimpleBox {
}
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
;
class MovingBox extends SimpleBox {
    constructor() {
        super(...arguments);
        this.dx = 0;
        this.dy = 0;
    }
}
class AnimatedMovingBox extends MovingBox {
    constructor(game) {
        super();
        this.currentFrame = 0;
        this.currentAnimationStep = 1;
        this.Game = game;
    }
    requestNewFrameAnimation(animationSpeedModifier) {
        if (this.Game.status !== GameStatus.Run)
            return;
        this.currentFrame += 1 * animationSpeedModifier;
        if (this.currentFrame >= this.animationSpeed) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                    ? 1
                    : this.currentAnimationStep + 1;
        }
    }
}

class Brick {
    constructor(src, hasCollisions = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
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

class Enemy extends AnimatedMovingBox {
    constructor(game, x, y, speed, direction) {
        super(game);
        this.sprites = [];
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
    }
    invertDirection() {
        if (this.direction == Direction.Up) {
            this.direction = Direction.Down;
        }
        else {
            this.direction = Direction.Up;
        }
    }
}
class Goomba extends Enemy {
    constructor(game, x, y, speed, direction) {
        super(game, x, y, speed, direction);
        this.width = 40;
        this.height = 40;
        this.animationSpeed = 20;
        this.nbAnimationStep = 2;
        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/goomba1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/goomba2.png");
        this.sprites[Direction.Down] = this.sprites[Direction.Up];
    }
}
class Enemies {
    constructor(game) {
        this.img = new Image();
        this.nbEnemies = 3;
        this.enemies = [];
        this.Game = game;
        if (this.Game.Landscape.currentScene.hasEnemies) {
            for (var i = 0; i < this.nbEnemies; i++) {
                this.enemies[i] = new Goomba(this.Game, getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.width - (this.Game.Landscape.cellSize + 60)), getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Landscape.height - (this.Game.Landscape.cellSize + 60)), getRandomIntInclusive(1, 3), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down);
            }
        }
    }
    loopEnemies(callback) {
        this.enemies.forEach((enemy) => {
            callback(enemy);
        });
    }
    killEnemy(enemy) {
        const enemyIndex = this.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }
        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
            this.Game.Landscape.currentScene.hasEnemies = false;
        }
    }
    draw() {
        this.loopEnemies((enemy) => {
            enemy.requestNewFrameAnimation(enemy.speed);
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(enemy.sprites[enemy.direction][enemy.currentAnimationStep], enemy.x, enemy.y, enemy.width, enemy.height);
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
                enemy.invertDirection();
            }
        });
        this.Game.Landscape.loopCollision((cell, col, row) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxCollision(enemy, cell)) {
                    enemy.invertDirection();
                }
            });
        });
    }
    listenEvents() {
        this.loopEnemies((enemy) => {
            enemy.dx = 0;
            if (enemy.direction == Direction.Down) {
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

class EventManager {
    constructor(game) {
        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;
        this.isDownPressed = false;
        this.isSpeedUpPressed = false;
        this.isAttackPressed = false;
        this.currentAttackFrame = 0;
        this.attackDuration = 20;
        this.Game = game;
        document.addEventListener("keydown", e => this.keydownEvent(e));
        document.addEventListener("keyup", e => this.keyupEvent(e));
    }
    keydownEvent(e) {
        if (e.repeat) {
            e.preventDefault();
            return;
        }
        ;
        let preventDefault = true;
        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = true;
                break;
            case "ArrowLeft":
                this.isLeftPressed = true;
                break;
            case "ArrowUp":
                this.isUpPressed = true;
                break;
            case "ArrowDown":
                this.isDownPressed = true;
                break;
            case "s":
                this.isSpeedUpPressed = true;
                break;
            case "q":
                this.isAttackPressed = true;
                break;
            case "p":
                if (this.Game.status === GameStatus.Run || this.Game.status === GameStatus.Paused) {
                    this.Game.status = this.Game.status === GameStatus.Run
                        ? GameStatus.Paused
                        : GameStatus.Run;
                }
                break;
            default:
                preventDefault = false;
                break;
        }
        if (preventDefault)
            e.preventDefault();
    }
    keyupEvent(e) {
        let preventDefault = true;
        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = false;
                break;
            case "ArrowLeft":
                this.isLeftPressed = false;
                break;
            case "ArrowUp":
                this.isUpPressed = false;
                break;
            case "ArrowDown":
                this.isDownPressed = false;
                break;
            case "s":
                this.isSpeedUpPressed = false;
                break;
            case "q":
                this.isAttackPressed = false;
                break;
            default:
                preventDefault = false;
                break;
        }
        if (preventDefault)
            e.preventDefault();
    }
    newFrame() {
        if (this.isAttackPressed) {
            this.currentAttackFrame++;
            if (this.currentAttackFrame >= this.attackDuration) {
                this.isAttackPressed = false;
            }
            return;
        }
        this.currentAttackFrame = 0;
    }
}

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

var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Run"] = 0] = "Run";
    GameStatus[GameStatus["Paused"] = 1] = "Paused";
})(GameStatus || (GameStatus = {}));
;
class Game {
    constructor(canvas) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");
        this.EventManager = new EventManager(this);
        this.Overworld = new Overworld(this);
        this.BrickCollection = new BrickCollection();
        this.Landscape = new Landscape(this, this.Overworld.getSpawnScene());
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);
        this.Canvas.width = this.Landscape.width;
        this.Canvas.height = this.Landscape.height;
        this.status = GameStatus.Run;
    }
    changeScene() {
        let c = this.Landscape.currentScene.c; // TODO: Rename vars names
        let r = this.Landscape.currentScene.r;
        //this.Overworld.map[c][r] = this.Landscape.currentScene;
        let dc = 0;
        let dr = 0;
        if (this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && !this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dc = -1;
        }
        else if (!this.EventManager.isLeftPressed && this.EventManager.isRightPressed && !this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dc = 1;
        }
        else if (!this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dr = -1;
        }
        else if (!this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && !this.EventManager.isUpPressed && this.EventManager.isDownPressed) {
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
            if (this.EventManager.isLeftPressed) {
                this.Player.x = this.Canvas.width - this.Player.width;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            }
            else if (this.EventManager.isRightPressed) {
                this.Player.x = 0;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            }
            else if (this.EventManager.isUpPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = this.Canvas.height - this.Player.height;
            }
            else if (this.EventManager.isDownPressed) {
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
    loop() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        if (this.status === GameStatus.Run) {
            this.Player.checkInvicibility();
            this.Sword.events();
        }
        this.Landscape.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.drawHud();
        if (this.status === GameStatus.Run) {
            this.Player.listenEvents();
            this.Enemies.listenEvents();
            this.Player.collisions();
            this.Sword.collisions();
            this.Enemies.collisions();
            this.Landscape.collisions();
            this.Player.move();
            this.Enemies.move();
            this.Sword.reset();
            this.EventManager.newFrame();
        }
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
                callback(this.Scene.getCell(col, row), col, row);
            }
        }
    }
    loopCollision(callback) {
        this.loopCells((cell, col, row) => {
            if (this.Game.BrickCollection.get(cell.brick).hasCollisions) {
                callback(cell, col, row);
            }
        });
    }
    draw() {
        this.loopCells((cell, col, row) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this.Game.BrickCollection.get(cell.brick).sprite, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
            this.Game.ctx.closePath();
        });
    }
    collisions() {
    }
}

class Cell extends SimpleBox {
    constructor(x, y, size, brick) {
        super();
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.brick = brick;
    }
}
class Scene {
    constructor(overworld, c, r) {
        this.cells = [];
        this.nbRow = 11;
        this.nbCol = 16;
        this.cellSize = 50;
        this.hasEnemies = true;
        this.Overworld = overworld;
        this.c = c;
        this.r = r;
        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(this.cellSize * c, this.cellSize * r, this.cellSize, "default");
            }
        }
        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = "wall";
            }
        }
        if (this.c == this.Overworld.nbCol - 1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol - 1][r].brick = "wall";
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = "wall";
            }
        }
        if (this.r == this.Overworld.nbRow - 1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow - 1].brick = "wall";
            }
        }
    }
    getCell(col, row) {
        return this.cells[col][row];
    }
}
class Overworld {
    constructor(game) {
        this.map = [];
        this.nbRow = 3;
        this.nbCol = 3;
        this.spawnSceneColl = 1;
        this.spawnSceneRow = 1;
        this.Game = game;
        for (let c = 0; c < this.nbCol; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this, c, r);
            }
        }
    }
    getSpawnScene() {
        return this.map[this.spawnSceneColl - 1][this.spawnSceneRow - 1];
    }
}

class Player extends AnimatedMovingBox {
    constructor(game) {
        super(game);
        this.width = 40;
        this.height = 40;
        this.speed = 2;
        this.speedUp = 3;
        this.isMoving = false;
        this.isAttack = false;
        this.hp = 100;
        this.isInvincible = false;
        this.invincibleTime = 0;
        this.score = 0;
        this.sprites = [];
        this.spritesAttack = [];
        this.x = this.Game.Landscape.cellSize;
        this.y = this.Game.Landscape.cellSize;
        this.direction = Direction.Down;
        this.animationSpeed = 20;
        this.nbAnimationStep = 2;
        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/link-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/link-up2.png");
        this.spritesAttack[Direction.Up] = SpriteLoader.load("./sprites/png/link-up-attack.png");
        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/link-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/link-right2.png");
        this.spritesAttack[Direction.Right] = SpriteLoader.load("./sprites/png/link-right-attack.png");
        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/link-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/link-down2.png");
        this.spritesAttack[Direction.Down] = SpriteLoader.load("./sprites/png/link-down-attack.png");
        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/link-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/link-left2.png");
        this.spritesAttack[Direction.Left] = SpriteLoader.load("./sprites/png/link-left-attack.png");
    }
    increaseScore() {
        this.score++;
        if (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol <= this.score) {
            alert("You win !");
            document.location.reload();
        }
    }
    draw() {
        if (this.isMoving) {
            this.requestNewFrameAnimation(this.Game.EventManager.isSpeedUpPressed ? 2 : 1);
        }
        let sprite = this.isAttack
            ? this.spritesAttack[this.direction]
            : this.sprites[this.direction][this.currentAnimationStep];
        this.Game.ctx.beginPath();
        this.Game.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        this.Game.ctx.closePath();
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.dx = 0;
        this.dy = 0;
    }
    collisions() {
        if (movingBoxCanvasCollision(this, this.Game.Canvas)) {
            this.Game.changeScene();
        }
        this.Game.Landscape.loopCollision((cell, col, row) => {
            movingBoxCollision(this, cell);
        });
    }
    listenEvents() {
        if (this.Game.EventManager.isAttackPressed) {
            this.isAttack = true;
            return;
        }
        // this.currentAttackFrame = 0;
        this.isAttack = false;
        let speed = this.Game.EventManager.isSpeedUpPressed ? this.speedUp : this.speed;
        if ((this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) && !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)) {
            if (this.Game.EventManager.isDownPressed) {
                this.dy = speed;
                this.direction = Direction.Down;
            }
            else if (this.Game.EventManager.isUpPressed) {
                this.dy = -speed;
                this.direction = Direction.Up;
            }
        }
        else if ((this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) && !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)) {
            if (this.Game.EventManager.isRightPressed) {
                this.dx = speed;
                this.direction = Direction.Right;
            }
            else if (this.Game.EventManager.isLeftPressed) {
                this.dx = -speed;
                this.direction = Direction.Left;
            }
        }
        this.isMoving =
            this.dx != 0 || this.dy != 0
                ? true
                : false;
    }
    takeDamage(damage) {
        if (this.isInvincible) {
            return;
        }
        if (this.hp - damage >= 0) {
            this.hp -= damage;
        }
        else {
            this.hp = 0;
        }
        this.setInvicibility();
        if (this.hp <= 0) {
            alert("Game Over !");
            document.location.reload();
        }
    }
    takeKnockBack() {
        switch (this.direction) {
            case Direction.Up:
                this.dy = this.Game.Landscape.cellSize;
                break;
            case Direction.Right:
                this.dx = -this.Game.Landscape.cellSize;
                break;
            case Direction.Down:
                this.dy = -this.Game.Landscape.cellSize;
                break;
            case Direction.Left:
                this.dx = this.Game.Landscape.cellSize;
                break;
        }
    }
    setInvicibility() {
        this.isInvincible = true;
        this.invincibleTime = performance.now();
    }
    checkInvicibility() {
        if (this.isInvincible && this.invincibleTime + 1000 < performance.now()) {
            this.isInvincible = false;
        }
    }
}

class Sword extends SimpleBox {
    constructor(game) {
        super();
        this.swordWidth = 32;
        this.swordHeight = 14;
        this.sprites = [];
        this.Game = game;
        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/sword-up.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/sword-right.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/sword-down.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/sword-left.png");
    }
    draw() {
        if (this.Game.Player.isAttack) {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this.sprites[this.Game.Player.direction], this.x, this.y, this.width, this.height);
            this.Game.ctx.closePath();
        }
    }
    collisions() {
        if (this.Game.Player.isAttack) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }
    events() {
        if (this.Game.Player.isAttack) {
            if (this.Game.Player.direction == Direction.Up) {
                this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
                this.y = this.Game.Player.y - this.swordWidth + 8;
                this.width = this.swordHeight;
                this.height = this.swordWidth;
            }
            else if (this.Game.Player.direction == Direction.Down) {
                this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
                this.y = this.Game.Player.y + this.Game.Player.width - 8;
                this.width = this.swordHeight;
                this.height = this.swordWidth;
            }
            else if (this.Game.Player.direction == Direction.Left) {
                this.x = this.Game.Player.x - this.swordWidth + 8;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
            else if (this.Game.Player.direction == Direction.Right) {
                this.x = this.Game.Player.x + this.Game.Player.width - 8;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
        }
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}
