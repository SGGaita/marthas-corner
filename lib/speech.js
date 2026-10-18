// Text-to-speech using the device's built-in voice (works offline on most devices).
let voice = null;
let token = 0;

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice() {
  if (!canSpeak()) return;
  const v = speechSynthesis.getVoices();
  voice =
    v.find((x) => /^en/i.test(x.lang) && /female|samantha|karen|google us|zira|moira/i.test(x.name)) ||
    v.find((x) => /^en/i.test(x.lang)) || null;
}
if (canSpeak()) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

export function stop() {
  token++;
  if (canSpeak()) try { speechSynthesis.cancel(); } catch {}
}

/**
 * Speak a list of steps in order. Each step: { t: text, on?: fn called as it starts, rate?, gap? }.
 * A new call cancels the previous queue. `done` runs after the last step.
 */
export function queue(steps, done) {
  stop();
  const my = token;
  let i = 0;
  const next = () => {
    if (my !== token) return;
    if (i >= steps.length) { done && done(); return; }
    const s = steps[i++];
    s.on && s.on();
    let fired = false;
    const go = () => { if (fired) return; fired = true; setTimeout(next, s.gap ?? 120); };
    if (canSpeak() && s.t) {
      try {
        const u = new SpeechSynthesisUtterance(s.t);
        if (voice) u.voice = voice;
        u.rate = s.rate || 0.8; u.pitch = 1.15;
        u.onend = go; u.onerror = go;
        speechSynthesis.speak(u);
      } catch {}
      // Safety net: some browsers never fire onend.
      setTimeout(go, Math.max(1600, s.t.length * 110));
    } else setTimeout(go, 750);
  };
  next();
}

export const speak = (t, done) => queue([{ t }], done);
