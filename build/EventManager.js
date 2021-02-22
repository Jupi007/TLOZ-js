import { GameState } from "./Game.js";
export class EventManager {
    constructor(game) {
        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;
        this.isDownPressed = false;
        this.isAttackPressed = false;
        this.isEnterPressed = false;
        this.currentAttackFrame = 0;
        this.attackDuration = 10;
        this.Game = game;
        document.addEventListener("keydown", e => this.keyEvent(e, true));
        document.addEventListener("keyup", e => this.keyEvent(e, false));
        document.addEventListener("visibilitychange", e => this.visibilityEvent(e), false);
    }
    keyEvent(e, keydown) {
        if (e.repeat) {
            e.preventDefault();
            return;
        }
        ;
        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = keydown;
                break;
            case "ArrowLeft":
                this.isLeftPressed = keydown;
                break;
            case "ArrowUp":
                this.isUpPressed = keydown;
                break;
            case "ArrowDown":
                this.isDownPressed = keydown;
                break;
            case "Enter":
                this.isEnterPressed = keydown;
                break;
            case "q":
            case "Q":
                if (keydown) {
                    this.isAttackPressed = true;
                }
                break;
            case "p":
            case "P":
                if (keydown && this.Game.state.isIn(GameState.Run, GameState.Stopped)) {
                    this.Game.state.setNextState(this.Game.state.is(GameState.Run)
                        ? GameState.Stopped
                        : GameState.Run);
                }
                break;
        }
        e.preventDefault();
    }
    visibilityEvent(e) {
        if (document["hidden"] && this.Game.state.is(GameState.Run)) {
            this.Game.state.setNextState(GameState.Stopped);
            this.Game.lastTime = null;
        }
    }
    newFrame() {
        if (this.isAttackPressed) {
            this.currentAttackFrame += this.Game.dt;
            if (this.currentAttackFrame >= this.attackDuration) {
                this.isAttackPressed = false;
            }
            return;
        }
        this.currentAttackFrame = 0;
    }
}
