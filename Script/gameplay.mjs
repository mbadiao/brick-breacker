import { initMap, createTwoDiv, removeOldBricks } from "./buildMap.mjs";
import { allBrickMap1, startHtml, heartHtml } from "./templates.mjs";
import { playSound, addHeart, initHeart, removeHeart} from "./utils.mjs";
import { gameLoop } from "./core.mjs";

export function play(life) {
  let brick = document.getElementById("brickImgContainer");
  let logo00 = document.getElementById("bricksansball");
  let betterexp = document.getElementById("betterexp");
  let leftto = document.getElementById("leftright");
  let logo01 = document.getElementById("gameHead");
  let press = document.getElementById("test");
  if (logo00 && press && leftto && betterexp && logo01 && brick) {
    const elementsToRemove = [logo00, press, leftto, betterexp, brick];
    elementsToRemove.forEach((element) => {
      element.classList.add("disparition");
      element.remove();
    });
    initHeart();
    startGame(life);
  }
}

export function init() {
  removeOldBricks();
  initMap(allBrickMap1);
}

export function resetGameState(life) {
  let gameBody = document.getElementById("gameBody");
  let second = document.getElementById("secondDiv");
  document.getElementById("ball").remove();
  setTimeout(() => {
    removeHeart(life);
    gameLoop(gameBody, second, life);
  }, 500);
}

export function startGame(life) {
  let gameBody = document.getElementById("gameBody");
  var second = document.getElementById("secondDiv");
  setTimeout(() => {
    let coeur = document.getElementById("hearts")
    if (!coeur){
      addHeart();
    }
    gameBody.classList.add("gamebody");
    init(second, life);
    gameLoop(gameBody, second, life);
  }, 490);
}

