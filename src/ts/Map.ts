import { Game } from "./Game";

import { SimpleBox } from "./Libraries/Boxes";
import { AudioLoader } from "./Libraries/Loaders";
import { Direction } from "./Libraries/Direction";
import { Random } from "./Libraries/Random";

import {
  Enemy,
  Octorok,
  BlueOctorok,
  Moblin,
  BlueMoblin,
  Tektite,
  BlueTektite
} from "./Enemies";
import { Brick } from "./Bricks";
import { HeartReceptacle, Item, Sword as SwordItem } from "./Items";

export class Cell extends SimpleBox {
  brick: Brick;

  constructor(x: number, y: number, size: number, brick: Brick) {
    super();

    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.brick = brick;
  }
}

export class Passage extends SimpleBox {
  Game: Game;
  Scene: Scene;

  targetWorldIndex: number;
  targetSceneC: number;
  targetSceneR: number;

  constructor(
    game: Game,
    scene: Scene,
    c: number,
    r: number,
    targetWorldIndex: number,
    targetSceneC: number,
    targetSceneR: number
  ) {
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

export class Scene {
  Game: Game;
  World: World;

  cells: Cell[][] = [];

  x: number;
  y: number;

  // Coordinates of the scene in the world
  c: number;
  r: number;

  nbRow: number;
  nbCol: number;
  cellSize: number;

  enemies: Enemy[];
  passages: Passage[];
  permanentItems: Item[];

  music: HTMLAudioElement;

  defaultBrick: Brick;
  defaultWallBrick: Brick;

  backgroundColor: string;

  constructor(
    game: Game,
    world: World,
    c: number,
    r: number,
    music: HTMLAudioElement,
    defaultBrick: Brick,
    backgroundColor: string
  ) {
    this.Game = game;
    this.World = world;

    this.nbRow = 11;
    this.nbCol = 16;
    this.cellSize = 64;

    this.enemies = [];
    this.passages = [];
    this.permanentItems = [];

    this.x = 0;
    this.y = 0;

    this.c = c;
    this.r = r;

    this.music = music;

    this.backgroundColor = backgroundColor;

    for (let c = 0; c < this.nbCol; c++) {
      this.cells[c] = [];
      for (let r = 0; r < this.nbRow; r++) {
        this.cells[c][r] = new Cell(
          this.cellSize * c,
          this.cellSize * r,
          this.cellSize,
          defaultBrick
        );
      }
    }
  }

  public get width(): number {
    return this.cellSize * this.nbCol;
  }

  public get height(): number {
    return this.cellSize * this.nbRow;
  }

  get hasEnemies(): boolean {
    return this.enemies.length > 0;
  }

  get hasPermanentItems(): boolean {
    return this.permanentItems.length > 0;
  }

  getCell(col: number, row: number): Cell {
    return this.cells[col][row];
  }

  loadBricks(bricks: any[][]): void {
    bricks.forEach((row, r) => {
      row.forEach((brickName, c) => {
        this.cells[c][r].brick = this.Game.BrickCollection.get(brickName);
      });
    });
  }

  drawImage({ sprite, x, y, width, height }: {
    sprite: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    this.Game.Viewport.drawImage({ sprite, x: x + this.x, y: y + this.y, width, height });
  }

  fillRect({ x, y, width, height, color }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }): void {
    this.Game.Viewport.fillRect({ x: x + this.x, y: y + this.y, width, height, color });
  }

  upperEdgeCollision(): void {
    this.Game.Viewport.slideScene(Direction.Up);
  }

  rightEdgeCollision(): void {
    this.Game.Viewport.slideScene(Direction.Right);
  }

  bottomEdgeCollision(): void {
    this.Game.Viewport.slideScene(Direction.Down);
  }

  leftEdgeCollision(): void {
    this.Game.Viewport.slideScene(Direction.Left);
  }
}

export class World {
  Game: Game;

  scenes: Scene[][] = [];

  nbCol: number;
  nbRow: number;

  constructor(
    game: Game,
    nbCol: number,
    nbRow: number,
    defaultMusic: HTMLAudioElement,
    defaultBrick: Brick,
    defaultBackgroundColor: string
  ) {
    this.Game = game;

    this.nbCol = nbCol;
    this.nbRow = nbRow;

    for (let c = 0; c < this.nbCol; c++) {
      this.scenes[c] = [];
      for (let r = 0; r < this.nbRow; r++) {
        this.scenes[c][r] = new Scene(
          this.Game,
          this,
          c,
          r,
          defaultMusic,
          defaultBrick,
          defaultBackgroundColor
        );
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

export class Map {
  Game: Game;

  worlds: World[];

  spawnWorldIndex: number;
  spawnSceneColl: number;
  spawnSceneRow: number;
  spawnCellColl: number;
  spawnCellRow: number;

  constructor(game: Game) {
    this.Game = game;

    this.spawnWorldIndex = 0;

    this.spawnSceneColl = 1;
    this.spawnSceneRow = 2;

    this.spawnCellColl = 7;
    this.spawnCellRow = 5.5;

    this.worlds = [];

    this.worlds[0] = new World(
      this.Game,
      3,
      3,
      AudioLoader.load("./sounds/music/overworld.mp3", true),
      this.Game.BrickCollection.get("default"),
      "#ffd4aa"
    );

    this.worlds[0].scenes[0][0].loadBricks([
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "default",
        "default",
        "default",
        "grave",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "white-wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "stairs",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "stairs",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ]
    ]);

    this.worlds[0].scenes[0][0].backgroundColor = "#747474";

    this.worlds[0].scenes[0][0].music = AudioLoader.load(
      "./sounds/music/death_mountain.mp3",
      true
    );

    this.worlds[0].scenes[0][0].enemies = [
      new BlueOctorok(
        this.Game,
        2 * 64,
        2 * 64,
        4,
        Random.getOneInt(2) ? Direction.Right : Direction.Down
      ),
      new BlueOctorok(
        this.Game,
        5 * 64,
        5 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new BlueOctorok(
        this.Game,
        13 * 64,
        3 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      )
    ];

    this.worlds[0].scenes[1][0].loadBricks([
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ]
    ]);

    this.worlds[0].scenes[1][0].backgroundColor = "#747474";

    this.worlds[0].scenes[1][0].music = AudioLoader.load(
      "./sounds/music/death_mountain.mp3",
      true
    );

    this.worlds[0].scenes[1][0].enemies = [
      new BlueMoblin(this.Game, 5 * 64, 8 * 64, 4, Direction.Up),
      new BlueMoblin(
        this.Game,
        8 * 64,
        4 * 64,
        4,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      ),
      new BlueMoblin(this.Game, 10 * 64, 2 * 64, 4, Direction.Down)
    ];

    this.worlds[0].scenes[2][0].loadBricks([
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "passage",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "white-wall-bl",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "monument-tl",
        "monument-tr",
        "default",
        "default",
        "white-tree",
        "default",
        "default",
        "monument-tl",
        "monument-tr",
        "default",
        "default",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "monument-bl",
        "monument-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "monument-bl",
        "monument-br",
        "default",
        "default",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "grave",
        "default",
        "grave",
        "default",
        "default",
        "default",
        "default",
        "default",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "white-wall",
        "white-wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "white-wall-tl",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall-t",
        "white-wall",
        "white-wall",
        "white-wall"
      ],
      [
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall",
        "white-wall"
      ]
    ]);

    this.worlds[0].scenes[2][0].backgroundColor = "#747474";

    this.worlds[0].scenes[2][0].music = AudioLoader.load(
      "./sounds/music/death_mountain.mp3",
      true
    );

    this.worlds[0].scenes[2][0].passages = [
      new Passage(this.Game, this.worlds[0].scenes[2][0], 7, 1, 2, 1, 1)
    ];

    this.worlds[0].scenes[2][0].enemies = [
      new BlueOctorok(this.Game, 5 * 64, 4 * 64, 4, Direction.Down),
      new BlueOctorok(this.Game, 9 * 64, 6 * 64, 4, Direction.Right),
      new BlueOctorok(this.Game, 12 * 64, 3 * 64, 4, Direction.Down),
      new BlueTektite(this.Game, 7 * 64, 7 * 64)
    ];

    this.worlds[0].scenes[0][1].loadBricks([
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "stairs",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "stairs",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall"
      ],
      [
        "wall",
        "default",
        "default",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall",
        "default",
        "default",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall",
        "default",
        "default",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "single-red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-tr",
        "default",
        "default",
        "wall-tl",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "default",
        "default",
        "wall",
        "wall",
        "wall"
      ]
    ]);
    this.worlds[0].scenes[0][1].enemies = [
      new Octorok(
        this.Game,
        6 * 64,
        4 * 64,
        3,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      ),
      new Octorok(
        this.Game,
        4 * 64,
        6 * 64,
        3,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      ),
      new Octorok(
        this.Game,
        7 * 64,
        2 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Octorok(this.Game, 13 * 64, 2 * 64, 3, Direction.Down)
    ];

    this.worlds[0].scenes[1][1].loadBricks([
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall"
      ],
      [
        "wall-br",
        "default",
        "default",
        "single-wall",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "wall-bl"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall-tr",
        "default",
        "default",
        "single-wall",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "wall-tl"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "default",
        "default",
        "wall",
        "wall",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "default",
        "default",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ]
    ]);
    this.worlds[0].scenes[1][1].enemies = [
      new Octorok(
        this.Game,
        4 * 64,
        5 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Octorok(
        this.Game,
        10 * 64,
        3 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Octorok(
        this.Game,
        13 * 64,
        7 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Octorok(
        this.Game,
        12 * 64,
        6 * 64,
        3,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      )
    ];

    this.worlds[0].scenes[2][1].loadBricks([
      [
        "wall",
        "wall",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "default",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "default",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ]
    ]);
    this.worlds[0].scenes[2][1].enemies = [
      new Octorok(
        this.Game,
        3 * 64,
        4 * 64,
        3,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      ),
      new Octorok(
        this.Game,
        5 * 64,
        6 * 64,
        3,
        Random.getOneInt(2) ? Direction.Right : Direction.Left
      ),
      new Octorok(
        this.Game,
        10 * 64,
        5 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Octorok(
        this.Game,
        14 * 64,
        2 * 64,
        3,
        Random.getOneInt(2) ? Direction.Left : Direction.Down
      )
    ];

    this.worlds[0].scenes[0][2].loadBricks([
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "default",
        "default",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall-br",
        "default",
        "default",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall",
        "wall"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall-t"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "single-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ]
    ]);
    this.worlds[0].scenes[0][2].enemies = [
      new Tektite(this.Game, 3 * 64, 4 * 64),
      new Tektite(this.Game, 5 * 64, 7 * 64),
      new Tektite(this.Game, 10 * 64, 5 * 64)
    ];

    // Spawn scene
    this.worlds[0].scenes[1][2].loadBricks([
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "default",
        "default",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "passage",
        "wall",
        "wall-br",
        "default",
        "default",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-bl",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default"
      ],
      [
        "wall-t",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall-t"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "wall-tl",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall-t",
        "wall",
        "wall",
        "wall"
      ],
      [
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall",
        "wall"
      ]
    ]);

    this.worlds[0].scenes[1][2].passages = [
      new Passage(this.Game, this.worlds[0].scenes[1][2], 3, 1, 1, 0, 0)
    ];

    this.worlds[0].scenes[2][2].loadBricks([
      [
        "wall",
        "wall",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall-br",
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall-br",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall-t",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree",
        "default",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall-tr",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree"
      ],
      [
        "wall",
        "wall",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree",
        "tree"
      ]
    ]);
    this.worlds[0].scenes[2][2].enemies = [
      new Moblin(
        this.Game,
        3 * 64,
        5 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Moblin(
        this.Game,
        5 * 64,
        7 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Moblin(
        this.Game,
        10 * 64,
        5 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new Moblin(
        this.Game,
        12 * 64,
        7 * 64,
        3,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      )
    ];

    this.worlds[1] = new World(
      this.Game,
      1,
      1,
      AudioLoader.load("./sounds/music/death_mountain.mp3", true),
      this.Game.BrickCollection.get("default"),
      "#0f0e0b"
    );

    this.worlds[1].scenes[0][0].loadBricks([
      [
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "fire",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "fire",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "red-wall"
      ],
      [
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "default",
        "default",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall",
        "red-wall"
      ]
    ]);

    this.worlds[1].scenes[0][0].permanentItems = [
      new SwordItem(this.Game, 8 * 64 - 14, 5 * 64)
    ];

    this.worlds[1].scenes[0][0].bottomEdgeCollision = function () {
      this.Game.Viewport.changeWorld(false, 0, 1, 2, 3, 1);
    };

    this.worlds[2] = new World(
      this.Game,
      2,
      2,
      AudioLoader.load("./sounds/music/dungeon.mp3", true),
      this.Game.BrickCollection.get("default-dungeon"),
      "#078382"
    );

    this.worlds[2].scenes[0][0].loadBricks([
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ]
    ]);

    this.worlds[2].scenes[0][0].enemies = [
      new BlueOctorok(
        this.Game,
        2 * 64,
        2 * 64,
        4,
        Random.getOneInt(2) ? Direction.Right : Direction.Down
      ),
      new BlueOctorok(
        this.Game,
        5 * 64,
        5 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new BlueOctorok(
        this.Game,
        13 * 64,
        3 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new BlueOctorok(
        this.Game,
        8 * 64,
        6 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      )
    ];

    this.worlds[2].scenes[1][0].loadBricks([
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ]
    ]);

    this.worlds[2].scenes[1][0].permanentItems = [
      new HeartReceptacle(this.Game, 8 * 64 - 13, 5 * 64)
    ];

    this.worlds[2].scenes[0][1].loadBricks([
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ]
    ]);

    this.worlds[2].scenes[0][1].enemies = [
      new BlueTektite(this.Game, 2 * 64, 2 * 64),
      new BlueTektite(this.Game, 5 * 64, 5 * 64),
      new BlueTektite(this.Game, 13 * 64, 3 * 64),
      new BlueTektite(this.Game, 8 * 64, 6 * 64)
    ];

    this.worlds[2].scenes[1][1].loadBricks([
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon"
      ],
      [
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "default-dungeon",
        "default-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon",
        "wall-dungeon"
      ]
    ]);

    this.worlds[2].scenes[1][1].bottomEdgeCollision = function () {
      this.Game.Viewport.changeWorld(false, 0, 2, 0, 7, 1);
    };

    this.worlds[2].scenes[1][1].enemies = [
      new BlueMoblin(
        this.Game,
        2 * 64,
        2 * 64,
        4,
        Random.getOneInt(2) ? Direction.Right : Direction.Down
      ),
      new BlueMoblin(
        this.Game,
        5 * 64,
        5 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      ),
      new BlueMoblin(
        this.Game,
        13 * 64,
        3 * 64,
        4,
        Random.getOneInt(2) ? Direction.Up : Direction.Down
      )
    ];
  }

  getSpawnWorld(): World {
    return this.worlds[this.spawnWorldIndex];
  }

  getSpawnScene(): Scene {
    return this.worlds[this.spawnWorldIndex].scenes[this.spawnSceneColl][
      this.spawnSceneRow
    ];
  }

  loopWorlds(callback: Function): void {
    this.worlds.forEach((world) => {
      callback(world);
    });
  }
}
