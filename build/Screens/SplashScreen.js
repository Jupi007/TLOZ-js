import { GameState } from "../Game.js";
import { StateObserver } from "../Libraries/Observers.js";
import { AudioLoader } from "../Libraries/Loaders.js";
import { AbstractScreen } from "./AbstractScreen.js";
var SplashScreenState;
(function (SplashScreenState) {
    SplashScreenState[SplashScreenState["BlackScreen"] = 0] = "BlackScreen";
})(SplashScreenState || (SplashScreenState = {}));
export class SplashScreen extends AbstractScreen {
    constructor(game) {
        super(game, new StateObserver(SplashScreenState.BlackScreen), "#000", "TLOZ-JS GAME", "press enter to start", 150);
        this.music = AudioLoader.load("./sounds/music/intro.mp3", true);
    }
    draw() {
        switch (this.state.get()) {
            case SplashScreenState.BlackScreen:
                if (this.state.isFirstFrame)
                    this.music.play();
                super.draw();
                if (this.state.currentFrame > this.showMessageAfter) {
                    if (this.Game.EventManager.isEnterPressed) {
                        this.music.pause();
                        this.Game.state.setNextState(GameState.Run);
                    }
                }
                break;
        }
        super.updateObservers();
    }
}
