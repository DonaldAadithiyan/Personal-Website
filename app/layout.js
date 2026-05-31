/* layout.js — turns SITE.neurons into positions + connections.
   Auto-spaces each column vertically and wires every neuron to the
   previous column. You never edit this; it just reacts to the config. */
(function () {
  function computeLayout(SITE) {
    const neurons = SITE.neurons || [];
    const cols = {};
    neurons.forEach((n) => { (cols[n.col] = cols[n.col] || []).push(n); });
    const colNums = Object.keys(cols).map(Number).sort((a, b) => a - b);
    const maxCol = colNums.length ? Math.max(...colNums) : 1;

    const xFor = (c) => (maxCol === 0 ? 0.5 : 0.32 + (c / maxCol) * 0.54);
    const yDist = (i, n) => (n === 1 ? 0.5 : 0.2 + i * (0.6 / (n - 1)));

    const nodes = {};
    // central "you" neuron
    nodes.__you = { id: '__you', fx: xFor(0), fy: 0.5, col: 0, kind: 'input', accent: 'teal' };
    // clickable neurons
    colNums.forEach((c) => {
      cols[c].forEach((n, i) => {
        nodes[n.id] = {
          id: n.id, fx: xFor(c), fy: yDist(i, cols[c].length),
          col: c, kind: c === maxCol ? 'output' : 'hidden',
          accent: n.accent || 'teal', cardSide: c === 0 ? 'right' : 'left',
          ref: n,
        };
      });
    });

    // edges: connect each column to the one before it
    const edges = [];
    const byCol = (c) => Object.values(nodes).filter((n) => n.col === c);
    colNums.forEach((c) => {
      const prev = c - 1;
      const prevNodes = prev === 0 ? [nodes.__you] : byCol(prev);
      if (!prevNodes.length) return;
      byCol(c).forEach((n) => prevNodes.forEach((p) => edges.push([p.id, n.id])));
    });

    const neighbors = {};
    Object.keys(nodes).forEach((k) => (neighbors[k] = new Set()));
    edges.forEach(([a, b]) => { neighbors[a].add(b); neighbors[b].add(a); });

    return { nodes, edges, neighbors, maxCol };
  }
  window.computeLayout = computeLayout;
})();
