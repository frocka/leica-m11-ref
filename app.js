// app.js — renders the field reference from data.js + optics.js.
(function () {
  'use strict';
  const { LENSES, CONDITIONS, SCENARIOS, recommend } = window.Data;
  const O = window.Optics;

  // ---- state ----
  let activeLensId = localStorage.getItem('leica.activeLens') || 'summilux35';
  let cocMode = localStorage.getItem('leica.coc') === 'strict' ? O.COC.strict : O.COC.standard;
  let activeConditionId = localStorage.getItem('leica.condition') || 'goldenhour';

  const lens = () => LENSES.find(l => l.id === activeLensId);
  const fstop = n => (n % 1 === 0 ? 'f/' + n : 'f/' + n);

  // ---- framing labels per focal length (curated; widths computed) ----
  const FRAMING = {
    21: [
      [0.5, 'Tight context', 'Min focus (Ksana). Subject + immediate surrounds. Slight wide distortion.'],
      [0.7, 'Close + scene', 'Subject dominant, environment still included. RF uncouple point.'],
      [1.0, 'Full figure + env', 'Whole person in their setting.'],
      [1.5, 'Subject + surroundings', 'Environmental. Two people + context.'],
      [2.0, 'Environmental wide', 'Wide scene with a clear subject.'],
      [3.0, 'Wide scene', 'Street-wide. Group + architecture.'],
      [5.0, 'Architecture / wide', 'Building facade, large scene.'],
      [10, 'Landscape sweep', 'Wide landscape, cityscape.'],
    ],
    35: [
      [0.5, 'Tight face crop', 'Min focus (Ksana only). Extreme close-up, distortion. RF uncoupled.'],
      [0.7, 'Tight face crop', 'Extreme close-up. Slight perspective distortion — editorial.'],
      [1.0, 'Head and shoulders', 'Intimate portrait. Slight wide-angle energy.'],
      [1.5, 'Half body', 'Waist-up. Natural portrait distance. Minimal distortion.'],
      [2.0, '¾ body', 'Classic street distance. Zone focus sweet spot.'],
      [3.0, 'Full body + context', 'Environmental. Two people side by side. Prime zone distance.'],
      [5.0, 'Small group / scene', 'Street scene, 3–4 people. Hyperfocal territory at f/8.'],
      [10, 'Wide scene', 'Street-wide view, building facade.'],
    ],
    50: [
      [0.7, 'Tight head crop', 'Close portrait. Compression flatters; thin DOF.'],
      [1.0, 'Head and shoulders', 'Classic portrait. Clean separation.'],
      [1.5, 'Half body', 'Portrait with context.'],
      [2.0, '¾ body', 'Full street distance. Zone focus.'],
      [3.0, 'Full body + context', 'Environmental portrait, compressed layers.'],
      [5.0, 'Small scene', 'Scene crop. Hyperfocal at f/8.'],
      [10, 'Detail / compressed', 'Distant detail, layered compression.'],
    ],
  };

  // ---- LENS SWITCHER ----
  function renderLensSwitch() {
    const el = document.getElementById('lensSwitch');
    el.innerHTML = LENSES.map(l => `
      <div class="lens-chip ${l.id === activeLensId ? 'active' : ''}" data-id="${l.id}">
        <div class="lc-brand">${l.brand}</div>
        <div class="lc-name">${l.short}</div>
        <div class="lc-meta">${l.focalMm}mm · ${fstop(l.maxAperture)} · ${l.filter}</div>
      </div>`).join('');
    el.querySelectorAll('.lens-chip').forEach(c => {
      c.onclick = () => { activeLensId = c.dataset.id; localStorage.setItem('leica.activeLens', activeLensId); renderAll(); };
    });
  }

  // ---- AT A GLANCE ----
  function renderSpecs() {
    const l = lens();
    document.getElementById('specsContext').textContent =
      `${l.brand} ${l.name} · ${l.focalMm}mm · ${fstop(l.maxAperture)}–${fstop(l.minAperture)} · ${l.filter} · ${l.weight}`;
    const h8 = O.hyperfocal(l.focalMm, 8, cocMode) / 1000;
    const half = h8 / 2;
    document.getElementById('heroStats').innerHTML = [
      ['Field of View', O.dfovDeg(l.focalMm).toFixed(0) + '°', 'Diagonal, full frame', 'var(--blue)'],
      ['Hyperfocal (f/8)', h8 >= 100 ? '∞' : (Math.round(h8 * 10) / 10) + 'm', `Sharp from ${(Math.round(half * 10) / 10)}m to ∞`, 'var(--green)'],
      ['Min Focus', l.minFocusM + 'm', l.rfUncoupleM ? `RF uncouples <${l.rfUncoupleM}m` : '', 'var(--amber)'],
      ['Framelines', l.framelines, '', 'var(--white)'],
      ['Filter', l.filter, 'Thread', 'var(--cyan)'],
      ['Weight', l.weight, l.brand, 'var(--light)'],
    ].map(([lab, val, note, col]) => `
      <div class="hero-stat"><div class="hs-l">${lab}</div><div class="hs-v" style="color:${col}">${val}</div><div class="hs-n">${note}</div></div>`).join('');

    const mono = document.getElementById('monoNote');
    mono.innerHTML = `<p><strong>On the Monochrom:</strong> ${l.monoNote}</p>`;
    const flare = document.getElementById('flareNote');
    flare.innerHTML = `<p><strong>Flare character:</strong> ${l.flareNote}</p>`;
  }

  // ---- DISTANCE & FRAMING ----
  function renderDistance() {
    const l = lens();
    const rows = FRAMING[l.focalMm] || FRAMING[35];
    const distGrid = document.getElementById('distGrid');
    let html = `<div class="dist-row dist-head"><div>Distance</div><div>Width Covered</div><div>Framing</div><div>Use Case</div></div>`;
    rows.forEach(([d, framing, use]) => {
      const w = O.frameWidthM(l.focalMm, d);
      const wStr = w >= 10 ? Math.round(w) + 'm' : (Math.round(w * 10) / 10) + 'm';
      const showDist = d === Infinity ? '∞' : (d < 1 ? Math.round(d * 100) + 'cm' : d + 'm');
      html += `<div class="dist-row">
        <div class="dv dist">${showDist}</div>
        <div class="dv frame">~${wStr}</div>
        <div>${framing}</div>
        <div>${use}</div></div>`;
    });
    distGrid.innerHTML = html;
    document.getElementById('distTip').innerHTML =
      `<strong>The ${l.focalMm}mm rule of thumb:</strong> At ${l.focalMm === 21 ? 'two steps (~3m)' : l.focalMm === 50 ? "arm's length (~1m)' it covers a face; at two steps (~3m) a full body" : "arm's length (~1m) it covers a doorway; at two big steps (~3m) a car's length"}, the frame covers roughly ${O.frameWidthM(l.focalMm, 3).toFixed(1)}m. Learn to estimate distance by paces and you can zone focus without thinking.`;
  }

  // ---- DOF TABLE ----
  function renderDOF() {
    const l = lens();
    document.getElementById('dofTitle').textContent = `${l.focalMm}mm Depth of Field at Every Aperture`;
    document.getElementById('dofDesc').textContent =
      `Focused at ${l.preFocusM}m — the versatile pre-focus distance for this focal length. CoC ${(cocMode * 1000).toFixed(1)}µm${cocMode === O.COC.strict ? ' (60MP strict — zones ~1 stop tighter)' : ' (standard full-frame)'}.`;

    let html = `<div class="dof-row dof-head"><div>f/stop</div><div>Near</div><div>Far</div><div>Zone</div><div>Best For</div></div>`;
    l.apertureStops.forEach(N => {
      const r = O.dof(l.focalMm, N, l.preFocusM * 1000, cocMode);
      const best = bestFor(l, N);
      html += `<div class="dof-row">
        <div class="dof-v ap">${fstop(N)}</div>
        <div class="dof-v near">${O.fmtM(r.near)}</div>
        <div class="dof-v far">${O.fmtM(r.far)}</div>
        <div class="dof-v zone">${r.zone === Infinity ? '∞' : O.fmtM(r.zone)}</div>
        <div>${best}</div></div>`;
    });
    document.getElementById('dofGrid').innerHTML = html;

    // hyperfocal cheat
    const hyperAp = l.apertureStops.filter(N => [5.6, 8, 11, 16].includes(N));
    document.getElementById('hyperGrid').innerHTML = hyperAp.map(N => {
      const H = O.hyperfocal(l.focalMm, N, cocMode) / 1000;
      const half = H / 2;
      return `<div class="ci"><div class="ci-l">${fstop(N)}</div><div class="ci-v" style="color:var(--amber)">${H >= 100 ? '∞' : (Math.round(H * 10) / 10) + 'm'}</div><div class="ci-l" style="margin-top:4px">→ ${(Math.round(half * 10) / 10)}m to ∞</div></div>`;
    }).join('');
  }

  function bestFor(l, N) {
    if (N <= 2) return l.focalMm <= 35 ? 'Low light, mood. Not for zone — rangefinder or live view.' : 'Portrait, isolation. Rangefinder.';
    if (N <= 2.8) return 'Low light street. Tight zone — good distance judgment.';
    if (N <= 4) return 'Overcast, golden hour. Comfortable zone.';
    if (N <= 5.6) return 'General daylight. Very forgiving zone.';
    if (N <= 8) return 'Bright daylight. Nearly everything sharp. The workhorse.';
    return 'Full sun. Everything sharp. Diffraction starts — avoid wide open of range.';
  }

  // ---- APERTURE CHARACTER ----
  function renderAperture() {
    const l = lens();
    document.getElementById('apDesc').textContent =
      `How the ${l.name} renders at each stop. Sharpness, flare, vignette — and how it reads on a 60MP monochrome sensor.`;
    document.getElementById('apGrid').innerHTML = l.apertureStops.map(N => {
      const a = l.aperture[N];
      if (!a) return '';
      return `<div class="ap-card">
        <div class="ap-val">${fstop(N)}</div>
        <div class="ap-char">${a.char}</div>
        <div class="ap-when">${a.when}</div>
      </div>`;
    }).join('');
  }

  // ---- FOCUS BY FEEL ----
  function renderFocus() {
    const l = lens();
    const title = document.getElementById('focusTitle');
    const desc = document.getElementById('focusDesc');
    const vis = document.getElementById('focusVisual');
    const tip = document.getElementById('focusTip');

    if (l.hasFocusTab && l.focusTab) {
      title.textContent = 'The Focus Tab Positions';
      desc.textContent = `The metal focus tab on the ${l.short} lets you set distance without looking. Learn these by touch and you can zone focus from the hip.`;
      vis.innerHTML = l.focusTab.map(t => `
        <div class="tab-row">
          <div class="tab-pos">${t.pos}</div>
          <div class="tab-info"><strong>${t.distM === Infinity ? '∞' : '~' + t.distM + 'm'}</strong> — ${t.info}</div>
        </div>`).join('');
      tip.innerHTML = `<p><strong>Practice drill:</strong> Close your eyes. Set the tab to 3m by feel. Open and check. Repeat until you hit it within 10cm every time. Then 2m. Then 5m. This is the muscle memory that makes zone focusing instinctive.</p>`;
    } else {
      title.textContent = 'Distance Scale by Feel';
      desc.textContent = `The ${l.short} has no focus tab. Use the distance scale on the barrel — learn these distances by the barrel's rotation feel and you can zone focus without the rangefinder. (Rangefinder coupling uncouples below ${l.rfUncoupleM}m.)`;
      const ds = [
        ['0.5m', 'Min focus. RF uncoupled — use live view.'],
        ['0.7m', 'RF uncouple point. Close subject.'],
        ['1m', 'Head and shoulders / close subject.'],
        ['1.5m', 'Half body.'],
        ['2m', 'Full body. Primary zone distance.'],
        ['3m', 'Environmental. Most common pre-focus.'],
        ['5m', 'Small group / scene.'],
        ['∞', 'Landscape, architecture, distant subjects.'],
      ];
      vis.innerHTML = ds.map(([p, info]) => `
        <div class="tab-row"><div class="tab-pos">${p}</div><div class="tab-info">${info}</div></div>`).join('');
      tip.innerHTML = `<p><strong>No tab, no problem:</strong> Feel the barrel's rotation from ∞ to 3m. That arc is your zone-focus reference. Most ${l.focalMm}mm ${l.brand} shooting lives between 2m and ∞.</p>`;
    }
  }

  // ---- SCENARIOS × CONDITIONS ----
  function renderScenarios() {
    // condition dial
    const dial = document.getElementById('condDial');
    dial.innerHTML = CONDITIONS.map(c => `
      <button class="cond-btn ${c.id === activeConditionId ? 'active' : ''}" data-id="${c.id}">${c.name}</button>`).join('');
    dial.querySelectorAll('.cond-btn').forEach(b => {
      b.onclick = () => { activeConditionId = b.dataset.id; localStorage.setItem('leica.condition', activeConditionId); renderScenarios(); };
    });
    const cond = CONDITIONS.find(c => c.id === activeConditionId);
    document.getElementById('condNote').textContent = cond.note + ` (EV ${cond.evOffset >= 0 ? '+' : ''}${cond.evOffset} · ${cond.isoNote} · ${cond.shutterNote})`;

    // scenarios
    document.getElementById('sceneGrid').innerHTML = SCENARIOS.map((s, i) => {
      const open = i === 0 ? ' open' : '';
      const lensTabs = LENSES.map(l => `
        <span class="scene-lens-tab ${l.id === activeLensId ? 'active' : ''}" data-lens="${l.id}" data-scene="${s.id}">${l.short}</span>`).join('');
      const cell = s.lenses[activeLensId];
      const settings = applyCondition(cell, cond);
      return `<div class="scene${open}" id="scene-${s.id}">
        <div class="scene-top" onclick="toggleScene(this)">
          <span class="scene-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="scene-name">${s.name}</span>
          <span class="scene-toggle">▾</span>
        </div>
        <div class="scene-body">
          <div class="scene-note">${s.note}</div>
          <div class="scene-lens-tabs">${lensTabs}</div>
          <div class="sg">
            <div class="sc ap"><div class="sc-l">Aperture</div><div class="sc-v">${settings.aperture}</div></div>
            <div class="sc iso"><div class="sc-l">ISO</div><div class="sc-v">${settings.iso}</div></div>
            <div class="sc ev"><div class="sc-l">EV</div><div class="sc-v">${settings.ev}</div></div>
            <div class="sc fo"><div class="sc-l">Focus</div><div class="sc-v">${settings.focus}</div></div>
            <div class="sc"><div class="sc-l">Shutter</div><div class="sc-v">${settings.shutter}</div></div>
            <div class="sc"><div class="sc-l">Filter</div><div class="sc-v" style="color:var(--warm)">${settings.filter}</div></div>
            <div class="sc" style="grid-column:1/-1"><div class="sc-l">Notes</div><div class="sc-n">${settings.extra}</div></div>
          </div>
        </div>
      </div>`;
    }).join('');

    // lens tab switching inside a scenario
    document.querySelectorAll('.scene-lens-tab').forEach(t => {
      t.onclick = (e) => {
        e.stopPropagation();
        activeLensId = t.dataset.lens;
        localStorage.setItem('leica.activeLens', activeLensId);
        renderAll();
      };
    });
  }

  // condition adjusts ISO + shutter + EV from the curated base
  function applyCondition(cell, cond) {
    const out = Object.assign({}, cell);
    if (cond.id !== 'midday') {
      out.iso = cond.isoNote;
      out.shutter = cond.shutterNote;
    }
    // fold ev offset into the displayed EV (base already includes a typical offset)
    const baseEv = parseFloat(cell.ev);
    if (!isNaN(baseEv)) {
      const merged = Math.round((baseEv + cond.evOffset) * 10) / 10;
      out.ev = String(merged);
    }
    return out;
  }

  window.toggleScene = function (el) { el.parentElement.classList.toggle('open'); };

  // ---- RECOMMENDER ----
  function renderRecommender() {
    const sSel = document.getElementById('recScenario');
    const cSel = document.getElementById('recCondition');
    if (!sSel.children.length) {
      sSel.innerHTML = SCENARIOS.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      cSel.innerHTML = CONDITIONS.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      sSel.value = 'street'; cSel.value = activeConditionId;
      sSel.onchange = cSel.onchange = renderRecommender;
    }
    const r = recommend(sSel.value, cSel.value);
    const cond = CONDITIONS.find(c => c.id === cSel.value);
    const scen = SCENARIOS.find(s => s.id === sSel.value);
    const cell = applyCondition(scen.lenses[r.pick.id], cond);
    document.getElementById('recOut').innerHTML = `
      <div class="rec-pick">${r.pick.brand} ${r.pick.name}</div>
      <div class="rec-why">${r.why}</div>
      <div class="rec-runner">Runner-up: <strong>${r.runnerUp.short}</strong> — ${r.runnerUp.bestFor.slice(0, 2).join(', ')}.</div>
      <div class="rec-grid">
        <div class="ci"><div class="ci-l">Aperture</div><div class="ci-v" style="color:var(--blue)">${cell.aperture}</div></div>
        <div class="ci"><div class="ci-l">ISO</div><div class="ci-v" style="color:var(--amber)">${cell.iso}</div></div>
        <div class="ci"><div class="ci-l">EV</div><div class="ci-v" style="color:var(--red)">${cell.ev}</div></div>
        <div class="ci"><div class="ci-l">Focus</div><div class="ci-v" style="color:var(--green);font-size:12px">${cell.focus}</div></div>
        <div class="ci"><div class="ci-l">Shutter</div><div class="ci-v" style="font-size:12px">${cell.shutter}</div></div>
        <div class="ci"><div class="ci-l">Filter</div><div class="ci-v" style="color:var(--warm);font-size:12px">${cell.filter}</div></div>
      </div>`;
  }

  // ---- LENS COMPARE ----
  function renderLensCompare() {
    document.getElementById('lensCompare').innerHTML = LENSES.map(l => `
      <div class="lens-card">
        <h4>${l.brand} ${l.name}</h4>
        <div class="lens-price">${l.price} · ${l.filter} · ${l.weight} · ${l.focalMm}mm</div>
        <div class="lens-col"><strong>Best for:</strong> ${l.bestFor.join(', ')}.</div>
        <div class="lens-col"><strong>On the Monochrom:</strong> ${l.monoNote}</div>
        <div class="lens-verdict">${l.flareNote}</div>
      </div>`).join('');
  }

  // ---- CoC toggle ----
  function bindCoc() {
    const std = document.getElementById('cocStd');
    const strict = document.getElementById('cocStrict');
    std.onclick = () => { cocMode = O.COC.standard; localStorage.setItem('leica.coc', 'standard'); std.classList.add('active'); strict.classList.remove('active'); renderDOF(); renderSpecs(); };
    strict.onclick = () => { cocMode = O.COC.strict; localStorage.setItem('leica.coc', 'strict'); strict.classList.add('active'); std.classList.remove('active'); renderDOF(); renderSpecs(); };
    if (cocMode === O.COC.strict) { strict.classList.add('active'); std.classList.remove('active'); }
  }

  // ---- render all ----
  function renderAll() {
    renderLensSwitch();
    renderSpecs();
    renderDistance();
    renderDOF();
    renderAperture();
    renderFocus();
    renderScenarios();
    renderRecommender();
    renderLensCompare();
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindCoc();
    renderAll();
    // register service worker for offline
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  });
})();