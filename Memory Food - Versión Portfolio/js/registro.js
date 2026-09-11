import { getUsers, saveUsers } from "./storage.js";

const form = document.querySelector("#register-form");
const message = document.querySelector("#form-message");

document.querySelectorAll("[data-toggle-password]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.togglePassword);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Ocultar" : "Mostrar";
    button.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const data = new FormData(form);
  const user = {
    name: data.get("name").trim(),
    city: data.get("city").trim(),
    country: data.get("country").trim(),
    email: data.get("email").trim().toLowerCase(),
    password: data.get("password")
  };
  const confirmPassword = data.get("confirmPassword");

  let valid = true;
  if (user.name.length < 2) valid = setError("name", "Introduce un nombre válido.") && false;
  if (!user.city) valid = setError("city", "La ciudad es obligatoria.") && false;
  if (!user.country) valid = setError("country", "El país es obligatorio.") && false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) valid = setError("email", "Introduce un email válido.") && false;
  if (user.password.length < 6) valid = setError("password", "Usa al menos 6 caracteres.") && false;
  if (confirmPassword !== user.password) valid = setError("confirm-password", "Las contraseñas no coinciden.") && false;

  if (!valid) return;

  const users = getUsers();
  if (users.some((item) => item.email === user.email)) {
    setError("email", "Ya existe una cuenta con este email.");
    return;
  }

  users.push(user);
  saveUsers(users);
  message.textContent = "Cuenta creada correctamente. Redirigiendo al login…";
  message.classList.add("form-message--success");
  setTimeout(() => { window.location.href = "login.html"; }, 500);
});

function setError(id, text) {
  const input = document.getElementById(id);
  const error = document.querySelector(`[data-error-for="${id}"]`);
  if (input) input.setAttribute("aria-invalid", "true");
  if (error) error.textContent = text;
  return true;
}

function clearErrors() {
  message.textContent = "";
  message.classList.remove("form-message--success");
  form.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
  form.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
}
