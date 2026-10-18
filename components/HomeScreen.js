"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { LESSONS } from "@/lib/lessons";
import { loadProgress } from "@/lib/progress";
import { crayon, displayFont } from "@/lib/theme";
import StarShape from "./StarShape";

export default function HomeScreen() {
  const [prog, setProg] = useState({});
  useEffect(() => { setProg(loadProgress()); }, []);
  const total = Object.values(prog).reduce((a, b) => a + b, 0);

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 1.5 }}>
        <div>
          <Typography variant="h1" sx={{ fontSize: "clamp(2rem,7vw,3.2rem)", textWrap: "balance" }}>
            Martha&apos;s <Box component="span" sx={{ color: "crayon.c1" }}>Learning Corner</Box>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 700, mt: 0.75, fontSize: "1.05rem" }}>Pick a lesson to play.</Typography>
        </div>
        <Box aria-label="Total stars" sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "background.paper", border: 2, borderColor: "divider", borderRadius: 999, px: 2, py: 1, fontWeight: 800, fontSize: "1.1rem" }}>
          <StarShape /> {total}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(auto-fill,minmax(160px,1fr))" }, gap: { xs: 1.25, sm: 1.75 } }}>
        {LESSONS.map((l, i) => {
          const n = prog[l.id] || 0;
          return (
            // Plain links (full page loads) so every page is served from the offline cache.
            <ButtonBase key={l.id} component="a" href={`/lesson/${l.id}`}
              sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", textAlign: "left", overflow: "hidden",
                bgcolor: "background.paper", border: 2, borderColor: "divider", borderRadius: "24px",
                boxShadow: (t) => `0 5px 0 ${t.vars.palette.divider}`, transition: "transform .12s",
                "&:active": { transform: "translateY(3px)" }, "&:focus-visible": { outline: "4px solid", outlineColor: "text.primary", outlineOffset: 3 } }}>
              <Box sx={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: crayon(i), color: "crayon.text",
                fontFamily: displayFont, fontWeight: 800, fontSize: "2.2rem", lineHeight: 1 }}>
                {l.cover}
              </Box>
              <Box sx={{ px: 1.75, pt: 1.25, pb: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="h3" sx={{ fontSize: "1.1rem" }}>{l.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "text.secondary", fontWeight: 800, fontSize: ".9rem" }}>
                  <StarShape size={15} /> {n} star{n === 1 ? "" : "s"}
                </Box>
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
