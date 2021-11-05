import { Direction } from "./Direction";
import { MathPlus } from "./MathPlus";

export interface Canvas {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SimpleBox {
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
    return this._x;
  }
  public set x(x: number) {
    this._x = MathPlus.round(x, 7);
  }

  public get y(): number {
    return this._y;
  }
  public set y(y: number) {
    this._y = MathPlus.round(y, 7);
  }
}

export class MovingBox extends SimpleBox {
  private _dx = 0;
  private _dy = 0;
  private _direction: Direction;
  private _hitBox: MovingBox | MovingBoxHitBox;

  constructor() {
    super();

    this.hitBox = this;
  }

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

  public get hitBox(): MovingBox | MovingBoxHitBox {
    return this._hitBox;
  }
  public set hitBox(value: MovingBox | MovingBoxHitBox) {
    this._hitBox = value;
  }
}

export class MovingBoxHitBox {
  private _Box: MovingBox | MovingBoxHitBox;

  private _hitX: number;
  private _hitY: number;
  private _hitWidth: number;
  private _hitHeight: number;

  constructor({ box, x, y, width, height }: {
    box: MovingBox | MovingBoxHitBox;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
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

export class MovingBoxHalfHitBoxes {
  box: MovingBox | MovingBoxHitBox;

  halfLeftHitBox: MovingBoxHitBox;
  halfRightHitBox: MovingBoxHitBox;
  halfUpHitBox: MovingBoxHitBox;
  halfDownHitBox: MovingBoxHitBox;

  constructor(box: MovingBox | MovingBoxHitBox) {
    this.box = box;

    this.halfLeftHitBox = new MovingBoxHitBox(
      { box: this.box, x: 0, y: 0, width: this.box.width / 2, height: this.box.height });

    this.halfRightHitBox = new MovingBoxHitBox(
      { box: this.box, x: this.box.width / 2, y: 0, width: this.box.width / 2, height: this.box.height });

    this.halfUpHitBox = new MovingBoxHitBox(
      { box: this.box, x: 0, y: 0, width: this.box.width, height: this.box.height / 2 });

    this.halfDownHitBox = new MovingBoxHitBox(
      { box: this.box, x: 0, y: this.box.height / 2, width: this.box.width, height: this.box.height / 2 });
  }
}
