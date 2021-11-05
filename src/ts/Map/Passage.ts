import { Game } from "../Game";
import { SimpleBox } from "../Libraries/Boxes";
import { Scene } from "./Scene";


export class Passage extends SimpleBox {
    Game: Game;
    Scene: Scene;

    targetWorldIndex: number;
    targetSceneC: number;
    targetSceneR: number;

    constructor({ game, scene, c, r, targetWorldIndex, targetSceneC, targetSceneR }: {
        game: Game;
        scene: Scene;
        c: number;
        r: number;
        targetWorldIndex: number;
        targetSceneC: number;
        targetSceneR: number;
    }) {
        super();

        this.Game = game;
        this.Scene = scene;

        this.x = c * this.Scene.cellSize;
        this.y = r * this.Scene.cellSize;

        this.width = this.Scene.cellSize;
        this.height = this.Scene.cellSize;

        this.targetWorldIndex = targetWorldIndex;
        this.targetSceneC = targetSceneC;
        this.targetSceneR = targetSceneR;
    }
}
