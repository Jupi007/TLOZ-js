export class Panes {
    constructor(game) {
        this.Game = game;
        this.speed = 8;
        this.position = 0;
    }
    get isAnimationFinished() {
        return this.position > this.Game.Canvas.width / 2;
    }
    reset() {
        this.position = 0;
    }
    drawOpen() {
        this.Game.fillRect(-this.position, 0, this.Game.Canvas.width / 2, this.Game.Canvas.height, "#000");
        this.Game.fillRect(this.Game.Canvas.width / 2 + this.position, 0, this.Game.Canvas.width / 2, this.Game.Canvas.height, "#000");
        this.position += this.speed * this.Game.dt;
    }
    drawClose() {
        this.Game.fillRect(-(this.Game.Canvas.width / 2) + this.position, 0, this.Game.Canvas.width / 2, this.Game.Canvas.height, "#000");
        this.Game.fillRect(this.Game.Canvas.width - this.position, 0, this.Game.Canvas.width / 2, this.Game.Canvas.height, "#000");
        this.position += this.speed * this.Game.dt;
    }
}
