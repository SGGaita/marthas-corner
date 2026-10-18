// Stars are stored on this device only (localStorage).
const KEY = "martha-learning-v1";

export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
export function addStar(id) {
  const p = loadProgress();
  p[id] = (p[id] || 0) + 1;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  return p;
}
