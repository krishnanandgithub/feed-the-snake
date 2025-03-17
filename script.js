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
    let propValue = value;
    for (const id of this.#snakeIds) {
      const element = document.getElementById(id);
      element.style.setProperty(property, propValue);
      propValue -= 20;
    }
  }

  enlargeSnake(top, left) {
    this.#top = top;
    this.#left = left;
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
    }
    snake.resetProperty(property, position.increment(property, value));
  }, 200);
  interval.add(id);
};

const handleMovement = (event, snake, food, position, interval, arrows) => {
  const key = event.key;

  if (key === "ArrowDown" && !arrows.has("ArrowUp")) {
    move(key, arrows, interval, snake, food, position, "top", 20);
  }

  if (key === "ArrowUp" && !arrows.has("ArrowDown")) {
    move(key, arrows, interval, snake, food, position, "top", -20);
  }

  if (key === "ArrowRight" && !arrows.has("ArrowLeft")) {
    move(key, arrows, interval, snake, food, position, "left", 20);
  }

  if (key === "ArrowLeft" && !arrows.has("ArrowRight")) {
    move(key, arrows, interval, snake, food, position, "left", -20);
  }
};

const createContainer = (height) => {
  const body = document.querySelector("body");
  const container = document.createElement("div");
  container.classList.add("box");
  container.style.setProperty("height", `${height}px`);

  body.appendChild(container);

  return container;
};

const main = () => {
  const container = createContainer(400);
  const snake = new Snake(container);
  const food = new Food(container);
  const position = new Position(-20, 380, -20, 380);
  const intervals = new Set();
  const arrows = new Set();

  document.addEventListener("keydown", (event) => {
    handleMovement(event, snake, food, position, intervals, arrows);
  });
};

main();
