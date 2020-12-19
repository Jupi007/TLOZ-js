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
            this.Game.ctx.font = "16px NES-font";
            this.Game.ctx.fillStyle = "#fff";
            this.Game.ctx.textBaseline = 'middle';
            this.Game.ctx.textAlign = 'left';
            this.Game.ctx.fillText(
                "HP: " + this.Game.Player.hp,
                this.x + this.height / 2,
                this.y + this.height / 2
            );
        this.Game.ctx.closePath();

        this.Game.ctx.beginPath();
            this.Game.ctx.font = "16px NES-font";
            this.Game.ctx.fillStyle = "#fff";
            this.Game.ctx.textBaseline = 'middle';
            this.Game.ctx.textAlign = 'center';
            this.Game.ctx.fillText(
                "PLAYER: X" + this.Game.Player.x + " Y" + this.Game.Player.y,
                this.x + this.width / 2,
                this.y + this.height / 2
            );
        this.Game.ctx.closePath();
        
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
