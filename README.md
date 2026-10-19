# M11 Monochrom — Field Reference

A go-to PWA for the Leica M11 Monochrom and four lenses, with settings for street,
night, landscape, and portraits across light conditions, plus a lens recommender.
Works offline, installs to your phone home screen.

## The kit

| Lens | Aperture | Filter | Min focus |
|---|---|---|---|
| Thypoch Ksana 21mm f/3.5 ASPH | f/3.5–22 | E39 | 0.5m |
| Thypoch Ksana 35mm f/2 ASPH | f/2–16 | E39 | 0.5m |
| Leica Summilux-M 35mm f/1.4 ASPH | f/1.4–16 | E46 | 0.7m |
| Leica Summilux-M 50mm f/1.4 ASPH | f/1.4–16 | E46 | 0.7m |

## Run locally

Just open `index.html` in a browser. For full PWA features (service worker, install
prompt) a static server is needed:

```bash
cd "/Users/floydrocker/Library/Mobile Documents/com~apple~CloudDocs/Leica App"
python3 -m http.server 8000
# open http://localhost:8000
```

## Get it on your phone

A PWA needs HTTPS (or localhost) to install. Easiest path — GitHub Pages:

1. Push this folder to a GitHub repo (e.g. `leica-m11-ref`).
2. Settings → Pages → deploy from `main` branch.
3. Open the Pages URL on your phone Safari/Chrome → Add to Home Screen.
4. It loads offline after the first visit.

Netlify Drop (drag the folder onto app.netlify.com) works too and gives instant HTTPS.

## Files

- `index.html` — app shell
- `styles.css` — dark monochrome system (matches the 35mm guide)
- `data.js` — lenses, scenarios, conditions, recommender rules
- `optics.js` — DOF / hyperfocal / FOV math
- `app.js` — rendering + interactions
- `sw.js`, `manifest.json`, `icon.svg` — PWA plumbing

## Notes

- DOF uses CoC 0.030mm (standard) by default; toggle "60MP strict" (0.015mm) for
  pixel-level zones ~1 stop tighter.
- The Ksana lenses have no focus tab; the Focus section shows a distance-scale
  reference for them and tab positions for the Leicas. Verify against your barrels.
- The Ksana 35mm is f/2 (not f/1.2) per the Thypoch store.