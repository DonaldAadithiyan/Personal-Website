# Donald A. — Personal Website

A neural-network-themed portfolio. Six interactive neurons sit inside an animated blue mesh; clicking one zooms into a full content page. Pure static HTML — no build step, no dependencies to install.

---

## Running locally

Any static file server works. The simplest options:

```bash
# Python (built into macOS / most Linux)
python3 -m http.server 8080

# VS Code — install the "Live Server" extension, then click "Go Live"

# Node (if you have it)
npx serve .
```

Then open `http://localhost:8080` in your browser.

> Opening `index.html` directly as a `file://` URL won't work — the browser blocks the `fetch()` call that loads the headshot state.

---

## Customising the content

**`site.config.js` is the only file you need to edit.** Everything — name, bio, neurons, research entries, skills, jokes — is driven from the `window.SITE` object in that file. Save and refresh; there is no build step.

### Profile block

```js
profile: {
  name: 'Donald A.',
  role: 'ML Researcher · Engineer',
  photoId: 'hero-portrait',   // keep as-is (drag-drop slot ID)
  links: { github, linkedin, researchgate, email },
  greeting: { hi, blurb, email },
}
```

### Adding / removing a neuron

Copy any existing neuron object, change its `id`, `label`, `col`, and `page.blocks`. Neurons auto-layout — no coordinate math needed.

```js
{
  id: 'teaching',       // unique slug, becomes the URL hash (#teaching)
  label: 'Teaching',
  accent: 'teal',       // 'teal' or 'blue'
  icon: 'research',     // research | projects | experience | cv | contact
  col: 1,               // column number (1 = first ring, 2 = second, …)
  summary: { stat, statLabel, keywords, points },
  page: { kicker, title, lede, blocks: [ … ] },
}
```

### Content block types

| Type | Fields |
|------|--------|
| `text` | `text` |
| `heading` | `text` |
| `stats` | `items: [{ n, label }]` |
| `entries` | `items: [{ title, meta, tag, points[], links[] }]` |
| `skills` | `groups: [{ name, items[] }]` |
| `list` | `items[]` |
| `links` | `items: [{ label, url }]` |

### Background joke neurons

```js
backgroundJokes: [
  'It works on my machine ¯\\_(ツ)_/¯',
  '99% accuracy… on the training set.',
  // add as many as you like
]
```

---

## Adding your headshot

Drag your photo onto the central neuron in the browser — or place any image at `uploads/headshot.JPG` (already wired up as the default `src`).

---

## Adding your CV

Drop a PDF at `uploads/cv.pdf`. The CV page already links to it.

---

## File structure

```
Personal-Website/
├── index.html          ← entry point (loads everything)
├── site.config.js      ← THE only file to edit for content
├── image-slot.js       ← drag-drop headshot web component
├── uploads/
│   ├── headshot.JPG
│   └── cv.pdf
└── app/
    ├── styles.css      ← full visual system (dark palette, all components)
    ├── layout.js       ← auto-positions neurons, wires edges (no editing needed)
    ├── heroNeuro.jsx   ← sub-page hero constellation (no editing needed)
    ├── network.jsx     ← home: background canvas + interactive neurons
    ├── page.jsx        ← renders each neuron's inner page from config blocks
    └── app.jsx         ← root: zoom transitions, hash routing, nav bar
```

---

## Easter eggs

| Trigger | Effect |
|---------|--------|
| Konami code `↑↑↓↓←→←→ B A` | Gradient explosion — the whole network fires at once |
| Click headshot **5× within 2s** | `loss = NaN 💥 — try gradient clipping` |
| Hover the **teal dot** in `donald.a` for **3s** | Site architecture diagram appears |
| Click **`forward pass · live`** (bottom-right) | Full signal cascade + toast |
| Idle **45s** on the home screen | Sleep mode — move mouse to wake |
| Visit **all 5 neurons** then return home | `forward pass complete 🧠` (fires once per session) |

---

## Deploying to GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages → Source** and set the branch to `main`, folder to `/ (root)`.
3. GitHub Pages serves the files statically — no configuration needed.

The site has no server-side logic, no bundler, and no runtime dependencies beyond React 18 and Babel Standalone (loaded from CDN).

---

## Tech notes

- **React 18** + **Babel Standalone** — JSX compiled in-browser; no Node toolchain required.
- **Two canvas layers on home** — a dense blue fuzz/mesh background (parallaxed) and an interactive foreground with signal flow.
- **Sub-page background** — same two-layer canvas, dialled back so content is prominent.
- **Transitions** — opening a neuron rockets the network to scale(13); returning snaps it back instantly (network is always rendered, just covered by the opaque page).
- **Responsive** — below 880px the layout switches to a scrollable card grid (no canvas interaction).
