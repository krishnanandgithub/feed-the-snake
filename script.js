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
    if (this.#top >= this.#maxTop) {
      this.#top = 0;
    }

    if (this.#top < 0) {
      this.#top = this.#maxTop;
    }

    this.#top += increment;
    return this.#top + "px";
  }

  left(increment) {
    if (this.#left >= this.#maxLeft) {
      this.#left = 0;
    }

    if (this.#left < 0) {
      this.#left = this.#maxLeft;
    }

    this.#left += increment;
    return this.#left + "px";
  }
}

const closeInterval = (interval) => {
  for (const id of interval) {
    clearInterval(id);
  }
};

const moveVertical = (key, arrows, interval, snake, position, value) => {
  arrows.clear();
  arrows.add(key);
  closeInterval(interval);
  const id = setInterval(() => {
    snake.style.setProperty("--top", position.top(value));
  }, 200);
  interval.add(id);
};

const moveHorizontal = (
  key,
  arrows,
  interval,
  snake,
  position,
  value,
) => {
  arrows.clear();
  arrows.add(key);
  closeInterval(interval);
  const id = setInterval(() => {
    snake.style.setProperty("--left", position.left(value));
  }, 200);
  interval.add(id);
};

const handleMovement = (event, snake, position, interval, arrows) => {
  const key = event.key;

  if (key === "ArrowDown" && !arrows.has("ArrowUp")) {
    moveVertical(key, arrows, interval, snake, position, 20);
  }

  if (key === "ArrowUp" && !arrows.has("ArrowDown")) {
    moveVertical(key, arrows, interval, snake, position, -20);
  }

  if (key === "ArrowRight" && !arrows.has("ArrowLeft")) {
    moveHorizontal(key, arrows, interval, snake, position, 20);
  }

  if (key === "ArrowLeft" && !arrows.has("ArrowRight")) {
    moveHorizontal(key, arrows, interval, snake, position, -20);
  }
};

const createContainer = (height) => {
  const body = document.querySelector("body");
  const container = document.createElement("div");
  container.classList.add("box");
  container.style.setProperty("--height", `${height}px`);

  body.appendChild(container);

  return container;
};

const createSnake = (container) => {
  const snake = document.createElement("div");
  snake.classList.add("snake");
  container.appendChild(snake);

  return snake;
};

const multipleOf = (num) => {
  return num * Math.floor(Math.random() * num);
};

const createFood = () => {
  const container = document.querySelector(".box");
  const food = document.createElement("div");
  food.classList.add("food");
  const top = `${multipleOf(20)}px`;
  const left = `${multipleOf(20)}px`;
  food.style.setProperty("--foodTop", top);
  food.style.setProperty("--foodLeft", left);
  container.appendChild(food);

  return food;
};

const main = () => {
  const container = createContainer(400);
  const snake = createSnake(container);
  const position = new Position(-20, 380, -20, 380);
  const intervals = new Set();
  const arrows = new Set();
  const food = createFood(container);

  document.addEventListener("keydown", (event) => {
    handleMovement(event, snake, position, intervals, arrows);
  });
};

window.onload = main;
