let bird;
let pipes = [];
let gravity = 0.6;
let lift = -15;
let score = 0;

let gameStarted = false;
let highscore = 0;

function setup() {
  const canvas = createCanvas(windowWidth / 2, windowHeight / 2);
  canvas.parent('canvas-container');
}

function startGame() {

  gameStarted = true;

  bird = new Bird();
  pipes.push(new Pipe());

  score = 0;

  console.log("gamestarted");
  const dialogue = document.getElementById('dialogue');
  dialogue.classList.add('hidden'); // Hide the Game Over message
}

function draw() {
  document.getElementById('start-button').addEventListener('click', startGame);

  background(135, 206, 235); // Sky color

  // Update and display the bird
  if (gameStarted) {

    bird.update();
    bird.show();

    if (frameCount % 75 === 0) {
      pipes.push(new Pipe());
    }


    // Manage pipes

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // Check for collision
      if (pipes[i].hits(bird)) {
        resetGame();
      }

      // Increment score if the bird passes the pipe
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
        score++;
      }
    }

    fill(0);
    textSize(32);
    text("Score: " + score, 10, 30);

  }



}

function keyPressed() {
  if (key === ' ') {
    bird.up();
  }
}

function resetGame() {

  if (score > highscore) {
    highscore = score;
  }
  const dialogue = document.getElementById('dialogue');
  const dialogueText = document.getElementById('dialogue-text');
  dialogue.classList.remove('hidden'); // Remove the hidden class to show the Game Over message
  const text = `Game Over<br>Your Score : ${score}<br> Highest Score : ${highscore}`;
  dialogueText.innerHTML = text;
  const button = document.getElementById('start-button');
  button.textContent = 'Replay';


  pipes = [];
  score = 0;
}

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.velocity = 0;
    this.width = 20;
    this.height = 20;
  }

  show() {
    fill(255, 204, 0); // Bird color
    ellipse(this.x, this.y, this.width, this.height);
  }

  up() {
    this.velocity += lift;
  }

  update() {
    this.velocity += gravity;
    this.velocity *= 0.9; // Slight air resistance
    this.y += this.velocity;

    // Prevent bird from going off the canvas
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}

class Pipe {
  constructor() {
    this.top = random(height / 2);
    this.bottom = random(height / 2);
    this.x = width;
    this.w = 40;
    this.speed = 6;
    this.highlight = false;
  }

  show() {
    fill(0, 255, 0); // Pipe color
    if (this.highlight) {
      fill(255, 0, 0); // Highlight color on hit
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }

  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
}