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
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const originFor = useCallback((id) => {
    const L = window.computeLayout(SITE); const n = L.nodes[id];
    return n ? { x: n.fx * 100, y: n.fy * 100 } : { x: 50, y: 50 };
  }, [SITE]);

  const open = useCallback((id, originPct) => {
    clearTimers();
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
    timers.current.push(setTimeout(() => {
      setPageId(null); setZoom(false);
      setNetKey((k) => k + 1); // remount NetworkView: resets all stuck state & restarts animations
    }, 100));
  }, []);

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
      else { setPageShown(false); setPageId(null); setZoom(false); }
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
          <span className="app-brand-dot"></span> donald.a
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
