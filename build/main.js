class SpriteLoader {
    static load(src) {
        let sprite = new Image();
        sprite.src = src;
        return sprite;
    }
}
class AudioLoader {
    static load(src, loop = false) {
        let audio = new Audio(src);
        audio.loop = loop;
        return audio;
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
class GameAnimation {
    constructor(animationStepDuration, nbAnimationStep) {
        this.currentFrame = 0;
        this.currentAnimationStep = 1;
        this.animationStepDuration = animationStepDuration;
        this.nbAnimationStep = nbAnimationStep;
    }
    requestNewFrameAnimation() {
        this.currentFrame++;
        if (this.currentFrame >= this.animationStepDuration) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                    ? 1
                    : this.currentAnimationStep + 1;
        }
    }
}
class MovingBoxHitBox {
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

class Brick {
    constructor(src, hasCollisions = false) {
        this.sprite = SpriteLoader.load(src);
        this.hasCollisions = hasCollisions;
    }
}
class DefaultBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/default.png");
    }
}
class TreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/tree.png", true);
    }
}
class WallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall.png", true);
    }
}
class WallTopBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top.png", true);
    }
}
class WallTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top-right.png", true);
    }
}
class WallTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-top-left.png", true);
    }
}
class WallBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-bottom-right.png", true);
    }
}
class WallBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall-bottom-left.png", true);
    }
}

class Enemy extends MovingBox {
    constructor(game, x, y, speed, direction) {
        super();
        this.sprites = [];
        this.Game = game;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
        // this.landscapeHitBox = new MovingBoxHitBox(this);
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
class Octorok extends Enemy {
    constructor(game, x, y, speed, direction) {
        super(game, x, y, speed, direction);
        this.width = 64;
        this.height = 64;
        this.sprites[Direction.Up] = [];
        this.sprites[Direction.Up][1] = SpriteLoader.load("./sprites/png/octorok-up1.png");
        this.sprites[Direction.Up][2] = SpriteLoader.load("./sprites/png/octorok-up2.png");
        this.sprites[Direction.Down] = [];
        this.sprites[Direction.Down][1] = SpriteLoader.load("./sprites/png/octorok-down1.png");
        this.sprites[Direction.Down][2] = SpriteLoader.load("./sprites/png/octorok-down2.png");
        this.spritesAnimation = new GameAnimation(20 / speed, 2);
        this.dieSound = AudioLoader.load("./sounds/effect/Enemy_Die.wav");
    }
}
class Enemies {
    constructor(game) {
        this.img = new Image();
        this.nbEnemies = 3;
        this.enemies = [];
        this.Game = game;
        if (this.Game.Viewport.currentScene.hasEnemies) {
            for (var i = 0; i < this.nbEnemies; i++) {
                this.enemies[i] = new Octorok(this.Game, getRandomIntInclusive(this.Game.Viewport.cellSize * 2, this.Game.Viewport.width - (this.Game.Viewport.cellSize * 2)), getRandomIntInclusive(this.Game.Viewport.cellSize * 2, this.Game.Viewport.height - (this.Game.Viewport.cellSize * 2)), getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down);
            }
        }
    }
    loopEnemies(callback) {
        this.enemies.forEach((enemy) => {
            callback(enemy);
        });
    }
    killEnemy(enemy) {
        enemy.dieSound.play();
        const enemyIndex = this.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
            this.enemies.splice(enemyIndex, 1);
        }
        if (this.Game.Enemies.enemies.length <= 0) {
            this.Game.Player.increaseScore();
            this.Game.Viewport.currentScene.hasEnemies = false;
        }
    }
    draw() {
        this.loopEnemies((enemy) => {
            if (this.Game.status === GameStatus.Run)
                enemy.spritesAnimation.requestNewFrameAnimation(enemy.speed);
            this.Game.Viewport.currentScene.drawImage(enemy.sprites[enemy.direction][enemy.spritesAnimation.currentAnimationStep], enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }
    collisions() {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy) && !this.Game.Player.isInvincible) {
                this.Game.Player.takeDamage(1);
                this.Game.Player.takeKnockBack();
            }
            if (movingBoxCanvasCollision(enemy, this.Game.Viewport)) {
                enemy.invertDirection();
            }
        });
        this.Game.Viewport.loopCollision((cell, col, row) => {
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
        this.isAttackPressed = false;
        this.currentAttackFrame = 0;
        this.attackDuration = 10;
        this.Game = game;
        document.addEventListener("keydown", e => this.keyEvent(e, true));
        document.addEventListener("keyup", e => this.keyEvent(e, false));
    }
    keyEvent(e, keydown) {
        if (e.repeat) {
            e.preventDefault();
            return;
        }
        ;
        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = keydown;
                break;
            case "ArrowLeft":
                this.isLeftPressed = keydown;
                break;
            case "ArrowUp":
                this.isUpPressed = keydown;
                break;
            case "ArrowDown":
                this.isDownPressed = keydown;
                break;
            case "q":
                if (keydown) {
                    this.isAttackPressed = true;
                }
                break;
            case "p":
                if (keydown && (this.Game.status === GameStatus.Run || this.Game.status === GameStatus.Stopped)) {
                    this.Game.status = this.Game.status === GameStatus.Run
                        ? GameStatus.Stopped
                        : GameStatus.Run;
                }
                break;
        }
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
function movingBoxsCollision(movingBox1, movingBox2) {
    if ((movingBox1.x + movingBox1.dx >= movingBox2.x + movingBox2.width + movingBox1.dx) ||
        (movingBox1.x + movingBox1.dx + movingBox1.width <= movingBox2.x + movingBox1.dx) ||
        (movingBox1.y + movingBox1.dy >= movingBox2.y + movingBox2.height + movingBox1.dy) ||
        (movingBox1.y + movingBox1.dy + movingBox1.height <= movingBox2.y + movingBox1.dy)) {
        return false;
    }
    return true;
}
function simpleMovingBoxCanvasCollision(movingBox, canvas) {
    if (movingBox.x + movingBox.dx + movingBox.width <= canvas.width &&
        movingBox.x + movingBox.dx >= 0 &&
        movingBox.y + movingBox.dy + movingBox.height <= canvas.height &&
        movingBox.y + movingBox.dy >= 0) {
        return false;
    }
    else {
        return true;
    }
}
function movingBoxCanvasCollision(movingBox, canvas) {
    if (!simpleMovingBoxCanvasCollision(movingBox, canvas)) {
        return false;
    }
    else {
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

var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Run"] = 0] = "Run";
    GameStatus[GameStatus["Stopped"] = 1] = "Stopped";
    GameStatus[GameStatus["SlideScene"] = 2] = "SlideScene";
    GameStatus[GameStatus["GameOver"] = 3] = "GameOver";
    GameStatus[GameStatus["Win"] = 4] = "Win";
})(GameStatus || (GameStatus = {}));
;
class Game {
    constructor(canvas) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");
        this.EventManager = new EventManager(this);
        this.World = new World(this);
        this.Viewport = new Viewport(this);
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);
        this.Hud = new Hud(this);
        this.GameOverScreen = new GameOverScreen(this);
        this.WinScreen = new WinScreen(this);
        this.Viewport.y = this.Hud.height;
        this.Hud.width = this.Viewport.width;
        this.Canvas.width = this.Viewport.width;
        this.Canvas.height = this.Viewport.height + this.Hud.height;
        this.Player.x = this.Viewport.cellSize * this.World.spawnCellColl;
        this.Player.y = this.Viewport.cellSize * this.World.spawnCellRow;
        this.status = GameStatus.Run;
    }
    run() {
        window.requestAnimationFrame(() => this.run());
        this.loop();
    }
    loop() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        switch (this.status) {
            case GameStatus.Run:
                this.runLoop();
                break;
            case GameStatus.Stopped:
                this.stoppedLoop();
                break;
            case GameStatus.SlideScene:
                this.slideSceneLoop();
                break;
            case GameStatus.GameOver:
                this.gameOverLoop();
                break;
            case GameStatus.Win:
                this.winLoop();
                break;
            default:
                this.runLoop();
                break;
        }
    }
    runLoop() {
        this.Sword.listenEvents();
        this.Player.listenEvents();
        this.Enemies.listenEvents();
        this.Player.collisions();
        this.Sword.collisions();
        this.Enemies.collisions();
        this.Viewport.collisions();
        this.Player.move();
        this.Enemies.move();
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Hud.draw();
        this.Sword.reset();
        this.Player.reset();
        this.EventManager.newFrame();
    }
    stoppedLoop() {
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Hud.draw();
    }
    gameOverLoop() {
        this.GameOverScreen.draw();
    }
    winLoop() {
        this.WinScreen.draw();
    }
    slideSceneLoop() {
        this.Viewport.slideSceneAnimationMove();
        this.Player.slideSceneAnimationMove();
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Hud.draw();
    }
    drawImage(sprite, x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(sprite, x, y, width, height);
        this.ctx.closePath();
    }
    fillRect(x, y, width, height, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.closePath();
    }
    fillText(text, x, y, color, fontSize = '16px', textAlign = 'left', textBaseline = 'alphabetic') {
        this.ctx.beginPath();
        this.ctx.font = fontSize + ' NES-font';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    }
}

class GameOverScreen {
    constructor(game) {
        this.Game = game;
        this.currentFrame = 0;
        this.playerRotationAnimationDuration = 100;
        this.playerRotationAnimationSpeed = 8;
        this.blackScreen = 180; // die music duration is 156
        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);
    }
    draw() {
        this.Game.Viewport.draw();
        this.Game.Enemies.draw();
        this.Game.Sword.draw();
        this.Game.Hud.draw();
        this.currentFrame++;
        if (this.currentFrame < this.playerRotationAnimationDuration) {
            if (this.currentFrame % this.playerRotationAnimationSpeed === 0) {
                switch (this.Game.Player.direction) {
                    case Direction.Up:
                        this.Game.Player.direction = Direction.Right;
                        break;
                    case Direction.Right:
                        this.Game.Player.direction = Direction.Down;
                        break;
                    case Direction.Down:
                        this.Game.Player.direction = Direction.Left;
                        break;
                    case Direction.Left:
                        this.Game.Player.direction = Direction.Up;
                        break;
                }
            }
            this.Game.Player.draw();
            return;
        }
        if (this.currentFrame < this.blackScreen) {
            return;
        }
        this.music.play();
        this.Game.fillRect(0, 0, this.Game.Canvas.width, this.Game.Canvas.height, "#000");
        this.Game.fillText("GAME OVER", this.Game.Canvas.width / 2, this.Game.Canvas.height / 2, '#fff', '24px', 'center', 'middle');
    }
}

class Hud {
    constructor(game) {
        this.Game = game;
        this.x = 0;
        this.y = 0;
        this.height = 64;
        this.emptyHeartSprite = SpriteLoader.load('./sprites/png/empty-heart.png');
        this.halfHeartSprite = SpriteLoader.load('./sprites/png/half-heart.png');
        this.fullHeartSprite = SpriteLoader.load('./sprites/png/full-heart.png');
    }
    draw() {
        this.Game.fillRect(this.x, this.y, this.width, this.height, '#000');
        this.drawHearts();
        this.drawScore();
    }
    drawHearts() {
        for (let i = 1; i <= this.Game.Player.maxHp / 2; i++) {
            this.Game.drawImage(this.emptyHeartSprite, 24 * i + 8 * i, this.height / 2 - 12, 24, 24);
        }
        for (let i = 1; i <= this.Game.Player.hp / 2; i++) {
            this.Game.drawImage(this.fullHeartSprite, 24 * i + 8 * i, this.height / 2 - 12, 24, 24);
        }
        if (this.Game.Player.hp % 2 === 1) {
            this.Game.drawImage(this.halfHeartSprite, 24 * (this.Game.Player.hp / 2 + 1) + 8 * (this.Game.Player.hp / 2 - 1), this.height / 2 - 12, 24, 24);
        }
    }
    drawScore() {
        this.Game.fillText(' SCORE: ' + this.Game.Player.score + '/' + (this.Game.World.nbRow * this.Game.World.nbCol), this.width - (this.height / 2) + this.x, this.y + this.height / 2, '#fff', '16px', 'right', 'middle');
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
    constructor(game, overworld, c, r, music) {
        this.cells = [];
        this.Game = game;
        this.World = overworld;
        this.nbRow = 11;
        this.nbCol = 16;
        this.cellSize = 64;
        this.hasEnemies = false;
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.r = r;
        this.music = music;
        this.defaultBrick = new DefaultBrick();
        this.defaultWallBrick = new WallBrick();
        for (let c = 0; c < this.nbCol; c++) {
            this.cells[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[c][r] = new Cell(this.cellSize * c, this.cellSize * r, this.cellSize, this.defaultBrick);
            }
        }
        if (this.c == 0) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[0][r].brick = this.defaultWallBrick;
            }
        }
        if (this.c == this.World.nbCol - 1) {
            for (let r = 0; r < this.nbRow; r++) {
                this.cells[this.nbCol - 1][r].brick = this.defaultWallBrick;
            }
        }
        if (this.r == 0) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][0].brick = this.defaultWallBrick;
            }
        }
        if (this.r == this.World.nbRow - 1) {
            for (let c = 0; c < this.nbCol; c++) {
                this.cells[c][this.nbRow - 1].brick = this.defaultWallBrick;
            }
        }
    }
    getCell(col, row) {
        return this.cells[col][row];
    }
    loadBricks(bricks) {
        bricks.forEach((row, r) => {
            row.forEach((brick, c) => {
                this.cells[c][r].brick = brick;
            });
        });
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.Viewport.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
}
class World {
    constructor(game) {
        this.map = [];
        this.Game = game;
        this.nbRow = 3;
        this.nbCol = 3;
        this.spawnSceneColl = 1;
        this.spawnSceneRow = 2;
        this.spawnCellColl = 7;
        this.spawnCellRow = 6;
        for (let c = 0; c < this.nbCol; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.map[c][r] = new Scene(this.Game, this, c, r, AudioLoader.load("./sounds/music/overworld.mp3", true));
            }
        }
        this.map[1][1].music = AudioLoader.load("./sounds/music/dungeon.mp3", true);
        this.map[1][2].loadBricks([
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopBrick()],
            [new WallTopBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()]
        ]);
        this.map[1][2].hasEnemies = false;
        this.map[2][2].loadBricks([
            [new WallBrick(), new WallBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallTopBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick()],
        ]);
    }
    getSpawnScene() {
        return this.map[this.spawnSceneColl][this.spawnSceneRow];
    }
}

class Player extends MovingBox {
    constructor(game) {
        super();
        this.sprites = [];
        this.spritesAttack = [];
        this.Game = game;
        this.isMoving = false;
        this.isAttack = false;
        this.isInvincible = false;
        this.score = 0;
        this.width = 64;
        this.height = 64;
        this.x = 0;
        this.y = 0;
        this.speed = 5;
        this.maxHp = 6;
        this.hp = this.maxHp;
        this.invincibleDuration = 2000;
        this.direction = Direction.Down;
        // | -- | -- |
        // | -- | -- |
        // | ** | ** |
        // | ** | ** |
        this.hitBox = new MovingBoxHitBox(this, 0, this.height / 2, this.width, this.height / 2);
        // HalfHitBoxs are used by the passBetweenHelper() function
        // | -- | -- |
        // | -- | -- |
        // | ** | -- |
        // | ** | -- |
        this.halfLeftHitBox = new MovingBoxHitBox(this, 0, this.height / 2, this.width / 2, this.height / 2);
        // | -- | -- |
        // | -- | -- |
        // | -- | ** |
        // | -- | ** |
        this.halfRightHitBox = new MovingBoxHitBox(this, this.width / 2, this.height / 2, this.width / 2, this.height / 2);
        // | -- | -- |
        // | -- | -- |
        // | ** | ** |
        // | -- | -- |
        this.halfUpHitBox = new MovingBoxHitBox(this, 0, this.height / 2, this.width, this.height / 4);
        // | -- | -- |
        // | -- | -- |
        // | -- | -- |
        // | ** | ** |
        this.halfDownHitBox = new MovingBoxHitBox(this, 0, (this.height / 4) * 3, this.width, this.height / 4);
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
        this.spritesAnimation = new GameAnimation(6, 2);
        this.invincibleAnimation = new GameAnimation(7, 2);
        this.hurtSound = AudioLoader.load("./sounds/effect/Link_Hurt.wav");
        this.dieSound = AudioLoader.load("./sounds/effect/Link_Die.wav");
        this.lowHealthSound = AudioLoader.load("./sounds/effect/Low_Health.wav", true);
    }
    increaseScore() {
        this.score++;
        if (this.Game.World.nbRow * this.Game.World.nbCol <= this.score) {
            this.isInvincible = false;
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.Game.status = GameStatus.Win;
        }
    }
    draw() {
        if (this.isMoving && this.Game.status !== GameStatus.Stopped) {
            this.spritesAnimation.requestNewFrameAnimation();
        }
        let sprite = this.isAttack
            ? this.spritesAttack[this.direction]
            : this.sprites[this.direction][this.spritesAnimation.currentAnimationStep];
        if (this.isInvincible) {
            this.invincibleAnimation.requestNewFrameAnimation();
            if (this.invincibleAnimation.currentAnimationStep === 2)
                sprite = new Image();
        }
        this.Game.Viewport.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.dx = 0;
        this.dy = 0;
    }
    slideSceneAnimationMove() {
        if (this.Game.Viewport.dc === 1) {
            this.dx = -this.Game.Viewport.slideSceneAnimationSpeed;
        }
        else if (this.Game.Viewport.dc === -1) {
            this.dx = this.Game.Viewport.slideSceneAnimationSpeed;
        }
        else if (this.Game.Viewport.dr === 1) {
            this.dy = -this.Game.Viewport.slideSceneAnimationSpeed;
        }
        else if (this.Game.Viewport.dr === -1) {
            this.dy = this.Game.Viewport.slideSceneAnimationSpeed;
        }
        movingBoxCanvasCollision(this, this.Game.Viewport);
        this.isMoving = true;
        this.move();
    }
    // Helper to pass between two boxes
    passBetweenBoxesHelper() {
        let halfLeftCollision = false;
        let halfRightCollision = false;
        let halfUpCollision = false;
        let halfDownCollision = false;
        this.Game.Viewport.loopCollision((cell, col, row) => {
            if (simpleMovingBoxCollision(this.halfLeftHitBox, cell)) {
                halfLeftCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfRightHitBox, cell)) {
                halfRightCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfUpHitBox, cell)) {
                halfUpCollision = true;
            }
            if (simpleMovingBoxCollision(this.halfDownHitBox, cell)) {
                halfDownCollision = true;
            }
        });
        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            if (halfLeftCollision && !halfRightCollision) {
                this.dx = this.speed;
            }
            else if (!halfLeftCollision && halfRightCollision) {
                this.dx = -this.speed;
            }
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            if (halfUpCollision && !halfDownCollision) {
                this.dy = this.speed;
            }
            else if (!halfUpCollision && halfDownCollision) {
                this.dy = -this.speed;
            }
        }
    }
    collisions() {
        if (movingBoxCanvasCollision(this, this.Game.Viewport)) {
            this.Game.Viewport.slideScene(this.direction);
        }
        this.passBetweenBoxesHelper();
        this.Game.Viewport.loopCollision((cell, col, row) => {
            movingBoxCollision(this.hitBox, cell);
        });
    }
    listenEvents() {
        this.isAttack = this.Game.EventManager.isAttackPressed
            ? true
            : false;
        if ((this.Game.EventManager.isDownPressed || this.Game.EventManager.isUpPressed) &&
            !(this.Game.EventManager.isDownPressed && this.Game.EventManager.isUpPressed)) {
            if (this.Game.EventManager.isDownPressed) {
                if (!this.Game.EventManager.isAttackPressed)
                    this.dy = this.speed;
                this.direction = Direction.Down;
            }
            else if (this.Game.EventManager.isUpPressed) {
                if (!this.Game.EventManager.isAttackPressed)
                    this.dy = -this.speed;
                this.direction = Direction.Up;
            }
        }
        else if ((this.Game.EventManager.isRightPressed || this.Game.EventManager.isLeftPressed) &&
            !(this.Game.EventManager.isRightPressed && this.Game.EventManager.isLeftPressed)) {
            if (this.Game.EventManager.isRightPressed) {
                if (!this.Game.EventManager.isAttackPressed)
                    this.dx = this.speed;
                this.direction = Direction.Right;
            }
            else if (this.Game.EventManager.isLeftPressed) {
                if (!this.Game.EventManager.isAttackPressed)
                    this.dx = -this.speed;
                this.direction = Direction.Left;
            }
        }
        this.isMoving = this.dx != 0 || this.dy != 0
            ? true
            : false;
    }
    takeDamage(damage) {
        if (this.isInvincible)
            return;
        if (this.hp - damage >= 0) {
            this.hurtSound.play();
            this.hp -= damage;
        }
        else {
            this.hp = 0;
        }
        this.setInvicibility();
        if (this.hp <= 0) {
            this.isInvincible = false;
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.dieSound.play();
            this.Game.status = GameStatus.GameOver;
        }
        else if (this.hp <= 2) {
            this.lowHealthSound.play();
        }
    }
    takeKnockBack() {
        switch (this.direction) {
            case Direction.Up:
                this.dy = this.Game.Viewport.cellSize;
                break;
            case Direction.Right:
                this.dx = -this.Game.Viewport.cellSize;
                break;
            case Direction.Down:
                this.dy = -this.Game.Viewport.cellSize;
                break;
            case Direction.Left:
                this.dx = this.Game.Viewport.cellSize;
                break;
        }
        movingBoxCanvasCollision(this, this.Game.Viewport);
        this.Game.Viewport.loopCollision((cell, col, row) => {
            movingBoxCollision(this, cell);
        });
    }
    setInvicibility() {
        this.isInvincible = true;
        this.invincibleTime = performance.now();
    }
    reset() {
        this.isMoving = false;
        if (this.isInvincible && this.invincibleTime + this.invincibleDuration < performance.now()) {
            this.isInvincible = false;
        }
    }
}

class Sword extends SimpleBox {
    constructor(game) {
        super();
        this.sprites = [];
        this.Game = game;
        this.swordWidth = 64;
        this.swordHeight = 28;
        this.swordHandleWidth = 16;
        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/sword-up.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/sword-right.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/sword-down.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/sword-left.png");
        this.slashSound = AudioLoader.load("./sounds/effect/Sword_Slash.wav");
    }
    draw() {
        if (this.Game.Player.isAttack) {
            this.Game.Viewport.drawImage(this.sprites[this.Game.Player.direction], this.x, this.y, this.width, this.height);
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
    listenEvents() {
        if (this.Game.Player.isAttack) {
            if (this.Game.Player.direction == Direction.Up) {
                this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
                this.y = this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
                this.width = this.swordHeight;
                this.height = this.swordWidth;
            }
            else if (this.Game.Player.direction == Direction.Down) {
                this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
                this.y = this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth;
                this.width = this.swordHeight;
                this.height = this.swordWidth;
            }
            else if (this.Game.Player.direction == Direction.Left) {
                this.x = this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
            else if (this.Game.Player.direction == Direction.Right) {
                this.x = this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
            this.slashSound.play();
        }
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

class Viewport {
    constructor(game) {
        this.Game = game;
        this.currentScene = this.Game.World.getSpawnScene();
        this.nextScene = null;
        this.music = this.currentScene.music;
        this.music.play();
        this.x = 0;
        this.y = 0;
        this.dr = 0;
        this.dc = 0;
        this.slideSceneAnimationSpeed = 10;
    }
    get cellSize() {
        return this.currentScene.cellSize;
    }
    get nbRow() {
        return this.currentScene.nbRow;
    }
    get nbCol() {
        return this.currentScene.nbCol;
    }
    get width() {
        return this.currentScene.cellSize * this.currentScene.nbCol;
    }
    get height() {
        return this.currentScene.cellSize * this.currentScene.nbRow;
    }
    loopCells(callback, scene = this.currentScene) {
        for (let col = 0; col < this.nbCol; col++) {
            for (let row = 0; row < this.nbRow; row++) {
                callback(scene.getCell(col, row), col, row);
            }
        }
    }
    loopCollision(callback) {
        this.loopCells((cell, col, row) => {
            if (cell.brick.hasCollisions) {
                callback(cell, col, row);
            }
        });
    }
    draw() {
        this.loopCells((cell, col, row) => {
            this.currentScene.drawImage(cell.brick.sprite, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
        });
        if (this.nextScene !== null) {
            this.loopCells((cell, col, row) => {
                this.nextScene.drawImage(cell.brick.sprite, this.cellSize * col, this.cellSize * row, this.cellSize, this.cellSize);
            }, this.nextScene);
        }
    }
    slideSceneAnimationMove() {
        if (this.dc === 1) {
            this.currentScene.x -= this.slideSceneAnimationSpeed;
            this.nextScene.x -= this.slideSceneAnimationSpeed;
        }
        else if (this.dc === -1) {
            this.currentScene.x += this.slideSceneAnimationSpeed;
            this.nextScene.x += this.slideSceneAnimationSpeed;
        }
        else if (this.dr === 1) {
            this.currentScene.y -= this.slideSceneAnimationSpeed;
            this.nextScene.y -= this.slideSceneAnimationSpeed;
        }
        else if (this.dr === -1) {
            this.currentScene.y += this.slideSceneAnimationSpeed;
            this.nextScene.y += this.slideSceneAnimationSpeed;
        }
        if ((this.nextScene.y <= 0 && this.dr === 1) ||
            (this.nextScene.y >= 0 && this.dr === -1) ||
            (this.nextScene.x <= 0 && this.dc === 1) ||
            (this.nextScene.x >= 0 && this.dc === -1)) {
            this.nextScene.y = 0;
            this.nextScene.x = 0;
            this.dr = 0;
            this.dc = 0;
            if (this.music.src != this.nextScene.music.src) {
                this.music.pause();
                this.music.currentTime = 0;
                this.music = this.nextScene.music;
                this.music.play();
            }
            this.currentScene = this.nextScene;
            this.nextScene = null;
            this.Game.Enemies = new Enemies(this.Game);
            this.Game.status = GameStatus.Run;
        }
    }
    collisions() {
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.drawImage(sprite, x + this.x, y + this.y, width, height);
    }
    slideScene(direction) {
        let currentSceneCol = this.currentScene.c;
        let currentSceneRow = this.currentScene.r;
        if (direction === Direction.Left) {
            this.dc = -1;
        }
        else if (direction === Direction.Right) {
            this.dc = 1;
        }
        else if (direction === Direction.Up) {
            this.dr = -1;
        }
        else if (direction === Direction.Down) {
            this.dr = 1;
        }
        else {
            return;
        }
        if (!(currentSceneCol + this.dc < 0 ||
            currentSceneCol + this.dc > this.Game.World.nbCol - 1 ||
            currentSceneRow + this.dr < 0 ||
            currentSceneRow + this.dr > this.Game.World.nbRow - 1)) {
            this.nextScene = this.Game.World.map[currentSceneCol + this.dc][currentSceneRow + this.dr];
            if (direction === Direction.Left) {
                this.nextScene.x = -this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Right) {
                this.nextScene.x = this.width;
                this.nextScene.y = 0;
            }
            else if (direction === Direction.Up) {
                this.nextScene.y = -this.height;
                this.nextScene.x = 0;
            }
            else if (direction === Direction.Down) {
                this.nextScene.y = this.height;
                this.nextScene.x = 0;
            }
            this.Game.Player.dx = 0;
            this.Game.Player.dy = 0;
            this.Game.status = GameStatus.SlideScene;
            return;
        }
        this.dc = 0;
        this.dr = 0;
    }
}

class WinScreen {
    constructor(game) {
        this.Game = game;
        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);
    }
    draw() {
        this.music.play();
        this.Game.fillRect(0, 0, this.Game.Canvas.width, this.Game.Canvas.height, "#000");
        this.Game.fillText("YOU WON", this.Game.Canvas.width / 2, this.Game.Canvas.height / 2, '#fff', '24px', 'center', 'middle');
    }
}
