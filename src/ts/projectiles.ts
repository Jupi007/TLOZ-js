class Projectile extends MovingBox {
    speed: number;
    sprite: HTMLImageElement;
    hasPlayerCollision: boolean;
    hasEnemiesCollision: boolean;
    collisionCallback: Function;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        speed: number,
        direction: Direction,
        sprite: HTMLImageElement,
        hasPlayerCollision: boolean,
        hasEnemiesCollision: boolean,
        collisionCallback: Function
    ) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.sprite = sprite;
        this.hasPlayerCollision = hasPlayerCollision;
        this.hasEnemiesCollision = hasEnemiesCollision;
        this.collisionCallback = collisionCallback;

        switch (this.direction) {
            case Direction.Up:
                this.dy = -this.speed;
                break;
            case Direction.Right:
                this.dx = this.speed;
                break;
            case Direction.Down:
                this.dy = this.speed;
                break;
            case Direction.Left:
                this.dx = -this.speed;
                break;
        }
    }
}

class Projectiles {
    Game: Game;

    projectiles: Projectile[];

    constructor(game: Game) {
        this.Game = game;

        this.projectiles = [];
    }

    collisions(): void {
        this.loopProjectiles((projectile) => {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (movingBoxsCollision(enemy, projectile)) {
                    this.Game.Enemies.killEnemy(enemy);
                    this.deleteProjectile(projectile);
                }
            });
        });

        this.loopProjectiles((projectile) => {
            if (movingBoxCanvasCollision(projectile, this.Game.Viewport)) {
                this.deleteProjectile(projectile);
            }
        });
    }

    move(): void {
        this.loopProjectiles((projectile) => {
            projectile.x += projectile.dx;
            projectile.y += projectile.dy;
        });
    }

    draw(): void {
        this.loopProjectiles((projectile) => {
            this.Game.Viewport.currentScene.drawImage(
                projectile.sprite,
                projectile.x,
                projectile.y,
                projectile.width,
                projectile.height
            );
        });
    }

    addProjectile(projectile: Projectile): void {
        this.projectiles.push(projectile);
    }

    deleteProjectile(projectile: Projectile): void {
        projectile.collisionCallback();
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
    }

    deleteAllProjectiles(): void {
        this.loopProjectiles((projectile) => {
            projectile.collisionCallback();
        });

        this.projectiles = [];
    }

    loopProjectiles(callback: Function): void {
        this.projectiles.forEach((projectile: Projectile) => {
            callback(projectile);
        });
    }
}
