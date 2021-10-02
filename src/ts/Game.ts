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

export enum GameState { Splash, Run, Inventory, Stopped, CustomLoop, GameOver, Win };

export class Game {
    Canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    lastTime: number;
    dt: number;

    BrickCollection: BrickCollection;
    Map: Map;
    Viewport: Viewport;
    Player: Player;
    Sword: Sword;
    EnemyManager: EnemyManager;
    ProjectileManager: ProjectileManager;
    ItemManager: ItemManager;
    EventManager: EventManager;
    Hud: Hud;
    Panes: Panes;
    SplashScreen: SplashScreen;
    GameOverScreen: GameOverScreen;
    WinScreen: WinScreen;
    StoppedScreen: StoppedScreen;
    Inventory: Inventory;

    state: StateObserver;

    customLoop: Function;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.init();
    }

    init(): void {
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

    restart(): void {
        this.init();
        this.state.setNextState(GameState.Run);
    }

    run(): void {
        window.requestAnimationFrame((now) => this.loop(now));
    }

    deltaCalculation(now: number): void {
        if (this.lastTime === null) {
            this.dt = 1;
        }
        else {
            this.dt = (now - this.lastTime) / (1000 / 60); // (1000 / 60) because we target 60 fps
        }

        this.lastTime = now;
    }

    loop(now: number): void {
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

    runLoop(): void {
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

        this.EnemyManager.removeKilled();

        this.Player.updateObservers();
        this.EnemyManager.updateObservers();
        this.ProjectileManager.updateObservers();

        this.EventManager.newFrame();
    }

    inventoryLoop(): void {
        this.Inventory.move();
        this.Inventory.draw();
    }

    stoppedLoop(): void {
        this.drawGame();
        this.StoppedScreen.draw();
    }

    splashLoop(): void {
        this.SplashScreen.draw();
    }

    gameOverLoop(): void {
        this.GameOverScreen.draw();
    }

    useCustomLoop(loop: Function): void {
        this.state.setNextState(GameState.CustomLoop);
        this.customLoop = loop;
    }

    winLoop(): void {
        this.WinScreen.draw();
    }

    drawGame(): void {
        this.Viewport.draw();
        this.EnemyManager.draw();
        this.Sword.draw();
        this.ItemManager.draw();
        this.ProjectileManager.draw();
        this.Player.draw();
        this.Hud.draw();
    }

    drawGameWithoutPlayer(): void {
        this.Viewport.draw();
        this.EnemyManager.draw();
        this.Sword.draw();
        this.ItemManager.draw();
        this.ProjectileManager.draw();
        this.Hud.draw();
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.ctx.beginPath();
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(
            sprite,
            x,
            y,
            width,
            height
        );
        this.ctx.closePath();
    }

    fillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
    ) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x,
            y,
            width,
            height
        );
        this.ctx.closePath();
    }

    fillText(
        text: string,
        x: number,
        y: number,
        color: string,
        fontSize: string = '16px',
        textAlign: CanvasTextAlign = 'left',
        textBaseline: CanvasTextBaseline = 'alphabetic',
    ) {
        this.ctx.beginPath();
        this.ctx.font = fontSize + ' NES-font';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    }
}
