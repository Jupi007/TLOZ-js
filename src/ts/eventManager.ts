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

        document.addEventListener("keydown", e => this.keydownEvent(e));
        document.addEventListener("keyup", e => this.keyupEvent(e));
    }

    keydownEvent(e) {
        if (e.repeat){
            e.preventDefault();
            return
        };

        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = true;
                break;
            case "ArrowLeft":
                this.isLeftPressed = true;
                break;
            case "ArrowUp":
                this.isUpPressed = true;
                break;
            case "ArrowDown":
                this.isDownPressed = true;
                break;
            case "q":
                this.isAttackPressed = true;
                break;
            case "p":
                if (this.Game.status === GameStatus.Run || this.Game.status === GameStatus.Stopped) {
                    this.Game.status = this.Game.status === GameStatus.Run
                                     ? GameStatus.Stopped
                                     : GameStatus.Run;
                }
                break;
        }

        e.preventDefault();
    }

    keyupEvent(e): void {
        switch (e.key) {
            case "ArrowRight":
                this.isRightPressed = false;
                break;
            case "ArrowLeft":
                this.isLeftPressed = false;
                break;
            case "ArrowUp":
                this.isUpPressed = false;
                break;
            case "ArrowDown":
                this.isDownPressed = false;
                break;
            case "q":
                this.isAttackPressed = false;
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
