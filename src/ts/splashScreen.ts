enum SplashScreenState {BlackScreen, RevealGame}

class SplashScreen {
    Game: Game;

    music: HTMLAudioElement;
    state: StateObserver;
    showStartMessage: boolean;

    revealGamePaneSpeed: number;
    revealGamePanePosition: number;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/intro.mp3", true);
        this.state = new StateObserver(SplashScreenState.BlackScreen);
        this.showStartMessage = true;

        this.revealGamePaneSpeed = 8;
        this.revealGamePanePosition = 0;
    }

    draw(): void {
        switch (this.state.get()) {
            case SplashScreenState.BlackScreen:
                if (this.state.isFirstFrame) this.music.play();

                this.Game.fillRect(
                    0,
                    0,
                    this.Game.Canvas.width,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.Game.fillText(
                    "TLOZ-JS GAME",
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height / 3,
                    '#fff',
                    '24px',
                    'center',
                    'middle'
                );

                if (this.state.currentFrame > 100) {
                    if (this.Game.EventManager.isEnterPressed) {
                        this.music.pause();
                        this.state.set(SplashScreenState.RevealGame);
                    }

                    if (this.state.currentFrame % 50 === 0) {
                        this.showStartMessage = this.showStartMessage ? false : true;
                    }

                    if (this.showStartMessage) {
                        this.Game.fillText(
                            "press enter to start",
                            this.Game.Canvas.width / 2,
                            this.Game.Canvas.height / 3 * 2,
                            '#fff',
                            '16px',
                            'center',
                            'middle'
                        );
                    }
                }
                break;
            case SplashScreenState.RevealGame:
                if (this.revealGamePanePosition > this.Game.Canvas.width / 2) {
                    this.Game.state.set(GameState.Run);
                }

                this.Game.Viewport.draw();
                this.Game.Player.draw();
                this.Game.Hud.draw();

                this.Game.fillRect(
                    -this.revealGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.Game.fillRect(
                    this.Game.Canvas.width / 2 + this.revealGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.revealGamePanePosition += this.revealGamePaneSpeed;
                break;
        }

        this.state.update();
    }
}
