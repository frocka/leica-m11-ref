// scripts/generate-sources.js — rasterize the SVG icon + build a splash source PNG
// for @capacitor/assets to expand into all iOS icon/splash sizes.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

const iconSvg = fs.readFileSync(path.join(ROOT, 'icon.svg'));

// Splash: dark bg, centered lens glyph, "M11 MONOCHROM" wordmark.
const SPLASH = 2732;
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SPLASH}" height="${SPLASH}" viewBox="0 0 ${SPLASH} ${SPLASH}">
  <rect width="${SPLASH}" height="${SPLASH}" fill="#090b0e"/>
  <g transform="translate(${SPLASH/2} ${SPLASH/2 - 120})">
    <circle r="520" fill="none" stroke="#dde4ea" stroke-width="46"/>
    <circle r="380" fill="none" stroke="#4890d8" stroke-width="32"/>
    <circle r="240" fill="#111418" stroke="#668" stroke-width="20"/>
    <circle r="116" fill="#090b0e" stroke="#d09830" stroke-width="14"/>
  </g>
  <text x="${SPLASH/2}" y="${SPLASH/2 + 520}" font-family="monospace" font-size="86" fill="#668" text-anchor="middle" letter-spacing="18">M11 MONOCHROM</text>
</svg>`;

(async () => {
  await sharp(iconSvg).resize(1024, 1024).png().toFile(path.join(ASSETS, 'icon.png'));
  await sharp(Buffer.from(splashSvg)).png().toFile(path.join(ASSETS, 'splash.png'));
  console.log('Generated assets/icon.png (1024) and assets/splash.png (2732)');
})();