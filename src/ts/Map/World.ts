import { Game } from "../Game";
import { Brick } from "../Bricks/Brick";
import { Scene } from "./Scene";


export class World {
    Game: Game;

    scenes: Scene[][] = [];

    nbCol: number;
    nbRow: number;

    constructor({ game, nbCol, nbRow, defaultMusic, defaultBrick, defaultBackgroundColor }: {
        game: Game;
        nbCol: number;
        nbRow: number;
        defaultMusic: HTMLAudioElement;
        defaultBrick: Brick;
        defaultBackgroundColor: string;
    }) {
        this.Game = game;

        this.nbCol = nbCol;
        this.nbRow = nbRow;

        for (let c = 0; c < this.nbCol; c++) {
            this.scenes[c] = [];
            for (let r = 0; r < this.nbRow; r++) {
                this.scenes[c][r] = new Scene({
                    game: this.Game,
                    world: this,
                    c,
                    r,
                    music: defaultMusic,
                    defaultBrick,
                    backgroundColor: defaultBackgroundColor
                });
            }
        }
    }

    loopScenes(callback: Function): void {
        this.scenes.forEach((col) => {
            col.forEach((scene) => {
                callback(scene);
            });
        });
    }
}
