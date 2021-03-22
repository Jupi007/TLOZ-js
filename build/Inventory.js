import { GameState } from "./Game.js";
import { Direction } from "./Libraries/Direction.js";
import { StateObserver } from "./Libraries/Observers.js";
export var InventoryState;
(function (InventoryState) {
    InventoryState[InventoryState["Visible"] = 0] = "Visible";
    InventoryState[InventoryState["Hidden"] = 1] = "Hidden";
    InventoryState[InventoryState["ShowAnimation"] = 2] = "ShowAnimation";
    InventoryState[InventoryState["HideAnimation"] = 3] = "HideAnimation";
})(InventoryState || (InventoryState = {}));
;
export class Inventory {
    constructor(game) {
        this.Game = game;
        this.y = -this.Game.Canvas.height;
        this.width = this.Game.Canvas.width;
        this.height = this.Game.Canvas.height;
        this.animationSpeed = 12;
        this.state = new StateObserver(InventoryState.Hidden);
    }
    move() {
        if (this.state.is(InventoryState.ShowAnimation)) {
            if (this.y < 0) {
                this.y += this.Game.dt * this.animationSpeed;
                this.Game.Viewport.y += this.Game.dt * this.animationSpeed;
                this.Game.Hud.y += this.Game.dt * this.animationSpeed;
            }
            else {
                this.y = 0;
                this.state.setNextState(InventoryState.Visible);
            }
        }
        else if (this.state.is(InventoryState.HideAnimation)) {
            if (this.y > -this.height) {
                this.y -= this.Game.dt * this.animationSpeed;
                this.Game.Viewport.y -= this.Game.dt * this.animationSpeed;
                this.Game.Hud.y -= this.Game.dt * this.animationSpeed;
            }
            else {
                this.y = -this.height;
                this.Game.Viewport.y = this.Game.Hud.height;
                this.Game.Hud.y = 0;
                this.state.setNextState(InventoryState.Hidden);
                this.Game.state.setNextState(GameState.Run);
            }
        }
    }
    draw() {
        if (this.state.isIn(InventoryState.ShowAnimation, InventoryState.HideAnimation))
            this.Game.drawGame();
        this.fillRect(0, 0, this.width, this.height, '#000');
        this.fillText("Inventory", this.width / 2, this.height / 3, '#fff', '24px', 'center', 'middle');
        this.fillText("Q", this.width / 2 - 10, this.height / 3 * 2, '#fff', '24px', 'right', 'middle');
        if (this.Game.Sword.isEnabled) {
            this.drawImage(this.Game.Sword.sprites[Direction.Up], this.width / 2 + 10, this.height / 3 * 2 - this.Game.Sword.swordWidth / 2, this.Game.Sword.swordHeight, this.Game.Sword.swordWidth);
        }
        else {
            this.fillRect(this.width / 2 + 10, this.height / 3 * 2 - this.Game.Sword.swordWidth / 2, this.Game.Sword.swordHeight, this.Game.Sword.swordWidth, "grey");
        }
        this.state.update(this.Game.dt);
    }
    drawImage(sprite, x, y, width, height) {
        this.Game.drawImage(sprite, x, y + this.y, width, height);
    }
    fillRect(x, y, width, height, color) {
        this.Game.fillRect(x, y + this.y, width, height, color);
    }
    fillText(text, x, y, color, fontSize = '16px', textAlign = 'left', textBaseline = 'alphabetic') {
        this.Game.fillText(text, x, y + this.y, color, fontSize, textAlign, textBaseline);
    }
}
