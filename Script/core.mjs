import { init, resetGameState, startGame } from "./gameplay.mjs";
import {
  pauseHTML,
  gameoverHTML,
  skeletonHTML,
  winHTML,
} from "./templates.mjs";
import { collisionBallBrick } from "./collision.mjs";
import { playSound, removeHeart, addHeart, initHeart } from "./utils.mjs";
import { createTwoDiv } from "./buildMap.mjs";

var posX = 0;
var player = document.createElement("div");
const fail = "/sounds/failure.wav",
  pop = "/sounds/pop.wav",
  success = "/sounds/success.wav",
  laugh = "/sounds/laugh.wav";

var isPaused = false;
var isGameOver = false;
let timer = 0, timerInterval = null, timerControl;

function build(gameBody, secondDiv) {
  posX = gameBody.offsetHeight / 2 + 150;
  console.log(gameBody.offsetHeight / 2 + player.offsetWidth + 10);
  player.classList.add("divAMover");
  secondDiv.appendChild(player);

  var vitesseDeplacement = 10;
  var toucheGauchePressee = false;
  var toucheDroitePressee = false;

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      toucheGauchePressee = true;
    } else if (event.key === "ArrowRight") {
      toucheDroitePressee = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
      toucheGauchePressee = false;
    } else if (event.key === "ArrowRight") {
      toucheDroitePressee = false;
    }
  });

  function mettreAJourPosition() {
    if (toucheGauchePressee) {
      posX = Math.max(posX - vitesseDeplacement, 0);
    }
    if (toucheDroitePressee) {
      posX = Math.min(
        posX + vitesseDeplacement,
        gameBody.clientWidth - player.offsetWidth
      );
    }
  }

  return {
    deplacerDiv: function () {
      posX = Math.min(
        Math.max(posX, 0),
        gameBody.clientWidth - player.offsetWidth
      );
      player.style.transform = `translateX(${posX}px)`;
    },
    mettreAJourPosition: mettreAJourPosition,
  };
}

function ball(gameBody, life) {
  const b = {
    x: gameBody.offsetWidth / 2,
    y: 250,
    w: 20,
    h: 20,
    dx: 0,
    dy: 1,
    speed: 7,
  };
  const ball = document.createElement("div");
  gameBody.append(ball);
  ball.id = "ball";
  ball.style.backgroundColor = "red";
  ball.style.borderRadius = "50%";
  ball.style.width = `${b.w}px`;
  ball.style.height = `${b.h}px`;
  ball.style.left = `${b.x}px`;
  ball.style.marginTop = `-${
    gameBody.offsetHeight + 0.04 * gameBody.offsetHeight
  }px`;

  function mover() {
    if (b.x > gameBody.offsetWidth - b.w || b.x < 0) {
      b.dx *= -1;
    }
    if (b.y < b.h) {
      b.dy *= -1;
    }
    if (b.y > gameBody.offsetHeight) {
      b.dy *= -1;
      retry(life);
      posX = gameBody.offsetHeight / 2 + 150;
      return;
    }

    const [brickCollision, brickId, collisionDirection] = collisionBallBrick(
      b.x,
      b.y
    );
    if (collisionDirection == "top" || collisionDirection == "bottom") {
      b.dy *= -1;
      checkWin();
    } else if (collisionDirection == "left" || collisionDirection == "right") {
      b.dx *= -1;
      checkWin();
    }
    var divRect = player.getBoundingClientRect();
    var ballRect = ball.getBoundingClientRect();

    if (
      ballRect.top < divRect.bottom &&
      ballRect.bottom > divRect.top &&
      ballRect.left < divRect.right &&
      ballRect.right > divRect.left
    ) {
      var intersectX = Math.min(Math.max(b.x + b.w / 2, posX), posX + 150);
      var relativeIntersectX = intersectX - (posX + 150 / 2);
      var normalizedRelativeIntersectionX = relativeIntersectX / (150 / 2);
      var bounceAngle = (normalizedRelativeIntersectionX * Math.PI) / 3;
      b.dx = Math.sin(bounceAngle);
      b.dy = -Math.cos(bounceAngle);
      // playSound(pop);
    }

    b.x += b.dx * b.speed;
    b.y += b.dy * b.speed;
    ball.style.transform = `translate(${b.x}px,${b.y}px)`;
  }

  return mover;
}

function checkWin() {
  let NbrOfBricks = Array.from(
    document.getElementsByClassName("setBrick")
  ).length;
  if (NbrOfBricks == 0) {
    let time = getfinalTime();
    playSound(success);
    document.body.innerHTML = winHTML;
    document.getElementById("yourtime").innerHTML = "Your " + time;
    document.getElementById("yourscore").innerHTML =
      "Your Score: 480";

    gameEnd();
  }
}

export function gameLoop(gameBody, secondDiv, life) {
  timerControl = startTimer();
  timerControl.resume();
  timerControl = startTimer();

  console.log("ISGAMEOVER", isGameOver);
  var player = build(gameBody, secondDiv);
  var moverBall = ball(gameBody, life);
  var requestId;
  function pauseGame() {
    isPaused = true;
    cancelAnimationFrame(requestId);
  }

  function resumeGame() {
    if (!isGameOver) {
      isPaused = false;
      requestId = requestAnimationFrame(animationLoop);
    }
  }

  function animationLoop() {
    if (!isPaused && !isGameOver) {
      player.mettreAJourPosition();
      player.deplacerDiv();
      moverBall();
    }
    if (isGameOver) {
      console.log("gameover GAMELOOP");
      gameOver();
      return;
    }
    requestId = requestAnimationFrame(animationLoop);
  }

  animationLoop();

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "r":
        if (isPaused) {
          timerControl.reset();
          hidePauseMenu();
          restartGame();
        }
        break;
      case "p":
        if (!isPaused && !isGameOver) {
          timerControl.pause();
          showPauseMenu();
        }
        break;
      case "c":
        timerControl.resume();
        hidePauseMenu();
        break;
      case "q":
        location.reload();
        break;
      default:
        break;
    }
  });

  document.getElementById("pause").addEventListener("click", showPauseMenu);
}

function showPauseMenu() {
  isPaused = true;
  document.body.insertAdjacentHTML("beforeend", pauseHTML);
  document.getElementById("replay").addEventListener("click", function () {
    hidePauseMenu();
  });
  document.getElementById("restart").addEventListener("click", function () {
    hidePauseMenu();
    restartGame();
  });
}

export function hidePauseMenu() {
  var pauseMenu = document.getElementById("pauseMenu");
  var overlay = document.getElementById("overlay");
  if (pauseMenu) {
    pauseMenu.parentNode.removeChild(pauseMenu);
  }
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
  isPaused = false;
}

function startTimer() {
  let myTime;
  const timeText = document.getElementById("timer")
  function updateTime() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    myTime = "Time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    timeText.textContent = myTime
  }

  function start() {
    if (timerInterval === null) {
      timerInterval = setInterval(function () {
        timer++;
        updateTime();
      }, 1000);
    }
  }

  function pause() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function reset() {
    timer = 0;
    updateTime();
  }

  start();

  return {
    pause: pause,
    resume: start,
    reset: reset,
  };
}

function getmyfinalscore() {
  let score = document.querySelector(".score");
  score.textContent = Number(score.textContent);
  return score.textContent;
}

function getfinalTime() {
  let timer = document.getElementById("timer");
  timer.textContent = timer.textContent;
  return timer.textContent;
}

function retry(life) {
  life--;
  console.log("LIFE RETRY", life);
  if (life == 0) {
    timerControl.reset();
    timerControl.pause();
    playSound(laugh);
    const myfinalscore = getmyfinalscore();
    document.body.innerHTML = gameoverHTML;
    document.getElementById("myscore").innerHTML = myfinalscore;
    isGameOver = true;
    return;
  } else {
    playSound(fail);
    resetGameState(life);
  }
}

function restartGame() {
  console.log("alert!!!!!!!!!!");
  let second = document.getElementById("secondDiv");
  let life = 3;
  document.getElementById("ball").remove(); 
  isGameOver = false;

  setTimeout(() => {
    console.log('here!!!!!!!!!!!!!!')
    document.getElementById("hearts").remove();
    initHeart();
    addHeart();
    gameBody.classList.add("gamebody");
    init(second, life);
    gameLoop(gameBody, second, life);
    isPaused = false;
  }, 490);
}

function recommenceAfterwin() {
  let life = 3;
  isGameOver = false;
  document.body.innerHTML = skeletonHTML;
  createTwoDiv();
  initHeart();
  startGame(life);
}

function recommence() {
  // document.getElementById("finish").remove();
  recommenceAfterwin();
}

function reloadFromStart() {
  location.reload();
}

function gameOver() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "r":
        // document.getElementById("hearts").remove()
        recommence();
        break;
      case "q":
        reloadFromStart();
        break;
      default:
        break;
    }
  });
  document.getElementById("restartR").addEventListener("click", recommence);
  document.getElementById("quitQ").addEventListener("click", reloadFromStart);
}

function gameEnd() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "r":
        recommenceAfterwin();
        break;
      case "q":
        reloadFromStart();
        break;
      default:
        break;
    }
  });
  document
    .getElementById("rplay")
    .addEventListener("click", recommenceAfterwin);
  document.getElementById("qquit").addEventListener("click", reloadFromStart);
}
