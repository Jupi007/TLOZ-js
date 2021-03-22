import { StateObserver } from "./Libraries/Observers.js";
import { BrickCollection } from "./Bricks.js";
import { Map } from "./Map.js";
import { Viewport } from "./Viewport.js";
import { Inventory } from "./Inventory.js";
import { Player } from "./Player.js";
import { Sword } from "./Sword.js";
import { EnemyManager } from "./EnemyManager.js";
import { ProjectileManager } from "./ProjectileManager.js";
import { ItemManager } from "./ItemManager.js";
import { EventManager } from "./EventManager.js";
import { Hud } from "./Hud.js";
import { Panes } from "./Panes.js";
import { SplashScreen } from "./Screens/SplashScreen.js";
import { GameOverScreen } from "./Screens/GameOverScreen.js";
import { WinScreen } from "./Screens/WinScreen.js";
import { StoppedScreen } from "./Screens/StoppedScreen.js";
export var GameState;
(function (GameState) {
    GameState[GameState["Splash"] = 0] = "Splash";
    GameState[GameState["Run"] = 1] = "Run";
    GameState[GameState["Inventory"] = 2] = "Inventory";
    GameState[GameState["Stopped"] = 3] = "Stopped";
    GameState[GameState["CustomLoop"] = 4] = "CustomLoop";
    GameState[GameState["GameOver"] = 5] = "GameOver";
    GameState[GameState["Win"] = 6] = "Win";
})(GameState || (GameState = {}));
;
export class Game {
    constructor(canvas) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");
        this.init();
    }
    init() {
        this.EventManager = new EventManager(this);
        this.BrickCollection = new BrickCollection(this);
        this.Map = new Map(this);
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
        this.Inventory = new Inventory(this);
        this.Player.x = this.Viewport.cellSize * this.Map.spawnCellColl;
        this.Player.y = this.Viewport.cellSize * this.Map.spawnCellRow;
        this.Map.loopWorlds((world) => {
            world.loopScenes((scene) => {
                if (scene.hasEnemies) {
                    this.Player.targetScore++;
                }
            });
        });
        this.state = new StateObserver(GameState.Splash);
        this.lastTime = null;
        this.dt = null;
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
            case GameState.Inventory:
                this.inventoryLoop();
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
        this.Sword.collisions();
        this.Player.collisions();
        this.ItemManager.collisions();
        this.EnemyManager.collisions();
        this.ProjectileManager.collisions();
        this.Viewport.collisions();
        this.Player.move();
        this.EnemyManager.move();
        this.ProjectileManager.move();
        this.drawGame();
        this.Player.updateObservers();
        this.EnemyManager.updateObservers();
        this.ProjectileManager.updateObservers();
        this.EventManager.newFrame();
    }
    inventoryLoop() {
        this.Inventory.move();
        this.Inventory.draw();
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
    drawGameWithoutPlayer() {
        this.Viewport.draw();
        this.EnemyManager.draw();
        this.Sword.draw();
        this.ItemManager.draw();
        this.ProjectileManager.draw();
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
