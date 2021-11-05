import { SimpleBox } from "../Libraries/Boxes";
import { Brick } from "../Bricks/Brick";


export class Cell extends SimpleBox {
    brick: Brick;

    constructor({ x, y, size, brick }: {
        x: number;
        y: number;
        size: number;
        brick: Brick;
    }) {
        super();

        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.brick = brick;
    }
}
