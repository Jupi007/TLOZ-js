enum SplashScreenState {BlackScreen}

class SplashScreen {
    Game: Game;

    music: HTMLAudioElement;
    state: StateObserver;
    showStartMessage: boolean;

    startMessageAnimation: AnimationObserver;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/intro.mp3", true);
        this.state = new StateObserver(SplashScreenState.BlackScreen);

        this.startMessageAnimation = new AnimationObserver(50, 2);
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

                if (this.state.currentFrame > 50) {
                    if (this.Game.EventManager.isEnterPressed) {
                        this.music.pause();
                        this.Game.state.setNextState(GameState.Run);
                    }

                    if (this.startMessageAnimation.currentAnimationStep === 1) {
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
                    this.startMessageAnimation.update(this.Game.dt);
                }
                break;
        }

        this.state.update(this.Game.dt);
    }
}
