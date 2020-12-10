class Brick {
    constructor(src, collisions = false) {
        this.img = new Image();
        this.img.src = src;
        this.collisions = collisions;
    }
}

$default = new Brick("./sprites/png/default.png");

$wall = new Brick("./sprites/png/wall.png");
$wall.collisions = true;

class Bricks {
    constructor() {
        this.bricks = {
            "default": $default,
            "wall": $wall,
        };
    }

    get(brick) {
        return this.bricks[brick];
    }
}
