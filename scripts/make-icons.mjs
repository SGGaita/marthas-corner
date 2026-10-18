// Regenerates the PNG app icons from public/icons/icon.svg.  Run: npm run icons
// (uses `sharp`, which ships with Next.js).
import sharp from "sharp";
const src = "public/icons/icon.svg";
const out = (n) => `public/icons/${n}`;
await sharp(src).resize(192, 192).png().toFile(out("icon-192.png"));
await sharp(src).resize(512, 512).png().toFile(out("icon-512.png"));
await sharp(src).resize(180, 180).flatten({ background: "#fbf7ef" }).png().toFile(out("apple-touch-icon.png"));
// Maskable: shrink the artwork into the safe zone on a solid background.
const inner = await sharp(src).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#fbf7ef" } })
  .composite([{ input: inner, gravity: "center" }]).png().toFile(out("icon-maskable-512.png"));
console.log("icons written");
