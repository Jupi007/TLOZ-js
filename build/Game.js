import { StateObserver } from "./Observers.js";
import { World } from "./Map.js";
import { Viewport } from "./Viewport.js";
import { Player } from "./Player.js";
import { Sword } from "./Sword.js";
import { EnemyManager } from "./EnemyManager.js";
import { ProjectileManager } from "./ProjectileManager.js";
import { ItemManager } from "./ItemManager.js";
import { EventManager } from "./EventManager.js";
import { Hud } from "./Hud.js";
import { Panes } from "./Panes.js";
import { SplashScreen } from "./screens/SplashScreen.js";
import { GameOverScreen } from "./screens/GameOverScreen.js";
import { WinScreen } from "./screens/WinScreen.js";
import { StoppedScreen } from "./screens/StoppedScreen.js";
export var GameState;
(function (GameState) {
    GameState[GameState["Splash"] = 0] = "Splash";
    GameState[GameState["Run"] = 1] = "Run";
    GameState[GameState["Stopped"] = 2] = "Stopped";
    GameState[GameState["CustomLoop"] = 3] = "CustomLoop";
    GameState[GameState["GameOver"] = 4] = "GameOver";
    GameState[GameState["Win"] = 5] = "Win";
})(GameState || (GameState = {}));
;
export class Game {
    constructor(canvas) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");
        this.lastTime = null;
        this.dt = null;
        this.init();
    }
    init() {
        this.EventManager = new EventManager(this);
        this.World = new World(this);
        this.Viewport = new Viewport(this);
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.EnemyManager = new EnemyManager(this);
        this.ProjectileManager = new ProjectileManager(this);
        this.ItemManager = new ItemManager(this);
        this.Hud = new Hud(this);
        this.Panes = new Panes(this);
        this.SplashScreen = new SplashScreen(this);
        this.GameOverScreen = new GameOverScreen(this);
        this.WinScreen = new WinScreen(this);
        this.StoppedScreen = new StoppedScreen(this);
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
        this.state = new StateObserver(GameState.Splash);
    }
    restart() {
        this.init();
        this.state.setNextState(GameState.Run);
    }
    run() {
        window.requestAnimationFrame((now) => this.loop(now));
    }
    deltaCalculation(now) {
        if (this.lastTime === null) {
            this.dt = 1;
        }
        else {
            this.dt = (now - this.lastTime) / (1000 / 60); // (1000 / 60) because we target 60 fps
        }
        this.lastTime = now;
    }
    loop(now) {
        window.requestAnimationFrame((now) => this.loop(now));
        this.deltaCalculation(now);
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        switch (this.state.get()) {
            case GameState.Splash:
                this.splashLoop();
                break;
            case GameState.Run:
                this.runLoop();
                break;
            case GameState.Stopped:
                this.stoppedLoop();
                break;
            case GameState.GameOver:
                this.gameOverLoop();
                break;
            case GameState.Win:
                this.winLoop();
                break;
            case GameState.CustomLoop:
                this.customLoop();
                break;
            default:
                this.runLoop();
                break;
        }
        this.state.update(this.dt);
    }
    runLoop() {
        if (!this.Panes.isAnimationFinished) {
            this.drawGame();
            this.Panes.drawOpen();
            return;
        }
        this.Player.listenEvents();
        this.Sword.listenEvents();
        this.EnemyManager.aiThinking();
        this.Player.collisions();
        this.ItemManager.collisions();
        this.EnemyManager.collisions();
        this.Viewport.collisions();
        this.ProjectileManager.collisions();
        this.Sword.collisions();
        this.Player.move();
        this.EnemyManager.move();
        this.ProjectileManager.move();
        this.drawGame();
        this.Player.updateObservers();
        this.EnemyManager.updateObservers();
        this.ProjectileManager.updateObservers();
        this.EventManager.newFrame();
    }
    stoppedLoop() {
        this.drawGame();
        this.StoppedScreen.draw();
    }
    splashLoop() {
        this.SplashScreen.draw();
    }
    gameOverLoop() {
        this.GameOverScreen.draw();
    }
    useCustomLoop(loop) {
        this.state.setNextState(GameState.CustomLoop);
        this.customLoop = loop;
    }
    winLoop() {
        this.WinScreen.draw();
    }
    drawGame() {
        this.Viewport.draw();
        this.EnemyManager.draw();
        this.Sword.draw();
        this.ItemManager.draw();
        this.ProjectileManager.draw();
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