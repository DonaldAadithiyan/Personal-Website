// page.jsx — renders one neuron's full page from its config `blocks`.

// Same two-layer rendering as the home page background canvas.
function PageBgCanvas() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BLUES = [[46,140,214],[58,168,236],[72,190,246],[38,118,196],[90,200,250]];
    const pick = () => BLUES[(Math.random() * BLUES.length) | 0];
    const PAD = 80, rnd = (a, b) => a + Math.random() * (b - a);
    let W = 0, H = 0, fuzz = [], mesh = [], fpx, fpy, mpx, mpy, nearD, nearJ;
    let bgSignals = [], lastSig = 0, raf;

    const build = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const NF = Math.min(160, Math.round((W * H) / 8500));
      fuzz = Array.from({ length: NF }, () => ({
        x: rnd(-PAD, W + PAD), y: rnd(-PAD, H + PAD),
        vx: rnd(-0.5, 0.5) * 0.10, vy: rnd(-0.5, 0.5) * 0.10,
        r: rnd(0.4, 1.2), c: pick(), a: rnd(0.18, 0.38),
        rays: Array.from({ length: 2 + ((Math.random() * 3) | 0) }, () => ({
          a: rnd(0, Math.PI * 2), len: rnd(25, 100), w: rnd(0.25, 0.45), al: rnd(0.05, 0.14),
        })),
      }));
      fpx = new Float32Array(NF); fpy = new Float32Array(NF);
      const NM = Math.min(70, Math.round((W * H) / 18000));
      mesh = Array.from({ length: NM }, () => {
        const hub = Math.random() < 0.22;
        return { x: rnd(-PAD, W + PAD), y: rnd(-PAD, H + PAD),
          vx: rnd(-0.5, 0.5) * 0.18, vy: rnd(-0.5, 0.5) * 0.18,
          r: hub ? rnd(3.4, 6.2) : rnd(1.4, 2.8), c: pick(), hub };
      });
      mpx = new Float32Array(NM); mpy = new Float32Array(NM);
      nearD = new Float32Array(NM).fill(1e9); nearJ = new Int32Array(NM).fill(-1);
      bgSignals = [];
    };
    build();

    const LF = 96, LF2 = LF * LF, LM = 250, LM2 = LM * LM;

    const draw = (now) => {
      const NF = fuzz.length, NM = mesh.length;
      ctx.clearRect(0, 0, W, H);

      // fuzz layer
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < -PAD) p.x = W + PAD; else if (p.x > W + PAD) p.x = -PAD;
        if (p.y < -PAD) p.y = H + PAD; else if (p.y > H + PAD) p.y = -PAD;
        fpx[i] = p.x; fpy[i] = p.y;
      }
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i], x = fpx[i], y = fpy[i], sw = Math.sin(now / 3400 + i) * 0.05;
        for (let k = 0; k < p.rays.length; k++) {
          const ry = p.rays[k];
          const ex = x + Math.cos(ry.a + sw) * ry.len, ey = y + Math.sin(ry.a + sw) * ry.len;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${ry.al.toFixed(3)})`;
          ctx.lineWidth = ry.w; ctx.stroke();
          ctx.beginPath(); ctx.arc(ex, ey, 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${(ry.al * 1.6).toFixed(3)})`; ctx.fill();
        }
      }
      for (let i = 0; i < NF; i++) {
        const a = fuzz[i];
        for (let j = i + 1; j < NF; j++) {
          const dx = fpx[i] - fpx[j], dy = fpy[i] - fpy[j], d2 = dx * dx + dy * dy;
          if (d2 < LF2) {
            const al = (1 - Math.sqrt(d2) / LF) * 0.11;
            ctx.beginPath(); ctx.moveTo(fpx[i], fpy[i]); ctx.lineTo(fpx[j], fpy[j]);
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${al.toFixed(3)})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      }
      for (let i = 0; i < NF; i++) {
        const p = fuzz[i];
        ctx.beginPath(); ctx.arc(fpx[i], fpy[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a.toFixed(3)})`; ctx.fill();
      }

      // mesh layer
      for (let i = 0; i < NM; i++) {
        const p = mesh[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < -PAD) p.x = W + PAD; else if (p.x > W + PAD) p.x = -PAD;
        if (p.y < -PAD) p.y = H + PAD; else if (p.y > H + PAD) p.y = -PAD;
        mpx[i] = p.x; mpy[i] = p.y; nearD[i] = 1e9; nearJ[i] = -1;
      }
      for (let i = 0; i < NM; i++) {
        const a = mesh[i];
        for (let j = i + 1; j < NM; j++) {
          const b = mesh[j], dx = mpx[i] - mpx[j], dy = mpy[i] - mpy[j], d2 = dx * dx + dy * dy;
          if (d2 < nearD[i]) { nearD[i] = d2; nearJ[i] = j; }
          if (d2 < nearD[j]) { nearD[j] = d2; nearJ[j] = i; }
          if (d2 < LM2) {
            const al = (1 - Math.sqrt(d2) / LM) * 0.32;
            ctx.beginPath(); ctx.moveTo(mpx[i], mpy[i]); ctx.lineTo(mpx[j], mpy[j]);
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${al.toFixed(3)})`;
            ctx.lineWidth = (a.hub || b.hub) ? 0.9 : 0.6; ctx.stroke();
          }
        }
      }
      for (let i = 0; i < NM; i++) {
        const j = nearJ[i]; if (j < 0 || nearD[i] < LM2) continue;
        const d = Math.sqrt(nearD[i]); if (d > LM * 1.7) continue;
        const a = mesh[i];
        ctx.beginPath(); ctx.moveTo(mpx[i], mpy[i]); ctx.lineTo(mpx[j], mpy[j]);
        ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},0.14)`; ctx.lineWidth = 0.7; ctx.stroke();
      }
      for (let i = 0; i < NM; i++) {
        const p = mesh[i];
        if (p.hub) {
          const g = ctx.createRadialGradient(mpx[i], mpy[i], 0, mpx[i], mpy[i], p.r * 3.2);
          g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.22)`);
          g.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
          ctx.beginPath(); ctx.arc(mpx[i], mpy[i], p.r * 3.2, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(mpx[i], mpy[i], p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.72)`; ctx.fill();
      }

      // info-flow signals
      if (now - lastSig > 320 && bgSignals.length < 14) {
        const i = (Math.random() * NM) | 0, j = nearJ[i];
        if (j >= 0) bgSignals.push({ i, j, t: 0, sp: 0.009 + Math.random() * 0.012 });
        lastSig = now;
      }
      bgSignals = bgSignals.filter((s) => {
        s.t += s.sp; if (s.t >= 1) return false;
        const col = mesh[s.i].c;
        const x = mpx[s.i] + (mpx[s.j] - mpx[s.i]) * s.t, y = mpy[s.i] + (mpy[s.j] - mpy[s.i]) * s.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 5);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.85)`);
        g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
        return true;
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', build);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', build); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}></canvas>;
}

function EntriesBlock({ items }) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const t = setTimeout(() => setShown(true), 120); // failsafe
    return () => { cancelAnimationFrame(r); clearTimeout(t); };
  }, []);
  return (
    <div className={`pg-entries ${shown ? 'in' : ''}`}>
      {items.map((e, i) => (
        <div className="pg-entry" key={i} style={{ transitionDelay: `${0.06 * i}s`, '--i': i }}>
          <div className="pg-entry-node"><span></span></div>
          <div className="pg-entry-body">
            <div className="pg-entry-head">
              <h3>{e.title}</h3>
              {e.tag ? <span className="pg-tag">{e.tag}</span> : null}
            </div>
            {e.meta ? <div className="pg-meta">{e.meta}</div> : null}
            {e.points && e.points.length ? <ul className="pg-points">{e.points.map((p, j) => <li key={j}>{p}</li>)}</ul> : null}
            {e.links && e.links.length ? (
              <div className="pg-entry-links">{e.links.map((l, j) => <a key={j} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ b }) {
  if (b.type === 'text') return <p className="pg-text">{b.text}</p>;
  if (b.type === 'heading') return <h2 className="pg-h2"><span className="pg-h2-dot"></span>{b.text}</h2>;
  if (b.type === 'stats') return (
    <div className="pg-stats">
      {b.items.map((s, i) => <div className="pg-stat" key={i}><div className="n">{s.n}</div><div className="l">{s.label}</div></div>)}
    </div>
  );
  if (b.type === 'entries') return <EntriesBlock items={b.items} />;
  if (b.type === 'skills') return (
    <div className="pg-skills">
      {b.groups.map((g, i) => (
        <div className="pg-skillgroup" key={i}>
          <div className="pg-skillname">{g.name}</div>
          <div className="pg-chips">{g.items.map((s, j) => <span className="pg-chip" key={j}>{s}</span>)}</div>
        </div>
      ))}
    </div>
  );
  if (b.type === 'list') return <ul className="pg-list">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
  if (b.type === 'links') return (
    <div className="pg-links">{b.items.map((l, i) => <a className="pg-linkbtn" key={i} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}</div>
  );
  return null;
}

function PageView({ id, onBack, onNav }) {
  const SITE = window.SITE;
  const neuron = SITE.neurons.find((n) => n.id === id);
  if (!neuron) return null;
  const pg = neuron.page;
  const others = SITE.neurons.filter((n) => n.id !== id);
  const accent = neuron.accent === 'blue' ? 'blue' : 'teal';

  return (
    <div className={`pg-root ${accent}`}>
      <PageBgCanvas />
      <div className="pg-scroll">
        <div className="pg-inner">
          <button className="pg-back" onClick={onBack}>
            <span className="pg-back-neuron"></span> back to network
          </button>

          <div className="pg-hero">
            <div className="pg-hero-content">
              <div className="pg-kicker">{pg.kicker}</div>
              <h1 className="pg-title">{pg.title}</h1>
              <p className="pg-lede">{pg.lede}</p>
            </div>
          </div>

          <div className="pg-blocks">
            {pg.blocks.map((b, i) => <Block b={b} key={i} />)}
          </div>

          <div className="pg-next">
            <div className="pg-next-label">jump to another neuron</div>
            <div className="pg-next-row">
              {others.map((o) => (
                <button key={o.id} className={`pg-next-btn ${o.accent === 'blue' ? 'blue' : ''}`} onClick={() => onNav(o.id)}>
                  <span className="pg-next-pip"></span>{o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.PageView = PageView;
