class WinScreen {
    Game: Game;

    music: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);
    }

    draw(): void {
        this.Game.Viewport.draw();
        this.Game.Enemies.draw();
        this.Game.Sword.draw();
        this.Game.Player.draw();
        this.Game.Projectiles.draw();
        this.Game.Hud.draw();

        if (this.Game.status.currentFrame > 50) {
            this.music.play();

            this.Game.fillRect(
                0,
                0,
                this.Game.Canvas.width,
                this.Game.Canvas.height,
                "#000"
            );

            this.Game.fillText(
                "YOU WON",
                this.Game.Canvas.width / 2,
                this.Game.Canvas.height / 2,
                '#fff',
                '24px',
                'center',
                'middle'
            );
        }
    }
}
