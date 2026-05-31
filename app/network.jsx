// network.jsx — home view: a foreground neural network sitting inside a huge,
// 3D-parallaxed background network. Reads window.SITE + window.computeLayout.
// Calls props.onOpen(id, originPct) when a neuron is clicked.

const NW_ICONS = {
  research: <path d="M9 3h6M10 3v5.5L5.2 17a2 2 0 0 0 1.8 3h10a2 2 0 0 0 1.8-3L14 8.5V3" />,
  projects: <g><path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z" /><path d="M3 12.5l9 4.5 9-4.5" /><path d="M3 16.5l9 4.5 9-4.5" /></g>,
  experience: <g><rect x="2.5" y="7" width="19" height="13.5" rx="2" /><path d="M8 7V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7" /><path d="M2.5 12h19" /></g>,
  cv: <g><path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" /><path d="M14 2.5V8h5.5" /><path d="M8.5 13h7M8.5 16.5h7" /></g>,
  contact: <g><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 6 9-6" /></g>,
};

function Icon({ name }) {
  const p = NW_ICONS[name];
  if (!p) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p}</svg>
  );
}

// brand glyphs for the greeting (filled, single-color)
const SOCIAL = {
  github: { label: 'GitHub', path: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 7.07c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z' },
  linkedin: { label: 'LinkedIn', path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.8a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.54v-4.57c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.32v-1.13h-2.67c.04.75 0 8.35 0 8.35h2.67v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.37-.97.97 0 1.36.74 1.36 1.82v4.46h2.63z' },
  researchgate: { label: 'ResearchGate', path: 'M15.1 2H8.9C5.1 2 2 5.1 2 8.9v6.2C2 18.9 5.1 22 8.9 22h6.2c3.8 0 6.9-3.1 6.9-6.9V8.9C22 5.1 18.9 2 15.1 2zm-1.36 13.36-1.5-2.4c-.18-.29-.36-.46-.5-.55-.13-.08-.32-.12-.56-.12h-.5v3.07H8.9V7.6h2.96c1.02 0 1.79.23 2.32.7.52.46.79 1.1.79 1.9 0 .62-.17 1.14-.5 1.55-.27.34-.64.59-1.1.74.25.13.5.4.74.79l1.62 2.58h-1.99zm-1.96-6.27h-1.1v2.06h1.1c.46 0 .8-.09 1.02-.27.22-.18.33-.45.33-.79 0-.33-.11-.58-.32-.75-.21-.17-.55-.25-1.03-.25z' },
};
function SocialIcon({ path }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg>;
}

// fixed scatter positions (fractions) for the quirky background joke-neurons,
// chosen to sit in the gaps around the main columns.
const JOKE_POS = [
  [0.10, 0.20], [0.13, 0.80], [0.45, 0.12], [0.52, 0.90],
  [0.72, 0.10], [0.93, 0.30], [0.90, 0.84], [0.41, 0.58],
  [0.21, 0.45], [0.64, 0.40], [0.80, 0.60], [0.30, 0.16],
];

function NetworkView({ onOpen }) {
  const SITE = window.SITE;
  const L = React.useMemo(() => window.computeLayout(SITE), [SITE]);
  const rootRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const fgCanvasRef = React.useRef(null);
  const bgCanvasRef = React.useRef(null);
  const jokesRef = React.useRef(null);
  const nodesRef = React.useRef(null);
  const [dims, setDims] = React.useState({ w: 1200, h: 720 });
  const [hovered, setHovered] = React.useState(null);
  const [joke, setJoke] = React.useState(null);
  const [booted, setBooted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const hoveredRef = React.useRef(null);
  const mouseRef = React.useRef({ x: -999, y: -999, inside: false });
  const parallaxRef = React.useRef({ x: 0, y: 0 });
  const meshPosRef = React.useRef(null);   // shared: bg writes mesh node positions, fg reads them to draw connections
  React.useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  // deterministic radiating spokes per neuron, so each reads as a connected hub
  const spokes = React.useMemo(() => {
    const out = {};
    Object.keys(L.nodes).forEach((id, idx) => {
      let s = (idx + 3) * 2654435761 % 2147483647;
      const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
      const count = 5 + ((idx * 3) % 3);
      out[id] = Array.from({ length: count }, (_, k) => ({
        a: (k / count) * Math.PI * 2 + rnd() * 0.8,
        len: 150 + rnd() * 230,
        mid: 0.45 + rnd() * 0.3,
      }));
    });
    return out;
  }, [L]);

  const P = React.useCallback((id) => ({ x: L.nodes[id].fx * dims.w, y: L.nodes[id].fy * dims.h }), [L, dims]);

  React.useLayoutEffect(() => {
    const el = rootRef.current; if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth || r.width;
      const vh = window.innerHeight || r.height;
      const nw = Math.round(r.width > 40 ? r.width : vw);
      const nh = Math.round(Math.max(r.height > 40 ? r.height : vh, 560));
      setDims((p) => (p.w === nw && p.h === nh ? p : { w: nw, h: nh }));
    };
    measure();
    // re-measure after layout/fonts settle (RO is unreliable in some embeds)
    const tids = [50, 200, 600, 1400].map((d) => setTimeout(measure, d));
    let ro;
    try { ro = new ResizeObserver(measure); ro.observe(el); } catch (e) { /* older browsers */ }
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      tids.forEach(clearTimeout);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  React.useEffect(() => { const t = setTimeout(() => setBooted(true), 90); return () => clearTimeout(t); }, []);

  // ---------- easter eggs ---------------------------------------------------
  const [egg, setEgg] = React.useState(null); // 'konami' | 'overfit'
  const fireRef = React.useRef(null);          // set by fg loop, lets eggs trigger a burst
  React.useEffect(() => {
    // 1) console art
    const css = 'color:#4edcb2;font-family:monospace;font-size:12px';
    console.log('%c  ╭───────────────────────────────────╮\n  │  hello, curious dev 👋            │\n  │  you found the console.           │\n  │  try the Konami code on the page. │\n  ╰───────────────────────────────────╯', css);
    // 2) Konami code → supernova
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = (k === seq[idx]) ? idx + 1 : (k === seq[0] ? 1 : 0);
      if (idx === seq.length) {
        idx = 0;
        setEgg('konami');
        if (fireRef.current) fireRef.current();
        setTimeout(() => setEgg(null), 4200);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---------- BACKGROUND huge DEPTH network (near = big/bright, far = small) -
  React.useEffect(() => {
    const canvas = bgCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = dims.w, H = dims.h;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ===== MONOCHROME-BLUE network like the reference: a fine "fuzz" texture
    // layer behind a bolder mesh of bright solid dots + clean connecting lines.
    const BLUES = [[46, 140, 214], [58, 168, 236], [72, 190, 246], [38, 118, 196], [90, 200, 250]];
    const pick = () => BLUES[(Math.random() * BLUES.length) | 0];
    const PAD = 160;
    const rnd = (a, b) => a + Math.random() * (b - a);

    // --- fuzz layer: dense, dim nodes that each emit thin radiating rays +
    //     short local links → the feathery "woven" texture from the reference ---
    const NF = Math.min(540, Math.round((W * H) / 2300));
    const fuzz = Array.from({ length: NF }, () => ({
      x: rnd(-PAD, W + PAD), y: rnd(-PAD, H + PAD),
      vx: rnd(-0.5, 0.5) * 0.10, vy: rnd(-0.5, 0.5) * 0.10,
      r: rnd(0.5, 1.5), c: pick(), a: rnd(0.28, 0.62),
      rays: Array.from({ length: 3 + ((Math.random() * 5) | 0) }, () => ({
        a: rnd(0, Math.PI * 2), len: rnd(40, 205), w: rnd(0.3, 0.6), al: rnd(0.09, 0.26),
      })),
    }));
    const LF = 96, LF2 = LF * LF;
    const fpx = new Float32Array(NF), fpy = new Float32Array(NF);

    // --- mesh layer: fewer, bright, varying-size solid dots + long clean links --
    const NM = Math.min(130, Math.round((W * H) / 10000));
    const mesh = Array.from({ length: NM }, () => {
      const hub = Math.random() < 0.22;
      return {
        x: rnd(-PAD, W + PAD), y: rnd(-PAD, H + PAD),
        vx: rnd(-0.5, 0.5) * 0.18, vy: rnd(-0.5, 0.5) * 0.18,
        r: hub ? rnd(3.4, 6.2) : rnd(1.4, 2.8), c: pick(), hub,
      };
    });
    const LM = 250, LM2 = LM * LM;
    const mpx = new Float32Array(NM), mpy = new Float32Array(NM);
    const nearD = new Float32Array(NM).fill(1e9), nearJ = new Int32Array(NM).fill(-1);

    // occasional info-flow signals between background mesh nodes
    let bgSignals = [];
    let lastSig = 0;
    // intro region (used to calm the network behind the greeting)
    const youx = (L.nodes['__you'] ? L.nodes['__you'].fx : 0.16) * W;
    const youy = (L.nodes['__you'] ? L.nodes['__you'].fy : 0.5) * H;
    const cardW = Math.max(180, Math.min(340, youx - 146));
    const gx = 56 + cardW / 2, gy = youy;
    // expose mesh node positions so the FOREGROUND can wire the UI neurons into them
    meshPosRef.current = { px: mpx, py: mpy, n: NM, mesh };

    const par = { x: 0, y: 0 };
    let raf, start = performance.now();

    const draw = (now) => {
      const t = now - start;
      // blue gradient wash (left navy → dark center → right teal), like the reference
      const lg = ctx.createLinearGradient(0, 0, W, H);
      lg.addColorStop(0, '#0d1840'); lg.addColorStop(0.5, '#070a16'); lg.addColorStop(1, '#0a2230');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);

      const tgt = parallaxRef.current;
      par.x += (tgt.x - par.x) * 0.045;
      par.y += (tgt.y - par.y) * 0.045;

      // ---- fuzz: integrate + project (small parallax, it sits deep) ----
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -PAD) p.x = W + PAD; else if (p.x > W + PAD) p.x = -PAD;
        if (p.y < -PAD) p.y = H + PAD; else if (p.y > H + PAD) p.y = -PAD;
        fpx[i] = p.x + par.x * 16; fpy[i] = p.y + par.y * 16;
      }
      // radiating rays — the dense feather texture; each ends in a faint point
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i]; const x = fpx[i], y = fpy[i];
        const sway = Math.sin(t / 3400 + i) * 0.05;
        for (let k = 0; k < p.rays.length; k++) {
          const ry = p.rays[k];
          const ex = x + Math.cos(ry.a + sway) * ry.len;
          const ey = y + Math.sin(ry.a + sway) * ry.len;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${ry.al.toFixed(3)})`;
          ctx.lineWidth = ry.w; ctx.stroke();
          ctx.beginPath(); ctx.arc(ex, ey, 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${(ry.al * 1.6).toFixed(3)})`; ctx.fill();
        }
      }
      // thin feathery links between nearby fuzz nodes
      for (let i = 0; i < NF; i++) {
        const a = fuzz[i];
        for (let j = i + 1; j < NF; j++) {
          const dx = fpx[i] - fpx[j], dy = fpy[i] - fpy[j];
          const d2 = dx * dx + dy * dy;
          if (d2 < LF2) {
            const al = (1 - Math.sqrt(d2) / LF) * 0.22;
            ctx.beginPath(); ctx.moveTo(fpx[i], fpy[i]); ctx.lineTo(fpx[j], fpy[j]);
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${al.toFixed(3)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      // tiny fuzz dots
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i];
        ctx.beginPath(); ctx.arc(fpx[i], fpy[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a.toFixed(3)})`; ctx.fill();
      }

      // ---- mesh: integrate + project (larger parallax, it sits near) ----
      for (let i = 0; i < NM; i++) {
        const p = mesh[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -PAD) p.x = W + PAD; else if (p.x > W + PAD) p.x = -PAD;
        if (p.y < -PAD) p.y = H + PAD; else if (p.y > H + PAD) p.y = -PAD;
        mpx[i] = p.x + par.x * 52; mpy[i] = p.y + par.y * 52;
        nearD[i] = 1e9; nearJ[i] = -1;
      }
      // bright, clean links between mesh nodes (long reach → crossing structure)
      for (let i = 0; i < NM; i++) {
        const a = mesh[i];
        for (let j = i + 1; j < NM; j++) {
          const b = mesh[j];
          const dx = mpx[i] - mpx[j], dy = mpy[i] - mpy[j];
          const d2 = dx * dx + dy * dy;
          if (d2 < nearD[i]) { nearD[i] = d2; nearJ[i] = j; }
          if (d2 < nearD[j]) { nearD[j] = d2; nearJ[j] = i; }
          if (d2 < LM2) {
            const al = (1 - Math.sqrt(d2) / LM) * 0.5;
            ctx.beginPath(); ctx.moveTo(mpx[i], mpy[i]); ctx.lineTo(mpx[j], mpy[j]);
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${al.toFixed(3)})`;
            ctx.lineWidth = (a.hub || b.hub) ? 1.2 : 0.8; ctx.stroke();
          }
        }
      }
      // keep every mesh node attached to its nearest neighbour
      for (let i = 0; i < NM; i++) {
        const j = nearJ[i]; if (j < 0 || nearD[i] < LM2) continue;
        const d = Math.sqrt(nearD[i]); if (d > LM * 1.7) continue;
        const a = mesh[i];
        ctx.beginPath(); ctx.moveTo(mpx[i], mpy[i]); ctx.lineTo(mpx[j], mpy[j]);
        ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},0.14)`; ctx.lineWidth = 0.7; ctx.stroke();
      }
      // bright solid mesh dots (varying size), with a soft glow on hubs
      for (let i = 0; i < NM; i++) {
        const p = mesh[i];
        if (p.hub) {
          const g = ctx.createRadialGradient(mpx[i], mpy[i], 0, mpx[i], mpy[i], p.r * 3.2);
          g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.35)`);
          g.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
          ctx.beginPath(); ctx.arc(mpx[i], mpy[i], p.r * 3.2, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(mpx[i], mpy[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.95)`; ctx.fill();
      }

      // ---- occasional info flow between background mesh nodes ----
      if (now - lastSig > 680 && bgSignals.length < 6) {
        const i = (Math.random() * NM) | 0; const j = nearJ[i];
        if (j >= 0) bgSignals.push({ i, j, t: 0, sp: 0.011 + Math.random() * 0.01 });
        lastSig = now;
      }
      bgSignals = bgSignals.filter((s) => {
        s.t += s.sp; if (s.t >= 1) return false;
        const ax = mpx[s.i], ay = mpy[s.i], bx = mpx[s.j], by = mpy[s.j], col = mesh[s.i].c;
        const x = ax + (bx - ax) * s.t, y = ay + (by - ay) * s.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 5);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.85)`); g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
        return true;
      });

      // ---- calm the network behind the intro so the greeting stays prominent ----
      const wash = ctx.createRadialGradient(gx, gy, 20, gx, gy, 380);
      wash.addColorStop(0, 'rgba(6,9,20,0.76)');
      wash.addColorStop(0.62, 'rgba(6,9,20,0.42)');
      wash.addColorStop(1, 'rgba(6,9,20,0)');
      ctx.fillStyle = wash; ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [dims]);

  // ---------- FOREGROUND network (the 6 interactive neurons) ----------------
  React.useEffect(() => {
    const canvas = fgCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = dims.w * dpr; canvas.height = dims.h * dpr;
    canvas.style.width = dims.w + 'px'; canvas.style.height = dims.h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const TEAL = [78, 220, 178], BLUE = [122, 162, 255];
    const colOf = (id) => (L.nodes[id].accent === 'blue' ? BLUE : TEAL);
    const pos = (id) => ({ x: L.nodes[id].fx * dims.w, y: L.nodes[id].fy * dims.h });
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => t * t * (3 - 2 * t);

    let signals = [];
    const firstCol = Object.values(L.nodes).filter((n) => n.col === 1).map((n) => n.id);
    const lastCol = Object.values(L.nodes).filter((n) => n.col === L.maxCol).map((n) => n.id);
    const spawn = () => {
      if (signals.length > 9 || !firstCol.length) return;
      const mid = firstCol[(Math.random() * firstCol.length) | 0];
      const seq = ['__you', mid];
      if (lastCol.length && L.maxCol > 1) seq.push(lastCol[(Math.random() * lastCol.length) | 0]);
      signals.push({ seq, seg: 0, t: 0, speed: 0.005 + Math.random() * 0.004, col: Math.random() > 0.5 ? TEAL : BLUE });
    };

    const fireFlash = {};
    let last = 0, raf, start = performance.now();

    // easter egg: supernova — flood the foreground with signals + flash all
    fireRef.current = () => {
      const ids = Object.keys(L.nodes);
      ids.forEach((id) => { fireFlash[id] = performance.now(); });
      for (let i = 0; i < 22; i++) {
        const mid = firstCol[(Math.random() * firstCol.length) | 0];
        const seq = ['__you', mid];
        if (lastCol.length) seq.push(lastCol[(Math.random() * lastCol.length) | 0]);
        signals.push({ seq, seg: 0, t: 0, speed: 0.01 + Math.random() * 0.012, col: Math.random() > 0.5 ? TEAL : BLUE });
      }
    };

    const draw = (now) => {
      const time = now - start;
      ctx.clearRect(0, 0, dims.w, dims.h);
      const hov = hoveredRef.current;
      const mouse = mouseRef.current;

      // backdrop: darken the busy background behind the main cluster so it pops
      const ids0 = Object.keys(L.nodes);
      let cx = 0, cy = 0;
      ids0.forEach((id) => { const p = pos(id); cx += p.x; cy += p.y; });
      cx /= ids0.length; cy /= ids0.length;
      const bd = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(dims.w, dims.h) * 0.55);
      bd.addColorStop(0, 'rgba(6,10,24,0.6)');
      bd.addColorStop(0.5, 'rgba(6,10,24,0.32)');
      bd.addColorStop(1, 'rgba(6,10,24,0)');
      ctx.fillStyle = bd; ctx.fillRect(0, 0, dims.w, dims.h);

      // ---- wire the UI neurons + joke neurons INTO the background mesh ----
      // (drawn here, ABOVE the vignette, so the connections are clearly visible)
      const mp = meshPosRef.current;
      if (mp && mp.n) {
        const parj = parallaxRef.current;
        const ids = Object.keys(L.nodes);
        for (let n = 0; n < ids.length; n++) {
          const id = ids[n]; const p = pos(id); const c = colOf(id);
          const nr = (L.nodes[id].kind === 'input' ? 132 : L.nodes[id].kind === 'output' ? 62 : 72) / 2;
          let nearest = -1, nd = 1e9, drew = 0;
          for (let m = 0; m < mp.n; m++) {
            const dx = mp.px[m] - p.x, dy = mp.py[m] - p.y; const d2 = dx * dx + dy * dy;
            if (d2 < nd) { nd = d2; nearest = m; }
            if (d2 < 250 * 250) {
              const d = Math.sqrt(d2); if (d < nr + 8) continue;
              const ux = dx / d, uy = dy / d;
              const al = (1 - d / 250) * 0.45;
              ctx.beginPath();
              ctx.moveTo(p.x + ux * (nr + 4), p.y + uy * (nr + 4));
              ctx.lineTo(mp.px[m], mp.py[m]);
              ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${al.toFixed(3)})`;
              ctx.lineWidth = 1; ctx.stroke();
              // small joint dot where it meets the mesh node
              ctx.beginPath(); ctx.arc(mp.px[m], mp.py[m], 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(al + 0.2).toFixed(3)})`; ctx.fill();
              drew++;
            }
          }
          if (!drew && nearest >= 0) {
            const dx = mp.px[nearest] - p.x, dy = mp.py[nearest] - p.y; const d = Math.hypot(dx, dy) || 1;
            const ux = dx / d, uy = dy / d;
            ctx.beginPath(); ctx.moveTo(p.x + ux * (nr + 4), p.y + uy * (nr + 4)); ctx.lineTo(mp.px[nearest], mp.py[nearest]);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.32)`; ctx.lineWidth = 0.9; ctx.stroke();
          }
        }
        for (let k = 0; k < JOKE_POS.length; k++) {
          const jx = JOKE_POS[k][0] * dims.w + parj.x * -26;
          const jy = JOKE_POS[k][1] * dims.h + parj.y * -26;
          let nearest = -1, nd = 1e9, drew = 0;
          for (let m = 0; m < mp.n; m++) {
            const dx = mp.px[m] - jx, dy = mp.py[m] - jy; const d2 = dx * dx + dy * dy;
            if (d2 < nd) { nd = d2; nearest = m; }
            if (d2 < 165 * 165) {
              const al = (1 - Math.sqrt(d2) / 165) * 0.36;
              ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(mp.px[m], mp.py[m]);
              ctx.strokeStyle = `rgba(255,183,77,${al.toFixed(3)})`; ctx.lineWidth = 0.6; ctx.stroke();
              drew++;
            }
          }
          if (!drew && nearest >= 0) {
            ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(mp.px[nearest], mp.py[nearest]);
            ctx.strokeStyle = 'rgba(255,183,77,0.3)'; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }

      // connector from greeting card to the input neuron
      const you = pos('__you');
      const cardR = Math.max(150, you.x - 96);
      ctx.beginPath(); ctx.moveTo(cardR - 18, you.y); ctx.lineTo(you.x, you.y);
      ctx.strokeStyle = 'rgba(78,220,178,0.22)'; ctx.lineWidth = 1; ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);

      // radiating spokes — tie each neuron into the surrounding web like a hub
      Object.keys(L.nodes).forEach((id) => {
        const p = pos(id); const c = colOf(id);
        const hubLit = hov === id || (hov && L.neighbors[hov] && L.neighbors[hov].has(id));
        (spokes[id] || []).forEach((sp, k) => {
          const drift = Math.sin(time / 2600 + k * 1.3 + p.x * 0.01) * 7;
          const ex = p.x + Math.cos(sp.a) * sp.len;
          const ey = p.y + Math.sin(sp.a) * sp.len + drift;
          const grad = ctx.createLinearGradient(p.x, p.y, ex, ey);
          const a0 = hubLit ? 0.26 : 0.1;
          grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a0})`);
          grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, ey);
          ctx.strokeStyle = grad; ctx.lineWidth = 1.1; ctx.stroke();
          // node at the spoke end
          ctx.beginPath(); ctx.arc(ex, ey, hubLit ? 2 : 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${hubLit ? 0.7 : 0.4})`; ctx.fill();
        });
      });

      if (hov && L.nodes[hov]) {
        const p = pos(hov); const c = colOf(hov);
        const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 230);
        sg.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.08)`); sg.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, 230, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
      }

      L.edges.forEach(([a, b]) => {
        const pa = pos(a), pb = pos(b);
        const lit = hov && (hov === a || hov === b);
        const fromYou = (a === '__you' || b === '__you'); // signal flowing out of the central photo
        // orient the edge so the arrow points AWAY from the profile (center → out)
        const src = (a === '__you') ? pa : (b === '__you' ? pb : pa);
        const dst = (src === pa) ? pb : pa;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        if (lit) { ctx.strokeStyle = 'rgba(78,220,178,0.75)'; ctx.lineWidth = fromYou ? 2.2 : 1.1; ctx.shadowColor = 'rgba(78,220,178,0.55)'; ctx.shadowBlur = 9; }
        else { ctx.strokeStyle = hov ? 'rgba(150,160,185,0.14)' : 'rgba(140,200,220,0.5)'; ctx.lineWidth = fromYou ? 1.8 : 0.65; ctx.shadowColor = 'rgba(120,180,200,0.3)'; ctx.shadowBlur = hov ? 0 : 3; }
        ctx.stroke(); ctx.shadowBlur = 0;

        // directional arrowhead, set a little before the destination node
        const ang = Math.atan2(dst.y - src.y, dst.x - src.x);
        const dnode = L.nodes[dst === pa ? a : b];
        const dr = (dnode.kind === 'input' ? 132 : dnode.kind === 'output' ? 62 : 72) / 2;
        const ax = dst.x - Math.cos(ang) * (dr + 9);
        const ay = dst.y - Math.sin(ang) * (dr + 9);
        const head = fromYou ? 7 : 5;
        const aAlpha = lit ? 0.85 : 0.5;
        const c = (b === '__you' || a === '__you') ? [120, 210, 200] : [150, 200, 215];
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - Math.cos(ang - 0.42) * head, ay - Math.sin(ang - 0.42) * head);
        ctx.lineTo(ax - Math.cos(ang + 0.42) * head, ay - Math.sin(ang + 0.42) * head);
        ctx.closePath();
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${aAlpha})`; ctx.fill();
      });

      if (mouse.inside) {
        Object.keys(L.nodes).forEach((id) => {
          const p = pos(id); const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dist < 200) { const a = (1 - dist / 200) * 0.3;
            ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(122,162,255,${a.toFixed(3)})`; ctx.lineWidth = 0.7; ctx.stroke(); }
        });
      }

      if (now - last > 780) { spawn(); last = now; }
      signals = signals.filter((s) => {
        s.t += s.speed;
        if (s.t >= 1) { fireFlash[s.seq[s.seg + 1]] = now; s.seg += 1; s.t = 0; if (s.seg >= s.seq.length - 1) return false; }
        const a = pos(s.seq[s.seg]), b = pos(s.seq[s.seg + 1]); const tt = ease(s.t);
        const x = lerp(a.x, b.x, tt), y = lerp(a.y, b.y, tt); const [r, g, bl] = s.col;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
        grad.addColorStop(0, `rgba(${r},${g},${bl},0.9)`); grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
        return true;
      });

      Object.keys(L.nodes).forEach((id) => {
        const p = pos(id); const n = L.nodes[id];
        const baseR = (n.kind === 'input' ? 132 : n.kind === 'output' ? 62 : 72) / 2;
        const flash = fireFlash[id] ? Math.max(0, 1 - (now - fireFlash[id]) / 620) : 0;
        const breathe = 0.5 + 0.5 * Math.sin(time / 1100 + n.fy * 6);
        const lit = hov === id || (hov && L.neighbors[hov] && L.neighbors[hov].has(id));
        const intensity = Math.max(flash, lit ? 0.7 : 0.26 + breathe * 0.14);
        const glowR = baseR + 20 + flash * 22;
        const c = colOf(id);
        // outer soft glow
        const grad = ctx.createRadialGradient(p.x, p.y, baseR * 0.3, p.x, p.y, glowR);
        grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${(intensity * 0.8).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        // crisp accent ring hugging the core
        ctx.beginPath(); ctx.arc(p.x, p.y, baseR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.3 + intensity * 0.6).toFixed(3)})`;
        ctx.lineWidth = 1.4; ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [dims, L]);

  // ---------- parallax (anchored main section; only bg + jokes drift) -------
  const onMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    mouseRef.current = { x, y, inside: true };
    const nx = (x / r.width) - 0.5, ny = (y / r.height) - 0.5;
    parallaxRef.current.x = nx; parallaxRef.current.y = ny;
    if (jokesRef.current) {
      jokesRef.current.style.transform = `translate(${(nx * -26).toFixed(1)}px, ${(ny * -26).toFixed(1)}px)`;
    }
  };
  const onLeave = () => {
    mouseRef.current.inside = false;
    parallaxRef.current.x = 0; parallaxRef.current.y = 0;
    if (jokesRef.current) jokesRef.current.style.transform = 'translate(0,0)';
  };

  const isLit = (id) => !hovered || hovered === id || (L.neighbors[hovered] && L.neighbors[hovered].has(id));
  const open = (id) => { const n = L.nodes[id]; onOpen(id, { x: n.fx * 100, y: n.fy * 100 }); };
  const copyEmail = () => {
    const pf = SITE.profile;
    const em = (pf.greeting && pf.greeting.email) || (pf.links && pf.links.email);
    if (!em) return;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(em).then(done).catch(() => fallbackCopy(em, done));
    } else {
      fallbackCopy(em, done);
    }
  };
  const fallbackCopy = (text, done) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); done();
    } catch (e) { /* ignore */ }
  };

  const D = { input: 132, output: 62, hidden: 72 };
  const you = P('__you');
  const GUTTER = 56;
  const cardMaxW = Math.max(180, Math.min(340, you.x - GUTTER - 90));
  const jokes = (SITE.backgroundJokes || []).slice(0, JOKE_POS.length);
  const pr = SITE.profile;
  const g = pr.greeting || {};
  const compact = (() => {
    try {
      const m = new URLSearchParams(location.search).get('m');
      if (m === '1') return true;
      if (m === '0') return false;
    } catch (e) { /* ignore */ }
    return dims.w < 880;
  })();

  // ===================== COMPACT (mobile / portrait) layout =================
  if (compact) {
    const openC = (id) => onOpen(id, { x: 50, y: 42 });
    return (
      <div className="nw-root nw-compact" ref={rootRef}>
        <canvas ref={bgCanvasRef} className="nw-bgcanvas"></canvas>
        <div className="nwc-scroll">
          <header className="nwc-head">
            <div className="nwc-photo">
              <div className="nwc-photo-ring"></div>
              <image-slot id={pr.photoId} shape="circle" fit="cover" placeholder="Drop headshot" src="uploads/headshot.JPG"
                style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}></image-slot>
            </div>
            <div className="nwc-hi">{g.hi || 'Hi there! I’m'}</div>
            <h1 className="nwc-name serif">{pr.name}</h1>
            <div className="nwc-role">{pr.role}</div>
            <button className="nwc-email" onClick={copyEmail}>
              <span>{g.email || pr.links.email}</span>
              <span className="nwc-copy">{copied ? '✓' : '⧉'}</span>
            </button>
            {g.blurb ? <p className="nwc-blurb">{g.blurb}</p> : null}
            <div className="nwc-links">
              {pr.links.github ? <a href={pr.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><SocialIcon path={SOCIAL.github.path} /></a> : null}
              {pr.links.linkedin ? <a href={pr.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon path={SOCIAL.linkedin.path} /></a> : null}
              {pr.links.researchgate ? <a href={pr.links.researchgate} target="_blank" rel="noreferrer" aria-label="ResearchGate"><SocialIcon path={SOCIAL.researchgate.path} /></a> : null}
            </div>
          </header>

          <div className="nwc-rail"><span className="nwc-rail-dot"></span></div>

          <div className="nwc-grid">
            {SITE.neurons.map((n) => (
              <button key={n.id} className={`nwc-card ${n.accent === 'blue' ? 'blue' : ''}`} onClick={() => openC(n.id)}>
                <div className="nwc-card-top">
                  <span className="nwc-card-icon">{n.icon ? <Icon name={n.icon} /> : null}</span>
                  <span className="nwc-card-stat"><b>{n.summary.stat}</b><small>{n.summary.statLabel}</small></span>
                </div>
                <div className="nwc-card-label">{n.label}</div>
                {n.summary.keywords && n.summary.keywords.length ? (
                  <div className="nwc-card-kw">{n.summary.keywords.slice(0, 3).map((k, i) => <span key={i}>{k}</span>)}</div>
                ) : (n.summary.points && n.summary.points.length ? (
                  <div className="nwc-card-sub">{n.summary.points[0]}</div>
                ) : null)}
                <div className="nwc-card-cta">open →</div>
              </button>
            ))}
          </div>

          <div className="nwc-foot">a neural network · tap a node to enter</div>
        </div>
      </div>
    );
  }

  // ===================== DESKTOP network layout =============================
  return (
    <div className="nw-root" ref={rootRef} onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* deepest layer: huge background web (2D, parallaxed) */}
      <canvas ref={bgCanvasRef} className="nw-bgcanvas"></canvas>

      {/* quirky background joke-neurons (2D so they hit-test reliably) */}
      <div className={`nw-jokes ${joke !== null ? 'has-open' : ''}`} ref={jokesRef}>
        {jokes.map((txt, i) => {
          const [fx, fy] = JOKE_POS[i];
          const openLeft = fx > 0.6;
          const vert = fy < 0.2 ? 'vt' : fy > 0.8 ? 'vb' : 'vm';
          return (
            <div key={i} className={`nw-joke ${joke === i ? 'on' : ''}`} style={{ left: fx * dims.w, top: fy * dims.h }}
                 onMouseEnter={() => setJoke(i)} onMouseLeave={() => setJoke((j) => (j === i ? null : j))}>
              <span className="nw-joke-dot"></span>
              <div className={`nw-joke-bubble ${openLeft ? 'bl' : 'br'} ${vert}`}>
                <span className="nw-joke-tag">// {String(i + 1).padStart(2, '0')}</span>{txt}
              </div>
            </div>
          );
        })}
      </div>

      {/* interactive layer: the 6 neurons + greeting (anchored, prominent) */}
      <div className={`nw-scene ${booted ? 'booted' : ''}`} ref={sceneRef}>
        <canvas ref={fgCanvasRef} className="nw-fgcanvas"></canvas>

        <div className="nw-nodes" ref={nodesRef}>
          {/* greeting card */}
          <div className="nw-greet" style={{ left: GUTTER, top: you.y, width: cardMaxW }}>
            <div className="nw-greet-hi">{g.hi || 'Hi there! I’m'}</div>
            <div className="nw-greet-name serif">{pr.name}</div>
            <button className="nw-greet-email" onClick={copyEmail}>
              <span>{g.email || pr.links.email}</span>
              <span className="nw-greet-copy">{copied ? '✓ copied' : '⧉'}</span>
            </button>
            <p className="nw-greet-blurb">{g.blurb}</p>
            <div className="nw-greet-links">
              {pr.links.github ? <a href={pr.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-tip="GitHub"><SocialIcon path={SOCIAL.github.path} /></a> : null}
              {pr.links.linkedin ? <a href={pr.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-tip="LinkedIn"><SocialIcon path={SOCIAL.linkedin.path} /></a> : null}
              {pr.links.researchgate ? <a href={pr.links.researchgate} target="_blank" rel="noreferrer" aria-label="ResearchGate" data-tip="ResearchGate"><SocialIcon path={SOCIAL.researchgate.path} /></a> : null}
            </div>
          </div>

          {Object.keys(L.nodes).map((id) => {
            const n = L.nodes[id]; const p = P(id); const d = D[n.kind];
            const dim = isLit(id) ? '' : 'dim';
            if (n.kind === 'input') {
              return (
                <div key={id} className={`nw-node nw-input ${dim}`} style={{ left: p.x, top: p.y }}
                     onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}>
                  <div className="nw-core" style={{ width: d, height: d }}>
                    <div className="nw-ring"></div><div className="nw-ring b"></div>
                    <image-slot id={pr.photoId} shape="circle" fit="cover" placeholder="Drop headshot" src="uploads/headshot.JPG"
                      style={{ position: 'absolute', inset: '0', width: d + 'px', height: d + 'px' }}></image-slot>
                  </div>
                  <div className="nw-lab"><div className="t serif">{pr.name}</div><div className="s">{pr.role}</div></div>
                </div>
              );
            }
            const acc = n.accent;
            return (
              <div key={id} className={`nw-node ${acc === 'blue' ? 'blue' : ''} ${dim}`} style={{ left: p.x, top: p.y }}
                   onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
                   onClick={() => open(id)} role="button" tabIndex={0}
                   onKeyDown={(e) => { if (e.key === 'Enter') open(id); }}>
                <div className="nw-core" style={{ width: d, height: d }}>
                  <div className="nw-ring"></div>
                  <div className="nw-icon">{n.ref.icon ? <Icon name={n.ref.icon} /> : <div className="nw-pip"></div>}</div>
                </div>
                <div className="nw-lab"><div className="t">{n.ref.label}</div><div className="s">{n.ref.summary.statLabel}</div></div>

                <div className={`nw-card ${n.cardSide}`}>
                  <div className="nw-card-stat"><span className="n">{n.ref.summary.stat}</span><span className="l">{n.ref.summary.statLabel}</span></div>
                  {n.ref.summary.keywords && n.ref.summary.keywords.length ? (
                    <div className="nw-card-kw">{n.ref.summary.keywords.map((k, i) => <span key={i}>{k}</span>)}</div>
                  ) : null}
                  {n.ref.summary.points && n.ref.summary.points.length ? (
                    <ul>{n.ref.summary.points.map((pt, i) => <li key={i}>{pt}</li>)}</ul>
                  ) : null}
                  <div className="nw-card-cta">open {n.ref.label.toLowerCase()} →</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="nw-hint"><span className="k">›</span> drag your eye through the network · hover a neuron · click to enter</div>
      <div className="nw-coords">forward pass · live</div>

      {/* easter egg toast */}
      <div className={`nw-egg ${egg ? 'on' : ''}`}>
        <span className="nw-egg-k">↑↑↓↓←→←→ B A</span>
        gradient exploded — the whole network just fired at once 💥
      </div>
    </div>
  );
}
window.NetworkView = NetworkView;
