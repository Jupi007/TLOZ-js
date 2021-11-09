import { Game } from "./ts/Game";

let button = document.getElementById("startButton") as HTMLButtonElement;
let help = document.getElementById("help") as HTMLElement;
let canvas = document.getElementById("canvas") as HTMLCanvasElement;

window.addEventListener("load", () => {
  button.disabled = false;

  button.addEventListener("click", () => {
    help.style.display = "block";
    canvas.style.display = "block";
  
    let game = new Game(canvas);
    game.run();
  
    button.remove();
  });
});
