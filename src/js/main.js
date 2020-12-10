class Landscape {
    constructor(Game, Scene) {
        this.Game = Game;

        this.Scene = Scene;

        this.nbRow = Scene.nbRow;
        this.nbColl = Scene.nbColl;
        this.cellSize = Scene.cellSize;
    }

    draw() {
        this.loopCells((c, r) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this.Game.Bricks.get(this.Scene.cells[c][r].brick).img, this.cellSize * c, this.cellSize * r, this.cellSize, this.cellSize);
            this.Game.ctx.closePath();
        });
    }

    collisions() {
        this.loopCells((c, r) => {
            if (this.Game.Bricks.bricks[this.Scene.cells[c][r].brick].collisions) {
                movingBoxCollision(this.Game.Player, this.Scene.cells[c][r]);

                this.Game.Enemies.enemies.forEach((enemy) => {
                    if (movingBoxCollision(enemy, this.Scene.cells[c][r])) {
                        if (enemy.dirY == "Up") {
                            enemy.dirY = "Down";
                        } else {
                            enemy.dirY = "Up";
                        }
                    }
                });
            }
        });
    }

    loopCells(callback) {
        for (let c = 0; c < this.nbColl; c++) {
            for (let r = 0; r < this.nbRow; r++) {
                callback(c, r);
            }
        }
    }
}

class Player {
    constructor(Game) {
        this.Game = Game;

        this.x = this.Game.Landscape.cellSize;
        this.y = this.Game.Landscape.cellSize;
        this.dx = 0;
        this.dy = 0;

        this.direction = "Down";

        this.frame = 0;
        this.animationSpeed = 20;

        this.animationStep = 1;
        this.nbAnimationStep = 2;

        this.width = 40;
        this.height = 40;

        this.speed = 2;
        this.speedUp = 3;

        this.hp = 100;
        this.invincible = false;
        this.invincibleTime = 0;

        this.score = 0;

        this.imgUp = [];
        this.imgUp[1] = new Image();
        this.imgUp[1].src = "./sprites/png/link-up1.png";
        this.imgUp[2] = new Image();
        this.imgUp[2].src = "./sprites/png/link-up2.png";

        this.imgRight = [];
        this.imgRight[1] = new Image();
        this.imgRight[1].src = "./sprites/png/link-right1.png";
        this.imgRight[2] = new Image();
        this.imgRight[2].src = "./sprites/png/link-right2.png";

        this.imgDown = [];
        this.imgDown[1] = new Image();
        this.imgDown[1].src = "./sprites/png/link-down1.png";
        this.imgDown[2] = new Image();
        this.imgDown[2].src = "./sprites/png/link-down2.png";

        this.imgLeft = [];
        this.imgLeft[1] = new Image();
        this.imgLeft[1].src = "./sprites/png/link-left1.png";
        this.imgLeft[2] = new Image();
        this.imgLeft[2].src = "./sprites/png/link-left2.png";
    }

    draw() {
        if (leftPressed || rightPressed || upPressed || downPressed) {
            this.frame += speedUpPressed ? 2 : 1;
        }

        if (this.frame >= this.animationSpeed) {
            this.frame = 0;
            this.animationStep = (this.animationStep+1 > this.nbAnimationStep) ? 1 : this.animationStep+1;
        }

        this.Game.ctx.beginPath();
        this.Game.ctx.drawImage(this["img" + this.direction][this.animationStep], this.x, this.y, this.width, this.height);
        this.Game.ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        this.dx = 0;
        this.dy = 0;
    }

    collisions() {
        if (movingBoxCanvasCollision(this, this.Game.Canvas)) {
            this.Game.changeScene();
        }
    }

    preMove() {
        let speed = speedUpPressed ? this.speedUp : this.speed;

        if (!(rightPressed && leftPressed)) {
            if (rightPressed) {
                this.dx = speed;
            } else if (leftPressed) {
                this.dx = -speed;
            }
        }

        if (!(downPressed && upPressed)) {
            if (downPressed) {
                this.dy = speed;
            } else if (upPressed) {
                this.dy = -speed;
            }
        }

        if (upPressed) {
            this.direction = "Up";
        } else if (downPressed) {
            this.direction = "Down";
        }else if (leftPressed) {
            this.direction = "Left";
        } else if (rightPressed) {
            this.direction = "Right";
        }
    }

    takeDamage(damage) {
        if (!this.invincible) {
            if (this.hp - damage >= 0) {
                this.hp -= damage;
            } else {
                this.hp = 0;
            }

            this.setInvicibility();
        }

        if (this.hp <= 0) {
            alert("Game Over !");
            document.location.reload();
        }
    }

    setInvicibility() {
        this.invincible = true;
        this.invincibleTime = performance.now()
    }

    checkInvicibility() {
        if (this.invincible && this.invincibleTime + 1000 < performance.now()) {
            this.invincible = false;
        }
    }
}

class Sword {
    constructor(Game) {
        this.Game = Game;

        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.swordWidth = 32;
        this.swordHeight = 14;

        this.imgUp = new Image();
        this.imgUp.src = "./sprites/png/sword-up.png";

        this.imgRight = new Image();
        this.imgRight.src = "./sprites/png/sword-right.png";

        this.imgDown = new Image();
        this.imgDown.src = "./sprites/png/sword-down.png";

        this.imgLeft = new Image();
        this.imgLeft.src = "./sprites/png/sword-left.png";
    }

    draw() {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            this.Game.ctx.beginPath();
            if (upPressed) {
                this.Game.ctx.drawImage(this.imgUp, this.x, this.y, this.width, this.height);
            } else if (downPressed) {
                this.Game.ctx.drawImage(this.imgDown, this.x, this.y, this.width, this.height);
            } else if (leftPressed) {
                this.Game.ctx.drawImage(this.imgLeft, this.x, this.y, this.width, this.height);
            } else if (rightPressed) {
                this.Game.ctx.drawImage(this.imgRight, this.x, this.y, this.width, this.height);
            }
            this.Game.ctx.closePath();
        }
    }

    collisions() {
        if (attackPressed) {
            this.Game.Enemies.enemies.forEach((enemy, i) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.enemies.splice(i, 1);
                    if (this.Game.Enemies.enemies.length <= 0) {
                        this.Game.Player.score++;
                        this.Game.Landscape.Scene.enemies = false;

                        if (this.Game.Overworld.nbRow * this.Game.Overworld.nbColl <= this.Game.Player.score) {
                            alert("You win !");
                            document.location.reload();
                        }
                    }
                }
            });
        }
    }

    events() {
        if (attackPressed && (leftPressed || rightPressed || upPressed || downPressed)) {
            if (upPressed) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y - this.swordWidth;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (downPressed) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y + this.Game.Player.width;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (leftPressed) {
                this.x = this.Game.Player.x - this.swordWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            } else if (rightPressed) {
                this.x = this.Game.Player.x + this.Game.Player.width;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }
        }
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }
}

class Enemies {
    constructor(Game) {
        this.Game = Game;

        this.img = new Image();
        this.img.src = "./sprites/png/goomba.png";

        this.speed = 2;

        this.nbEnemies = 3;
        this.enemies = [];

        if (this.Game.Landscape.Scene.enemies) {


            for (var i = 0; i < this.nbEnemies; i++) {
                this.enemies[i] = {
                    x: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Canvas.width - (this.Game.Landscape.cellSize + 60)),
                    y: getRandomIntInclusive(this.Game.Landscape.cellSize + 60, this.Game.Canvas.height - (this.Game.Landscape.cellSize + 60)),
                    dx: 0,
                    dy: 0,
                    speed: getRandomIntInclusive(1, 3),
                    dirY: getRandomIntInclusive(0, 1) ? "Up" : "Down",
                    width: 40,
                    height: 40,
                };
            }
        }
    }

    draw() {
        this.enemies.forEach((enemy) => {
            this.Game.ctx.beginPath();
            this.Game.ctx.drawImage(this.img, enemy.x, enemy.y, enemy.width, enemy.height);
            this.Game.ctx.closePath();
        });
    }

    collisions() {
        this.enemies.forEach((enemy) => {
            if (movingBoxsCollision(this.Game.Player, enemy) && !this.Game.Player.invincible) {
                this.Game.Player.takeDamage(20);

                if (!(rightPressed && leftPressed)) {
                    if (rightPressed) {
                        this.Game.Player.dx = -this.Game.Landscape.cellSize;
                        //enemy.dx = this.Game.Landscape.cellSize;
                    } else if (leftPressed) {
                        this.Game.Player.dx = this.Game.Landscape.cellSize;
                        //enemy.dx = -this.Game.Landscape.cellSize;
                    }

                    if (!(downPressed && upPressed)) {}
                    if (downPressed) {
                        this.Game.Player.dy = -this.Game.Landscape.cellSize;
                        enemy.dy = this.Game.Landscape.cellSize;
                    } else if (upPressed) {
                        this.Game.Player.dy = this.Game.Landscape.cellSize;
                        enemy.dy = -this.Game.Landscape.cellSize;
                    }
                }

                if (!(rightPressed || leftPressed || downPressed || upPressed)) {
                    if (enemy.dirY == "Down") {
                        this.Game.Player.dy = this.Game.Landscape.cellSize;
                        enemy.dy = -this.Game.Landscape.cellSize;
                    } else {
                        this.Game.Player.dy = -this.Game.Landscape.cellSize;
                        enemy.dy = this.Game.Landscape.cellSize;
                    }
                }
            }


            if (movingBoxCanvasCollision(enemy, this.Game.Canvas)) {
                if (enemy.dirY == "Up") {
                    enemy.dirY = "Down";
                } else {
                    enemy.dirY = "Up";
                }
            }
        });
    }

    preMove() {
        this.enemies.forEach((enemy) => {
            enemy.dx = 0;

            if (enemy.dirY == "Down") {
                enemy.dy = enemy.speed;
            } else {
                enemy.dy = -enemy.speed;
            }
        });
    }

    move() {
        this.enemies.forEach((enemy) => {
            enemy.y += enemy.dy;
            enemy.x += enemy.dx;
        });
    }
}

class Game {
    constructor(Canvas) {
        this.Canvas = Canvas;
        this.ctx = this.Canvas.getContext("2d");

        this.Overworld = new Overworld(this);
        this.Bricks = new Bricks(this);
        this.Landscape = new Landscape(this, this.Overworld.getSpawnScene());
        this.Player = new Player(this);
        this.Sword = new Sword(this);
        this.Enemies = new Enemies(this);
    }

    init() {
        this.Canvas.width = this.Landscape.nbColl * this.Landscape.cellSize;
        this.Canvas.height = this.Landscape.nbRow * this.Landscape.cellSize;
    }

    changeScene() {
        let c = this.Landscape.Scene.c;
        let r = this.Landscape.Scene.r;


        this.Overworld.map[c][r] = this.Landscape.Scene;

        let dc = 0;
        let dr = 0;

        if (leftPressed && !rightPressed && !upPressed && !downPressed) {
            dc = -1;
        } else if (!leftPressed && rightPressed && !upPressed && !downPressed) {
            dc = 1;
        } else if (!leftPressed && !rightPressed && upPressed && !downPressed) {
            dr = -1;
        } else if (!leftPressed && !rightPressed && !upPressed && downPressed) {
            dr = 1;
        } else {
            this.Player.dx = 0;
            this.Player.dy = 0;
            return;
        }

        if (!(c + dc < 0 || c + dc > this.Overworld.nbColl - 1 || r + dr < 0 || r + dr > this.Overworld.nbRow - 1)) {
            this.Landscape = new Landscape(this, this.Overworld.map[c + dc][r + dr]);
            this.Enemies = new Enemies(this);

            if (leftPressed) {
                this.Player.x = this.Canvas.width - this.Player.width;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            } else if (rightPressed) {
                this.Player.x = 0;
                this.Player.y = (this.Canvas.height - this.Player.height) / 2;
            } else if (upPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = this.Canvas.height - this.Player.height;
            } else if (downPressed) {
                this.Player.x = (this.Canvas.width - this.Player.width) / 2;
                this.Player.y = 0;
            }

            this.Player.dx = 0;
            this.Player.dy = 0;
        }
    }

    drawHud() {
        this.ctx.font = "16px Ubuntu";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText("HP: " + this.Player.hp + " Score: " + this.Player.score + "/" + (this.Overworld.nbRow * this.Overworld.nbColl), 8, 20);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        this.Player.checkInvicibility();

        this.Sword.events();

        this.Landscape.draw();
        this.Enemies.draw();
        this.Player.draw();
        this.Sword.draw();
        this.drawHud();

        this.Player.preMove();
        this.Enemies.preMove();

        this.Player.collisions();
        this.Sword.collisions();
        this.Enemies.collisions();
        this.Landscape.collisions();

        this.Player.move();
        this.Enemies.move();

        this.Sword.reset();
    }
}
