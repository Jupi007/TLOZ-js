enum GameStatus {Run, Stopped, SlideScene, GameOver, Win};

class Game {
    Canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    Overworld: Overworld;
    Viewport: Viewport;
    Player: Player;
    Sword: Sword;
    Enemies: Enemies;
    EventManager: EventManager;
    Hud: Hud;
    GameOverScreen: GameOverScreen;
    WinScreen: WinScreen;

    status: GameStatus;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.EventManager = new EventManager(this);
        this.Overworld = new Overworld(this);
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

        this.status = GameStatus.Run;
    }

    run(): void {
        window.requestAnimationFrame(() => this.run());
        this.loop();
    }

    loop(): void {
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

    runLoop(): void {
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

    stoppedLoop(): void {
        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Hud.draw();
    }

    gameOverLoop(): void {
        this.GameOverScreen.draw();
    }

    winLoop(): void {
        this.WinScreen.draw();
    }

    slideSceneLoop(): void {
        this.Viewport.slideSceneAnimationMove();
        this.Player.slideSceneAnimationMove();

        this.Viewport.draw();
        this.Enemies.draw();
        this.Sword.draw();
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
        this.ctx.drawImage(
            sprite,
            x,
            y,
            width,
            height
        );
        this.ctx.closePath();
    }
}
