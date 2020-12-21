class Hud {
    Game: Game;

    x: number;
    y: number;

    height: number;
    width: number;

    emptyHeartSprite: HTMLImageElement;
    halfHeartSprite: HTMLImageElement;
    fullHeartSprite: HTMLImageElement;

    constructor(game: Game) {
        this.Game = game;

        this.x = 0;
        this.y = 0;

        this.height = 64;

        this.emptyHeartSprite = SpriteLoader.load('./sprites/png/empty-heart.png');
        this.halfHeartSprite = SpriteLoader.load('./sprites/png/half-heart.png');
        this.fullHeartSprite = SpriteLoader.load('./sprites/png/full-heart.png');
    }

    draw(): void {
        this.Game.ctx.beginPath();
            this.Game.ctx.fillStyle = "#000";
            this.Game.ctx.fillRect(
                this.x,
                this.y,
                this.width,
                this.height
            );
        this.Game.ctx.closePath();

        this.drawHearts();
        this.drawScore();
    }

    drawHearts(): void {
        for (let i = 1; i <= this.Game.Player.maxHp / 2; i++) {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                this.emptyHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
            this.Game.ctx.closePath();
        }

        for (let i = 1; i <= this.Game.Player.hp / 2; i++) {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                this.fullHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
            this.Game.ctx.closePath();
        }

        if (this.Game.Player.hp % 2 === 1) {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(
                this.halfHeartSprite,
                24 * (this.Game.Player.hp / 2 + 1) + 8 * (this.Game.Player.hp / 2 - 1),
                this.height / 2 - 12,
                24,
                24
            );
            this.Game.ctx.closePath();
        }
    }

    drawScore(): void {
        this.Game.ctx.beginPath();
            this.Game.ctx.font = "16px NES-font";
            this.Game.ctx.fillStyle = "#fff";
            this.Game.ctx.textBaseline = 'middle';
            this.Game.ctx.textAlign = 'right';
            this.Game.ctx.fillText(
                " SCORE: " + this.Game.Player.score + "/" + (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol),
                this.width - (this.height / 2) + this.x,
                this.y + this.height / 2
            );
        this.Game.ctx.closePath();
    }
}
