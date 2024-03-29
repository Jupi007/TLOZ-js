import { Game, GameState } from "../Game";

import { StateObserver } from "../Libraries/Observers";

import { AbstractScreen } from "./AbstractScreen";

enum SplashScreenState {
  BlackScreen
}

export class SplashScreen extends AbstractScreen {
  music: HTMLAudioElement;

  constructor(game: Game) {
    super({
      game,
      state: new StateObserver(SplashScreenState.BlackScreen),
      backgroundColor: "#000",
      title: "TLOZ - JS",
      titleFontSize: "40px",
      titleColor: "#aefe44",
      message: "press enter to start",
      showMessageAfter: 150
    });

    this.music = this.Game.AssetManager.getSound("./sounds/music/intro.mp3", true);
  }

  draw(): void {
    switch (this.state.get()) {
      case SplashScreenState.BlackScreen:
        if (this.state.isFirstFrame) this.music.play();

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
