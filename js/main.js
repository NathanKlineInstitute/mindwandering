/* ============================================================
   CONTE CENTER — Unified Site JS
   Audience toggle · Nav · Scroll FX · Brain · Wave · FAQ
   ============================================================ */

/* ── Mode system ── */
const MODE_KEY = 'conteCenterMode';
const DEFAULT_MODE = 'public';

function getMode()   { return localStorage.getItem(MODE_KEY) || DEFAULT_MODE; }
function setMode(m)  {
  document.body.dataset.mode = m;
  localStorage.setItem(MODE_KEY, m);
  // Update toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === m);
  });
  // Update mode banner text
  const banner = document.getElementById('modeBanner');
  if (banner) {
    if (m === 'public') {
      banner.innerHTML = '<span>👤</span> Viewing in <strong>General Public</strong> mode &nbsp;·&nbsp; <button onclick="setMode(\'scientist\')" style="background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit;">Switch to Scientist mode</button>';
    } else {
      banner.innerHTML = '<span>🔬</span> Viewing in <strong>Scientist</strong> mode &nbsp;·&nbsp; <button onclick="setMode(\'public\')" style="background:none;border:none;color:inherit;cursor:pointer;text-decoration:underline;font-family:inherit;font-size:inherit;">Switch to Public mode</button>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Init mode ── */
  setMode(getMode());

  /* ── Toggle button clicks ── */
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  /* ── Nav ── */
  const nav    = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
  window.addEventListener('scroll', () => {
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 2px 28px rgba(0,0,0,.55)' : 'none';
  });

  /* ── Active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html'))
      a.classList.add('active');
  });

  /* ── Scroll fade-in ── */
  const io = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  /* ── FAQ ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Filter tabs (dual-group) ── */
  setupFilters();

  /* ── Interactive brain ── */
  initBrain();

  /* ── Brain wave canvas ── */
  initWave();

  /* ── Counter animation ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const io2 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const target = +el.dataset.count;
        let n = 0; const step = Math.ceil(target / 45);
        const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n; if (n >= target) clearInterval(t); }, 28);
        io2.disconnect();
      }
    });
    io2.observe(el);
  });

});

/* ── Dual filter groups ── */
function setupFilters() {
  let activeYear  = 'all';
  let activeTopic = 'all';

  function applyFilters() {
    const items = document.querySelectorAll('[data-year][data-topic]');
    let shown = 0;
    items.forEach(item => {
      const yearOk  = activeYear  === 'all' || item.dataset.year  === activeYear;
      const topicOk = activeTopic === 'all' || item.dataset.topic === activeTopic;
      item.style.display = (yearOk && topicOk) ? '' : 'none';
      if (yearOk && topicOk) shown++;
    });
    const badge = document.getElementById('pubCount');
    if (badge) badge.textContent = shown + ' publication' + (shown !== 1 ? 's' : '');
  }

  document.querySelectorAll('.filter-tabs[data-group="year"] .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs[data-group="year"] .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeYear = btn.dataset.filter; applyFilters();
    });
  });
  document.querySelectorAll('.filter-tabs[data-group="topic"] .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs[data-group="topic"] .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeTopic = btn.dataset.filter; applyFilters();
    });
  });
}

/* ── Interactive Brain ── */
function initBrain() {
  const regions = document.querySelectorAll('.brain-region');
  const tooltip = document.getElementById('brainTooltip');
  if (!regions.length || !tooltip) return;

  const info = {
    dmn: {
      title: 'Default Mode Network',
      pub:  '💭 Most active when your mind wanders — replaying memories, imagining the future, or daydreaming.',
      sci:  'Hub of internally-directed cognition. Slow fluctuations drive transitions between DMN dominance and task-positive network engagement.'
    },
    prefrontal: {
      title: 'Prefrontal Cortex',
      pub:  '🎯 Your brain\'s "CEO" — controls focus, planning, and pulling attention back when it drifts.',
      sci:  'Governs top-down attentional control and executive function. SBNFs here regulate cognitive control cycles.'
    },
    parietal: {
      title: 'Parietal Cortex',
      pub:  '👁 Part of your spotlight of attention — helps direct where in the world you focus your awareness.',
      sci:  'Component of the dorsal fronto-parietal attention network. Theta-band (3–8 Hz) phase over slow fluctuations shapes spatial attention.'
    },
    temporal: {
      title: 'Temporal Cortex',
      pub:  '🎵 Processes sounds, faces, and language — and links them to memories.',
      sci:  'Auditory and language processing. Slow network fluctuations modulate sensory sampling timing and cross-modal attention.'
    },
    insula: {
      title: 'Anterior Insula',
      pub:  '💓 Reads your body\'s internal signals — heartbeat, breathing, gut feelings — and feeds them to the brain.',
      sci:  'Key hub for interoception and arousal. Candidate trigger site for SBNF network switching; target for chemogenetic manipulation in Project 3.'
    },
    motor: {
      title: 'Motor / Somatosensory Cortex',
      pub:  '👀 Coordinates eye movements and body actions with the rhythm of your brain\'s attention cycles.',
      sci:  'Saccade-related oscillatory resets (Barczak et al., 2019) modulate cortical excitability, coupling motor sampling to SBNF phase.'
    },
    occipital: {
      title: 'Visual Cortex',
      pub:  '🔍 Processes everything you see — but only as sharply as slow brain rhythms allow it to at any given moment.',
      sci:  'Phase-amplitude coupling on infraslow fluctuations amplifies V1 excitability post-fixation. Studied in active sensing paradigms (Project 3).'
    },
    cingulate: {
      title: 'Anterior Cingulate Cortex',
      pub:  '⚡ Detects when your mind has wandered and signals the brain to refocus — your internal error monitor.',
      sci:  'Monitors internal state; ACC–AIC projections are cholinergic/dopaminergic candidates for SBNF regulation (Project 3 Aim 2).'
    }
  };

  let activeRegion = null;

  regions.forEach(region => {
    region.addEventListener('mouseenter', e => showTip(e, region));
    region.addEventListener('mousemove',  e => posTip(e));
    region.addEventListener('mouseleave', ()  => { if (activeRegion !== region) hideTip(); });
    region.addEventListener('click', () => {
      if (activeRegion === region) { activeRegion = null; region.classList.remove('active'); hideTip(); }
      else { if (activeRegion) activeRegion.classList.remove('active'); activeRegion = region; region.classList.add('active'); }
    });
  });

  function showTip(e, region) {
    const key = region.dataset.region;
    if (!info[key]) return;
    const d = info[key];
    tooltip.querySelector('h4').textContent = d.title;
    tooltip.querySelector('.tt-text').textContent = '';
    const mode = document.body.dataset.mode || 'public';
    const pubEl = tooltip.querySelector('.tt-pub');
    const sciEl = tooltip.querySelector('.tt-sci');
    if (mode === 'public') {
      pubEl.textContent = d.pub; pubEl.style.display = 'block';
      sciEl.style.display = 'none';
    } else {
      sciEl.textContent = d.sci; sciEl.style.display = 'block';
      pubEl.style.display = 'none';
    }
    tooltip.classList.add('visible');
    posTip(e);
  }
  function posTip(e) {
    const wrapper = tooltip.closest('.brain-wrapper') || document.body;
    const rect = wrapper.getBoundingClientRect();
    let x = e.clientX - rect.left + 14, y = e.clientY - rect.top - 10;
    const tw = tooltip.offsetWidth || 240, th = tooltip.offsetHeight || 110;
    if (x + tw > rect.width)  x = e.clientX - rect.left - tw - 14;
    if (y + th > rect.height) y = e.clientY - rect.top  - th - 10;
    tooltip.style.left = Math.max(0, x) + 'px';
    tooltip.style.top  = Math.max(0, y) + 'px';
  }
  function hideTip() { if (!activeRegion) tooltip.classList.remove('visible'); }
}

/* ── Animated wave ── */
function initWave() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 540, H = 160; canvas.width = W; canvas.height = H;
  let t = 0;
  const waves = [
    { freq: .007, amp: 36, color: '#1ac8ae', alpha: .9 },
    { freq: .033, amp: 21, color: '#ffc947', alpha: .7 },
    { freq: .11,  amp: 13, color: '#a78bfa', alpha: .55 },
  ];
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
    for (let y = 0; y <= H; y += H / 3) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    waves.forEach(w => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = H / 2 + Math.sin(x * w.freq * 2 * Math.PI + t * w.freq * 60) * w.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w.color; ctx.globalAlpha = w.alpha;
      ctx.lineWidth = w === waves[0] ? 2.5 : 1.5; ctx.stroke();
    });
    ctx.globalAlpha = 1; t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
}
