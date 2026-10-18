// Kid-friendly cartoon planets, drawn as SVG (no downloads, works offline).
// planetSvg(key, uid, { face }) returns a complete <svg> string.

export const PLANETS = [
  { k: "mercury", name: "Mercury", color: "#a8a29e", short: "the closest to the Sun",
    fact: "Mercury is the closest planet to the Sun. It is small and very hot." },
  { k: "venus", name: "Venus", color: "#f0c05a", short: "the hottest planet",
    fact: "Venus is the hottest planet. It is covered in thick yellow clouds." },
  { k: "earth", name: "Earth", color: "#3f93e8", short: "our home",
    fact: "Earth is our home! It has water, air, plants and animals." },
  { k: "mars", name: "Mars", color: "#d9603b", short: "the red planet",
    fact: "Mars is the red planet. It is dusty and cold." },
  { k: "jupiter", name: "Jupiter", color: "#e9b98a", short: "the biggest planet",
    fact: "Jupiter is the biggest planet. It has a giant red storm." },
  { k: "saturn", name: "Saturn", color: "#eac86f", short: "the planet with rings",
    fact: "Saturn has beautiful rings made of ice and rock." },
  { k: "uranus", name: "Uranus", color: "#86dbe3", short: "the planet that spins on its side",
    fact: "Uranus is an icy planet. It spins on its side." },
  { k: "neptune", name: "Neptune", color: "#3d63de", short: "the planet farthest from the Sun",
    fact: "Neptune is far, far away. It is cold, blue and windy." },
];

const INK = "#2b2a3d";

function face(cx, cy, s) {
  const p = (n) => +(n * s).toFixed(2);
  return `<g>
    <ellipse cx="${cx - p(19)}" cy="${cy + p(11)}" rx="${p(5.5)}" ry="${p(3.2)}" fill="#ff8fa3" opacity=".65"/>
    <ellipse cx="${cx + p(19)}" cy="${cy + p(11)}" rx="${p(5.5)}" ry="${p(3.2)}" fill="#ff8fa3" opacity=".65"/>
    <circle cx="${cx - p(11)}" cy="${cy + p(1)}" r="${p(4.6)}" fill="${INK}"/>
    <circle cx="${cx + p(11)}" cy="${cy + p(1)}" r="${p(4.6)}" fill="${INK}"/>
    <circle cx="${cx - p(9.6)}" cy="${cy - p(0.6)}" r="${p(1.6)}" fill="#fff"/>
    <circle cx="${cx + p(12.4)}" cy="${cy - p(0.6)}" r="${p(1.6)}" fill="#fff"/>
    <path d="M${cx - p(8)} ${cy + p(11)} Q${cx} ${cy + p(19)} ${cx + p(8)} ${cy + p(11)}" stroke="${INK}" stroke-width="${p(3)}" stroke-linecap="round" fill="none"/>
  </g>`;
}

// Soft light from the top-left, shade on the bottom-right.
function shading(cx, cy, r, clip) {
  return `<g clip-path="url(#${clip})">
    <circle cx="${cx + r * 0.35}" cy="${cy + r * 0.35}" r="${r}" fill="#000" opacity=".13"/>
    <ellipse cx="${cx - r * 0.42}" cy="${cy - r * 0.45}" rx="${r * 0.32}" ry="${r * 0.2}" fill="#fff" opacity=".35" transform="rotate(-35 ${cx - r * 0.42} ${cy - r * 0.45})"/>
  </g>`;
}

const DETAILS = {
  mercury: () => `
    <circle cx="40" cy="44" r="7" fill="#8a847f"/><circle cx="80" cy="38" r="5" fill="#8a847f"/>
    <circle cx="75" cy="82" r="8" fill="#8a847f"/><circle cx="42" cy="84" r="4" fill="#8a847f"/>
    <circle cx="94" cy="62" r="4" fill="#8a847f"/><circle cx="26" cy="64" r="3.5" fill="#8a847f"/>`,
  venus: () => `
    <path d="M10 42 Q35 32 60 42 T110 42 L110 50 Q85 60 60 50 T10 50Z" fill="#e3a33e" opacity=".7"/>
    <path d="M10 76 Q35 66 60 76 T110 76 L110 83 Q85 92 60 83 T10 83Z" fill="#e3a33e" opacity=".7"/>
    <path d="M20 62 Q45 56 70 62" stroke="#f8dc95" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  earth: () => `
    <path d="M22 40 C30 26 50 24 54 36 C58 46 46 50 48 60 C50 70 36 74 30 66 C22 58 16 50 22 40Z" fill="#4cb050"/>
    <path d="M70 30 C82 26 96 36 92 46 C88 54 76 50 72 44 C68 38 64 32 70 30Z" fill="#4cb050"/>
    <path d="M66 74 C76 66 94 70 92 84 C90 96 72 100 66 92 C60 86 60 80 66 74Z" fill="#4cb050"/>
    <ellipse cx="78" cy="58" rx="11" ry="4" fill="#fff" opacity=".85"/>
    <ellipse cx="34" cy="86" rx="9" ry="3.5" fill="#fff" opacity=".85"/>`,
  mars: () => `
    <ellipse cx="60" cy="20" rx="20" ry="7" fill="#fff" opacity=".9"/>
    <path d="M26 52 C34 44 46 48 44 58 C42 66 30 66 26 60Z" fill="#b84a2c"/>
    <path d="M70 70 C80 62 96 66 94 78 C92 86 78 88 72 82Z" fill="#b84a2c"/>
    <circle cx="82" cy="44" r="4" fill="#b84a2c"/><circle cx="46" cy="86" r="3" fill="#b84a2c"/>`,
  jupiter: () => `
    <rect x="0" y="24" width="120" height="9" fill="#d4935e"/>
    <rect x="0" y="40" width="120" height="6" fill="#f6dfc2"/>
    <rect x="0" y="66" width="120" height="8" fill="#c47a48"/>
    <rect x="0" y="80" width="120" height="6" fill="#f6dfc2"/>
    <rect x="0" y="92" width="120" height="9" fill="#d4935e"/>
    <ellipse cx="74" cy="90" rx="11" ry="6.5" fill="#c9462c"/>
    <ellipse cx="74" cy="90" rx="6" ry="3.2" fill="#e0684d"/>`,
  saturn: () => `
    <rect x="0" y="44" width="120" height="6" fill="#d9ae4f" opacity=".8"/>
    <rect x="0" y="70" width="120" height="5" fill="#d9ae4f" opacity=".8"/>`,
  uranus: () => `
    <path d="M18 52 Q60 46 102 52" stroke="#a6e8ee" stroke-width="5" fill="none" opacity=".8"/>
    <path d="M20 78 Q60 72 100 78" stroke="#6fc8d2" stroke-width="4" fill="none" opacity=".7"/>`,
  neptune: () => `
    <rect x="0" y="38" width="120" height="8" fill="#2f4fc0"/>
    <rect x="0" y="78" width="120" height="6" fill="#5a7ff0"/>
    <ellipse cx="76" cy="90" rx="10" ry="5.5" fill="#22388f"/>
    <path d="M30 32 Q42 28 54 32" stroke="#e8f0ff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
};

// Rings drawn as a back half (behind the planet) and a front half.
function ring(k, half) {
  if (k === "saturn") {
    const sweep = half === "back" ? 1 : 0;
    const arc = (rx, ry) => `M${60 - rx} 0 A${rx} ${ry} 0 0 ${sweep} ${60 + rx} 0`;
    return `<g transform="translate(0 64) rotate(-14 60 0)" fill="none" stroke-linecap="round">
      <path d="${arc(56, 15)}" stroke="#c9a35a" stroke-width="7"/>
      <path d="${arc(47, 12)}" stroke="#f2dfa4" stroke-width="4"/>
    </g>`;
  }
  if (k === "uranus") {
    // Nearly upright ring: back = right half, front = left half.
    const sweep = half === "back" ? 1 : 0;
    return `<g transform="rotate(-10 60 60)" fill="none">
      <path d="M60 4 A27 56 0 0 ${sweep} 60 116" stroke="#5fb8c4" stroke-width="3.5" stroke-linecap="round"/>
    </g>`;
  }
  return "";
}

export function planetSvg(k, uid = k, { face: withFace = true, title } = {}) {
  const p = PLANETS.find((x) => x.k === k);
  const r = k === "saturn" ? 34 : k === "uranus" ? 38 : 42;
  const clip = `pc-${uid}`;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title || p.name}">
  <defs><clipPath id="${clip}"><circle cx="60" cy="60" r="${r}"/></clipPath></defs>
  ${ring(k, "back")}
  <circle cx="60" cy="60" r="${r}" fill="${p.color}"/>
  <g clip-path="url(#${clip})">${DETAILS[k]()}</g>
  ${shading(60, 60, r, clip)}
  ${withFace ? face(60, k === "saturn" ? 50 : 58, r / 42) : ""}
  ${ring(k, "front")}
</svg>`;
}
