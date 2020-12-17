class EventManager {
    Game: Game;

    isRightPressed = false;
    isLeftPressed = false;
    isUpPressed = false;
    isDownPressed = false;
    isAttackPressed = false;

    currentAttackFrame = 0;
    attackDuration = 20;

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
                this.isAttackPressed = keydown;
                break;
            case "p":
                if (keydown && (this.Game.status === GameStatus.Run || this.Game.status === GameStatus.Stopped)) {
                    this.Game.status = this.Game.status === GameStatus.Run
                                     ? GameStatus.Stopped
                                     : GameStatus.Run;
                }
                break;
        }

        e.preventDefault();
    }

    newFrame(): void {
        if (this.isAttackPressed) {
            this.currentAttackFrame++;

            if (this.currentAttackFrame >= this.attackDuration) {
                this.isAttackPressed = false;
            }

            return;
        }

        this.currentAttackFrame = 0;
    }
}
