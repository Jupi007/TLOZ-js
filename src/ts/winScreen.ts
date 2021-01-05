enum WinScreenState {PlayerAnimation, HideGame, BlackScreen};

class WinScreen {
    Game: Game;

    killedSprites: HTMLImageElement[] = [];

    music: HTMLAudioElement;

    state: StateObserver;

    hideGamePaneSpeed: number;
    hideGamePanePosition: number;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);

        this.state = new StateObserver(WinScreenState.PlayerAnimation);

        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");

        this.hideGamePaneSpeed = 8;
        this.hideGamePanePosition = 0;
    }

    draw(): void {
        switch (this.state.get()) {
            case WinScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();

                if (this.state.currentFrame > 120) this.state.set(WinScreenState.HideGame);
                break;

            case GameOverScreenState.HideGame:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();

                this.Game.fillRect(
                    -(this.Game.Canvas.width / 2) + this.hideGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.Game.fillRect(
                    this.Game.Canvas.width - this.hideGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.hideGamePanePosition += this.hideGamePaneSpeed;

                if (this.hideGamePanePosition > this.Game.Canvas.width / 2) {
                    this.state.set(WinScreenState.BlackScreen);
                }
                break;

            case WinScreenState.BlackScreen:
                if (this.state.isFirstFrame) this.music.play();

                if (this.Game.EventManager.isEnterPressed) {
                    this.music.pause();
                    this.Game.restart();
                }

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
                    "press enter to play again",
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
