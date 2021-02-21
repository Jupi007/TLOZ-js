import { AbstractScreen } from "./AbstractScreen.js";
import { StateObserver } from "../Observers.js";
import { AudioLoader, SpriteLoader } from "../AbstractClasses.js";
var WinScreenState;
(function (WinScreenState) {
    WinScreenState[WinScreenState["PlayerAnimation"] = 0] = "PlayerAnimation";
    WinScreenState[WinScreenState["HideGame"] = 1] = "HideGame";
    WinScreenState[WinScreenState["BlackScreen"] = 2] = "BlackScreen";
})(WinScreenState || (WinScreenState = {}));
;
export class WinScreen extends AbstractScreen {
    constructor(game) {
        super(game, new StateObserver(WinScreenState.PlayerAnimation), "#000", "YOU WON", "press enter to play again", 150);
        this.killedSprites = [];
        this.music = AudioLoader.load("./sounds/music/ending.mp3", true);
        this.killedSprites[1] = SpriteLoader.load("./sprites/png/killed1.png");
        this.killedSprites[2] = SpriteLoader.load("./sprites/png/killed2.png");
    }
    draw() {
        switch (this.state.get()) {
            case WinScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.EnemyManager.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();
                if (this.state.currentFrame > 120)
                    this.state.setNextState(WinScreenState.HideGame);
                break;
            case WinScreenState.HideGame:
                if (this.state.isFirstFrame)
                    this.Game.Panes.reset();
                this.Game.Viewport.draw();
                this.Game.EnemyManager.draw();
                this.Game.Sword.drawWin();
                this.Game.Player.drawWin();
                this.Game.Hud.draw();
                this.Game.Panes.drawClose();
                if (this.Game.Panes.isAnimationFinished) {
                    this.state.setNextState(WinScreenState.BlackScreen);
                }
                break;
            case WinScreenState.BlackScreen:
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
