// optics.js — DOF / hyperfocal / FOV math for the M11 Monochrom field reference.
// All distances internally in millimetres. CoC in mm. Sensor 36×24 (full frame).

const SENSOR_W = 36;   // mm
const SENSOR_D = 43.27; // diagonal mm

// Circle of confusion presets. 0.030 = standard full-frame; 0.015 ≈ "60MP strict"
// (the 35mm guide's note: at 60MP pixel-level, reduce the zone by ~1 stop).
const COC = { standard: 0.030, strict: 0.015 };

// Hyperfocal distance (mm): H = f²/(N·c) + f
function hyperfocal(focalMm, N, coc = COC.standard) {
  return (focalMm * focalMm) / (N * coc) + focalMm;
}

// Near / far limits (mm) for a subject distance s (mm).
// near = s·H / (H + (s − f));  far = s·H / (H − (s − f)), ∞ if s ≥ H − (s−f) > 0 i.e. s >= H
function dof(focalMm, N, sMm, coc = COC.standard) {
  const H = hyperfocal(focalMm, N, coc);
  const f = focalMm;
  const near = (sMm * H) / (H + (sMm - f));
  const far = sMm >= H ? Infinity : (sMm * H) / (H - (sMm - f));
  return { near, far, zone: far === Infinity ? Infinity : far - near, H };
}

// Horizontal field of view (radians → degrees)
function hfovDeg(focalMm) {
  return 2 * Math.atan(SENSOR_W / (2 * focalMm)) * 180 / Math.PI;
}
function dfovDeg(focalMm) {
  return 2 * Math.atan(SENSOR_D / (2 * focalMm)) * 180 / Math.PI;
}

// Width (m) covered across the frame at subject distance d (m)
function frameWidthM(focalMm, dM) {
  return (dM * SENSOR_W) / focalMm;
}

// Human-readable distance: "0.6m", "18m", "∞"
function fmtM(mm) {
  if (!isFinite(mm)) return '∞';
  const m = mm / 1000;
  if (m >= 100) return '∞';
  if (m >= 10) return Math.round(m) + 'm';
  if (m >= 1) return (Math.round(m * 10) / 10) + 'm';
  return Math.round(m * 100) + 'cm';
}

// Aperture sequence across the kit (union, ascending)
const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

window.Optics = { COC, hyperfocal, dof, hfovDeg, dfovDeg, frameWidthM, fmtM, APERTURES };