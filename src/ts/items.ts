class Item extends SimpleBox {
    sprite: HTMLImageElement;
    collisionCallback: Function;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        sprite: HTMLImageElement,
        collisionCallback: Function
    ) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.collisionCallback = collisionCallback;
    }
}

class Items {
    Game: Game;

    items: Item[];

    constructor(game: Game) {
        this.Game = game;

        this.items = [];
    }

    collisions(): void {
        this.loopItems((item) => {
            if (movingBoxsCollision(this.Game.Player, item)) {
                item.collisionCallback();
                this.deleteItem(item);
            }
        });
    }

    draw(): void {
        this.loopItems((item) => {
            this.Game.Viewport.currentScene.drawImage(
                item.sprite,
                item.x,
                item.y,
                item.width,
                item.height
            );
        });
    }

    addItem(item: Item): void {
        this.items.push(item);
    }

    deleteItem(item: Item): void {
        this.items.splice(this.items.indexOf(item), 1);
    }

    deleteAllItems(): void {
        this.items = [];
    }

    loopItems(callback: Function): void {
        this.items.forEach((item: Item) => {
            callback(item);
        });
    }
}