// data.js — the four lenses, four scenarios, four light conditions, recommender rules.
// M11 Monochrom: B&W only. Floyd leans into shadows/darks; grain is embraced, not fought.

const LENSES = [
  {
    id: 'ksana21',
    brand: 'Thypoch',
    name: 'Ksana 21mm f/3.5 ASPH',
    short: '21mm',
    focalMm: 21,
    maxAperture: 3.5,
    minAperture: 22,
    apertureStops: [3.5, 5.6, 8, 11, 16, 22],
    filter: 'E39',
    minFocusM: 0.5,
    rfUncoupleM: 0.7, // rangefinder coupling disengages below this
    weight: '131g',
    price: '$549',
    framelines: '21 (external finder)',
    hasFocusTab: true,
    preFocusM: 2.0,
    bestFor: ['Landscape', 'Architecture', 'Tight streets', 'Environmental'],
    flareNote: "Epoch Coating '73 — vintage 1970s-style amber flare. On the Monochrom this renders as warm-bright streaks and ghosts; use it intentionally for mood, not accidentally.",
    monoNote: 'No CA to speak of (ASPH + ED + HRI). Flare is the character trait. Wide 90° diagonal means skies dominate — a red filter dramatizes clouds and deepens shadows.',
    aperture: {
      3.5: { char: 'Soft corners, glow.', when: 'Wide open. Centre sharp, corners dreamy. Vignette strong. Use for mood, not architecture. Flare shows.' },
      5.6: { char: 'Corners improve.', when: 'Landscape and environmental. Still some edge softness. Good dawn/dusk compromise.' },
      8:   { char: 'Peak across field.', when: 'The landscape workhorse. Corner-to-corner sharp. Hyperfocal sweet spot.' },
      11:  { char: 'Deep, still sharp.', when: 'Architecture, hyperfocal. Diffraction barely visible.' },
      16:  { char: 'Max depth, softening.', when: 'Only when you need near-to-far depth on a 60MP file and accept the trade.' },
    },
    focusTab: [
      { pos: 'Hard left',  distM: 0.5, info: 'Min focus. RF uncoupled — use live view. Wide close-up with context.' },
      { pos: '45° left',   distM: 0.7, info: 'RF uncouple point. Close subject + scene.' },
      { pos: 'Dead centre',distM: 1.0, info: 'Full figure + environment.' },
      { pos: '30° right',  distM: 1.5, info: 'Subject + surroundings. Zone begins.' },
      { pos: '45° right',  distM: 2.0, info: 'Environmental wide. Primary zone distance.' },
      { pos: '60° right',  distM: 3.0, info: 'Wide scene. Common pre-focus.' },
      { pos: 'Near stop',  distM: 5.0, info: 'Architecture / wide. Hyperfocal territory.' },
      { pos: 'Hard right', distM: Infinity, info: 'Landscape, cityscape. Tab at the stop.' },
    ],
  },
  {
    id: 'ksana35',
    brand: 'Thypoch',
    name: 'Ksana 35mm f/2 ASPH',
    short: '35 Ksana',
    focalMm: 35,
    maxAperture: 2,
    minAperture: 16,
    apertureStops: [2, 2.8, 4, 5.6, 8, 11, 16],
    filter: 'E39',
    minFocusM: 0.5,
    rfUncoupleM: 0.7,
    weight: '199g',
    price: '$599',
    framelines: '35',
    hasFocusTab: true,
    preFocusM: 3.0,
    bestFor: ['Daytime street', 'Travel', 'Carry-all-day', 'Environmental'],
    flareNote: "Epoch Coating '84 — vintage 1980s gold-and-purple flare. Backlit scenes produce coloured ghosts that on the Monochrom read as bright shapes against shadow.",
    monoNote: 'ASPH + ED + HRI keeps CA low. The compact daytime 35: light, unobtrusive, vintage flare character. f/2 tops out — for dark streets switch to the Summilux.',
    aperture: {
      2:   { char: 'Soft glow, vignette.', when: 'Available light, mood. Centre sharp, corners soft. Flare shows backlit. Daytime overcast portrait-adjacent.' },
      2.8: { char: 'Sharp, even.', when: 'Overcast street, golden hour. Corners catch up. Versatile.' },
      4:   { char: 'Peak begins.', when: 'Golden hour, shade, general daylight. Zone focus practical.' },
      5.6: { char: 'Optimal.', when: 'Bright overcast street. Edge-to-edge. Forgiving zone.' },
      8:   { char: 'Workhorse.', when: 'Full sun street, architecture. Nearly everything sharp.' },
      11:  { char: 'Max depth.', when: 'Hyperfocal, landscape. Diffraction starts at pixel level.' },
    },
    focusTab: [
      { pos: 'Hard left',  distM: 0.5, info: 'Min focus. RF uncoupled — use live view. Tight close-up.' },
      { pos: '45° left',   distM: 0.7, info: 'RF uncouple point. Tight face crop.' },
      { pos: 'Dead centre',distM: 1.0, info: 'Head and shoulders. Intimate.' },
      { pos: '30° right',  distM: 1.5, info: 'Half body. Natural portrait distance.' },
      { pos: '45° right',  distM: 2.0, info: '¾ body. Zone focus sweet spot.' },
      { pos: '60° right',  distM: 3.0, info: 'Full body + context. Most common pre-focus.' },
      { pos: 'Near stop',  distM: 5.0, info: 'Small group / scene. Hyperfocal at f/8.' },
      { pos: 'Hard right', distM: Infinity, info: 'Wide scene, landscape. Tab at the stop.' },
    ],
  },
  {
    id: 'summilux35',
    brand: 'Leica',
    name: 'Summilux-M 35mm f/1.4 ASPH',
    short: '35 Lux',
    focalMm: 35,
    maxAperture: 1.4,
    minAperture: 16,
    apertureStops: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16],
    filter: 'E46',
    minFocusM: 0.7,
    weight: '320g',
    price: '~$5,795',
    framelines: '35',
    hasFocusTab: true,
    preFocusM: 3.0,
    bestFor: ['Night street', 'Low light', 'Portrait', 'Mood'],
    flareNote: 'Classic Summilux flare — a defined ghosting pattern wide open. Less vintage-colour than the Ksana; more controlled, still present backlit.',
    monoNote: 'Not APO — some CA wide open shows as luminance softness on the Monochrom at 100%. The trade is the f/1.4 look: glow, vignette, isolation. Beautiful grain adjacency in the shadows.',
    aperture: {
      1.4: { char: 'Dreamy. Vignettes. Glow.', when: 'Night, portraits, mood. Centre sharp, soft corner. Natural vignette draws the eye in. Spherical-aberration glow on highlights.' },
      2:   { char: 'Sharp. Clean. Versatile.', when: 'Night street, available light. Excellent sharpness. Vignetting reduced. Smooth bokeh.' },
      2.8: { char: 'Very sharp. Even.', when: 'Twilight, indoor, environmental. Corners arrive. Still isolates subject.' },
      4:   { char: 'Peak sharpness begins.', when: 'Golden hour, shade. Max micro-contrast. Zone focus practical.' },
      5.6: { char: 'Optimal. Edge to edge.', when: 'Bright overcast, general street. Razor corner-to-corner.' },
      8:   { char: 'Deep. Forgiving.', when: 'Full sun street, architecture, zone focus workhorse.' },
      11:  { char: 'Maximum depth.', when: 'Hyperfocal, landscape. Diffraction starts on 60MP — prefer f/8.' },
    },
    focusTab: [
      { pos: 'Hard left',  distM: 0.7, info: 'Min focus. Tab at the stop. Tight face crop.' },
      { pos: '45° left',   distM: 0.9, info: 'Head and shoulders. Intimate.' },
      { pos: 'Dead centre',distM: 1.2, info: "Arm's length. Half body. Close street distance." },
      { pos: '30° right',  distM: 2.0, info: 'One big step. Full body. Primary zone distance.' },
      { pos: '45° right',  distM: 3.0, info: 'Two steps. Environmental. Most common pre-focus.' },
      { pos: '60° right',  distM: 5.0, info: 'Small group. Hyperfocal at f/8 → 2.5m–∞.' },
      { pos: 'Hard right', distM: Infinity, info: 'Landscape, distant subjects. Tab at the stop.' },
    ],
  },
  {
    id: 'summilux50',
    brand: 'Leica',
    name: 'Summilux-M 50mm f/1.4 ASPH',
    short: '50 Lux',
    focalMm: 50,
    maxAperture: 1.4,
    minAperture: 16,
    apertureStops: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16],
    filter: 'E46',
    minFocusM: 0.7,
    weight: '335g',
    price: '~$3,995',
    framelines: '50',
    hasFocusTab: true,
    preFocusM: 3.0,
    bestFor: ['Portrait', 'Compression', 'Low light', 'Isolation'],
    flareNote: 'Controlled for a Summilux; mild ghosting wide open backlit. Resistant to veiling compared to older 50mm designs.',
    monoNote: 'The portrait lens. Compression flatters faces; f/1.4 isolates a face from the street. CA wide open is mild — cleans up by f/2. Shallow DOF on 60MP demands precise focus.',
    aperture: {
      1.4: { char: 'Isolation. Glow.', when: 'Portrait, low light. Razor-thin DOF — eye-critical. Vignette adds focus. Beautiful shadow falloff.' },
      2:   { char: 'Sharp, still soft.', when: 'Portrait, indoor. Sharpness climbs; DOF still tight. Clean up CA.' },
      2.8: { char: 'Crisp. Classic.', when: 'Portrait in good light, street detail. Corners arrive.' },
      4:   { char: 'Peak.', when: 'Environmental portrait, street. Micro-contrast max.' },
      5.6: { char: 'Optimal.', when: 'Street, general. Edge-to-edge. Zone focus practical.' },
      8:   { char: 'Workhorse.', when: 'Street in sun, detail shots. Deep zone.' },
      11:  { char: 'Max depth.', when: 'Hyperfocal, architecture detail. Prefer f/8 on 60MP.' },
    },
    focusTab: [
      { pos: 'Hard left',  distM: 0.7, info: 'Min focus. Tight head crop.' },
      { pos: '45° left',   distM: 0.9, info: 'Head and shoulders portrait.' },
      { pos: 'Dead centre',distM: 1.2, info: 'Half body. Close portrait.' },
      { pos: '30° right',  distM: 2.0, info: 'Full body / ¾. Street distance.' },
      { pos: '45° right',  distM: 3.0, info: 'Environmental portrait, street scene.' },
      { pos: '60° right',  distM: 5.0, info: 'Small scene. Hyperfocal at f/8.' },
      { pos: 'Hard right', distM: Infinity, info: 'Distant detail, landscape crop.' },
    ],
  },
];

// Light conditions — EV offset and ISO/shutter guidance modifiers applied to a scenario base.
// EV offsets are relative to the scenario's base EV (which assumes a mid-reference light).
const CONDITIONS = [
  { id: 'midday',      name: 'Midday Sun',     evOffset: 0,    isoNote: 'ISO 125–400',   shutterNote: '≥1/500',   note: 'Hard light, deep shadows. Embrace the contrast; meter for highlights.' },
  { id: 'goldenhour',  name: 'Golden Hour',    evOffset: -0.7, isoNote: 'ISO 400–1600',  shutterNote: '≥1/250',   note: 'Warm directional light. Long shadows — the Monochrom sweet spot.' },
  { id: 'earlymorning',name: 'Early Morning',  evOffset: -1.3, isoNote: 'ISO 800–3200',  shutterNote: '≥1/125',   note: 'Cool, low, misty. Lift shadows slightly in metering; grain is part of it.' },
  { id: 'darknight',   name: 'Dark Night',     evOffset: -3.0, isoNote: 'ISO 3200–12500',shutterNote: '≥1/60',    note: 'Embrace the dark. Underexpose −0.7 to −1.0 to protect highlights; grain is the look.' },
];

// Scenarios — curated per-lens settings. Each cell: aperture, iso, ev, focus, shutter, filter, extra.
const SCENARIOS = [
  {
    id: 'street', name: 'Street', note: 'The 90% case. Zone focus, set-and-forget, shoot from the hip.',
    lenses: {
      ksana21:     { aperture: 'f/8',     iso: 'Auto ≤6400', ev: '−0.7', focus: 'Zone 2m / Hyperfocal', shutter: '≥1/500', filter: 'Orange', extra: 'Wide scene; crop in post from 60MP.' },
      ksana35:     { aperture: 'f/8',     iso: 'Auto ≤6400', ev: '−0.7', focus: 'Zone 3m', shutter: '≥1/250', filter: 'Orange', extra: 'The set-and-forget daytime config.' },
      summilux35:  { aperture: 'f/8',     iso: 'Auto ≤6400', ev: '−0.7', focus: 'Zone 3m', shutter: '≥1/250', filter: 'Orange', extra: 'When the Lux is already mounted; same zone logic.' },
      summilux50:  { aperture: 'f/5.6',   iso: 'Auto ≤6400', ev: '−0.7', focus: 'Zone 3m', shutter: '≥1/500', filter: 'Orange', extra: 'Tighter framing; zone at 3m, crop-friendly.' },
    },
  },
  {
    id: 'night', name: 'Night', note: 'Open up, push ISO, zone focus tighter. Grain is beautiful — do not fight it.',
    lenses: {
      ksana21:     { aperture: 'f/3.5',   iso: '3200–12500', ev: '−1.0', focus: 'Hyperfocal ~2.5m', shutter: '≥1/60', filter: 'None', extra: 'f/3.5 limits you — steady hands or brace. Wide night scenes only.' },
      ksana35:     { aperture: 'f/2',     iso: '3200–12500', ev: '−0.7', focus: 'Zone 2–3m', shutter: '≥1/60', filter: 'None', extra: 'Wide-open Ksana. Accept the glow and vignette as mood.' },
      summilux35:  { aperture: 'f/2',     iso: '3200–12500', ev: '−0.7', focus: 'Zone 2–3m', shutter: '≥1/60', filter: 'None', extra: 'The night street lens. f/2 when you need zone; f/1.4 for a single subject.' },
      summilux50:  { aperture: 'f/2',     iso: '3200–12500', ev: '−0.7', focus: 'Rangefinder', shutter: '≥1/60', filter: 'None', extra: 'Isolate a subject from night lights; DOF tight, focus carefully.' },
    },
  },
  {
    id: 'landscape', name: 'Landscape', note: 'Sharp corner to corner. Hyperfocal. Filter for sky drama.',
    lenses: {
      ksana21:     { aperture: 'f/8',     iso: '125', ev: '−0.7', focus: 'Hyperfocal ~1.5m', shutter: '1/250+', filter: 'Red', extra: 'The wide landscape lens. Sky dominates — red filter deepens clouds.' },
      ksana35:     { aperture: 'f/8',     iso: '125', ev: '−0.7', focus: 'Hyperfocal 5.1m', shutter: '1/250+', filter: 'Red', extra: 'Tighter landscape; near-far compositions.' },
      summilux35:  { aperture: 'f/8',     iso: '125', ev: '−0.7', focus: 'Hyperfocal 5.1m', shutter: '1/250+', filter: 'Red', extra: 'Dawn/dusk landscape when light is low — open to f/2.8 or f/4.' },
      summilux50:  { aperture: 'f/8',     iso: '125', ev: '−0.7', focus: 'Hyperfocal ~7.3m', shutter: '1/250+', filter: 'Red', extra: 'Landscape detail, compressed layers.' },
    },
  },
  {
    id: 'portrait', name: 'Portrait', note: 'Subject isolation and compression. Meter for the face; protect highlights.',
    lenses: {
      ksana21:     { aperture: 'f/3.5',   iso: 'Auto ≤6400', ev: '0', focus: 'Live view 0.5m', shutter: '≥1/125', filter: 'Orange', extra: 'Environmental only — distortion up close. Step back, include context.' },
      ksana35:     { aperture: 'f/2',     iso: 'Auto ≤6400', ev: '0', focus: 'Rangefinder', shutter: '≥1/125', filter: 'Orange', extra: 'Environmental portrait; context over compression.' },
      summilux35:  { aperture: 'f/2',     iso: 'Auto ≤6400', ev: '0 to +0.3', focus: 'Rangefinder', shutter: '≥1/125', filter: 'Orange', extra: 'Environmental portrait with mood; f/1.4 to isolate.' },
      summilux50:  { aperture: 'f/2',     iso: 'Auto ≤6400', ev: '0', focus: 'Rangefinder', shutter: '≥1/125', filter: 'Orange', extra: 'The portrait lens. f/1.4 for a single face; f/2.8 for a couple.' },
    },
  },
];

// Recommender — pick the best lens for scenario + condition, with a runner-up.
// Rules expressed as an ordered preference per (scenario, condition-bucket).
// Condition bucket: daylight = midday|goldenhour|earlymorning; dark = darknight.
function recommend(scenarioId, conditionId) {
  const dark = conditionId === 'darknight';
  const lowlight = conditionId === 'earlymorning' || conditionId === 'darknight';

  const rules = {
    street: dark
      ? { pick: 'summilux35', runnerUp: 'ksana35', why: 'Dark streets need speed — the Summilux 35 f/1.4 zone-focuses in light the Ksana f/2 cannot reach.' }
      : { pick: 'ksana35', runnerUp: 'summilux35', why: 'Compact, unobtrusive daytime 35. The Lux stays home unless you want its wide-open character.' },
    night: { pick: 'summilux35', runnerUp: 'summilux50', why: 'f/1.4 + 35mm framing is the night-street default. 50mm if you want to isolate a single subject from the lights.' },
    landscape: lowlight
      ? { pick: 'summilux35', runnerUp: 'ksana21', why: 'Low light rules out the f/3.5 21mm; the 35 f/1.4 opens up for dawn/dusk. Bring the 21mm if you can brace for a long exposure.' }
      : { pick: 'ksana21', runnerUp: 'ksana35', why: '90° wide, sharp at f/8, red-filter sky drama. 35mm if the scene is tighter or near-far layered.' },
    portrait: { pick: 'summilux50', runnerUp: 'summilux35', why: '50mm compression flatters a face; f/1.4 isolates it from the street. 35mm for environmental portraits with context.' },
  };
  const r = rules[scenarioId];
  const pick = LENSES.find(l => l.id === r.pick);
  const runnerUp = LENSES.find(l => l.id === r.runnerUp);
  // Starting settings = the scenario's curated cell for the picked lens, condition-adjusted.
  return { pick, runnerUp, why: r.why };
}

window.Data = { LENSES, CONDITIONS, SCENARIOS, recommend };