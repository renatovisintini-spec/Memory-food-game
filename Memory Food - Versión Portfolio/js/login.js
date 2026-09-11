import { getUsers, setSession } from "./storage.js";

const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const toggle = document.querySelector("[data-toggle-password]");

toggle.addEventListener("click", () => {
  const input = document.getElementById(toggle.dataset.togglePassword);
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  toggle.textContent = show ? "Ocultar" : "Mostrar";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const user = getUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    message.textContent = "Email o contraseña incorrectos.";
    return;
  }

  const sessionUser = { name: user.name, city: user.city, country: user.country, email: user.email };
  setSession(sessionUser);
  window.location.href = "juego.html";
});
