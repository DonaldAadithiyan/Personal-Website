// app.jsx — root: persistent bar, network <-> page zoom transitions, hash routing, theme.
const { useState, useEffect, useCallback, useRef } = React;

function App() {
  const SITE = window.SITE;
  const [pageId, setPageId] = useState(null);
  const [pageShown, setPageShown] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [netKey, setNetKey] = useState(0);
  const timers = useRef([]);
  // #6 — visit all neurons
  const visitedRef = useRef(new Set());
  const allVisitedShownRef = useRef(false);
  const [allVisitedEgg, setAllVisitedEgg] = useState(false);
  // #3 — brand dot hover
  const [dotHint, setDotHint] = useState(false);
  const dotTimerRef = useRef(null);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const originFor = useCallback((id) => {
    const L = window.computeLayout(SITE); const n = L.nodes[id];
    return n ? { x: n.fx * 100, y: n.fy * 100 } : { x: 50, y: 50 };
  }, [SITE]);

  const open = useCallback((id, originPct) => {
    clearTimers();
    visitedRef.current.add(id);
    setOrigin(originPct || originFor(id));
    setZoom(true);
    setPageId(id);
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    timers.current.push(setTimeout(() => setPageShown(true), 880));
  }, [originFor]);

  const back = useCallback(() => {
    clearTimers();
    setPageShown(false);
    if (location.hash) history.pushState(null, '', location.pathname);
    // #6 — all pages visited egg (fires once per session)
    if (!allVisitedShownRef.current && SITE.neurons.every((n) => visitedRef.current.has(n.id))) {
      allVisitedShownRef.current = true;
      setAllVisitedEgg(true);
      setTimeout(() => setAllVisitedEgg(false), 4500);
    }
    timers.current.push(setTimeout(() => {
      setPageId(null); setZoom(false);
      setNetKey((k) => k + 1);
    }, 100));
  }, [SITE.neurons]);

  const navTo = useCallback((id) => {
    clearTimers();
    setPageShown(false);
    timers.current.push(setTimeout(() => {
      setOrigin(originFor(id)); setPageId(id);
      if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
      timers.current.push(setTimeout(() => setPageShown(true), 60));
    }, 240));
  }, [originFor]);

  // hash sync (back/forward buttons, deep links)
  useEffect(() => {
    const sync = () => {
      const id = location.hash.replace('#', '');
      const exists = SITE.neurons.some((n) => n.id === id);
      if (exists) { setOrigin(originFor(id)); setZoom(true); setPageId(id); setPageShown(true); }
      else { setPageShown(false); setPageId(null); setZoom(false); setNetKey((k) => k + 1); }
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, [originFor]);

  return (
    <div className="app">
      <div className="app-bar">
        <button className="app-brand" onClick={back}>
          <span className="app-brand-dot" style={{ position:'relative' }}
            onMouseEnter={() => { dotTimerRef.current = setTimeout(() => setDotHint(true), 3000); }}
            onMouseLeave={() => { clearTimeout(dotTimerRef.current); setDotHint(false); }}>
            {dotHint && (
              <div style={{ position:'absolute', bottom:'calc(100% + 10px)', left:'50%', transform:'translateX(-50%)',
                background:'var(--panel-solid)', border:'1px solid var(--line)', borderRadius:10,
                padding:'10px 14px', fontFamily:'IBM Plex Mono,monospace', fontSize:11,
                color:'var(--soft)', whiteSpace:'pre', zIndex:100, pointerEvents:'none',
                boxShadow:'0 8px 32px rgba(0,0,0,.55)', lineHeight:1.7 }}>
                <span style={{ color:'var(--teal)' }}>// site architecture</span>{'\n'}
                {'you → research\n     → projects\n     → experience\n     → cv\n     → contact'}
              </div>
            )}
          </span>{' '}donald aadithiyan
        </button>
        <div className="app-nav">
          {SITE.neurons.map((n) => (
            <button key={n.id} className={pageId === n.id ? 'on' : ''} onClick={() => (pageId ? navTo(n.id) : open(n.id))}>{n.label}</button>
          ))}
        </div>
      </div>

      <div className="app-stage">
        <div className="app-net" style={{ '--ox': origin.x + '%', '--oy': origin.y + '%' }} data-zoom={zoom ? '1' : '0'}>
          <NetworkView key={netKey} onOpen={open} />
        </div>
        {pageId ? (
          <div className={`app-page ${pageShown ? 'show' : ''}`}>
            <PageView id={pageId} onBack={back} onNav={navTo} />
          </div>
        ) : null}
      </div>
      {/* #6 — all neurons visited toast */}
      {allVisitedEgg && (
        <div style={{ position:'fixed', bottom:64, left:'50%', transform:'translateX(-50%)',
          zIndex:9999, background:'var(--panel-solid)', borderRadius:12, padding:'13px 18px',
          border:'1px solid color-mix(in srgb, var(--teal) 45%, var(--line))',
          fontSize:13.5, color:'var(--text)', boxShadow:'0 22px 60px rgba(0,0,0,.6)',
          display:'flex', alignItems:'center', gap:12, whiteSpace:'nowrap' }}>
          <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, color:'var(--teal)',
            border:'1px solid color-mix(in srgb, var(--teal) 40%, transparent)',
            padding:'4px 8px', borderRadius:6 }}>full pass ✓</span>
          you explored all neurons — forward pass complete 🧠
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
