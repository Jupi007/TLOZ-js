class StoppedScreen {
    Game: Game;

    constructor(game: Game) {
        this.Game = game;
    }

    draw(): void {
        this.Game.fillRect(
            0,
            0,
            this.Game.Canvas.width,
            this.Game.Canvas.height,
            "rgba(0, 0, 0, 0.5)"
        );

        this.Game.fillText(
            "PAUSE",
            this.Game.Canvas.width / 2,
            this.Game.Canvas.height / 3,
            '#fff',
            '24px',
            'center',
            'middle'
        );

        this.Game.fillText(
            "press p to continue",
            this.Game.Canvas.width / 2,
            this.Game.Canvas.height / 3 * 2,
            '#fff',
            '16px',
            'center',
            'middle'
        );
    }
}
