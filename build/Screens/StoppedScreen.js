import { StateObserver } from "../Libraries/Observers.js";
import { AbstractScreen } from "./AbstractScreen.js";
var StoppedScreenState;
(function (StoppedScreenState) {
    StoppedScreenState[StoppedScreenState["BlackScreen"] = 0] = "BlackScreen";
})(StoppedScreenState || (StoppedScreenState = {}));
export class StoppedScreen extends AbstractScreen {
    constructor(game) {
        super(game, new StateObserver(StoppedScreenState.BlackScreen), "rgba(0, 0, 0, 0.5)", "PAUSE", "press p to continue");
    }
    draw() {
        switch (this.state.get()) {
            case StoppedScreenState.BlackScreen:
                super.draw();
                break;
        }
        super.updateObservers();
    }
}
