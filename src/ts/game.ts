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

        this.Canvas.width = this.Landscape.width;
        this.Canvas.height = this.Landscape.height;

        this.status = GameStatus.Run;
    }

    changeScene(): void {
        let c = this.Landscape.currentScene.c; // TODO: Rename vars names
        let r = this.Landscape.currentScene.r;

        //this.Overworld.map[c][r] = this.Landscape.currentScene;

        let dc = 0;
        let dr = 0;

        if (this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && !this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dc = -1;
        } else if (!this.EventManager.isLeftPressed && this.EventManager.isRightPressed && !this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dc = 1;
        } else if (!this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && this.EventManager.isUpPressed && !this.EventManager.isDownPressed) {
            dr = -1;
        } else if (!this.EventManager.isLeftPressed && !this.EventManager.isRightPressed && !this.EventManager.isUpPressed && this.EventManager.isDownPressed) {
            dr = 1;
        } else {
            this.Player.dx = 0;
            this.Player.dy = 0;
            return;
        }

        if (!(c + dc < 0 || c + dc > this.Overworld.nbCol - 1 || r + dr < 0 || r + dr > this.Overworld.nbRow - 1)) {
            this.Landscape = new Landscape(this, this.Overworld.map[c + dc][r + dr]);
            this.Enemies = new Enemies(this);

            if (this.EventManager.isLeftPressed) {
                this.Player.x = this.Canvas.width - this.Player.width;
            } else if (this.EventManager.isRightPressed) {
                this.Player.x = 0;
            } else if (this.EventManager.isUpPressed) {
                this.Player.y = this.Canvas.height - this.Player.height;
            } else if (this.EventManager.isDownPressed) {
                this.Player.y = 0;
            }

            this.Player.dx = 0;
            this.Player.dy = 0;
        }
    }

    drawHud(): void {
        this.ctx.font = "16px Ubuntu";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("HP: " + this.Player.hp + " Score: " + this.Player.score + "/" + (this.Overworld.nbRow * this.Overworld.nbCol), 8, 20);
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
