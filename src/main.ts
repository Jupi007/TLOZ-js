import { Game } from "./ts/Game";

let button = document.getElementById("startButton");
let help = document.getElementById("help");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;

button.addEventListener("click", () => {
  help.style.display = "block";
  canvas.style.display = "block";

  let game = new Game(canvas);
  game.run();

  button.remove();
});
