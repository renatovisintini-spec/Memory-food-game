export const STORAGE_KEYS = {
  users: "memoryFoodUsers",
  session: "memoryFoodSession",
  ranking: "memoryFoodRanking"
};

export function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJSON(STORAGE_KEYS.users, []);
}

export function saveUsers(users) {
  writeJSON(STORAGE_KEYS.users, users);
}

export function getSession() {
  return readJSON(STORAGE_KEYS.session, null);
}

export function setSession(user) {
  writeJSON(STORAGE_KEYS.session, user);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function getRanking() {
  return readJSON(STORAGE_KEYS.ranking, []);
}

export function saveRanking(entries) {
  writeJSON(STORAGE_KEYS.ranking, entries);
}
