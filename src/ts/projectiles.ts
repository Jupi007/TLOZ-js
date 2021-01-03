class Projectile extends MovingBox {
    speed: number;
    sprite: HTMLImageElement;
    hasPlayerCollision: boolean;
    canBeShieldBlocked: boolean;
    playerCollisionCallback: Function;
    hasEnemiesCollision: boolean;
    enemiesCollisionCallback: Function;
    deleteCallback: Function;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        speed: number,
        direction: Direction,
        sprite: HTMLImageElement,
        hasPlayerCollision: boolean,
        canBeShieldBlocked: boolean,
        playerCollisionCallback: Function,
        hasEnemiesCollision: boolean,
        enemiesCollisionCallback: Function,
        deleteCallback: Function
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
        this.canBeShieldBlocked = canBeShieldBlocked;
        this.playerCollisionCallback = playerCollisionCallback;

        this.hasEnemiesCollision = hasEnemiesCollision;
        this.enemiesCollisionCallback = enemiesCollisionCallback;

        this.deleteCallback = deleteCallback;

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

    shieldSound: HTMLAudioElement;

    constructor(game: Game) {
        this.Game = game;

        this.projectiles = [];

        this.shieldSound = AudioLoader.load("./sounds/effect/Shield.wav");
    }

    collisions(): void {
        this.loopProjectiles((projectile) => {
            if (projectile.hasEnemiesCollision) {
                this.Game.Enemies.loopEnemies((enemy) => {
                    if (movingBoxsCollision(enemy, projectile)) {
                        if (projectile.enemiesCollisionCallback !== null) projectile.enemiesCollisionCallback(enemy);
                        this.deleteProjectile(projectile);
                    }
                });
            }

            if (projectile.hasPlayerCollision) {
                if (movingBoxsCollision(this.Game.Player.hitBox, projectile)) {
                    if (
                        projectile.canBeShieldBlocked &&
                        this.Game.Player.isMovingObserver.is(false) &&
                        areOppositeDirections(this.Game.Player.direction, projectile.direction)
                    ) {
                        this.shieldSound.play();
                        this.deleteProjectile(projectile);
                        return;
                    }

                    if (projectile.playerCollisionCallback !== null) projectile.playerCollisionCallback(this.Game.Player);
                    this.deleteProjectile(projectile);
                }
            }

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
        if (projectile.deleteCallback !== null) projectile.deleteCallback();
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
    }

    deleteAllProjectiles(): void {
        this.loopProjectiles((projectile) => {
            projectile.deleteCallback();
        });

        this.projectiles = [];
    }

    loopProjectiles(callback: Function): void {
        this.projectiles.forEach((projectile: Projectile) => {
            callback(projectile);
        });
    }
}
