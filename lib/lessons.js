// All lesson content lives here. To add a lesson, append an object to LESSONS.
//
// Lesson:  { id, title, cols, cover, type?, items[], findLabel?, allLabel? }
// Item:    { name, plain?, tile(mode) -> JSX, explore() -> {visual, word, say}, ask() -> {visual, word, say} }
//          "words" lessons use { name, word, emoji } and get the spelling game instead.
import { crayon } from "./tokens";
import { PLANETS } from "./planets";
import Planet from "@/components/Planet";

const range = (a, b, s = 1) => { const r = []; for (let i = a; i <= b; i += s) r.push(i); return r; };
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
export const words = (n) => n === 100 ? "one hundred" : n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/* ---------- small visual building blocks ---------- */
const Big = ({ children, color, size }) => (
  <span className="big-num" style={{ color, fontSize: size }}>{children}</span>
);
const Emo = ({ e, size = "clamp(3.6rem,14vw,6rem)" }) => <span style={{ fontSize: size, lineHeight: 1 }}>{e}</span>;
const TileEmo = ({ e, label }) => (
  <>
    <span style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)", lineHeight: 1.1 }}>{e}</span>
    {label && <span className="tile-lbl">{label}</span>}
  </>
);
const Swatch = ({ c, w = "62%" }) => (
  <span style={{ width: w, aspectRatio: "1", borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 3px rgba(0,0,0,.16)", display: "block" }} />
);
const Objs = ({ n, e }) => (
  <span style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(n, 5)},auto)`, gap: "2px 6px", fontSize: "clamp(1.8rem,7vw,2.6rem)", lineHeight: 1.15 }}>
    {Array.from({ length: n }, (_, k) => <span key={k}>{e}</span>)}
  </span>
);
const QUESTION = <Big color="var(--mui-palette-text-secondary)">?</Big>;

const SHAPES = {
  circle: <circle cx="50" cy="50" r="42" />,
  square: <rect x="12" y="12" width="76" height="76" rx="4" />,
  triangle: <polygon points="50,8 94,90 6,90" />,
  rectangle: <rect x="4" y="26" width="92" height="48" rx="4" />,
  oval: <ellipse cx="50" cy="50" rx="45" ry="30" />,
  star: <polygon points="50,5 61,38 96,38 68,58 79,92 50,72 21,92 32,58 4,38 39,38" />,
  heart: <path d="M50 88C22 68 4 50 4 31A22 22 0 0 1 50 22A22 22 0 0 1 96 31C96 50 78 68 50 88Z" />,
  diamond: <polygon points="50,4 90,50 50,96 10,50" />,
};
const Shape = ({ k, c, w = "60%" }) => (
  <svg viewBox="0 0 100 100" style={{ fill: c, width: w, height: "auto" }} aria-hidden="true">{SHAPES[k]}</svg>
);

/* ---------- content lists ---------- */
const OBJS = [["🥭","mango","mangoes"],["⚽","ball","balls"],["⭐","star","stars"],["🐟","fish","fish"],["🍌","banana","bananas"],["🌸","flower","flowers"],["🚗","car","cars"],["🐞","ladybird","ladybirds"]];
const ABC = [["apple","🍎"],["banana","🍌"],["cat","🐱"],["dog","🐶"],["elephant","🐘"],["fish","🐟"],["goat","🐐"],["hat","👒"],["ice cream","🍦"],["juice","🧃"],["kite","🪁"],["lion","🦁"],["mango","🥭"],["nose","👃"],["orange","🍊"],["pig","🐷"],["queen","👸"],["rabbit","🐰"],["sun","☀️"],["tree","🌳"],["umbrella","☂️"],["van","🚐"],["watermelon","🍉"],["fox","🦊"],["yo-yo","🪀"],["zebra","🦓"]];
const CVC = [["cat","🐱"],["dog","🐶"],["sun","☀️"],["hat","👒"],["pig","🐷"],["bus","🚌"],["cup","☕"],["bed","🛏️"],["hen","🐔"],["fox","🦊"],["box","📦"],["pen","🖊️"]];
const COLOURS = [["red","#e53935"],["blue","#1e66d0"],["yellow","#fdd835"],["green","#2e9d4c"],["orange","#fb8c00"],["purple","#8e44ad"],["pink","#f48fb1"],["brown","#8d5a34"],["black","#1d1d1f"],["white","#ffffff"]];
const ANIMALS = [["cow","🐄","moo"],["dog","🐕","woof woof"],["cat","🐈","meow"],["duck","🦆","quack quack"],["goat","🐐","maa"],["sheep","🐑","baa"],["lion","🦁","roar"],["hen","🐔","cluck cluck"],["pig","🐖","oink oink"],["horse","🐴","neigh"],["frog","🐸","ribbit"],["bee","🐝","buzz"]];
const BODY = [["eyes","👀","These are my eyes. I see with my eyes."],["ears","👂","This is my ear. I hear with my ears."],["nose","👃","This is my nose. I smell with my nose."],["mouth","👄","This is my mouth. I eat with my mouth."],["teeth","🦷","These are my teeth. I brush my teeth."],["tongue","👅","This is my tongue. I taste with my tongue."],["hand","✋","This is my hand. I wave with my hand."],["arm","💪","This is my arm. My arm is strong."],["leg","🦵","This is my leg. I walk with my legs."],["foot","🦶","This is my foot. I stamp my feet."]];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const findAsk = (name, say) => () => ({ visual: QUESTION, word: `Find ${name}`, say: say || `Find ${name}` });

const numItem = (n, i) => ({
  name: words(n),
  tile: () => String(n),
  explore: () => ({ visual: <Big color={crayon(i)}>{n}</Big>, word: cap(words(n)), say: words(n) }),
  ask: findAsk(words(n)),
});

/* ---------- lessons ---------- */
export const LESSONS = [
  { id: "numbers", title: "Numbers 1–20", cols: 5, cover: "123", allLabel: "Count them all",
    items: range(1, 20).map(numItem) },

  { id: "tens", title: "Counting by tens", cols: 5, cover: "10 20", allLabel: "Count them all",
    items: range(10, 100, 10).map(numItem) },

  { id: "count", title: "Count the objects", cols: 5, cover: <span style={{ fontSize: "2.4rem" }}>🥭🥭🥭</span>, allLabel: "Count them all",
    items: range(1, 10).map((n) => ({
      name: words(n),
      tile: () => String(n),
      explore: () => { const o = pick(OBJS); const t = `${words(n)} ${n === 1 ? o[1] : o[2]}`; return { visual: <Objs n={n} e={o[0]} />, word: cap(t), say: t }; },
      ask: () => { const o = pick(OBJS); return { visual: <Objs n={n} e={o[0]} />, word: `How many ${o[2]}?`, say: `Count them. How many ${o[2]}?` }; },
    })) },

  { id: "alphabet", title: "Alphabet A–Z", cols: 6, cover: "Aa Bb",
    items: ABC.map(([w, e], i) => {
      const L = String.fromCharCode(65 + i); const l = L.toLowerCase();
      const line = L === "X" ? "X is in fox" : `${L} is for ${w}`;
      return {
        name: L,
        tile: () => <span>{L}<small style={{ fontSize: ".55em" }}>{l}</small></span>,
        explore: () => ({ visual: <><Big color={crayon(i)}>{L}<small style={{ fontSize: ".6em" }}>{l}</small></Big><Emo e={e} /></>, word: line, say: `${L}. ${line}.` }),
        ask: findAsk(`the letter ${L}`),
      };
    }) },

  { id: "words", title: "Three-letter words", type: "words", cols: 4, cover: "cat", findLabel: "Spell it!",
    items: CVC.map(([w, e]) => ({ name: w, word: w, emoji: e, plain: true, tile: () => <TileEmo e={e} label={w} /> })) },

  { id: "colours", title: "Colours", cols: 5,
    cover: <span style={{ display: "flex", gap: 6 }}>{COLOURS.slice(0, 4).map(([n, c]) => <span key={n} style={{ width: 22, height: 22, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 2px rgba(0,0,0,.15)" }} />)}</span>,
    items: COLOURS.map(([n, c]) => ({
      name: n, plain: true,
      tile: (mode) => <><Swatch c={c} />{mode === "explore" && <span className="tile-lbl">{n}</span>}</>,
      explore: () => ({ visual: <Swatch c={c} w="clamp(100px,28vw,140px)" />, word: cap(n), say: n }),
      ask: findAsk(n, `Find the colour ${n}`),
    })) },

  { id: "shapes", title: "Shapes", cols: 4,
    cover: <span style={{ display: "flex", gap: 6 }}><Shape k="triangle" c="var(--mui-palette-crayon-text)" w={40} /><Shape k="circle" c="var(--mui-palette-crayon-text)" w={40} /></span>,
    items: Object.keys(SHAPES).map((k, i) => ({
      name: k, plain: true,
      tile: (mode) => <><Shape k={k} c={crayon(i)} />{mode === "explore" && <span className="tile-lbl">{k}</span>}</>,
      explore: () => ({ visual: <Shape k={k} c={crayon(i)} w="clamp(100px,28vw,150px)" />, word: cap(k), say: `This is a ${k}` }),
      ask: findAsk(`the ${k}`),
    })) },

  { id: "animals", title: "Animal sounds", cols: 4, cover: <span style={{ fontSize: "2.6rem" }}>🐄</span>,
    items: ANIMALS.map(([n, e, s]) => ({
      name: n, plain: true,
      tile: () => <TileEmo e={e} label={n} />,
      explore: () => ({ visual: <Emo e={e} />, word: `The ${n} says ${s.split(" ")[0]}!`, say: `The ${n} says ${s}!` }),
      ask: () => ({ visual: QUESTION, word: `Who says ${s.split(" ")[0]}?`, say: `Who says ${s}?` }),
    })) },

  { id: "body", title: "My body", cols: 5, cover: <span style={{ fontSize: "2.6rem" }}>👃</span>,
    items: BODY.map(([n, e, s]) => ({
      name: n, plain: true,
      tile: () => <TileEmo e={e} label={n} />,
      explore: () => ({ visual: <Emo e={e} />, word: cap(n), say: `${s} Touch your ${n}!` }),
      ask: findAsk(`the ${n}`),
    })) },

  { id: "days", title: "Days of the week", cols: 4, cover: "Mon", allLabel: "Say the days",
    items: DAYS.map((d, i) => ({
      name: d,
      tile: () => d.slice(0, 3),
      explore: () => ({ visual: <Big color={crayon(i)} size="clamp(3rem,13vw,5.5rem)">{d.slice(0, 3)}</Big>, word: d, say: d }),
      ask: findAsk(d),
    })) },
  { id: "planets", title: "Planets", cols: 4, allLabel: "Planets in order",
    cover: <span style={{ width: 84, display: "block" }}><Planet k="saturn" size="84px" /></span>,
    items: PLANETS.map((p) => ({
      name: p.name, plain: true,
      tile: (mode) => <><Planet k={p.k} size={mode === "explore" ? "64%" : "78%"} />{mode === "explore" && <span className="tile-lbl">{p.name}</span>}</>,
      explore: () => ({ visual: <Planet k={p.k} size="clamp(120px,32vw,170px)" />, word: p.name, say: p.fact }),
      ask: () => ({ visual: QUESTION, word: `Find ${p.name}`, say: `Find ${p.name}, ${p.short}.` }),
    })) },
];

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
