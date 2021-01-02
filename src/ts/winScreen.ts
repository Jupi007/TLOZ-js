enum WinScreenState {PlayerAnimation, BlackScreen};

class WinScreen {
    Game: Game;

    music: HTMLAudioElement;

    state: StateObserver;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);

        this.state = new StateObserver(WinScreenState.PlayerAnimation);
    }

    draw(): void {
        switch (this.state.get()) {
            case WinScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();

                if (this.state.currentFrame > 120) this.state.set(WinScreenState.BlackScreen);
                break;

            case WinScreenState.BlackScreen:
                if (this.state.isFirstFrame) this.music.play();

                if (this.Game.EventManager.isEnterPressed) location.reload();

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
                    this.Game.Canvas.height / 3,
                    '#fff',
                    '24px',
                    'center',
                    'middle'
                );

                this.Game.fillText(
                    "press enter to retry",
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height / 3 * 2,
                    '#fff',
                    '16px',
                    'center',
                    'middle'
                );
                break;
        }
        this.state.update();
    }
}
