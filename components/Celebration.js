"use client";
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Full-screen "Well done!" with a short burst of crayon confetti.
export default function Celebration({ open, onAgain }) {
  const canvas = useRef(null);

  useEffect(() => {
    if (!open || !canvas.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvas.current, x = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    const cs = getComputedStyle(document.documentElement);
    const pal = [1, 2, 3, 4, 5].map((n) => cs.getPropertyValue(`--mui-palette-crayon-c${n}`).trim() || "#e8553d");
    const parts = Array.from({ length: 130 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
      v: 2 + Math.random() * 4, s: 6 + Math.random() * 8, r: Math.random() * 6, c: pal[Math.floor(Math.random() * 5)],
    }));
    let f = 0, raf;
    const draw = () => {
      x.clearRect(0, 0, c.width, c.height);
      parts.forEach((q) => { q.y += q.v; q.r += 0.1; x.save(); x.translate(q.x, q.y); x.rotate(q.r); x.fillStyle = q.c; x.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); x.restore(); });
      if (++f < 220) raf = requestAnimationFrame(draw); else x.clearRect(0, 0, c.width, c.height);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;
  return (
    <>
      <Box sx={{ position: "fixed", inset: 0, zIndex: 20, display: "grid", placeItems: "center", p: 2.5,
        bgcolor: "color-mix(in srgb, var(--mui-palette-background-default) 82%, transparent)" }}>
        <Box role="dialog" aria-label="Well done" sx={{ bgcolor: "background.paper", border: 3, borderColor: "star.main", borderRadius: "28px",
          px: 4, py: 3.5, textAlign: "center", display: "flex", flexDirection: "column", gap: 1.75, alignItems: "center" }}>
          <Typography variant="h2" sx={{ fontSize: "2.4rem" }}>Well done!</Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>You got 10 stars!</Typography>
          <Button variant="contained" color="success" size="large" disableElevation onClick={onAgain}>Play again</Button>
          <Button component="a" href="/" color="inherit">Back to lessons</Button>
        </Box>
      </Box>
      <canvas ref={canvas} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 21 }} />
    </>
  );
}
