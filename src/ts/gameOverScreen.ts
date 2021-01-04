enum GameOverScreenState {PlayerAnimation, HideGame, BlackScreen}

class GameOverScreen {
    Game: Game;

    killedSprites: HTMLImageElement[] = [];

    music: HTMLAudioElement;

    state: StateObserver;

    hideGamePaneSpeed: number;
    hideGamePanePosition: number;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);

        this.state = new StateObserver(GameOverScreenState.PlayerAnimation);

        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");

        this.hideGamePaneSpeed = 8;
        this.hideGamePanePosition = 0;
    }

    draw(): void {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Hud.draw();

                if (this.state.currentFrame <= 125) {
                    if (this.state.currentFrame % 8 === 0) {
                        switch (this.Game.Player.direction) {
                            case Direction.Up:
                                this.Game.Player.direction = Direction.Right;
                                break;
                            case Direction.Right:
                                this.Game.Player.direction = Direction.Down;
                                break;
                            case Direction.Down:
                                this.Game.Player.direction = Direction.Left;
                                break;
                            case Direction.Left:
                                this.Game.Player.direction = Direction.Up;
                                break;
                        }
                    }

                    this.Game.Player.draw();
                }
                else if (this.state.currentFrame <= 135) {
                    this.Game.Viewport.currentScene.drawImage(
                        this.killedSprites[1],
                        this.Game.Player.x,
                        this.Game.Player.y,
                        this.Game.Player.width,
                        this.Game.Player.height
                    );
                }
                else if (this.state.currentFrame <= 145) {
                    this.Game.Viewport.currentScene.drawImage(
                        this.killedSprites[2],
                        this.Game.Player.x,
                        this.Game.Player.y,
                        this.Game.Player.width,
                        this.Game.Player.height
                    );
                }
                else {
                    this.state.set(GameOverScreenState.HideGame);
                }
                break;

            case GameOverScreenState.HideGame:
                this.Game.Viewport.draw();
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
                    this.state.set(GameOverScreenState.BlackScreen);
                }
                break;

            case GameOverScreenState.BlackScreen:
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
                    "GAME OVER",
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
