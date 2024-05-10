
export function collisionBallBrick(ballX, ballY) {
  const ball = document.getElementById("ball");
  const ballPosition = ball.getBoundingClientRect();

  const ballInfo = {
    x: ballPosition.left,
    xx: ballPosition.left + ball.offsetWidth,
    y: ballPosition.top,
    yy: ballPosition.top + ball.offsetHeight,
  };

  const brickList = Array.from(document.getElementsByClassName("setBrick"));

  for (let i = 0; i < brickList.length; i++) {
    const brick = brickList[i];
    const rect = brick.getBoundingClientRect();

    if (
      ballInfo.xx > rect.left &&
      ballInfo.x < rect.left + rect.width &&
      ballInfo.yy > rect.top &&
      ballInfo.y < rect.top + rect.height
    ) {
      if (
        verticaleCollision(ballInfo, rect) >
        horizontaleCollision(ballInfo, rect) / 1.8
      ) {
        handleBrickCollision(brick);
        const collisionDirection = "top";
        return [true, brick.id, collisionDirection];
      } else {
        handleBrickCollision(brick);
        const collisionDirection = "left";
        return [true, brick.id, collisionDirection];
      }
    }
  }

  return [false];
}

var time = 0;
function handleBrickCollision(brick) {
  let score = document.querySelector(".score");
  brick.classList.add("hit");
  score.textContent = Number(score.textContent) + 10;
  time++;
  brick.remove();
  // setTimeout(() => {
  //   brick.remove();
  // }, 17);
}

function verticaleCollision(ballInfo, rect) {
  return Math.max(
    0,
    hautCollision(ballInfo, rect),
    basCollision(ballInfo, rect)
  );
}

function horizontaleCollision(ballInfo, rect) {
  return Math.max(
    0,
    gaucheCollision(ballInfo, rect),
    droitCollision(ballInfo, rect)
  );
}

function hautCollision(ballInfo, rect) {
  if (ballInfo.yy >= rect.top) {
    const diff = ballInfo.yy - rect.top;
    return diff;
  }
  return -1;
}

function basCollision(ballInfo, rect) {
  if (rect.top + rect.height >= ballInfo.y) {
    const diff = rect.top + rect.height - ballInfo.y;
    return diff;
  }
  return -1;
}

function gaucheCollision(ballInfo, rect) {
  if (ballInfo.xx >= rect.left) {
    const diff = ballInfo.xx - rect.left;
    return diff;
  }
  return -1;
}

function droitCollision(ballInfo, rect) {
  if (rect.left + rect.width >= ballInfo.x) {
    const diff = rect.left + rect.width - ballInfo.x;
    return diff;
  }
  return -1;
}
