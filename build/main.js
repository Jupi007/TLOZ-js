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
class DefaultGreyBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/default-grey.png");
    }
}
class StairsBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/stairs.png");
    }
}
class TreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/tree.png", true);
    }
}
class WhiteTreeBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-tree.png", true);
    }
}
class GraveBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/grave.png", true);
    }
}
class WallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/wall.png", true);
    }
}
class SingleWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/single-wall.png", true);
    }
}
class SingleRedWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/single-red-wall.png", true);
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
class WhiteWallBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall.png", true);
    }
}
class WhiteWallTopBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top.png", true);
    }
}
class WhiteWallTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top-right.png", true);
    }
}
class WhiteWallTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-top-left.png", true);
    }
}
class WhiteWallBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-bottom-right.png", true);
    }
}
class WhiteWallBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/white-wall-bottom-left.png", true);
    }
}
class MonumentTopRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-top-right.png", true);
    }
}
class MonumentTopLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-top-left.png", true);
    }
}
class MonumentBottomRightBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-bottom-right.png", true);
    }
}
class MonumentBottomLeftBrick extends Brick {
    constructor() {
        super("./sprites/png/bricks/monument-bottom-left.png", true);
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
        switch (this.direction) {
            case Direction.Up:
                this.direction = Direction.Down;
                break;
            case Direction.Down:
                this.direction = Direction.Up;
                break;
            case Direction.Left:
                this.direction = Direction.Right;
                break;
            case Direction.Right:
                this.direction = Direction.Left;
                break;
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
        this.sprites[Direction.Right] = [];
        this.sprites[Direction.Right][1] = SpriteLoader.load("./sprites/png/octorok-right1.png");
        this.sprites[Direction.Right][2] = SpriteLoader.load("./sprites/png/octorok-right2.png");
        this.sprites[Direction.Left] = [];
        this.sprites[Direction.Left][1] = SpriteLoader.load("./sprites/png/octorok-left1.png");
        this.sprites[Direction.Left][2] = SpriteLoader.load("./sprites/png/octorok-left2.png");
        this.spritesAnimation = new AnimationObserver(20 / speed, 2);
        this.dieSound = AudioLoader.load("./sounds/effect/Enemy_Die.wav");
    }
}
class Enemies {
    constructor(game) {
        this.enemies = [];
        this.Game = game;
        if (this.Game.Viewport.currentScene.hasEnemies) {
            this.enemies = this.Game.Viewport.currentScene.enemies;
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
        }
    }
    draw() {
        this.loopEnemies((enemy) => {
            this.Game.Viewport.currentScene.drawImage(enemy.sprites[enemy.direction][enemy.spritesAnimation.currentAnimationStep], enemy.x, enemy.y, enemy.width, enemy.height);
            if (this.Game.state.is(GameState.Run))
                enemy.spritesAnimation.update();
        });
    }
    collisions() {
        this.loopEnemies((enemy) => {
            if (movingBoxsCollision(this.Game.Player.hitBox, enemy)) {
                this.Game.Player.takeDamage(1);
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
            switch (enemy.direction) {
                case Direction.Down:
                    enemy.dy = enemy.speed;
                    break;
                case Direction.Up:
                    enemy.dy = -enemy.speed;
                    break;
                case Direction.Right:
                    enemy.dx = enemy.speed;
                    break;
                case Direction.Left:
                    enemy.dx = -enemy.speed;
                    break;
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
        this.isEnterPressed = false;
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
            case "Enter":
                this.isEnterPressed = keydown;
                break;
            case "q":
                if (keydown) {
                    this.isAttackPressed = true;
                }
                break;
            case "p":
                if (keydown && this.Game.state.isIn(GameState.Run, GameState.Stopped)) {
                    this.Game.state.set(this.Game.state.is(GameState.Run)
                        ? GameState.Stopped
                        : GameState.Run);
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

var GameState;
(function (GameState) {
    GameState[GameState["Run"] = 0] = "Run";
    GameState[GameState["Stopped"] = 1] = "Stopped";
    GameState[GameState["SlideScene"] = 2] = "SlideScene";
    GameState[GameState["GameOver"] = 3] = "GameOver";
    GameState[GameState["Win"] = 4] = "Win";
})(GameState || (GameState = {}));
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
        this.Projectiles = new Projectiles(this);
        this.Hud = new Hud(this);
        this.GameOverScreen = new GameOverScreen(this);
        this.WinScreen = new WinScreen(this);
        this.Viewport.y = this.Hud.height;
        this.Hud.width = this.Viewport.width;
        this.Canvas.width = this.Viewport.width;
        this.Canvas.height = this.Viewport.height + this.Hud.height;
        this.Player.x = this.Viewport.cellSize * this.World.spawnCellColl;
        this.Player.y = this.Viewport.cellSize * this.World.spawnCellRow;
        this.World.loopScenes((scene) => {
            if (scene.hasEnemies) {
                this.Player.targetScore++;
            }
        });
        this.state = new StateObserver(GameState.Run);
    }
    run() {
        window.requestAnimationFrame(() => this.run());
        this.loop();
    }
    loop() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        switch (this.state.get()) {
            case GameState.Run:
                this.runLoop();
                break;
            case GameState.Stopped:
                this.stoppedLoop();
                break;
            case GameState.SlideScene:
                this.slideSceneLoop();
                break;
            case GameState.GameOver:
                this.gameOverLoop();
                break;
            case GameState.Win:
                this.winLoop();
                break;
            default:
                this.runLoop();
                break;
        }
        this.state.update();
    }
    runLoop() {
        this.Player.listenEvents();
        this.Sword.listenEvents();
        this.Enemies.listenEvents();
        this.Player.collisions();
        this.Sword.collisions();
        this.Enemies.collisions();
        this.Viewport.collisions();
        this.Projectiles.collisions();
        this.Player.move();
        this.Enemies.move();
        this.Projectiles.move();
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Projectiles.draw();
        this.Hud.draw();
        this.Player.updateObservers();
        this.EventManager.newFrame();
    }
    stoppedLoop() {
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Projectiles.draw();
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
        this.Projectiles.draw();
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

var GameOverScreenState;
(function (GameOverScreenState) {
    GameOverScreenState[GameOverScreenState["PlayerAnimation"] = 0] = "PlayerAnimation";
    GameOverScreenState[GameOverScreenState["BlackScreen"] = 1] = "BlackScreen";
})(GameOverScreenState || (GameOverScreenState = {}));
class GameOverScreen {
    constructor(game) {
        this.Game = game;
        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);
        this.state = new StateObserver(GameOverScreenState.PlayerAnimation);
    }
    draw() {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                if (this.state.isFirstFrame)
                    this.Game.Player.isMovingObserver.set(false);
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Hud.draw();
                if (this.state.currentFrame < 125) {
                    if (this.state.currentFrame % 8 === 0) {
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
                }
                if (this.state.currentFrame > 200)
                    this.state.set(GameOverScreenState.BlackScreen);
                break;
            case GameOverScreenState.BlackScreen:
                if (this.state.isFirstFrame)
                    this.music.play();
                if (this.Game.EventManager.isEnterPressed)
                    location.reload();
                this.Game.fillRect(0, 0, this.Game.Canvas.width, this.Game.Canvas.height, "#000");
                this.Game.fillText("GAME OVER", this.Game.Canvas.width / 2, this.Game.Canvas.height / 3, '#fff', '24px', 'center', 'middle');
                this.Game.fillText("press enter to retry", this.Game.Canvas.width / 2, this.Game.Canvas.height / 3 * 2, '#fff', '16px', 'center', 'middle');
                break;
        }
        this.state.update();
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
        this.Game.fillText(' SCORE: ' + this.Game.Player.score + '/' + this.Game.Player.targetScore, this.width - (this.height / 2) + this.x, this.y + this.height / 2, '#fff', '16px', 'right', 'middle');
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
        this.enemies = [];
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
    get hasEnemies() {
        return this.enemies.length > 0;
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
        this.map[0][0].loadBricks([
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBottomRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),],
            [new WhiteWallBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),],
            [new WhiteWallBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new WhiteWallTopRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new StairsBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new StairsBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()]
        ]);
        this.map[0][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[0][0].enemies = [
            new Octorok(this.Game, 2 * 64, 2 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Down),
            new Octorok(this.Game, 5 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 3 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
        ];
        this.map[1][0].loadBricks([
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(),],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()]
        ]);
        this.map[1][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[1][0].enemies = [
            new Octorok(this.Game, 5 * 64, 8 * 64, getRandomIntInclusive(1, 2), Direction.Up),
            new Octorok(this.Game, 8 * 64, 4 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 10 * 64, 2 * 64, getRandomIntInclusive(1, 2), Direction.Down),
        ];
        this.map[2][0].loadBricks([
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBottomLeftBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new MonumentTopLeftBrick(), new MonumentTopRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteTreeBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new MonumentTopLeftBrick(), new MonumentTopRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new MonumentBottomLeftBrick(), new MonumentBottomRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new MonumentBottomLeftBrick(), new MonumentBottomRightBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new GraveBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new DefaultGreyBrick(), new WhiteWallTopLeftBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallTopBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()],
            [new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick(), new WhiteWallBrick()]
        ]);
        this.map[2][0].music = AudioLoader.load("./sounds/music/death_mountain.mp3", true);
        this.map[2][0].enemies = [
            new Octorok(this.Game, 5 * 64, 4 * 64, getRandomIntInclusive(1, 2), Direction.Down),
            new Octorok(this.Game, 9 * 64, 6 * 64, getRandomIntInclusive(1, 2), Direction.Right),
            new Octorok(this.Game, 12 * 64, 3 * 64, getRandomIntInclusive(1, 2), Direction.Down),
        ];
        this.map[0][1].loadBricks([
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new StairsBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new StairsBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new SingleRedWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick()]
        ]);
        this.map[0][1].enemies = [
            new Octorok(this.Game, 6 * 64, 4 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 4 * 64, 6 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 7 * 64, 2 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 2 * 64, getRandomIntInclusive(1, 2), Direction.Down),
        ];
        this.map[1][1].loadBricks([
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()]
        ]);
        this.map[1][1].enemies = [
            new Octorok(this.Game, 4 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 3 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 13 * 64, 7 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 12 * 64, 6 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
        ];
        this.map[2][1].loadBricks([
            [new WallBrick(), new WallBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick(), new TreeBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
            [new WallBrick(), new WallBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick(), new DefaultBrick(), new TreeBrick()],
        ]);
        this.map[2][1].enemies = [
            new Octorok(this.Game, 3 * 64, 4 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 5 * 64, 6 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 10 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 14 * 64, 2 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Left : Direction.Down),
        ];
        this.map[0][2].loadBricks([
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new SingleWallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()]
        ]);
        this.map[0][2].enemies = [
            new Octorok(this.Game, 3 * 64, 4 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Right : Direction.Left),
            new Octorok(this.Game, 5 * 64, 7 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
        ];
        // Spawn scene
        this.map[1][2].loadBricks([
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new WallBottomRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBottomLeftBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()],
            [new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick()],
            [new WallTopBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallTopLeftBrick(), new WallTopBrick()],
            [new WallBrick(), new WallTopRightBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new DefaultBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallTopBrick(), new WallBrick(), new WallBrick()],
            [new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick(), new WallBrick()]
        ]);
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
        this.map[2][2].enemies = [
            new Octorok(this.Game, 3 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 5 * 64, 7 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 10 * 64, 5 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
            new Octorok(this.Game, 12 * 64, 7 * 64, getRandomIntInclusive(1, 2), getRandomIntInclusive(0, 1) ? Direction.Up : Direction.Down),
        ];
    }
    getSpawnScene() {
        return this.map[this.spawnSceneColl][this.spawnSceneRow];
    }
    loopScenes(callback) {
        this.map.forEach((col, c) => {
            col.forEach((scene, r) => {
                callback(scene);
            });
        });
    }
}

class AbstractObserver {
    constructor() {
        this.currentFrame = 0;
    }
    get isFirstFrame() {
        return this.currentFrame === 0 || this.currentFrame === 1;
    }
    update() {
        this.currentFrame++;
    }
}
class StateObserver extends AbstractObserver {
    constructor(state) {
        super();
        this.state = state;
    }
    set(state) {
        if (this.state === state)
            return;
        this.lastState = this.state;
        this.lastFrameState = this.state;
        this.state = state;
        this.currentFrame = 0;
    }
    update() {
        super.update();
        this.lastFrameState = this.state;
    }
    get() {
        return this.state;
    }
    getLast() {
        return this.lastState;
    }
    getLastFrame() {
        return this.lastFrameState;
    }
    is(state) {
        return this.state === state;
    }
    isIn(...states) {
        return states.some(s => this.is(s));
    }
    was(state) {
        return this.lastState === state;
    }
    wasIn(...states) {
        return states.some(s => this.was(s));
    }
    wasLastFrame(state) {
        return this.lastFrameState === state;
    }
    wasInLastFrame(...states) {
        return states.some(s => this.wasLastFrame(s));
    }
}
class AnimationObserver extends AbstractObserver {
    constructor(animationStepDuration, nbAnimationStep) {
        super();
        this.currentAnimationStep = 1;
        this.animationStepDuration = animationStepDuration;
        this.nbAnimationStep = nbAnimationStep;
    }
    update() {
        super.update();
        if (this.currentFrame >= this.animationStepDuration) {
            this.currentFrame = 0;
            this.currentAnimationStep =
                (this.currentAnimationStep + 1 > this.nbAnimationStep)
                    ? 1
                    : this.currentAnimationStep + 1;
        }
    }
}

class Player extends MovingBox {
    constructor(game) {
        super();
        this.sprites = [];
        this.spritesAttack = [];
        this.Game = game;
        this.isMovingObserver = new StateObserver(false);
        this.isAttackObserver = new StateObserver(false);
        this.isInvincibleObserver = new StateObserver(false);
        this.score = 0;
        this.targetScore = 0;
        this.width = 64;
        this.height = 64;
        this.x = 0;
        this.y = 0;
        this.speed = 5;
        this.maxHp = 6;
        this.hp = this.maxHp;
        this.invincibleDuration = 200;
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
        this.spriteWin = SpriteLoader.load("./sprites/png/link-win.png");
        this.spritesAnimation = new AnimationObserver(6, 2);
        this.invincibleAnimation = new AnimationObserver(7, 2);
        this.hurtSound = AudioLoader.load("./sounds/effect/Link_Hurt.wav");
        this.dieSound = AudioLoader.load("./sounds/effect/Link_Die.wav");
        this.lowHealthSound = AudioLoader.load("./sounds/effect/Low_Health.wav", true);
        this.fanfareSound = AudioLoader.load("./sounds/effect/Fanfare.wav");
    }
    get isFullLife() {
        return this.hp === this.maxHp;
    }
    draw() {
        let sprite = this.isAttackObserver.get()
            ? this.spritesAttack[this.direction]
            : this.sprites[this.direction][this.spritesAnimation.currentAnimationStep];
        if (this.isInvincibleObserver.get()) {
            this.invincibleAnimation.update();
            if (this.invincibleAnimation.currentAnimationStep === 2)
                sprite = new Image();
        }
        this.Game.Viewport.drawImage(sprite, this.x, this.y, this.width, this.height);
        if (this.isMovingObserver.get() && !this.Game.state.is(GameState.Stopped)) {
            this.spritesAnimation.update();
        }
    }
    drawWin() {
        this.Game.Viewport.drawImage(this.spriteWin, this.x, this.y, this.width, this.height);
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
        this.isAttackObserver.set(this.Game.EventManager.isAttackPressed ? true : false);
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
        this.isMovingObserver.set((this.dx != 0 || this.dy != 0) ? true : false);
    }
    increaseScore() {
        this.score++;
        if (this.score >= this.targetScore) {
            this.isInvincibleObserver.set(false);
            this.isAttackObserver.set(false);
            this.isMovingObserver.set(false);
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.fanfareSound.play();
            this.Game.state.set(GameState.Win);
        }
    }
    takeDamage(damage) {
        if (this.isInvincibleObserver.get())
            return;
        this.hurtSound.play();
        this.takeKnockBack();
        if (this.hp - damage >= 0) {
            this.hp -= damage;
            this.setInvicibility();
        }
        else {
            this.hp = 0;
        }
        if (this.hp <= 0) {
            this.isInvincibleObserver.set(false);
            this.Game.Viewport.music.pause();
            this.lowHealthSound.pause();
            this.dieSound.play();
            this.Game.state.set(GameState.GameOver);
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
        this.isInvincibleObserver.set(true);
    }
    updateObservers() {
        this.isMovingObserver.update();
        this.isAttackObserver.update();
        this.isInvincibleObserver.update();
        if (this.isInvincibleObserver.get() && this.isInvincibleObserver.currentFrame > this.invincibleDuration) {
            this.isInvincibleObserver.set(false);
        }
    }
}

class Projectile extends MovingBox {
    constructor(x, y, width, height, speed, direction, sprite, hasPlayerCollision, hasEnemiesCollision, collisionCallback) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.sprite = sprite;
        this.hasPlayerCollision = hasPlayerCollision;
        this.hasEnemiesCollision = hasEnemiesCollision;
        this.collisionCallback = collisionCallback;
        switch (this.direction) {
            case Direction.Up:
                this.dy = -this.speed;
                break;
            case Direction.Right:
                this.dx = this.speed;
                break;
            case Direction.Down:
                this.dy = this.speed;
                break;
            case Direction.Left:
                this.dx = -this.speed;
                break;
        }
    }
}
class Projectiles {
    constructor(game) {
        this.Game = game;
        this.projectiles = [];
    }
    collisions() {
        this.loopProjectiles((projectile) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxsCollision(enemy, projectile)) {
                    this.Game.Enemies.killEnemy(enemy);
                    this.deleteProjectile(projectile);
                }
            });
        });
        this.loopProjectiles((projectile) => {
            if (movingBoxCanvasCollision(projectile, this.Game.Viewport)) {
                this.deleteProjectile(projectile);
            }
        });
    }
    move() {
        this.loopProjectiles((projectile) => {
            projectile.x += projectile.dx;
            projectile.y += projectile.dy;
        });
    }
    draw() {
        this.loopProjectiles((projectile) => {
            this.Game.Viewport.currentScene.drawImage(projectile.sprite, projectile.x, projectile.y, projectile.width, projectile.height);
        });
    }
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }
    deleteProjectile(projectile) {
        projectile.collisionCallback();
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
    }
    deleteAllProjectiles() {
        this.loopProjectiles((projectile) => {
            projectile.collisionCallback();
        });
        this.projectiles = [];
    }
    loopProjectiles(callback) {
        this.projectiles.forEach((projectile) => {
            callback(projectile);
        });
    }
}

class Sword {
    constructor(game) {
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
        this.flyingSound = AudioLoader.load("./sounds/effect/Sword_Shoot.wav");
        this.isFlying = false;
    }
    get direction() {
        return this.Game.Player.direction;
    }
    get x() {
        if (this.direction === Direction.Up) {
            return this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Down) {
            return this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Left) {
            return this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
        }
        else if (this.direction === Direction.Right) {
            return this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
        }
    }
    get y() {
        if (this.direction === Direction.Up) {
            return this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
        }
        else if (this.direction === Direction.Down) {
            return this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth;
        }
        else if (this.direction === Direction.Left) {
            return this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
        }
        else if (this.direction === Direction.Right) {
            return this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
        }
    }
    get width() {
        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            return this.swordHeight;
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            return this.swordWidth;
        }
    }
    get height() {
        if (this.direction === Direction.Up || this.direction === Direction.Down) {
            return this.swordWidth;
        }
        else if (this.direction === Direction.Left || this.direction === Direction.Right) {
            return this.swordHeight;
        }
    }
    draw() {
        if (this.Game.Player.isAttackObserver.get()) {
            this.Game.Viewport.drawImage(this.sprites[this.direction], this.x, this.y, this.width, this.height);
        }
    }
    drawWin() {
        this.Game.Viewport.drawImage(this.sprites[Direction.Up], this.Game.Player.x, this.Game.Player.y - this.swordWidth, this.swordHeight, this.swordWidth);
    }
    collisions() {
        if (this.Game.Player.isAttackObserver.get()) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }
    listenEvents() {
        if (this.Game.Player.isAttackObserver.get() && this.Game.Player.isAttackObserver.isFirstFrame) {
            this.slashSound.play();
        }
        if (!this.isFlying
            && this.Game.Player.isAttackObserver.getLastFrame()
            && !this.Game.Player.isAttackObserver.get()
            && this.Game.Player.isFullLife) {
            this.flyingSound.play();
            this.isFlying = true;
            this.Game.Projectiles.addProjectile(new Projectile(this.x, this.y, this.width, this.height, this.Game.Player.speed * 2, this.direction, this.sprites[this.direction], false, // Disable collision on Player
            true, // Enable collisions on Ennemies
            () => this.isFlying = false));
        }
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
            this.Game.Projectiles.deleteAllProjectiles();
            this.Game.state.set(GameState.Run);
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
            this.Game.state.set(GameState.SlideScene);
            return;
        }
        this.dc = 0;
        this.dr = 0;
    }
}

var WinScreenState;
(function (WinScreenState) {
    WinScreenState[WinScreenState["PlayerAnimation"] = 0] = "PlayerAnimation";
    WinScreenState[WinScreenState["BlackScreen"] = 1] = "BlackScreen";
})(WinScreenState || (WinScreenState = {}));
;
class WinScreen {
    constructor(game) {
        this.Game = game;
        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);
        this.state = new StateObserver(WinScreenState.PlayerAnimation);
    }
    draw() {
        switch (this.state.get()) {
            case WinScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();
                if (this.state.currentFrame > 120)
                    this.state.set(WinScreenState.BlackScreen);
                break;
            case WinScreenState.BlackScreen:
                if (this.state.isFirstFrame)
                    this.music.play();
                if (this.Game.EventManager.isEnterPressed)
                    location.reload();
                this.Game.fillRect(0, 0, this.Game.Canvas.width, this.Game.Canvas.height, "#000");
                this.Game.fillText("YOU WON", this.Game.Canvas.width / 2, this.Game.Canvas.height / 3, '#fff', '24px', 'center', 'middle');
                this.Game.fillText("press enter to retry", this.Game.Canvas.width / 2, this.Game.Canvas.height / 3 * 2, '#fff', '16px', 'center', 'middle');
                break;
        }
        this.state.update();
    }
}
