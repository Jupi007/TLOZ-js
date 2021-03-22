import { Game, GameState } from "./Game.js";

import { AnimationObserver } from "./Libraries/Observers.js";
import { SpriteLoader } from "./Libraries/Loaders.js";
import { Random } from "./Libraries/Random.js";

export class Hud {
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
        this.fillRect(
            0,
            0,
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
            this.drawImage(
                this.emptyHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
        }

        for (let i = 1; i <= this.Game.Player.hp / 2; i++) {
            this.drawImage(
                this.fullHeartSprite,
                24 * i + 8 * i,
                this.height / 2 - 12,
                24,
                24
            );
        }

        if (this.Game.Player.hp % 2 === 1) {
            this.drawImage(
                this.halfHeartSprite,
                24 * (this.Game.Player.hp / 2 + 1) + 8 * (this.Game.Player.hp / 2 - 1),
                this.height / 2 - 12,
                24,
                24
            );
        }
    }

    drawMap(): void {
        let cellHeight = (this.height - this.Game.Viewport.currentWorld.nbRow - 1) / this.Game.Viewport.currentWorld.nbRow;
        let cellWidth = (cellHeight * this.Game.Viewport.width) / this.Game.Viewport.height;

        let x = (this.width - cellWidth * this.Game.Viewport.currentWorld.nbCol + this.Game.Viewport.currentWorld.nbCol - 1) / 2

        this.Game.Viewport.currentWorld.loopScenes((scene) => {
            let bgColor = '#00a230';

            if (scene.hasPermanentItems) {
                bgColor = '#e2d64a'
            }
            else if (scene.hasEnemies) {
                bgColor = '#d11c0d';
            }

            this.fillRect(
                x + cellWidth * scene.c + 2 * scene.c,
                cellHeight * scene.r + 2 * scene.r,
                cellWidth,
                cellHeight,
                bgColor
            );
        });

        if (this.Game.state.isIn(GameState.Run)) {
            if (this.currentSceneAnimation.currentAnimationStep === 1) {
                this.fillRect(
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
        this.fillText(
            ' SCORE: ' + this.Game.Player.score + '/' + this.Game.Player.targetScore,
            //'FPS:' + ((1/this.Game.dt)*60).toFixed(0),
            this.width - (this.height / 2),
            this.height / 2,
            '#fff',
            '16px',
            'right',
            'middle'
        );
    }

    drawImage(
        sprite: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.Game.drawImage(
            sprite,
            x + this.x,
            y + this.y,
            width,
            height
        );
    }

    fillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
    ) {
        this.Game.fillRect(
            x + this.x,
            y + this.y,
            width,
            height,
            color
        );
    }

    fillText(
        text: string,
        x: number,
        y: number,
        color: string,
        fontSize: string = '16px',
        textAlign: CanvasTextAlign = 'left',
        textBaseline: CanvasTextBaseline = 'alphabetic',
    ) {
        this.Game.fillText(text, x + this.x, y + this.y, color, fontSize, textAlign, textBaseline);
    }
}
