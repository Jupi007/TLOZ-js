import { Game } from "../Game.js";
import { Direction } from "./Direction.js";

export abstract class SimpleBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class GameMovingBox extends SimpleBox {
    Game: Game;

    _dx = 0;
    _dy = 0;
    direction:Direction;

    constructor(game: Game) {
        super();
        this.Game = game;
    }

    get dx(): number {
        return this._dx * this.Game.dt;
    }

    get dy(): number {
        return this._dy * this.Game.dt;
    }

    get realDx(): number {
        return this._dx;
    }

    get realDy(): number {
        return this._dy;
    }

    set dx(dx) {
        this._dx = dx;
    }

    set dy(dy) {
        this._dy = dy;
    }
}

export abstract class MovingBox extends SimpleBox {
    dx = 0;
    dy = 0;
    direction:Direction;
}

export class MovingBoxHitBox {
    Box: MovingBox;

    hitX: number;
    hitY: number;
    hitWidth: number;
    hitHeight: number;

    constructor(box: MovingBox, x: number, y: number, width: number, height: number) {
        this.Box = box;
        this.hitX = x;
        this.hitY = y;
        this.hitWidth = width;
        this.hitHeight = height;
    }

    get x(): number {
        return this.Box.x + this.hitX;
    }
    set x(x: number) {
        this.Box.x = x - this.hitX;
    }

    get y(): number {
        return this.Box.y + this.hitY;
    }
    set y(y: number) {
        this.Box.y = y - this.hitY;
    }

    get width(): number {
        return this.hitWidth;
    }

    get height(): number {
        return this.hitHeight;
    }

    get dx(): number {
        return this.Box.dx;
    }
    set dx(dx: number) {
        this.Box.dx = dx;
    }

    get dy(): number {
        return this.Box.dy;
    }
    set dy(dy: number) {
        this.Box.dy = dy;
    }

    get direction(): number {
        return this.Box.direction;
    }
    set direction(direction: number) {
        this.Box.direction = direction;
    }
}
