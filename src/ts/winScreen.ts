class WinScreen {
    Game: Game;

    music: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);
    }

    draw(): void {
        this.music.play();

        this.Game.ctx.beginPath();
            this.Game.ctx.fillStyle = "#000";
            this.Game.ctx.fillRect(
                0,
                0,
                this.Game.Canvas.width,
                this.Game.Canvas.height
            );
        this.Game.ctx.closePath();

        this.Game.ctx.beginPath();
            this.Game.ctx.font = "24px NES-font";
            this.Game.ctx.fillStyle = "#fff";
            this.Game.ctx.textBaseline = 'middle';
            this.Game.ctx.textAlign = 'center';
            this.Game.ctx.fillText(
                "YOU WIN",
                this.Game.Canvas.width / 2,
                this.Game.Canvas.height / 2
            );
        this.Game.ctx.closePath();
    }
}
