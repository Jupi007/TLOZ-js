enum GameStatus {Run, Paused};

class Game {
    Canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    Overworld: Overworld;
    BrickCollection: BrickCollection;
    Landscape: Landscape;
    Player: Player;
    Sword: Sword;
    Enemies: Enemies;
    EventManager: EventManager;
    Hud: Hud;

    status: GameStatus;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.EventManager = new EventManager(this);
        this.Overworld = new Overworld(this);
        this.BrickCollection = new BrickCollection();
        this.Landscape = new Landscape(this, this.Overworld.getSpawnScene());
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);
        this.Hud = new Hud(this);

        this.Landscape.y = this.Hud.height;
        this.Hud.width = this.Landscape.width;

        this.Canvas.width = this.Landscape.width;
        this.Canvas.height = this.Landscape.height + this.Hud.height;

        this.status = GameStatus.Run;
    }

    loop(): void {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        if (this.status === GameStatus.Run) {
            this.Player.checkInvicibility();

            this.Sword.events();
        }

        this.Landscape.draw();
        this.Enemies.draw();
        this.Sword.draw();
        this.Player.draw();
        this.Hud.draw();

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
