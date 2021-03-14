import { Direction } from "./Direction.js";

export interface Canvas {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class SimpleBox {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
    }
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }

    public get x(): number {
        return this._x
    }
    public set x(x: number) {
        this._x = Math.round(x)
    }

    public get y(): number {
        return this._y
    }
    public set y(y: number) {
        this._y = Math.round(y);
    }
}

export abstract class MovingBox extends SimpleBox {
    private _dx = 0;
    private _dy = 0;
    private _direction: Direction;

    public get dx() {
        return this._dx;
    }
    public set dx(value) {
        this._dx = value;
    }

    public get dy() {
        return this._dy;
    }
    public set dy(value) {
        this._dy = value;
    }
    
    public get direction(): Direction {
        return this._direction;
    }
    public set direction(value: Direction) {
        this._direction = value;
    }
}

export class MovingBoxHitBox {
    private _Box: MovingBox;

    private _hitX: number;
    private _hitY: number;
    private _hitWidth: number;
    private _hitHeight: number;

    constructor(box: MovingBox, x: number, y: number, width: number, height: number) {
        this._Box = box;
        this._hitX = x;
        this._hitY = y;
        this._hitWidth = width;
        this._hitHeight = height;
    }

    public get x(): number {
        return this._Box.x + this._hitX;
    }
    public set x(x: number) {
        this._Box.x = x - this._hitX;
    }

    public get y(): number {
        return this._Box.y + this._hitY;
    }
    public set y(y: number) {
        this._Box.y = y - this._hitY;
    }

    public get width(): number {
        return this._hitWidth;
    }

    public get height(): number {
        return this._hitHeight;
    }

    public get dx(): number {
        return this._Box.dx;
    }
    public set dx(dx: number) {
        this._Box.dx = dx;
    }

    public get dy(): number {
        return this._Box.dy;
    }
    public set dy(dy: number) {
        this._Box.dy = dy;
    }

    public get direction(): number {
        return this._Box.direction;
    }
    public set direction(direction: number) {
        this._Box.direction = direction;
    }
}
