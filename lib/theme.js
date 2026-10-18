"use client";
import { createTheme } from "@mui/material/styles";

import { fonts } from "./tokens";

// Crayon-box palette. Light and dark follow the device setting automatically.
const theme = createTheme({
  cssVariables: { colorSchemeSelector: "media" },
  colorSchemes: {
    light: {
      palette: {
        background: { default: "#fbf7ef", paper: "#ffffff" },
        text: { primary: "#2b2a3d", secondary: "#6e6a80" },
        divider: "#e9e1d1",
        primary: { main: "#2f7fd1" },
        success: { main: "#2f9e5a" },
        crayon: { c1: "#e8553d", c2: "#f2a72b", c3: "#3aa66b", c4: "#2f7fd1", c5: "#9a5bd6", text: "#ffffff" },
        star: { main: "#f5b301", off: "#e9e1d1" },
      },
    },
    dark: {
      palette: {
        background: { default: "#1c1f2e", paper: "#262a3d" },
        text: { primary: "#f4f1ea", secondary: "#a9a7bd" },
        divider: "#363b55",
        primary: { main: "#4f97e6" },
        success: { main: "#4cc47c" },
        crayon: { c1: "#f0705a", c2: "#f4b545", c3: "#4cbf80", c4: "#4f97e6", c5: "#ad78e3", text: "#14161f" },
        star: { main: "#ffc82e", off: "#363b55" },
      },
    },
  },
  shape: { borderRadius: 22 },
  typography: {
    fontFamily: fonts.body,
    fontWeightBold: 800,
    h1: { fontFamily: fonts.display, fontWeight: 800, lineHeight: 0.95 },
    h2: { fontFamily: fonts.display, fontWeight: 800, lineHeight: 1 },
    h3: { fontFamily: fonts.display, fontWeight: 800, lineHeight: 1.1 },
    button: { textTransform: "none", fontWeight: 800 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 18 } } },
  },
});

export default theme;
export { crayon, displayFont } from "./tokens";

