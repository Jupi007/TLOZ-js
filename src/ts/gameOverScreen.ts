enum GameOverScreenState {PlayerAnimation, BlackScreen}

class GameOverScreen {
    Game: Game;

    playerRotationAnimationSpeed: number;

    music: HTMLAudioElement;

    state: StateObserver;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);

        this.state = new StateObserver(GameOverScreenState.PlayerAnimation);
    }

    draw(): void {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Hud.draw();

                if (this.state.currentFrame < 125) {
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

                if (this.state.currentFrame > 200) this.state.set(GameOverScreenState.BlackScreen);
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
