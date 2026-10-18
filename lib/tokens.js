// Plain helpers shared by server and client code (no React/MUI imports here).
export const fonts = {
  display: 'var(--font-display), "Trebuchet MS", "Arial Rounded MT Bold", sans-serif',
  body: 'var(--font-body), "Segoe UI", system-ui, sans-serif',
};
export const displayFont = fonts.display;

/** CSS variable for crayon colour n (cycles through 5). Works in style/sx/SVG fill. */
export const crayon = (i) => `var(--mui-palette-crayon-c${(i % 5) + 1})`;
