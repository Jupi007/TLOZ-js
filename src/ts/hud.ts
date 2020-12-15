class Hud {
    Game: Game;

    x: number;
    y: number;

    height: number;
    width: number;

    constructor(game: Game) {
        this.Game = game;

        this.x = 0;
        this.y = 0;

        this.height = 64;
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

        this.Game.ctx.beginPath();
            this.Game.ctx.font = "16px Ubuntu";
            this.Game.ctx.fillStyle = "#fff";
            this.Game.ctx.fillText(
                "HP: " + this.Game.Player.hp + " Score: " + this.Game.Player.score + "/" + (this.Game.Overworld.nbRow * this.Game.Overworld.nbCol),
                8 + this.x,
                20 + this.y
            );
        this.Game.ctx.closePath();
    }
}
