"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { getLesson, pick, shuffle } from "@/lib/lessons";
import { queue, speak, stop, canSpeak } from "@/lib/speech";
import { addStar } from "@/lib/progress";
import { crayon, displayFont } from "@/lib/theme";
import StarShape from "./StarShape";
import Celebration from "./Celebration";

const ROUND = 10; // correct answers per game round
const PRAISE = ["Yes!", "Great job!", "Well done!", "You got it!", "Super!"];

function anim(el, cls) {
  if (!el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
}

const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
  </svg>
);

function Tile({ children, color, plain, selected, done, gone, onClick, label }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label={label}
      sx={{
        aspectRatio: "1", minWidth: 0, maxWidth: "100%", p: 0.5, borderRadius: { xs: "16px", sm: "22px" },
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px",
        fontFamily: displayFont, fontWeight: 800, fontSize: "clamp(1.5rem,6.5vw,3rem)", lineHeight: 1,
        fontVariantNumeric: "tabular-nums", position: "relative", transition: "transform .12s",
        visibility: gone ? "hidden" : "visible",
        ...(plain
          ? { bgcolor: "background.paper", color: "text.primary", border: 3, borderColor: "divider", boxShadow: (t) => `0 6px 0 ${t.vars.palette.divider}` }
          : { bgcolor: color, color: "crayon.text", boxShadow: "0 6px 0 rgba(0,0,0,.18)" }),
        outline: selected ? "5px solid" : "none", outlineColor: "text.primary", outlineOffset: 3,
        "&:active": { transform: "translateY(4px)" },
        "&.Mui-focusVisible": { outline: "4px solid", outlineColor: "text.primary", outlineOffset: 3 },
      }}
    >
      {children}
      {done && <StarShape size={16} className="tile-done" />}
    </ButtonBase>
  );
}

export default function LessonScreen({ id }) {
  const L = getLesson(id);
  const isWords = L.type === "words";

  const [mode, setMode] = useState("explore");
  const [spot, setSpot] = useState(null);       // { visual, word }
  const [hint, setHint] = useState("");
  const [sel, setSel] = useState(-1);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [spell, setSpell] = useState(null);     // { idx, word, letters:[{ch,k}], pos, gone:[k] }
  const [hl, setHl] = useState(-1);             // highlighted letter while sounding out (99 = all)
  const [party, setParty] = useState(false);

  const visRef = useRef(null);
  // Mutable game state that timers and speech callbacks read.
  const g = useRef({ cur: 0, lastSay: "", target: -1, ask: null, busy: false, found: new Set(), score: 0, spell: null, epoch: 0 });

  const pop = () => anim(visRef.current, "anim-pop");

  const showItem = useCallback((i) => {
    const it = L.items[i];
    g.current.cur = i;
    setSel(i);
    if (isWords) {
      setSpot({ visual: <span style={{ fontSize: "clamp(3.6rem,14vw,6rem)", lineHeight: 1 }}>{it.emoji}</span>, word: null });
      g.current.lastSay = it.word;
      pop();
      return { say: it.word };
    }
    const ex = it.explore();
    setSpot({ visual: ex.visual, word: ex.word });
    g.current.lastSay = ex.say;
    pop();
    return ex;
  }, [L, isWords]);

  const sayItem = (i) => {
    const it = L.items[i];
    if (isWords) {
      queue(
        [...it.word].map((ch, k) => ({ t: ch.toUpperCase(), rate: 0.7, on: () => setHl(k) }))
          .concat([{ t: it.word, on: () => setHl(99) }]),
        () => setHl(-1)
      );
    } else speak(g.current.lastSay);
  };

  const freshPool = () => {
    const s = g.current;
    let p = L.items.map((_, i) => i).filter((i) => !s.found.has(i) && i !== s.target);
    if (!p.length) { s.found.clear(); setDone(new Set()); p = L.items.map((_, i) => i).filter((i) => i !== s.target); }
    return p;
  };

  const nextTarget = () => {
    const s = g.current;
    s.target = pick(freshPool());
    s.ask = L.items[s.target].ask();
    setSpot({ visual: s.ask.visual, word: s.ask.word });
    setSel(-1);
    setHint("Listen, then tap the answer.");
    pop();
    speak(s.ask.say);
  };

  const nextWord = () => {
    const s = g.current;
    s.target = pick(freshPool());
    const it = L.items[s.target];
    const extra = shuffle("abdefghilmnoprstu".split("").filter((c) => !it.word.includes(c))).slice(0, 3);
    s.spell = { idx: s.target, word: it.word, letters: shuffle([...it.word, ...extra]).map((ch, k) => ({ ch, k })), pos: 0, gone: [] };
    s.ask = { say: `Spell ${it.word}` };
    setSpell({ ...s.spell });
    setSpot({ visual: <span style={{ fontSize: "clamp(3.6rem,14vw,6rem)", lineHeight: 1 }}>{it.emoji}</span>, word: null });
    setHint("Tap the letters in order.");
    pop();
    speak(`Spell ${it.word}`);
  };

  const win = (i, el) => {
    const s = g.current;
    const epoch = s.epoch;
    s.busy = true;
    anim(el, "anim-pop");
    s.found.add(i); setDone(new Set(s.found));
    s.score += 1; setScore(s.score);
    addStar(L.id);
    setHint("Yes! Well done!");
    const ex = isWords ? null : showItem(i);
    speak(`${pick(PRAISE)} ${ex ? ex.say : ""}`);
    setTimeout(() => {
      if (epoch !== g.current.epoch) return;
      s.busy = false;
      if (s.score >= ROUND) { setParty(true); speak("Well done Martha! You got ten stars!"); }
      else isWords ? nextWord() : nextTarget();
    }, isWords ? 2200 : 1800);
  };

  const onTile = (i, e) => {
    const el = e.currentTarget;
    if (mode === "explore") { showItem(i); sayItem(i); return; }
    const s = g.current;
    if (s.busy) return;
    if (i === s.target) win(i, el);
    else {
      anim(el, "anim-wiggle");
      setHint("Oops! Try again.");
      speak(`That is ${L.items[i].name}. Try again. ${s.ask.say}`);
    }
  };

  const onLetter = (letter, e) => {
    const s = g.current, sp = s.spell, el = e.currentTarget;
    if (s.busy || !sp) return;
    if (letter.ch === sp.word[sp.pos]) {
      sp.gone = [...sp.gone, letter.k];
      sp.pos += 1;
      setSpell({ ...sp });
      if (sp.pos < sp.word.length) speak(letter.ch.toUpperCase());
      else {
        s.busy = true;
        const epoch = s.epoch;
        queue([...sp.word].map((c) => ({ t: c.toUpperCase(), rate: 0.75 })).concat([{ t: sp.word }]), () => {
          if (epoch === g.current.epoch) win(sp.idx, null);
        });
      }
    } else {
      anim(el, "anim-wiggle");
      setHint("Not that one. Try again!");
      speak("Try again");
    }
  };

  const startFind = () => {
    const s = g.current;
    s.score = 0; setScore(0); s.found = new Set(); setDone(new Set()); s.target = -1; s.busy = false;
    isWords ? nextWord() : nextTarget();
  };

  const changeMode = (m) => {
    if (!m || m === mode) return;
    const s = g.current;
    s.epoch += 1; s.busy = false;
    stop(); setHl(-1); setParty(false);
    setMode(m);
    if (m === "find") startFind();
    else {
      setSpell(null);
      showItem(s.cur);
      setHint(isWords ? "Tap a picture to hear the word sounded out." : "Tap a picture to hear it.");
    }
  };

  // First render: show the first item (done after mount because some lessons pick random objects).
  useEffect(() => {
    showItem(0);
    setHint(!canSpeak() ? "Tap to see the names. (Sound isn't available on this device.)"
      : isWords ? "Tap a picture to hear the word sounded out." : "Tap a picture to hear it.");
    return () => stop();
  }, [showItem, isWords]);

  const allLabel = L.allLabel || "Say them all";
  const findLabel = L.findLabel || "Find it!";
  const spellingNow = isWords && mode === "find" && spell;

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", display: "flex", flexDirection: "column", gap: 2.25 }}>
      {/* Top bar */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Button component="a" href="/" variant="outlined" color="inherit" sx={{ borderWidth: 2, borderColor: "divider", bgcolor: "background.paper" }}>
            ← Lessons
          </Button>
          <Typography variant="h2" component="h1" sx={{ fontSize: "clamp(1.4rem,5vw,2rem)" }}>{L.title}</Typography>
        </Box>
        <ToggleButtonGroup exclusive value={mode} onChange={(_, m) => changeMode(m)} aria-label="Mode"
          sx={{ bgcolor: "background.paper", border: 2, borderColor: "divider", borderRadius: 999, p: 0.5, gap: 0.5,
            "& .MuiToggleButton-root": { border: 0, borderRadius: "999px !important", px: 2, py: 1, fontWeight: 800, fontSize: "1rem", textTransform: "none", color: "text.secondary" },
            "& .Mui-selected, & .Mui-selected:hover": { bgcolor: "text.primary !important", color: "background.default !important" } }}>
          <ToggleButton value="explore">Explore</ToggleButton>
          <ToggleButton value="find">{findLabel}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Spotlight */}
      <Box component="section" aria-live="polite"
        sx={{ bgcolor: "background.paper", border: 2, borderColor: "divider", borderRadius: "28px", p: { xs: 1.75, sm: "18px 22px" },
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: { xs: 1.5, sm: "16px 26px" }, minHeight: 170 }}>
        <Box ref={visRef} sx={{ flex: "0 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, minWidth: 120, minHeight: 120, maxWidth: "100%" }}>
          {spot?.visual}
        </Box>
        <Box sx={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>
          <Typography variant="h3" component="div" sx={{ fontSize: "clamp(1.6rem,6vw,2.4rem)", textWrap: "balance" }}>
            {spellingNow ? (
              <Box sx={{ display: "flex", gap: 1.25 }}>
                {[...spell.word].map((ch, k) => (
                  <Box key={k} sx={{ width: "clamp(48px,14vw,64px)", height: "clamp(56px,16vw,72px)", borderBottom: 5,
                    borderColor: k === spell.pos ? "primary.main" : "text.secondary", textAlign: "center",
                    fontSize: "clamp(2rem,9vw,3rem)", lineHeight: 1.4, color: "crayon.c3" }}>
                    {k < spell.pos ? ch : ""}
                  </Box>
                ))}
              </Box>
            ) : isWords && mode === "explore" ? (
              [...L.items[g.current.cur].word].map((ch, k) => (
                <Box key={k} component="span" sx={{ display: "inline-block", transition: "transform .15s, color .15s",
                  ...(hl === k || hl === 99 ? { color: "crayon.c1", transform: "scale(1.35) translateY(-3px)" } : {}) }}>{ch}</Box>
              ))
            ) : spot?.word}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>{hint}</Typography>
          {mode === "find" && (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }} aria-label={`${score} of ${ROUND} stars`}>
              {Array.from({ length: ROUND }, (_, k) => (
                <StarShape key={k} size={26} on={k < score} className={k === score - 1 ? "anim-pop" : undefined} />
              ))}
            </Box>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button variant="contained" startIcon={<SpeakerIcon />} disableElevation
              onClick={() => (mode === "find" ? g.current.ask && speak(g.current.ask.say) : sayItem(g.current.cur))}>
              {mode === "find" ? "Hear it again" : "Say it"}
            </Button>
            {mode === "explore" && (
              <Button variant="outlined" color="inherit" sx={{ borderWidth: 2, borderColor: "divider" }}
                onClick={() => queue(L.items.map((it, i) => ({ t: isWords ? it.word : it.name, on: () => showItem(i), gap: 250 })))}>
                {allLabel}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Board */}
      {spellingNow ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: { xs: 1, sm: 1.5 }, maxWidth: 480, width: "100%", mx: "auto" }}>
          {spell.letters.map((lt) => (
            <Tile key={lt.k} color={crayon(lt.k)} gone={spell.gone.includes(lt.k)} label={lt.ch} onClick={(e) => onLetter(lt, e)}>
              {lt.ch}
            </Tile>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${L.cols},1fr)`, gap: { xs: 1, sm: 1.5 } }}>
          {L.items.map((it, i) => (
            <Tile key={i} color={crayon(i)} plain={it.plain} selected={mode === "explore" && sel === i}
              done={mode === "find" && done.has(i)} label={it.name} onClick={(e) => onTile(i, e)}>
              {it.tile(mode)}
            </Tile>
          ))}
        </Box>
      )}

      <Celebration open={party} onAgain={() => { g.current.epoch += 1; setParty(false); startFind(); }} />
    </Box>
  );
}
