class Game {
    Canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    Overworld: Overworld;
    BrickCollection: BrickCollection;
    Landscape: Landscape;
    Player: Player;
    Sword: Sword;
    Enemies: Enemies;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.Overworld = new Overworld(this);
        this.BrickCollection = new BrickCollection();
        this.Landscape = new Landscape(this, this.Overworld.getSpawnScene());
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);

        this.Canvas.width = this.Landscape.width;
        this.Canvas.height = this.Landscape.height;
    }

    changeScene(): void {
        let c = this.Landscape.currentScene.c; // TODO: Rename vars names
        let r = this.Landscape.currentScene.r;


        this.Overworld.map[c][r] = this.Landscape.currentScene; // TODO: ???? what is it ????

        let dc = 0;
        let dr = 0;

        if (leftPressed && !rightPressed && !upPressed && !downPressed) {
            dc = -1;
        } else if (!leftPressed && rightPressed && !upPressed && !downPressed) {
            dc = 1;
        } else if (!leftPressed && !rightPressed && upPressed && !downPressed) {
            dr = -1;
        } else if (!leftPressed && !rightPressed && !upPressed && downPressed) {
            dr = 1;
        } else {
            this.Player.dx = 0;
            this.Player.dy = 0;
            return;
        }

        if (!(c + dc < 0 || c + dc > this.Overworld.nbCol - 1 || r + dr < 0 || r + dr > this.Overworld.nbRow - 1)) {
            this.Landscape = new Landscape(this, this.Overworld.map[c + dc][r + dr]);
            this.Enemies = new Enemies(this);

            if (leftPressed) {
                this.Player.x = this.Canvas.width - this.Player.width;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            } else if (rightPressed) {
                this.Player.x = 0;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            } else if (upPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = this.Canvas.height - this.Player.height;
            } else if (downPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
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

    draw(): void {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        this.Player.checkInvicibility();

        this.Sword.events();

        this.Landscape.draw();
        this.Enemies.draw();
        this.Player.draw();
        this.Sword.draw();
        this.drawHud();

        this.Player.listenEvents();
        this.Enemies.listenEvents();

        this.Player.collisions();
        this.Sword.collisions();
        this.Enemies.collisions();
        this.Landscape.collisions();

        this.Player.move();
        this.Enemies.move();

        this.Sword.reset();
    }
}
