// heroNeuro.jsx — a soft, accent-tinted neural constellation that lives behind
// a page's hero. Echoes the home network so each page feels like the inside of
// that neuron. Pure decoration; pointer-events:none.
function HeroNeuro({ accent }) {
  const ref = React.useRef(null);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current; const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COL = accent === 'blue' ? [138, 166, 255] : [78, 220, 178];

    let W = 0, H = 0, nodes = [], raf, start = performance.now();
    const rnd = (a, b) => a + Math.random() * (b - a);

    const build = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(320, r.width); H = Math.max(180, r.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = Math.min(46, Math.round(W / 24));
      nodes = Array.from({ length: N }, () => {
        const z = Math.random();
        return {
          x: rnd(0, W), y: rnd(0, H), z,
          vx: rnd(-0.5, 0.5) * (0.12 + z * 0.22),
          vy: rnd(-0.5, 0.5) * (0.12 + z * 0.22),
          r: 0.6 + z * 2.2, ph: Math.random() * 6.28,
        };
      });
    };
    build();

    const LINK = 116, LINK2 = LINK * LINK;
    const draw = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x += W; else if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += H; else if (p.y > H) p.y -= H;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y; const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const d = Math.sqrt(d2);
            const al = (1 - d / LINK) * 0.16 * ((a.z + b.z) * 0.5 + 0.3);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${COL[0]},${COL[1]},${COL[2]},${al.toFixed(3)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const tw = 0.55 + 0.45 * Math.sin(t / 1600 + p.ph);
        const r = p.r * (0.85 + tw * 0.3);
        const a = (0.18 + p.z * 0.5) * tw;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
        g.addColorStop(0, `rgba(${COL[0]},${COL[1]},${COL[2]},${(a * 0.8).toFixed(3)})`);
        g.addColorStop(1, `rgba(${COL[0]},${COL[1]},${COL[2]},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COL[0]},${COL[1]},${COL[2]},${Math.min(0.7, a + 0.2).toFixed(3)})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    let ro; try { ro = new ResizeObserver(build); ro.observe(wrap); } catch (e) { /* ignore */ }
    const tids = [120, 500].map((d) => setTimeout(build, d));
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); tids.forEach(clearTimeout); };
  }, [accent]);

  return (
    <div className="pg-heroneuro" ref={wrapRef}>
      <canvas ref={ref}></canvas>
    </div>
  );
}
window.HeroNeuro = HeroNeuro;
