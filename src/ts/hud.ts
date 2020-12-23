class Hud {
    Game: Game;

    x: number;
    y: number;

    height: number;
    width: number;

    emptyHeartSprite: HTMLImageElement;
    halfHeartSprite: HTMLImageElement;
    fullHeartSprite: HTMLImageElement;

    constructor(game: Game) {
        this.Game = game;

        this.x = 0;
        this.y = 0;

        this.height = 64;

        this.emptyHeartSprite = SpriteLoader.load('./sprites/png/empty-heart.png');
        this.halfHeartSprite = SpriteLoader.load('./sprites/png/half-heart.png');
        this.fullHeartSprite = SpriteLoader.load('./sprites/png/full-heart.png');
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

    drawScore(): void {
        this.Game.fillText(
            ' SCORE: ' + this.Game.Player.score + '/' + (this.Game.World.nbRow * this.Game.World.nbCol),
            this.width - (this.height / 2) + this.x,
            this.y + this.height / 2,
            '#fff',
            '16px',
            'right',
            'middle'
        );
    }
}
