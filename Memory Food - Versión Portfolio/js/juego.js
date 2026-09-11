import { clearSession, getRanking, getSession, saveRanking } from "./storage.js";

const session = getSession();
if (!session) {
  window.location.replace("login.html");
}

const foods = [
  { id: "rice", emoji: "🍚", label: "Arroz" },
  { id: "cake", emoji: "🍰", label: "Bizcocho" },
  { id: "pork", emoji: "🍖", label: "Carne de cerdo" },
  { id: "beef", emoji: "🥩", label: "Carne vacuna" },
  { id: "onion", emoji: "🧅", label: "Cebolla" },
  { id: "salad", emoji: "🥗", label: "Ensalada" },
  { id: "starter", emoji: "🥟", label: "Entrada" },
  { id: "eggs", emoji: "🥚", label: "Huevos" }
];

const board = document.querySelector("#game-board");
const playerName = document.querySelector("#player-name");
const timeElement = document.querySelector("#time");
const errorsElement = document.querySelector("#errors");
const matchesElement = document.querySelector("#matches");
const message = document.querySelector("#game-message");
const resultPanel = document.querySelector("#result-panel");

let firstCard = null;
let secondCard = null;
let locked = false;
let errors = 0;
let matches = 0;
let elapsedSeconds = 0;
let timerId = null;
let started = false;

playerName.textContent = session?.name ?? "Jugador";
document.querySelector("#logout-button").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});
document.querySelector("#restart-button").addEventListener("click", startGame);
document.querySelector("#play-again-button").addEventListener("click", startGame);

startGame();

function startGame() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  locked = false;
  errors = 0;
  matches = 0;
  elapsedSeconds = 0;
  started = false;
  errorsElement.textContent = "0";
  matchesElement.textContent = "0";
  timeElement.textContent = "00:00";
  message.textContent = "Haz clic en una tarjeta para comenzar.";
  resultPanel.hidden = true;

  const deck = shuffle([...foods, ...foods].map((food, index) => ({ ...food, uid: `${food.id}-${index}` })));
  board.replaceChildren(...deck.map(createCard));
}

function createCard(food) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "memory-card";
  button.dataset.foodId = food.id;
  button.dataset.uid = food.uid;
  button.setAttribute("aria-label", "Tarjeta oculta");
  button.innerHTML = `
    <span class="memory-card__inner">
      <span class="memory-card__face memory-card__back" aria-hidden="true">?</span>
      <span class="memory-card__face memory-card__front" aria-hidden="true">${food.emoji}</span>
    </span>`;
  button.addEventListener("click", () => handleCardClick(button, food));
  return button;
}

function handleCardClick(card, food) {
  if (locked || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;

  if (!started) {
    started = true;
    startTimer();
    message.textContent = "Partida en curso.";
  }

  flip(card, food.label);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  locked = true;

  if (firstCard.dataset.foodId === secondCard.dataset.foodId) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.setAttribute("aria-label", `Pareja encontrada: ${food.label}`);
    secondCard.setAttribute("aria-label", `Pareja encontrada: ${food.label}`);
    matches += 1;
    matchesElement.textContent = String(matches);
    message.textContent = `¡Pareja encontrada! ${matches} de 8.`;
    resetTurn();
    if (matches === foods.length) finishGame();
    return;
  }

  errors += 1;
  errorsElement.textContent = String(errors);
  message.textContent = "No coinciden. Inténtalo otra vez.";
  setTimeout(() => {
    unflip(firstCard);
    unflip(secondCard);
    resetTurn();
  }, 850);
}

function flip(card, label) {
  card.classList.add("is-flipped");
  card.setAttribute("aria-label", label);
}

function unflip(card) {
  card.classList.remove("is-flipped");
  card.setAttribute("aria-label", "Tarjeta oculta");
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  locked = false;
}

function startTimer() {
  timerId = window.setInterval(() => {
    elapsedSeconds += 1;
    timeElement.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function finishGame() {
  stopTimer();
  locked = true;
  message.textContent = "¡Has completado las 8 parejas!";
  saveResult();
  document.querySelector("#result-name").textContent = session.name;
  document.querySelector("#result-errors").textContent = String(errors);
  document.querySelector("#result-time").textContent = formatTime(elapsedSeconds);
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function saveResult() {
  const ranking = getRanking();
  ranking.push({
    name: session.name,
    city: session.city,
    country: session.country,
    email: session.email,
    errors,
    time: elapsedSeconds,
    playedAt: new Date().toISOString()
  });
  saveRanking(ranking);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
