class Sword extends SimpleBox {
    Game: Game;

    swordWidth = 64;
    swordHeight = 28;

    swordHandleWidth = 16;

    sprites: HTMLImageElement[] = [];

    constructor(game: Game) {
        super();
        this.Game = game;

        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/sword-up.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/sword-right.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/sword-down.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/sword-left.png");
    }

    draw(): void {
        if (this.Game.Player.isAttack) {
            this.Game.Landscape.drawImage(
                this.sprites[this.Game.Player.direction],
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    collisions(): void {
        if (this.Game.Player.isAttack) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }

    events(): void {
        if (this.Game.Player.isAttack) {
            if (this.Game.Player.direction == Direction.Up) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (this.Game.Player.direction == Direction.Down) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (this.Game.Player.direction == Direction.Left) {
                this.x = this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            } else if (this.Game.Player.direction == Direction.Right) {
                this.x = this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
        }
    }

    reset(): void {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}
