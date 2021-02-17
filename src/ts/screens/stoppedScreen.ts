enum StoppedScreenState {BlackScreen}

class StoppedScreen extends AbstractScreen {
    constructor(game: Game) {
        super(
            game,
            new StateObserver(StoppedScreenState.BlackScreen),
            "rgba(0, 0, 0, 0.5)",
            "PAUSE",
            "press p to continue"
        );
    }

    draw(): void {
        switch (this.state.get()) {
            case StoppedScreenState.BlackScreen:
                super.draw();
                break;
        }

        super.updateObservers();
    }
}
