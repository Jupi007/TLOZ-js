import { Brick } from "./Brick";
import { Game } from "../Game";
import { AnimationObserver } from "../Libraries/Observers";


export class AnimatedBrick extends Brick {
    sprites: HTMLImageElement[] = [];
    spritesAnimation: AnimationObserver;

    constructor(game: Game) {
        super(game);
    }
}
