// page.jsx — renders one neuron's full page from its config `blocks`.
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
