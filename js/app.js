const starterPage = document.querySelector(".starter-page");
const gamePage = document.querySelector(".game-page");
const startBtn = document.querySelector(".start-game");

const gameBoard = document.querySelector(".game-board");
const elMoves = document.getElementById("moves");
const elTime = document.getElementById("time");

const restartBtn = document.getElementById("restartBtn");
const newGameBtn = document.getElementById("newGameBtn");

const themeButtons = document.querySelectorAll(".theme .btns");
const playerButtons = document.querySelectorAll(".number-of-players .btns");
const gridButtons = document.querySelectorAll(".grid-size .btns");

function setActive(buttons) {
  buttons.forEach((btns) => {
    btns.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("activeBtn"));
      btns.classList.add("activeBtn");
    });
  });
}

setActive(themeButtons);
setActive(playerButtons);
setActive(gridButtons);

themeButtons[0].classList.add("activeBtn");
playerButtons[0].classList.add("activeBtn");
gridButtons[0].classList.add("activeBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let firstValue = null;
let secondValue = null;

let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timer = null;

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    elTime.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function getGridSize() {
  return document.querySelector(".grid-size .activeBtn").textContent;
}

function getPairCount() {
  return getGridSize() === "6x6" ? 18 : 8;
}

function setGridColumns() {
  gameBoard.style.gridTemplateColumns =
    getGridSize() === "6x6" ? "repeat(6, 1fr)" : "repeat(4, 1fr)";
}

function generateNumbers() {
  const pairCount = getPairCount();
  const nums = [];

  while (nums.length < pairCount) {
    const n = Math.floor(Math.random() * 99) + 1;
    if (!nums.includes(n)) nums.push(n);
  }

  return [...nums, ...nums];
}

function generateIcons() {
  const pairCount = getPairCount();

  const icons = [
    "bitcoin.svg",
    "car.svg",
    "cloud.svg",
    "css.svg",
    "euro.svg",
    "folder.svg",
    "html.svg",
    "laptop.svg",
    "man.svg",
    "money.svg",
    "moon.svg",
    "send.svg",
    "shape.svg",
    "shape2.svg",
    "sun.svg",
    "thunder.svg",
    "washing-machine.svg",
    "wifi.svg",
  ];

  const selectedIcons = icons.slice(0, pairCount);

  return [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
}

function generateCards() {
  gameBoard.innerHTML = "";

  moves = 0;
  seconds = 0;
  matchedPairs = 0;

  elMoves.textContent = "0";
  elTime.textContent = "0:00";

  setGridColumns();

  const theme = document.querySelector(".theme .activeBtn").textContent;
  const values = theme === "Icons" ? generateIcons() : generateNumbers();

  values.forEach((value) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="./img/close-circle.svg">
      <span></span>
    `;

    card.addEventListener("click", () => flipCard(card, value));
    gameBoard.appendChild(card);
  });
}

function flipCard(card, value) {
  if (lockBoard) return;
  if (card === firstCard) return;

  openCard(card, value);

  if (!firstCard) {
    firstCard = card;
    firstValue = value;
    return;
  }

  secondCard = card;
  secondValue = value;
  lockBoard = true;

  moves++;
  elMoves.textContent = moves;

  checkMatch();
}

function openCard(card, value) {
  const theme = document.querySelector(".theme .activeBtn").textContent;

  if (theme === "Icons") {
    card.querySelector("img").src = `./img/${value}`;
    card.querySelector("span").textContent = "";
  } else {
    card.querySelector("span").textContent = value;
    card.querySelector("img").src = "./img/open-circle.svg";
  }
}

function closeCard(card) {
  const theme = document.querySelector(".theme .activeBtn").textContent;

  if (theme === "Icons") {
    card.querySelector("img").src = "./img/close-circle.svg";
  } else {
    card.querySelector("span").textContent = "";
    card.querySelector("img").src = "./img/close-circle.svg";
  }
}

function checkMatch() {
  if (firstValue === secondValue) {
    matchedPairs++;
    resetTurn();
    checkWin();
  } else {
    setTimeout(() => {
      closeCard(firstCard);
      closeCard(secondCard);
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  firstValue = null;
  secondValue = null;
  lockBoard = false;
}

function checkWin() {
  if (matchedPairs === getPairCount()) {
    stopTimer();
    setTimeout(() => {
      alert(
        `🎉 Siz yutdingiz!
        
        Moves: ${moves}
        Time: ${elTime.textContent}`
      );
    }, 300);
  }
}

startBtn.addEventListener("click", () => {
  starterPage.classList.add("slide-up");

  setTimeout(() => {
    starterPage.style.display = "none";
    gamePage.classList.remove("hidden");

    generateCards();
    stopTimer();

    const ready = confirm("Are you ready?");
    if (ready) startTimer();
  }, 600);
});

restartBtn.addEventListener("click", () => {
  const ok = confirm("Restart qilmoqchimisiz?");
  if (!ok) return;

  stopTimer();
  generateCards();
  startTimer();
});

newGameBtn.addEventListener("click", () => {
  const ok = confirm("New game boshlamoqchimisiz?");
  if (!ok) return;

  stopTimer();
  gamePage.classList.add("hidden");

  starterPage.style.display = "flex";
  starterPage.classList.remove("hidden");
  starterPage.classList.remove("slide-up");
});
