'use strict';

enum GameState {Splash, Run, Stopped, CustomLoop, GameOver, Win};

class Game {
    Canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    lastTime: number;
    dt: number;

    World: World;
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

    state: StateObserver;

    customLoop: Function;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.lastTime = null;
        this.dt = null;

        this.init();
    }

    init(): void {
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

    runLoop(): void {
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
