var isMobile = false;
//display a warning if the user uses a mobile device
if (screen.width <= 900) {
  isMobile = true;
  //redirect to last page
  custom
    .confirm(
      "Sorry",
      "This Game is not optimised for mobile devices yet.",
      "return"
    )
    .then((response) => {
      location.href = sessionStorage.prevURL;
    });
} else
  custom
    .confirm(
      "",
      "This game is an early version, bugs will be patched soon",
      "play"
    )
    .then(() => game.start());

const root = document.querySelector(":root");
const canvas = document.querySelector("#pongGame");
const cvsContext = canvas.getContext("2d");
const audio = document.querySelector("audio"); //used for playing a die-sound
const main = document.querySelector("main");

const startButton = document.querySelector("#startButton");
const startPauseButton = document.querySelector("#startPauseButton");

const settingsToggle = document.querySelector("#settings-toggle");
const maxScoreSlider = document.querySelector("#maxScoreSlider");
const maxScoreSpan = document.querySelector("#maxScoreSpan");
const gameColorInput = document.querySelector("#gameColorInput");
const randomColorButton = document.querySelector(".randomColorButton");
const playAudioSwitch = document.querySelector("#playAudioSwitch");

// DevMode.callback = (status) => {
//     switch (status) {
//         case true:
//             gameColorInput.value = "#ba30ff";
//             gameColorInput.oninput();
//             break;

//         case false:
//             // gameColorInput.value = "#ffffff";
//             gameColorInput.oninput();
//             break;
//     }
// };
getRandomColor = () => {
  const letters = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

maxScoreSlider.oninput = () => {
  maxScoreSpan.innerHTML = maxScoreSlider.value;
  game.maxScore = maxScoreSlider.value;
  game.render();
};
gameColorInput.oninput = () => {
  game.rerenderColor();
};
randomColorButton.onclick = () => {
  game.rerenderColor(getRandomColor());
};
playAudioSwitch.oninput = () => {
  if (playAudioSwitch.checked)
    custom
      .confirm(
        "Attention",
        "For this feature to work, you need to have Autoplay enabled.",
        "OK",
        "no thanks"
      )
      .catch(() => {
        playAudioSwitch.checked = false;
      });
};

//the main object containing all the game logic
const game = {
  isRunning: false,
  defaultColor: "#ffffff",
  fps: 50,
  maxScore: 5,
  draw: {
    Rect(x, y, w, h, color) {
      cvsContext.fillStyle = color ? color : game.defaultColor;
      cvsContext.fillRect(x, y, w, h);
    },
    Circle(x, y, r, color) {
      cvsContext.fillStyle = color ? color : game.defaultColor;
      cvsContext.beginPath();
      cvsContext.arc(x, y, r, 0, Math.PI * 2, false);
      cvsContext.closePath();
      cvsContext.fill();
    },
    net(color) {
      for (let i = 0; i <= canvas.height; i += 15) {
        game.draw.Rect(
          net.x,
          net.y + i,
          net.width,
          net.height,
          color ? color : game.defaultColor
        );
      }
    },
    Text(text, x, y, color) {
      cvsContext.fillStyle = color ? color : game.defaultColor;
      cvsContext.font = "50px monospace";
      cvsContext.fillText(text, x, y);
    },
  },
  moveUserPaddle(event) {
    let rect = canvas.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height / 2;
  },
  resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.speed = 5;
    ball.velocity.x = -ball.velocity.x;
  },
  detectCollision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return (
      b.right > p.left &&
      b.bottom > p.top &&
      b.left < p.right &&
      b.top < p.bottom
    );
  },
  update() {
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;

    //AI to controll the computer paddle
    computer.y += (ball.y - (computer.y + computer.height / 2)) * computer.level; //prettier-ignore
    /* if ((computer.y + computer.height / 2) < (canvas.height / 2)) {
            console.log("top")
			let amt;
			if (computer.y <= 0) amt = 1;
			else amt = (ball.y - (computer.y + computer.height / 2)) * computer.level; //prettier-ignore

			computer.y += amt;
		} else {
            console.log("bottom")
            let amt;
			if ((computer.y + computer.height) == canvas.height) amt = 0;
            else amt = (ball.y - (computer.y + computer.height / 2)) * computer.level;
				computer.y += amt;
		} */

    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0)
      ball.velocity.y = -ball.velocity.y;

    let player = ball.x < canvas.width / 2 ? computer : user;

    if (game.detectCollision(ball, player)) {
      //determine where the ball hits the paddle
      let collidePoint = ball.y - (player.y + player.height / 2);

      //normalization
      collidePoint = collidePoint / (player.height / 2);

      //calculate angle
      let angleRad = (collidePoint * Math.PI) / 4;

      // X direction of the ball when its hit
      let direction = ball.x < canvas.width / 2 ? 1 : -1;

      //change velocity x and y
      ball.velocity.x = direction * ball.speed * Math.cos(angleRad);
      ball.velocity.y = ball.speed * Math.sin(angleRad);

      //increase speed when ball is touching a paddle
      ball.speed += 0.4;
      /* ball.velocity.x = -ball.velocity.x; */
    }

    //update the Score
    if (ball.x - ball.radius < 0) {
      user.score++;
      game.resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
      computer.score++;
      game.resetBall();

      if (playAudioSwitch.checked)
        audio
          .play() // play the die-sound
          .catch(() => console.warn("not able to play audio"));
    }
    if (computer.score == game.maxScore) {
      game.stop();
      custom
        .confirm("Game Over!💀", "", "play again", "stop")
        .then(() => game.start())
        .catch(() => {});
    }
    if (user.score == game.maxScore) {
      game.stop();
      custom
        .confirm("You Win!🎉", "", "play again", "stop")
        .then(() => game.start())
        .catch(() => {});
    }
  },
  render() {
        //reset the canvas
        game.draw.Rect(0, 0, canvas.width, canvas.height, "black");
        game.draw.net();

        //draw Scores
        game.draw.Text(computer.score, canvas.width / 4, canvas.height / 5);
        game.draw.Text(`/${game.maxScore}`, (canvas.width / 4) + 30, canvas.height / 5, pSBC(-0.7, game.defaultColor));
        
        game.draw.Text(user.score, 3 * canvas.width / 4, canvas.height / 5);
        game.draw.Text(`/${game.maxScore}`, (3 * canvas.width / 4) + 30, canvas.height / 5, pSBC(-0.7, game.defaultColor));

        //draw players
        game.draw.Rect(user.x, user.y, user.width, user.height);
        game.draw.Rect(computer.x, computer.y, computer.width, computer.height,);

        //draw ball
        game.draw.Circle(ball.x, ball.y, ball.radius)
    }, //prettier-ignore
  start() {
    game.Cycle = setInterval(game.init, 1000 / game.fps);
    game.isRunning = true;

    startButton.style.display = "none";
    startPauseButton.style.display = "block";
    startPauseButton.innerHTML = `<i class="fad fa-pause"></i>`;
    startPauseButton.onclick = game.pause;

    settingsToggle.checked = false;

    canvas.addEventListener("mousemove", game.moveUserPaddle);
    document.addEventListener("keydown", game.toggle);
  },
  toggle(event) {
    if (event.keyCode == 32) {
      event.preventDefault();
      if (game.isRunning) game.pause();
      else game.start();
    } else if (event.keyCode == 27 && !game.isRunning) game.start();
  },
  pause() {
    clearInterval(game.Cycle);
    game.isRunning = false;
    // startButton.style.display = "block";
    startPauseButton.innerHTML = `<i class="fad fa-play"></i>`;
    startPauseButton.onclick = game.start;

    settingsToggle.checked = true;

    canvas.removeEventListener("mousemove", game.moveUserPaddle);

    canvas.onclick = (event) => {
      if (!event.target.matches(".settings-panel"))
        if (!game.isRunning) game.start();
    };
  },
  stop() {
    clearInterval(game.Cycle);
    game.isRunning = false;
    startButton.style.display = "block";
    user.score = 0;
    computer.score = 0;

    canvas.removeEventListener("mousemove", game.moveUserPaddle);
    startPauseButton.style.display = "none";
  },
  restart() {
    game.resetBall();
    game.stop();
    computer.y = canvas.height / 2 - paddle.height / 2;
    user.y = canvas.height / 2 - paddle.height / 2;
    game.render();
    startPauseButton.style.display = "none";
    settingsToggle.checked = false;
  },
  rerenderColor(color) {
    color ||= gameColorInput.value;

    gameColorInput.value = color;
    game.defaultColor = color;
    game.render();

    canvas.style.border = `1px solid ${color}`;
    main.style.color = color;
    root.style.setProperty("--gameColor", color);
  },
  init() {
    game.update();
    game.render();
  },
};

//create the game elements
const paddle = {
  height: 100,
  width: 10,
};
var computer = {
  width: paddle.width,
  height: paddle.height,
  x: 0 + 10,
  y: canvas.height / 2 - paddle.height / 2,
  color: game.defaultColor,
  score: 0,
  level: 0.08,
};

var user = {
  width: paddle.width,
  height: paddle.height,
  x: canvas.width - paddle.width - 10,
  y: canvas.height / 2 - paddle.height / 2,
  color: game.defaultColor,
  score: 0,
};

var net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: game.defaultColor,
};

var ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocity: {
    x: 5,
    y: 5,
  },
  color: game.defaultColor,
};

startPauseButton.style.display = "none";
game.rerenderColor(getRandomColor());
game.init();
