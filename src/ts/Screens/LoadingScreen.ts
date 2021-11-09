import { Game, GameState } from "../Game";

import { StateObserver } from "../Libraries/Observers";

import { AbstractScreen } from "./AbstractScreen";

enum LoadingScreenState {
  BlackScreen
}

export class LoadingScreen extends AbstractScreen {
  music: HTMLAudioElement;

  constructor(game: Game) {
    super({
      game,
      state: new StateObserver(LoadingScreenState.BlackScreen),
      backgroundColor: "#000",
      title: "LOADING...",
      message: "",
      blinkingMessage: false
    });
  }

  draw(): void {
    this.message = Math.trunc(this.Game.AssetManager.loaded * 100 /  this.Game.AssetManager.toLoad) + "%";

    super.draw();

    super.updateObservers();

    if (this.Game.AssetManager.isLoadFinished()) this.Game.state.setNextState(GameState.Splash);
  }
}
