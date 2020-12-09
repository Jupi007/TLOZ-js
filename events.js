var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var speedUpPressed = false;
var attackPressed = false;

document.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = true;
            break;
        case 37:
            leftPressed = true;
            break;
        case 38:
            upPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
        case 83:
            speedUpPressed = true;
            break;
        case 81:
            attackPressed = true;
            break;
    }
    e.preventDefault();
}, false);

document.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
        case 39:
            rightPressed = false;
            break;
        case 37:
            leftPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        case 83:
            speedUpPressed = false;
            break;
        case 81:
            attackPressed = false;
            break;
    }
    e.preventDefault();
}, false);
