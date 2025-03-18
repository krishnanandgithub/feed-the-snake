class Position {
  #top;
  #maxTop;
  #left;
  #maxLeft;
  constructor(top, maxTop, left, maxLeft) {
    this.#top = top;
    this.#maxTop = maxTop;
    this.#left = left;
    this.#maxLeft = maxLeft;
  }

  top(increment) {
    if (this.#top === this.#maxTop && increment > 0) {
      this.#top = -20;
    } else if (this.#top === 0 && increment < 0) {
      this.#top = this.#maxTop + 20;
    }

    this.#top += increment;
    return this.#top + "px";
  }

  left(increment) {
    if (this.#left === this.#maxLeft && increment > 0) {
      this.#left = -20;
    } else if (this.#left === 0 && increment < 0) {
      this.#left = this.#maxLeft + 20;
    }

    this.#left += increment;
    return this.#left + "px";
  }

  increment(property, value) {
    if (property === "top") {
      return this.top(value);
    }

    return this.left(value);
  }
}

class Food {
  #container;
  #top;
  #left;
  constructor(container) {
    this.#container = container;
    this.createFood();
  }

  multipleOf = (num) => {
    return num * Math.floor(Math.random() * num);
  };

  createFood() {
    const food = document.createElement("div");
    food.classList.add("food");
    this.#top = this.multipleOf(20);
    this.#left = this.multipleOf(20);
    food.style.setProperty("top", `${this.#top}px`);
    food.style.setProperty("left", `${this.#left}px`);
    this.#container.appendChild(food);
  }

  top() {
    return this.#top;
  }

  left() {
    return this.#left;
  }

  removeFood() {
    const food = document.querySelector(".food");
    this.#container.removeChild(food);
  }
}

class Snake {
  #snakeIds;
  #idCounter;
  #container;
  #top;
  #left;
  constructor(container) {
    this.#container = container;
    this.#snakeIds = [];
    this.#idCounter = 1;
    this.enlargeSnake(0, 0);
  }

  parseValue(value) {
    return +value.slice(0, -2);
  }

  setPosition(property, value) {
    if (property === "top") {
      this.#top = this.parseValue(value);
      return;
    }

    this.#left = this.parseValue(value);
  }

  resetProperty(property, value) {
    this.setPosition(property, value);
    let top = this.#top + "px";
    let left = this.#left + "px";

    for (const id of this.#snakeIds) {
      const element = document.getElementById(id);
      const tempTop = element.style.top;
      const tempLeft = element.style.left;
      element.style.setProperty("top", top);
      element.style.setProperty("left", left);
      top = tempTop;
      left = tempLeft;
    }
  }

  enlargeSnake(top, left) {
    const snake = document.createElement("div");
    snake.id = this.#idCounter;
    this.#snakeIds.unshift(this.#idCounter);
    snake.classList.add("snake");
    snake.style.setProperty("top", `${top}px`);
    snake.style.setProperty("left", `${left}px`);
    this.#container.appendChild(snake);
    this.#idCounter += 1;
  }

  isFoodFound(top, left) {
    return this.#top === top && this.#left === left;
  }
}

class Score {
  #score;
  constructor() {
    this.#score = 0;
    this.displayScore();
  }

  displayScore() {
    const score = document.getElementById("score");
    score.textContent = `
    Score : ${10 * this.#score}
    `;
    this.#score += 1;
  }
}

const closeInterval = (interval) => {
  for (const id of interval) {
    clearInterval(id);
  }
};

const move = (
  key,
  arrows,
  interval,
  snake,
  food,
  score,
  position,
  property,
  value,
) => {
  arrows.clear();
  arrows.add(key);
  closeInterval(interval);
  const id = setInterval(() => {
    if (snake.isFoodFound(food.top(), food.left())) {
      food.removeFood();
      snake.enlargeSnake(food.top(), food.left());
      food.createFood();
      score.displayScore();
    }
    snake.resetProperty(property, position.increment(property, value));
  }, 200);
  interval.add(id);
};

const handleMovement = (
  event,
  snake,
  food,
  score,
  position,
  interval,
  arrows,
) => {
  const key = event.key;

  if (key === "ArrowDown" && !arrows.has("ArrowUp")) {
    move(key, arrows, interval, snake, food, score, position, "top", 20);
  }

  if (key === "ArrowUp" && !arrows.has("ArrowDown")) {
    move(key, arrows, interval, snake, food, score, position, "top", -20);
  }

  if (key === "ArrowRight" && !arrows.has("ArrowLeft")) {
    move(key, arrows, interval, snake, food, score, position, "left", 20);
  }

  if (key === "ArrowLeft" && !arrows.has("ArrowRight")) {
    move(key, arrows, interval, snake, food, score, position, "left", -20);
  }
};

const main = () => {
  const container = document.querySelector(".box");
  const snake = new Snake(container);
  const food = new Food(container);
  const score = new Score();
  const position = new Position(20, 380, 20, 380);
  const intervals = new Set();
  const arrows = new Set();

  document.addEventListener("keydown", (event) => {
    handleMovement(event, snake, food, score, position, intervals, arrows);
  });
};

main();
