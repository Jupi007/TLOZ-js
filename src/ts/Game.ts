import { StateObserver } from "./Libraries/Observers";

import { BrickCollection } from "./Bricks/Bricks";
import { Map } from "./Map/Map";
import { AssetManager } from "./Components/AssetManager";
import { Viewport } from "./Components/Viewport";
import { Inventory } from "./Components/Inventory";
import { Player } from "./Components/Player";
import { Sword } from "./Components/Sword";
import { EnemyManager } from "./Components/EnemyManager";
import { ProjectileManager } from "./Components/ProjectileManager";
import { ItemManager } from "./Components/ItemManager";
import { EventManager } from "./Components/EventManager";
import { Hud } from "./Components/Hud";
import { Panes } from "./Components/Panes";
import { SplashScreen } from "./Screens/SplashScreen";
import { GameOverScreen } from "./Screens/GameOverScreen";
import { WinScreen } from "./Screens/WinScreen";
import { StoppedScreen } from "./Screens/StoppedScreen";
import { LoadingScreen } from "./Screens/LoadingScreen";

export enum GameState {
  Loading,
  Splash,
  Run,
  Inventory,
  Stopped,
  CustomLoop,
  GameOver,
  Win
}

export class Game {
  Canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  lastTime: number;
  dt: number;

  AssetManager: AssetManager;
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
  LoadingScreen: LoadingScreen;
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
    this.AssetManager = new AssetManager(this);
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
    this.LoadingScreen = new LoadingScreen(this);
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

    this.state = new StateObserver(GameState.Loading);

    this.lastTime = null;
    this.dt = null;
  }

  restart(): void {
    this.init();
  }

  run(): void {
    window.requestAnimationFrame((now) => this.loop(now));
  }

  deltaCalculation(now: number): void {
    if (this.lastTime === null) {
      this.dt = 1;
    } else {
      this.dt = (now - this.lastTime) / (1000 / 60); // (1000 / 60) because we target 60 fps
    }

    this.lastTime = now;
  }

  loop(now: number): void {
    window.requestAnimationFrame((now) => this.loop(now));

    this.deltaCalculation(now);

    this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

    switch (this.state.get()) {
      case GameState.Loading:
        this.loadingLoop();
        break;
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

  loadingLoop() {
    this.LoadingScreen.draw();
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
    console.log("winLoop");
    document.dispatchEvent(new Event("win"));
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

  drawImage({ sprite, x, y, width, height }: {
    sprite: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    this.ctx.beginPath();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(sprite, x, y, width, height);
    this.ctx.closePath();
  }

  fillRect({ x, y, width, height, color }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.closePath();
  }

  fillText({
    text, x, y, color,
    fontSize = "16px",
    textAlign = "left",
    textBaseline = "alphabetic"
  }: {
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
  }): void {
    this.ctx.beginPath();
    this.ctx.font = fontSize + " NES-font";
    this.ctx.fillStyle = color;
    this.ctx.textAlign = textAlign;
    this.ctx.textBaseline = textBaseline;
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
  }
}
