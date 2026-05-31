// page.jsx — renders one neuron's full page from its config `blocks`.

// Ambient neural background for sub-pages — dim, viewport-fixed, behind all content.
function PageBgCanvas({ accent }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COL = accent === 'blue' ? [138, 166, 255] : [78, 220, 178];
    let W = 0, H = 0, nodes = [], raf, start = performance.now();
    const rnd = (a, b) => a + Math.random() * (b - a);
    const build = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = Math.min(160, Math.round((W * H) / 8000));
      nodes = Array.from({ length: N }, () => {
        const z = Math.random();
        return { x: rnd(-20, W + 20), y: rnd(-20, H + 20), z,
          vx: rnd(-0.5, 0.5) * (0.04 + z * 0.08), vy: rnd(-0.5, 0.5) * (0.04 + z * 0.08),
          r: 0.4 + z * 1.8, ph: Math.random() * 6.28 };
      });
    };
    build();
    const LINK = 145, LINK2 = LINK * LINK;
    const draw = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const d = Math.sqrt(d2);
            const al = (1 - d / LINK) * 0.09 * ((a.z + b.z) * 0.5 + 0.35);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${COL[0]},${COL[1]},${COL[2]},${al.toFixed(3)})`;
            ctx.lineWidth = 0.45; ctx.stroke();
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const tw = 0.5 + 0.5 * Math.sin(t / 2400 + p.ph);
        const r = p.r * (0.85 + tw * 0.28);
        const a = (0.07 + p.z * 0.22) * tw;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COL[0]},${COL[1]},${COL[2]},${Math.min(0.42, a + 0.09).toFixed(3)})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', build);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', build); };
  }, [accent]);
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
      <PageBgCanvas accent={accent} />
      <div className="pg-grid"></div>
      <div className="pg-scroll">
        <div className="pg-inner">
          <button className="pg-back" onClick={onBack}>
            <span className="pg-back-neuron"></span> back to network
          </button>

          <div className="pg-hero">
            {window.HeroNeuro ? <window.HeroNeuro accent={accent} /> : null}
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
