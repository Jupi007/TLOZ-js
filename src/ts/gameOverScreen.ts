class GameOverScreen {
    Game: Game;

    currentFrame: number;
    playerRotationAnimationDuration: number;
    blackScreen: number;
    playerRotationAnimationSpeed: number;

    music: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;

        this.currentFrame = 0;
        this.playerRotationAnimationDuration = 100;
        this.playerRotationAnimationSpeed = 8;
        this.blackScreen = 180; // die music duration is 156
        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);
    }

    draw(): void {
        this.Game.Landscape.draw();
        this.Game.Enemies.draw();
        this.Game.Sword.draw();
        this.Game.Hud.draw();

        this.currentFrame++;

        if (this.currentFrame < this.playerRotationAnimationDuration) {
            if (this.currentFrame % this.playerRotationAnimationSpeed === 0) {
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

            return;
        }

        if (this.currentFrame < this.blackScreen) {
            return;
        }

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
                "GAME OVER",
                this.Game.Canvas.width / 2,
                this.Game.Canvas.height / 2
            );
        this.Game.ctx.closePath();
    }
}
