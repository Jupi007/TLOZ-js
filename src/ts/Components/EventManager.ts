import { Game, GameState } from "../Game";

import { InventoryState } from "./Inventory";

export class EventManager {
  Game: Game;

  isRightPressed = false;
  isLeftPressed = false;
  isUpPressed = false;
  isDownPressed = false;
  isAttackPressed = false;
  isEnterPressed = false;

  currentAttackFrame = 0;
  attackDuration = 10;

  constructor(game: Game) {
    this.Game = game;

    document.addEventListener("keydown", (e) => this.keyEvent(e, true));
    document.addEventListener("keyup", (e) => this.keyEvent(e, false));
    document.addEventListener(
      "visibilitychange",
      () => this.visibilityEvent(),
      false
    );
  }

  keyEvent(e, keydown): void {
    if (e.repeat) {
      e.preventDefault();
      return;
    }

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
      case "i":
      case "I":
        if (!keydown) return;
        if (
          this.Game.state.isIn(GameState.Run) &&
          this.Game.Panes.isAnimationFinished
        ) {
          this.Game.state.setNextState(GameState.Inventory);
          this.Game.Inventory.state.set(InventoryState.ShowAnimation);
        } else if (this.Game.state.isIn(GameState.Inventory)) {
          if (this.Game.Inventory.state.is(InventoryState.Visible)) {
            this.Game.Inventory.state.setNextState(
              InventoryState.HideAnimation
            );
          } else {
            this.Game.Inventory.state.set(
              this.Game.Inventory.state.is(InventoryState.ShowAnimation)
                ? InventoryState.HideAnimation
                : InventoryState.ShowAnimation
            );
          }
        }
        break;
      case "w":
      case "W":
        this.Game.state.setNextState(GameState.Win);
        break;
      case "p":
      case "P":
        if (!keydown) return;
        if (this.Game.state.isIn(GameState.Run, GameState.Stopped)) {
          this.Game.state.setNextState(
            this.Game.state.is(GameState.Run)
              ? GameState.Stopped
              : GameState.Run
          );
        }
        break;
    }

    e.preventDefault();
  }

  visibilityEvent(): void {
    if (document["hidden"] && this.Game.state.is(GameState.Run)) {
      this.Game.state.setNextState(GameState.Stopped);
      this.Game.lastTime = null;
    }
  }

  newFrame(): void {
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
