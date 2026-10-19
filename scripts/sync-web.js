// scripts/sync-web.js — copy the web app files into dist/ for Capacitor to bundle.
// No build step; the app is plain HTML/CSS/JS. dist/ keeps .git/.claude/node_modules/ios out of the native bundle.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const FILES = ['index.html', 'styles.css', 'data.js', 'optics.js', 'app.js', 'icon.svg', 'manifest.json', 'sw.js'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, f));
}
console.log('Synced web assets to dist/:', FILES.join(', '));