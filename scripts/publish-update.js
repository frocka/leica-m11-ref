// scripts/publish-update.js — build a live-update bundle for the native iOS app.
// Zips dist/ (index.html at root), computes sha256, writes updates/manifest.json
// with an auto-incremented version. Served via raw.githubusercontent.com (CORS *).
//
// Usage: node scripts/publish-update.js [version]   (version defaults to patch bump)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const UPDATES = path.join(ROOT, 'updates');
const MANIFEST = path.join(UPDATES, 'manifest.json');
const BUNDLE_ZIP = path.join(UPDATES, 'bundle.zip');
const RAW_BASE = 'https://raw.githubusercontent.com/frocka/leica-m11-ref/main/updates';

// 1. sync web assets into dist/
execSync('node scripts/sync-web.js', { stdio: 'inherit', cwd: ROOT });

// 2. zip dist/ contents (index.html at root)
fs.rmSync(UPDATES, { recursive: true, force: true });
fs.mkdirSync(UPDATES, { recursive: true });
execSync(`zip -X -r "${BUNDLE_ZIP}" . -x '*.DS_Store'`, { cwd: DIST, stdio: 'pipe' });

// 3. sha256 checksum
const shasum = execSync(`shasum -a 256 "${BUNDLE_ZIP}"`).toString().trim().split(/\s+/)[0];

// 4. version: arg, else patch-bump from existing manifest, else 1.0.1
let version = process.argv[2];
if (!version) {
  let prev = '1.0.0';
  if (fs.existsSync(MANIFEST)) {
    try { prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).version || '1.0.0'; } catch (e) {}
  }
  const [maj, min, pat] = prev.split('.').map(Number);
  version = `${maj}.${min}.${(pat || 0) + 1}`;
}

// 5. write manifest
const manifest = {
  version,
  url: `${RAW_BASE}/bundle.zip`,
  checksum: shasum,
};
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`\nUpdate bundle v${version} published:`);
console.log(`  bundle: ${BUNDLE_ZIP} (${(fs.statSync(BUNDLE_ZIP).size / 1024).toFixed(1)} KB)`);
console.log(`  checksum: ${shasum}`);
console.log(`  manifest: ${MANIFEST}`);
console.log(`\nNext: git add -A && git commit -m "Live update v${version}" && git push`);