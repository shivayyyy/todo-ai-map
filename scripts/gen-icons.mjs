import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT = process.argv[2] || "./public";
mkdirSync(OUT, { recursive: true });

// Roadmap tracker icon: a routed path with checkpoints on a dark navy tile.
// Kept geometric so it stays crisp at every size.
const svg = (size, maskable = false) => {
  const padding = maskable ? Math.round(size * 0.14) : Math.round(size * 0.08);
  const inner = size - padding * 2;
  const stroke = Math.round(inner * 0.09);
  const dot = Math.round(inner * 0.11);
  const bg = "#0a0d1a";
  const line = "#6b8eff";
  const highlight = "#e8e6dc";
  // Path viewBox is 0..100 inside the inner area.
  const cx = (x) => padding + (x / 100) * inner;
  const cy = (y) => padding + (y / 100) * inner;
  const pathD = `M ${cx(18)} ${cy(78)}
                 C ${cx(30)} ${cy(78)}, ${cx(34)} ${cy(52)}, ${cx(50)} ${cy(52)}
                 S ${cx(70)} ${cy(28)}, ${cx(82)} ${cy(22)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <path d="${pathD}"
        fill="none"
        stroke="${line}"
        stroke-width="${stroke}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="${stroke * 0.05} ${stroke * 1.6}"/>
  <circle cx="${cx(18)}" cy="${cy(78)}" r="${dot / 1.4}" fill="${line}"/>
  <circle cx="${cx(50)}" cy="${cy(52)}" r="${dot / 1.6}" fill="${line}" opacity="0.65"/>
  <circle cx="${cx(82)}" cy="${cy(22)}" r="${dot}" fill="${highlight}"/>
  <path d="M ${cx(76)} ${cy(22)} L ${cx(81)} ${cy(27)} L ${cx(89)} ${cy(17)}"
        stroke="${bg}"
        stroke-width="${Math.max(2, Math.round(dot * 0.35))}"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>
</svg>`;
};

async function toPng(size, name, maskable = false) {
  const buf = Buffer.from(svg(size, maskable));
  const out = resolve(OUT, name);
  await sharp(buf).png().toFile(out);
  console.log("wrote", out);
}

await toPng(192, "icon-192.png");
await toPng(512, "icon-512.png");
await toPng(512, "icon-maskable-512.png", true);

// Also drop a raw SVG for the manifest (crisp at any size).
writeFileSync(resolve(OUT, "icon.svg"), svg(512));
console.log("wrote", resolve(OUT, "icon.svg"));
