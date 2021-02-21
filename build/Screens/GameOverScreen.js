import { StateObserver } from "../Libraries/Observers.js";
import { AudioLoader } from "../Libraries/Loaders.js";
import { AbstractScreen } from "./AbstractScreen.js";
var GameOverScreenState;
(function (GameOverScreenState) {
    GameOverScreenState[GameOverScreenState["PlayerAnimation"] = 0] = "PlayerAnimation";
    GameOverScreenState[GameOverScreenState["HideGame"] = 1] = "HideGame";
    GameOverScreenState[GameOverScreenState["BlackScreen"] = 2] = "BlackScreen";
})(GameOverScreenState || (GameOverScreenState = {}));
export class GameOverScreen extends AbstractScreen {
    constructor(game) {
        super(game, new StateObserver(GameOverScreenState.PlayerAnimation), "#000", "GAME OVER", "press enter to retry", 150);
        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);
    }
    draw() {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.EnemyManager.draw();
                this.Game.Hud.draw();
                this.Game.Player.drawGameOver();
                if (this.Game.Player.isDiedObserver.currentFrame > 145)
                    this.state.setNextState(GameOverScreenState.HideGame);
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
                if (this.state.isFirstFrame)
                    this.music.play();
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
