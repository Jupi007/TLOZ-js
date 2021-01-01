class EventManager {
    Game: Game;

    isRightPressed = false;
    isLeftPressed = false;
    isUpPressed = false;
    isDownPressed = false;
    isAttackObserverPressed = false;

    currentAttackFrame = 0;
    attackDuration = 10;

    constructor(game: Game) {
        this.Game = game;

        document.addEventListener("keydown", e => this.keyEvent(e, true));
        document.addEventListener("keyup", e => this.keyEvent(e, false));
    }

    keyEvent(e, keydown) {
        if (e.repeat){
            e.preventDefault();
            return;
        };

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
            case "q":
                if (keydown) {
                    this.isAttackObserverPressed = true;
                }
                break;
            case "p":
                if (keydown && this.Game.status.isIn(GameStatus.Run, GameStatus.Stopped)) {
                    this.Game.status.set(this.Game.status.is(GameStatus.Run)
                                     ? GameStatus.Stopped
                                     : GameStatus.Run);
                }
                break;
        }

        e.preventDefault();
    }

    newFrame(): void {
        if (this.isAttackObserverPressed) {
            this.currentAttackFrame++;

            if (this.currentAttackFrame >= this.attackDuration) {
                this.isAttackObserverPressed = false;
            }

            return;
        }

        this.currentAttackFrame = 0;
    }
}
