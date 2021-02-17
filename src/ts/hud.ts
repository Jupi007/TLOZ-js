class Hud {
    Game: Game;

    x: number;
    y: number;

    height: number;
    width: number;

    emptyHeartSprite: HTMLImageElement;
    halfHeartSprite: HTMLImageElement;
    fullHeartSprite: HTMLImageElement;

    currentSceneAnimation: AnimationObserver;

    constructor(game: Game) {
        this.Game = game;

        this.x = 0;
        this.y = 0;

        this.height = 64;

        this.emptyHeartSprite = SpriteLoader.load('./sprites/png/empty-heart.png');
        this.halfHeartSprite = SpriteLoader.load('./sprites/png/half-heart.png');
        this.fullHeartSprite = SpriteLoader.load('./sprites/png/full-heart.png');

        this.currentSceneAnimation = new AnimationObserver(25, 2);
    }

    draw(): void {
        this.Game.fillRect(
            this.x,
            this.y,
            this.width,
            this.height,
            '#000'
        );

        this.drawHearts();
        this.drawMap();
        this.drawScore();
    }

    drawHearts(): void {
        for (let i = 1; i <= this.Game.Player.maxHp / 2; i++) {
            this.Game.drawImage(
                this.emptyHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
        }

        for (let i = 1; i <= this.Game.Player.hp / 2; i++) {
            this.Game.drawImage(
                this.fullHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
        }

        if (this.Game.Player.hp % 2 === 1) {
            this.Game.drawImage(
                this.halfHeartSprite,
                24 * (this.Game.Player.hp / 2 + 1) + 8 * (this.Game.Player.hp / 2 - 1),
                this.height / 2 - 12,
                24,
                24
            );
        }
    }

    drawMap(): void {
        let cellHeight = (this.height  - this.Game.World.nbCol - 1) / this.Game.World.nbCol;
        let cellWidth = (cellHeight * this.Game.Viewport.width) / this.Game.Viewport.height;

        let x = (this.width / 2) - (cellWidth * this.Game.World.nbRow + this.Game.World.nbRow - 1) / 2

        this.Game.World.loopScenes((scene) => {
            this.Game.fillRect(
                x + cellWidth * scene.c + 2 * scene.c,
                cellHeight * scene.r + 2 * scene.r,
                cellWidth,
                cellHeight,
                scene.hasEnemies ? '#d11c0d' : '#00a230'
            );
        });

        if (this.Game.state.isIn(GameState.Run)) {
            if (this.currentSceneAnimation.currentAnimationStep === 1) {
                this.Game.fillRect(
                    x + cellWidth * this.Game.Viewport.currentScene.c + 2 * this.Game.Viewport.currentScene.c,
                    cellHeight * this.Game.Viewport.currentScene.r + 2 * this.Game.Viewport.currentScene.r,
                    cellWidth,
                    cellHeight,
                    "rgba(0, 0, 0, 0.3)"
                );
            }

            this.currentSceneAnimation.update(this.Game.dt);
        }
    }

    drawScore(): void {
        this.Game.fillText(
            ' SCORE: ' + this.Game.Player.score + '/' + this.Game.Player.targetScore,
            //'FPS:' + ((1/this.Game.dt)*60).toFixed(0),
            this.width - (this.height / 2) + this.x,
            this.y + this.height / 2,
            '#fff',
            '16px',
            'right',
            'middle'
        );
    }
}
