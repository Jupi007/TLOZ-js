import { Game } from "./ts/Game";

let button = document.getElementById("startButton");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;

button.addEventListener("click", () => {
  let game = new Game(canvas);
  game.run();
  button.remove();
});
