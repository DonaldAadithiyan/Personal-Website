/* ============================================================================
   site.config.js  —  THE ONLY FILE YOU NEED TO EDIT
   ----------------------------------------------------------------------------
   Everything on the website is generated from the SITE object below.
   Edit the text here, save, refresh the page — the frontend updates.

   HOW IT WORKS
   • profile .............. the centre "you" neuron (your photo + name)
   • neurons[] ............ every clickable neuron. Order doesn't matter;
                            position is decided by `col` (column number).
                              col 1 = first ring of neurons
                              col 2 = second ring, etc.
                            Neurons auto-space vertically inside their column,
                            and connections auto-wire column→column. So to add
                            a neuron you just add an object — no layout math.
   • each neuron has:
       id ........ unique slug, also the page URL (#research)
       label ..... text under the neuron
       accent .... 'teal' or 'blue' (the glow colour)
       col ....... which column it sits in
       summary ... the small card shown on HOVER (keep it short!)
                     stat / statLabel = the big number
                     points[] = up to ~3 quick highlights
       page ...... the full page shown when the neuron is CLICKED.
                   page.blocks[] is a list of content blocks. Block types:
                     { type:'text',    text:'…' }
                     { type:'heading', text:'…' }
                     { type:'stats',   items:[{n:'3.54', label:'CGPA'} …] }
                     { type:'entries', items:[{ title, meta, tag,
                                                points:['…','…'],
                                                links:[{label,url}] }] }
                     { type:'skills',  groups:[{ name, items:['Python', …] }] }
                     { type:'list',    items:['…','…'] }
                     { type:'links',   items:[{label, url}] }
                   Add / remove / reorder blocks freely.
   • To DELETE a neuron: remove its object. To ADD one: copy an existing
     neuron block, change id/label/col/summary/page.
   ============================================================================ */

window.SITE = {

  /* -------- the central "you" neuron -------------------------------------- */
  profile: {
    name: 'Donald A.',
    role: 'ML Researcher · Engineer',
    location: 'Colombo, Sri Lanka',
    photoId: 'hero-portrait',          // drag-drop headshot slot id (keep as is)
    links: {
      github: 'https://github.com/DonaldAadithiyan',
      linkedin: 'https://www.linkedin.com/in/donald-aadithiyan/',
      researchgate: 'https://www.researchgate.net/profile/Donald-Aadithiyan',
      email: 'donaldaadithiyanwork@gmail.com',
    },
    tagline: 'Understanding how AI systems decide, fail under uncertainty, and generalize.',

    // the "Hi there!" greeting card shown next to your photo neuron
    greeting: {
      hi: 'Hi there! I\'m',
      blurb: 'Welcome to my universe — a final-year CS & Engineering undergrad at the University of Moratuwa, wiring together reinforcement learning, interpretability, and a stubborn curiosity about why models fail.',
      email: 'donaldaadithiyanwork@gmail.com',
    },
  },

  /* -------- clickable neurons --------------------------------------------- */
  neurons: [

    /* ===== RESEARCH ===== */
    {
      id: 'research',
      label: 'Research',
      accent: 'teal',
      icon: 'research',
      col: 1,
      summary: {
        stat: '2',
        statLabel: 'active threads',
        keywords: ['epistemic uncertainty', 'RL world models', 'interpretability', 'DreamerV3'],
        points: [
          'Epistemic uncertainty in RL world models',
          'Interpretability of DreamerV3 hidden states',
        ],
      },
      page: {
        kicker: '01 — Research',
        title: 'Research',
        lede: 'I study how AI systems make decisions, fail under uncertainty, and generalize — reinforcement learning, model-based RL, interpretability, and uncertainty quantification. Three threads are active right now.',
        blocks: [
          { type: 'stats', items: [
            { n: '2', label: 'peer-reviewed' },
            { n: '1', label: 'under review · ICML\'26' },
            { n: '1', label: 'working paper' },
          ]},
          { type: 'heading', text: 'Active research threads' },
          { type: 'entries', items: [
            {
              title: 'Epistemic Uncertainty in RL World Models',
              meta: 'Independent Research · Phase 1 & 2',
              tag: 'Interpretability · Model-based RL',
              points: [
                'Probed whether DreamerV3\'s recurrent hidden state hₜ linearly encodes epistemic uncertainty without external OOD labels; the confusion signal is orthogonal to input novelty.',
                'Found uncertainty representation uniformly distributed across all GRU blocks with no localised subspace — structurally distinct from ROME-style localisation in transformer FFN layers.',
                'Extended the causal-tracing framework to recurrent GRU dynamics; Phase 2 shows the probe adds growing predictive information at longer horizons.',
              ],
              links: [],
            },
            {
              title: 'CAE-KAN: Interpretable Equity Valuation with a KAN Decoder',
              meta: 'Differential Capital, Johannesburg · Working paper',
              tag: 'Interpretability · Quant ML',
              points: [
                'Designed CAE-KAN — a Conditional Autoencoder with a KAN decoder mapping latent valuation factors through learnable B-splines.',
                'Introduced the Valuation Curvature Signal (VCS), a per-factor OOD stress measure attributing 8/8 JSE market-regime events to their economic transmission mechanisms.',
                'Formalised the accuracy–signal tradeoff, reframing interpretability as the correct benchmark on thin emerging markets.',
              ],
              links: [],
            },
            {
              title: 'Beyond Point Prediction: Multi-Horizon Rare-Event Forecasting',
              meta: 'Submitted to AI for Forecasting Workshop, ICML 2026 · under review',
              tag: 'Forecasting · Conformal inference',
              points: [
                'Built a two-stage decoupled pipeline: hybrid Prophet/ARIMA with XGBoost residual correction, then a stacking-ensemble RegressorChain conditioning longer-horizon recession probabilities on shorter ones.',
                'Novel finding: calibration-set rare-event class composition — not size — determines conformal interval validity under temporal distribution shift.',
                'Horizon-conditional SHAP reveals feature importance shifting from current-state to forward-looking signals across horizons.',
              ],
              links: [],
            },
          ]},
          { type: 'heading', text: 'Publications' },
          { type: 'entries', items: [
            {
              title: 'Predicting YouTube Video Initial Engagement Using Ensemble Machine Learning Techniques',
              meta: 'Intl. Conference in Data Science 2025 · Univ. of Colombo',
              tag: 'C.1 · Conference',
              points: ['Donald Aadithiyan, Birunthaban Rajendram, Parishith Ragumar (2025).'],
              links: [],
            },
            {
              title: 'Beyond Point Prediction: Inter-Temporal Conditioning and Conformal Uncertainty for Multi-Horizon Rare-Event Forecasting',
              meta: 'AI for Forecasting Workshop, ICML 2026 · Under Review',
              tag: 'W.1 · Workshop',
              points: ['Donald Aadithiyan (2026). Decision pending.'],
              links: [],
            },
            {
              title: 'When Better Models Predict Less: KAN Decoder Curvature as a Regime Attribution Signal on the JSE',
              meta: 'Differential Capital, Johannesburg · Working paper',
              tag: 'I.1 · In progress',
              points: ['Donald Aadithiyan (2026).'],
              links: [],
            },
          ]},
        ],
      },
    },

    /* ===== PROJECTS ===== */
    {
      id: 'projects',
      label: 'Projects',
      accent: 'teal',
      icon: 'projects',
      col: 1,
      summary: {
        stat: '5★',
        statLabel: 'Upwork · Top 15%',
        points: [
          '2× national hackathon winner',
          '4 shipped apps — Flutter · Next.js',
          '10k+ videos modelled (YouTube tool)',
        ],
      },
      page: {
        kicker: '02 — Projects',
        title: 'Projects',
        lede: 'Things I\'ve built and shipped — from ML tooling to cross-platform products delivered to real clients and competition stages.',
        blocks: [
          { type: 'stats', items: [
            { n: '5★', label: 'Upwork feedback · Top 15%' },
            { n: '2×', label: 'national hackathon wins' },
            { n: '1.3M', label: 'LKR delivered · Lightspeed' },
          ]},
          { type: 'heading', text: 'Selected builds' },
          { type: 'entries', items: [
            {
              title: 'YouTube Viewership Forecasting Tool',
              meta: 'Personal Project · Python, GCP, Streamlit',
              tag: 'ML tooling',
              points: [
                'Collected hourly metadata from 10,000+ YouTube videos on GCP; engineered engagement scores and log-transformed distributions.',
                'Two-stage pipeline: engagement-tier classification then tier-specific quantile regression; ensemble stacking beat all individual baselines.',
                'Deployed as an interactive Streamlit dashboard for content creators.',
              ],
              links: [],
            },
            {
              title: 'Localize Sri Lanka',
              meta: 'Team Project · Flutter, Firebase, OpenAI API',
              tag: 'Winner · IDEALIZE & DevThon 2024',
              points: [
                'A tourism platform: guides list packages and share a social-style feed; tourists book and get help from an AI chatbot.',
                'Integrated OpenAI for conversational support, Firebase for realtime + auth, Flutter for cross-platform deployment.',
                'Won two major national hackathons and placed 4th at Startup Spark 2024.',
              ],
              links: [],
            },
            {
              title: 'Moon',
              meta: 'Upwork · Flutter, BLE',
              tag: 'Shipped · Android & iOS',
              points: ['A Flutter app connecting to and controlling a smart design object over Bluetooth Low Energy.'],
              links: [],
            },
            {
              title: 'Fixsy',
              meta: 'Upwork · Flutter, Next.js, Firebase',
              tag: 'Shipped',
              points: ['Service-booking app and admin panel with a realtime analytics dashboard for booking patterns and technician performance.'],
              links: [],
            },
            {
              title: 'Social Pass · Grossoo',
              meta: 'Lightspeed Labs · Flutter, MedusaJS',
              tag: 'Shipped',
              points: ['Event-discovery app with attendance tracking and popularity prediction; e-commerce platform with behaviour analytics and demand forecasting.'],
              links: [],
            },
          ]},
        ],
      },
    },

    /* ===== EXPERIENCE ===== */
    {
      id: 'experience',
      label: 'Experience',
      accent: 'teal',
      icon: 'experience',
      col: 1,
      summary: {
        stat: '3',
        statLabel: 'roles',
        points: [
          'Differential Capital — DS Intern & Research',
          'Lightspeed Labs — PM & Full-Stack',
          'Upwork — Rising Talent (Top 15%)',
        ],
      },
      page: {
        kicker: '03 — Experience',
        title: 'Experience',
        lede: 'Where I\'ve worked — research collaboration, product delivery, and leading peer teams.',
        blocks: [
          { type: 'entries', items: [
            {
              title: 'Differential Capital PTY LTD',
              meta: 'Data Science Intern & Research Collaborator · Dec 2025 – Present',
              tag: 'Johannesburg',
              points: [
                'Developed and maintained ETL pipelines for retail web-scraper infrastructure; built a monitoring dashboard tracking data-quality metrics and pipeline health.',
                'Conducted EDA on historical scraped data, documenting schema inconsistencies and improving scraper robustness with better error handling and validation.',
                'Research: developing CAE-KAN for interpretable equity valuation on the JSE; introduced the Valuation Curvature Signal (working paper in preparation).',
              ],
              links: [],
            },
            {
              title: 'Upwork — Rising Talent (Full-Stack Developer)',
              meta: 'Freelance · Jan 2025 – Feb 2026',
              tag: 'Top 15% · 5★',
              points: [
                'Delivered two full-stack apps (Flutter, Next.js, Firebase) to international clients with 5-star feedback.',
                'Earned the Rising Talent badge — top 15% in the industry.',
              ],
              links: [],
            },
            {
              title: 'Lightspeed Labs — Collaborative Development Initiative',
              meta: 'Project Manager & Full-Stack Developer · Dec 2024 – Mar 2026',
              tag: '1.3M LKR revenue',
              points: [
                'Led a peer-driven team delivering full-stack web and mobile solutions for local and international clients; earned over 1.3 Million LKR in revenue.',
                'Shipped Social Pass (event discovery + predictive analytics) and Grossoo (e-commerce with demand forecasting).',
              ],
              links: [],
            },
          ]},
          { type: 'heading', text: 'Leadership & community' },
          { type: 'entries', items: [
            {
              title: 'Co-Chairperson — SpiritX 2025',
              meta: 'University of Moratuwa · 2025',
              tag: 'Hackathon lead',
              points: ['Led MoraSpirit\'s first inter-university hackathon: 160+ teams, 650+ participants from 20+ universities. Oversaw operations, sponsors, and judging.'],
              links: [],
            },
            {
              title: 'Member — MoraSpirit Web & Technology Pillar',
              meta: 'University of Moratuwa · 2024 – 2026',
              tag: 'Laravel backend',
              points: ['Built and maintained the admin panel for Sri Lanka\'s premier university sports platform, serving realtime scores and data to thousands of daily users.'],
              links: [],
            },
          ]},
        ],
      },
    },

    /* ===== CV ===== */
    {
      id: 'cv',
      label: 'CV / Résumé',
      accent: 'blue',
      icon: 'cv',
      col: 2,
      summary: {
        stat: '3.54',
        statLabel: 'CGPA / 4.0',
        points: [
          'Univ. of Moratuwa — CS & Engineering',
          'A/L Z-score 2.21 — top 1.67% in SL',
          'Full record + PDF download',
        ],
      },
      page: {
        kicker: '04 — Curriculum Vitae',
        title: 'CV / Résumé',
        lede: 'The full record — education, skills, awards, and certifications. Download the PDF for the complete version.',
        blocks: [
          { type: 'links', items: [{ label: '↓ Download CV (PDF)', url: 'uploads/cv.pdf' }] },
          { type: 'heading', text: 'Education' },
          { type: 'entries', items: [
            {
              title: 'University of Moratuwa',
              meta: 'BSc (Hons) in Engineering — CS & Engineering, Data Science stream · Mar 2022 – Present',
              tag: 'CGPA 3.54 / 4.0 · Second Upper',
              points: ['Coursework: Deep Neural Networks, Calculus, Operational Research, Data Structures & Algorithms, Database Systems.'],
              links: [],
            },
            {
              title: 'St. Peter\'s College — GCE Advanced Level',
              meta: 'Physics, Chemistry, Combined Maths · Jan 2019 – Jan 2022',
              tag: 'Z-score 2.21 · top 1.67% in SL',
              points: ['Distinctions (A) in all three subjects. O/Ls: 9 A\'s.'],
              links: [],
            },
          ]},
          { type: 'heading', text: 'Skills' },
          { type: 'skills', groups: [
            { name: 'ML & Deep Learning', items: ['PyTorch', 'Scikit-learn', 'Reinforcement Learning (PPO, DreamerV3)', 'Probing & Interpretability', 'Conformal Inference', 'SHAP', 'Ensemble Methods', 'Time Series'] },
            { name: 'Optimization & RL', items: ['Deep RL', 'Model-Based RL', 'RegressorChain', 'Optuna', 'Multi-Horizon Forecasting', 'Combinatorial Optimization'] },
            { name: 'Languages', items: ['Python', 'R', 'SQL', 'Dart', 'TypeScript', 'JavaScript', 'Java', 'C++'] },
            { name: 'Data Science', items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Feature Engineering', 'Statistical Modeling', 'Causal Tracing'] },
            { name: 'Web & Mobile', items: ['Flutter', 'Next.js', 'React.js', 'Node.js', 'FastAPI', 'Laravel'] },
            { name: 'Data & Cloud', items: ['MySQL', 'PostgreSQL', 'Firebase', 'Supabase', 'GCP'] },
          ]},
          { type: 'heading', text: 'Honors & awards' },
          { type: 'entries', items: [
            { title: 'Winners — IDEALIZE 2024', meta: 'Localize Sri Lanka · 200+ teams nationwide', tag: 'Double victory', points: ['Idealizer Award (best overall) + Trendsetter Award (innovation & national impact).'], links: [] },
            { title: 'Winners — DevThon 2024', meta: 'Localize Sri Lanka · 100+ teams · Leo Club, UoM', tag: 'National', points: [], links: [] },
            { title: '4th Place — Startup Spark 2024', meta: 'Localize Sri Lanka · Techno 2024, IESL · 50+ teams', tag: 'Pitch', points: ['Pitched to a panel of investors on product-market fit and vision.'], links: [] },
          ]},
          { type: 'heading', text: 'Certifications' },
          { type: 'list', items: [
            'Building Transformer-Based NLP Applications — NVIDIA (Certificate of Competency)',
            'Feature Engineering — Kaggle',
          ]},
          { type: 'heading', text: 'Beyond work' },
          { type: 'text', text: 'Self-taught investor — active in the Sri Lankan stock and treasury-bill markets for 2+ years, with a deep interest in finance, macroeconomics, and quantitative market modelling. Languages: English & Sinhala (professional), Tamil (native).' },
        ],
      },
    },

    /* ===== CONTACT ===== */
    {
      id: 'contact',
      label: 'Contact',
      accent: 'blue',
      icon: 'contact',
      col: 2,
      summary: {
        stat: '→',
        statLabel: 'get in touch',
        points: [
          'GitHub · DonaldAadithiyan',
          'LinkedIn · donald-aadithiyan',
          'donaldaadithiyanwork@gmail.com',
        ],
      },
      page: {
        kicker: '05 — Contact',
        title: 'Get in touch',
        lede: 'Open to research collaborations, PhD opportunities, and engineering roles. The fastest way to reach me is email.',
        blocks: [
          { type: 'links', items: [
            { label: 'Email — donaldaadithiyanwork@gmail.com', url: 'mailto:donaldaadithiyanwork@gmail.com' },
            { label: 'GitHub — DonaldAadithiyan', url: 'https://github.com/DonaldAadithiyan' },
            { label: 'LinkedIn — donald-aadithiyan', url: 'https://www.linkedin.com/in/donald-aadithiyan/' },
            { label: 'ResearchGate — profile', url: 'https://www.researchgate.net/profile/Donald-Aadithiyan' },
          ]},
          { type: 'text', text: 'Based in Colombo, Sri Lanka · +94 77 360 9683' },
        ],
      },
    },

  ],

  /* -------- quirky background neurons -------------------------------------
     Faint joke-neurons floating in the huge background network. Hover one to
     reveal the punchline. Keep them short. Add/remove freely.            */
  backgroundJokes: [
    'It works on my machine ¯\\_(ツ)_/¯',
    '99% accuracy… on the training set.',
    'It’s not overfitting, it’s memorising with confidence.',
    'CUDA out of memory (again).',
    'git commit -m "final_FINAL_v3_actually_final"',
    'My loss is going down. My hopes are going up.',
    'Reproducibility: a purely theoretical concept.',
    'Adam optimizer — because I gave up tuning.',
    'Stack Overflow is my real co-author.',
    'TODO: fix this before the deadline. (the deadline was Tuesday)',
    'Normalising my data and my sleep schedule.',
    'p < 0.05, so… trust me bro.',
  ],
};
