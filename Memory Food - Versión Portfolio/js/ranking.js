import { getRanking } from "./storage.js";

const playerBody = document.querySelector("#player-ranking");
const cityBody = document.querySelector("#city-ranking");
const playerEmpty = document.querySelector("#player-empty");
const cityEmpty = document.querySelector("#city-empty");

const ranking = getRanking();
const ordered = [...ranking].sort(compareResults);

if (ordered.length === 0) {
  playerEmpty.hidden = false;
  cityEmpty.hidden = false;
} else {
  renderPlayerRanking(bestByPlayer(ordered));
  renderCityRanking(bestByCity(ordered));
}

function compareResults(a, b) {
  return a.errors - b.errors || a.time - b.time || a.name.localeCompare(b.name, "es");
}

function bestByPlayer(entries) {
  const best = new Map();
  for (const entry of entries) {
    const key = entry.email || `${entry.name}|${entry.city}`;
    if (!best.has(key)) best.set(key, entry);
  }
  return [...best.values()].sort(compareResults);
}

function bestByCity(entries) {
  const best = new Map();
  for (const entry of entries) {
    const key = entry.city.trim().toLocaleLowerCase("es");
    if (!best.has(key)) best.set(key, entry);
  }
  return [...best.values()].sort(compareResults);
}

function renderPlayerRanking(entries) {
  playerBody.replaceChildren(...entries.map((entry, index) => row([
    index + 1,
    entry.name,
    entry.city,
    entry.errors,
    formatTime(entry.time)
  ])));
}

function renderCityRanking(entries) {
  cityBody.replaceChildren(...entries.map((entry, index) => row([
    index + 1,
    entry.city,
    entry.name,
    entry.errors,
    formatTime(entry.time)
  ])));
}

function row(values) {
  const tr = document.createElement("tr");
  for (const value of values) {
    const td = document.createElement("td");
    td.textContent = String(value);
    tr.appendChild(td);
  }
  return tr;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
