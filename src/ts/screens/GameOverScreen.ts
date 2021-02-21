import { Game } from "../Game.js";
import { AbstractScreen } from "./AbstractScreen.js";
import { StateObserver, AnimationObserver } from "../Observers.js";
import { AudioLoader } from "../AbstractClasses.js";

enum GameOverScreenState {PlayerAnimation, HideGame, BlackScreen}

export class GameOverScreen extends AbstractScreen {
    music: HTMLAudioElement;

    constructor(game: Game) {
        super(
            game,
            new StateObserver(GameOverScreenState.PlayerAnimation),
            "#000",
            "GAME OVER",
            "press enter to retry",
            150
        );

        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);
    }

    draw(): void {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.EnemyManager.draw();
                this.Game.Hud.draw();
                this.Game.Player.drawGameOver();

                if (this.Game.Player.isDiedObserver.currentFrame > 145) this.state.setNextState(GameOverScreenState.HideGame);
                break;

            case GameOverScreenState.HideGame:
                if (this.state.isFirstFrame) {
                    this.Game.Panes.reset();
                }

                this.Game.Viewport.draw();
                this.Game.Hud.draw();
                this.Game.Panes.drawClose();

                if (this.Game.Panes.isAnimationFinished) {
                    this.state.setNextState(GameOverScreenState.BlackScreen);
                }
                break;

            case GameOverScreenState.BlackScreen:
                if (this.state.isFirstFrame) this.music.play();

                if (this.Game.EventManager.isEnterPressed) {
                    this.music.pause();
                    this.Game.restart();
                }

                super.draw();
                break;
        }

        super.updateObservers();
    }
}
