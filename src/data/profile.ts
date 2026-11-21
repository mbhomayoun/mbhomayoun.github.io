// ============================================================================
// SINGLE SOURCE OF TRUTH FOR YOUR PERSONAL WEBSITE
// Edit any field below to customize your identity, research, publications,
// projects, timeline, essays, and links. All components read from this file.
// ============================================================================

export type ShaderMode = 'interference' | 'lattice' | 'aurora';

export interface ResearchPillar {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  equation: string;
  metrics: { label: string; value: string }[];
  simulationMode: 'curl' | 'lattice' | 'wave' | 'network';
  accent: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Computational Physics' | 'AI & Modeling' | 'Open Tools' | 'Systems';
  year: string;
  role: string;
  featured?: boolean;
  metrics: string;
  tags: string[];
  summary: string;
  architecture: string[];
  outcomes: string[];
  sparkline: number[];
  githubUrl: string;
  liveUrl?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: 'Journal' | 'Conference' | 'Preprint';
  citations: number;
  doi: string;
  topics: string[];
  abstract: string;
  keyFinding: string;
  bibtex: string;
  pdfUrl: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  institution: string;
  location: string;
  kind: 'Position' | 'Education' | 'Grant & Award' | 'Visiting';
  summary: string;
  highlights: string[];
}

export interface WritingItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  equationCallout?: string;
  sections: { heading: string; body: string }[];
}

export const PROFILE = {
  // ---- Core Identity ----
  monogram: 'H.',
  fullName: 'Dr. Homayoun K.',
  shortName: 'Homayoun',
  roleTitle: 'Computational Scientist, Principal Investigator & Systems Architect',
  affiliation: 'Laboratory for Coupled Multiphysics & Scientific Intelligence',
  location: 'Tehran · Zurich · Global Collaborations',
  availability: 'Open to Research Collaborations, Advisory & Keynotes (2026–2027)',
  email: 'contact@homayoun-lab.org',
  coordinates: '35.7219° N, 51.3347° E',

  // ---- Hero Copy ----
  heroEyebrow: 'SCIENTIFIC COMPUTING · MULTIPHYSICS AI · ACADEMIC OBSERVATORY',
  heroHeadlineTop: 'Decoding Complex',
  heroHeadlineItalic: 'Physical Realities',
  heroHeadlineBottom: 'Into Living Code.',
  heroDescription:
    'I bridge physics-informed machine learning, high-performance numerical solvers, and interactive scientific instrumentation to make invisible multiscale phenomena computable, verifiable, and visually intuitive.',

  // ---- Live Telemetry / Impact Strip ----
  stats: [
    { label: 'Peer-Reviewed Papers', value: 28, suffix: '+' },
    { label: 'Cumulative Citations', value: 1420, suffix: '' },
    { label: 'Open-Source Solvers', value: 11, suffix: '' },
    { label: 'h-index', value: 17, suffix: '' },
  ],

  // ---- Social & Academic Profiles ----
  links: [
    { label: 'Google Scholar', handle: '@homayoun-research', url: 'https://scholar.google.com' },
    { label: 'ORCID', handle: '0000-0002-XXXX-XXXX', url: 'https://orcid.org' },
    { label: 'GitHub', handle: 'github.com/homayoun-lab', url: 'https://github.com' },
    { label: 'arXiv', handle: 'preprints / physics.comp-ph', url: 'https://arxiv.org' },
    { label: 'LinkedIn', handle: 'in/homayoun-research', url: 'https://linkedin.com' },
  ],

  // ---- Pinned Scroll Laboratory Pillars ----
  pillars: [
    {
      id: 'pillar-surrogates',
      index: '01',
      title: 'Physics-Informed Neural Operators',
      subtitle: 'Zero-shot PDE surrogates obeying conservation laws',
      description:
        'Conventional simulators stall on million-cell coupled fields. We design spectral & graph neural operators that embed mass, momentum, and thermodynamic bounds directly inside the latent manifold—delivering 4,000× speedups with calibrated uncertainty.',
      equation: '∂ₜu + ∇·F(u) = D∇²u + S(x, t)   |   L_phys = ‖R_PDE(u_θ)‖₂²',
      metrics: [
        { label: 'Solver Acceleration', value: '4,200×' },
        { label: 'Conservation Drift', value: '< 0.08%' },
        { label: 'Mesh Generalization', value: 'Zero-Shot' },
      ],
      simulationMode: 'curl',
      accent: '#2EE6D6',
    },
    {
      id: 'pillar-multiscale',
      index: '02',
      title: 'Coupled Multiscale Field Solvers',
      subtitle: 'Pore-to-continuum transport in heterogeneous media',
      description:
        'From micro-fracture topology to macro-scale reservoir and subsurface transport, we build GPU-accelerated hybrid finite-volume / lattice-Boltzmann engines capable of resolving stiff phase transitions across six orders of magnitude.',
      equation: 'K_eff(x) = ⟨u ⊗ ∇p⟩_Ω · (∇P)⁻¹   |   Δt_CFL ≤ h / λ_max',
      metrics: [
        { label: 'Throughput', value: '1.8B cells/s' },
        { label: 'Dynamic Range', value: '10⁻⁶ – 10² m' },
        { label: 'Precision', value: 'FP64 / Mixed' },
      ],
      simulationMode: 'lattice',
      accent: '#F5B971',
    },
    {
      id: 'pillar-inverse',
      index: '03',
      title: 'Bayesian Inverse Discovery',
      subtitle: 'Extracting governing laws from sparse, noisy sensors',
      description:
        'Real-world experiments rarely yield clean boundary conditions. By fusing adjoint-state gradients with variational inference, our pipelines reconstruct hidden permeability, diffusivity, and constitutive equations in real time.',
      equation: 'p(θ | y) ∝ exp(−½‖G(θ) − y‖_Σ⁻¹²) · π_prior(θ)',
      metrics: [
        { label: 'Sensor Sparsity', value: '3% coverage' },
        { label: 'Posterior Convergence', value: '12 min' },
        { label: 'Calibration Error', value: '0.014 ECE' },
      ],
      simulationMode: 'wave',
      accent: '#8B7CFF',
    },
    {
      id: 'pillar-instruments',
      index: '04',
      title: 'Interactive Scientific Instruments',
      subtitle: 'WebGPU visualizers & reproducible computational monographs',
      description:
        'Scientific software deserves museum-grade clarity. Every major paper from our group ships with browser-native interactive field explorers, open benchmarks, and deterministic notebooks anyone can inspect.',
      equation: 'Reproducibility = Code ∩ Data ∩ Seed ∩ Interactive Atlas',
      metrics: [
        { label: 'Open Artifacts', value: '100% FAIR' },
        { label: 'Community Stars', value: '6.4k' },
        { label: 'Live Demos', value: '14 WebGPU' },
      ],
      simulationMode: 'network',
      accent: '#2EE6D6',
    },
  ] as ResearchPillar[],

  // ---- Featured Projects & Case Studies ----
  projects: [
    {
      id: 'chronoflux-fno',
      title: 'ChronoFlux FNO',
      tagline: 'Fourier-spectral neural operator for coupled multiphase flow in fractured media',
      category: 'AI & Modeling',
      year: '2026',
      role: 'Principal Author & Architect',
      featured: true,
      metrics: '4,200× faster than fine-grid IMPEC · 99.4% mass conservation',
      tags: ['PyTorch', 'JAX', 'Fourier Operators', 'Multiphase PDEs'],
      summary:
        'ChronoFlux introduces an adaptive spectral-graph architecture that couples global Fourier modes with local fracture-aware message passing, enabling real-time sensitivity ensembles across 10,000+ geological realizations.',
      architecture: [
        'Dual-branch Spectral + Anisotropic Graph Encoder for unstructured corner-point grids',
        'Differentiable flux-limiter layer enforcing local mass conservation at every rollout step',
        'Ensemble conformal calibration wrapper providing provable 95% confidence envelopes',
      ],
      outcomes: [
        'Adopted by 4 academic computational mechanics groups across Europe and North America',
        'Reduced 30-day Monte Carlo uncertainty campaigns from 9 days on 64 GPUs to 18 minutes',
      ],
      sparkline: [18, 29, 34, 52, 61, 78, 86, 94, 99],
      githubUrl: 'https://github.com',
      liveUrl: 'https://arxiv.org',
    },
    {
      id: 'aether-lbm',
      title: 'Aether-LBM',
      tagline: 'Header-only CUDA/WebGPU Lattice-Boltzmann engine for micro-CT pore dynamics',
      category: 'Computational Physics',
      year: '2025',
      role: 'Lead Solver Engineer',
      featured: true,
      metrics: '1.84 GLUPS on single RTX 4090 · Zero-copy browser visualization',
      tags: ['CUDA', 'C++20', 'WebGPU', 'Lattice-Boltzmann'],
      summary:
        'Aether-LBM streams segmented 3D micro-tomography volumes directly into multi-relaxation-time D3Q27 collision kernels with sparse brick-map compression for 80% memory savings.',
      architecture: [
        'Sparse 8×8×8 active-fluid brick allocator eliminating solid-voxel memory footprint',
        'Shan-Chen & color-gradient immiscible two-phase kernels with dynamic contact angle control',
        'Shared-memory WebGPU compute bridge for live iso-surface & streamline inspection',
      ],
      outcomes: [
        'Featured benchmark in Computational Geosciences Open Solver Track 2025',
        'Over 2,400 GitHub stars and 19 external research citations',
      ],
      sparkline: [22, 24, 38, 45, 58, 70, 74, 88, 96],
      githubUrl: 'https://github.com',
    },
    {
      id: 'adjoint-lens',
      title: 'AdjointLens',
      tagline: 'Differentiable history-matching & symbolic constitutive law discovery suite',
      category: 'AI & Modeling',
      year: '2025',
      role: 'Co-Creator',
      metrics: 'Recovers sparse boundary tensors with < 2.1% relative L2 error',
      tags: ['JAX', 'Adjoint State', 'Bayesian Inference', 'Symbolic Regression'],
      summary:
        'Combines checkpointed reverse-mode automatic differentiation with Hamiltonian Monte Carlo to infer hidden spatial parameters from sparse borehole and acoustic observations.',
      architecture: [
        'Binomial revolve checkpointing for O(log T) memory scaling over 5,000 time steps',
        'Sparse-dictionary symbolic regularization isolating compact analytical closures',
      ],
      outcomes: [
        'Cut inverse calibration wall-clock time by 18× versus derivative-free EnKF baselines',
      ],
      sparkline: [30, 35, 42, 48, 55, 67, 73, 81, 89],
      githubUrl: 'https://github.com',
    },
    {
      id: 'atlas-monograph',
      title: 'Atlas Monograph Kit',
      tagline: 'Interactive WebGL scientific essay & live equation playground framework',
      category: 'Open Tools',
      year: '2026',
      role: 'Creator & Designer',
      metrics: '60fps shader plates · Exportable vector figures & BibTeX',
      tags: ['React', 'TypeScript', 'GLSL', 'Interactive Explainers'],
      summary:
        'An open-source publishing toolkit inspired by Distill.pub that turns dense mathematical appendices into manipulable visual proofs and responsive parameter sweeps.',
      architecture: [
        'Declarative WebGL2 shader stage bound directly to KaTeX/equation sliders',
        'Deterministic seed snapshot URLs for peer-review citation of interactive states',
      ],
      outcomes: [
        'Used across 6 graduate computational physics courses as interactive lecture notes',
      ],
      sparkline: [12, 25, 40, 49, 63, 71, 82, 90, 95],
      githubUrl: 'https://github.com',
      liveUrl: 'https://github.com',
    },
    {
      id: 'kestrel-mesh',
      title: 'Kestrel Mesh Orchestrator',
      tagline: 'Distributed adaptive mesh refinement scheduler for heterogeneous HPC clusters',
      category: 'Systems',
      year: '2024',
      role: 'Systems Architect',
      metrics: '93% weak-scaling efficiency up to 2,048 MPI ranks',
      tags: ['Rust', 'MPI', 'Space-Filling Curves', 'HPC'],
      summary:
        'Hilbert space-filling curve partitioner and asynchronous work-stealing runtime written in Rust for dynamic load balancing across CPU/GPU nodes.',
      architecture: [
        'Lock-free Morton/Hilbert octree rebalancing triggered by local error indicators',
        'Zero-serialization RDMA halo exchange wrapper over OpenMPI',
      ],
      outcomes: [
        'Eliminated tail-latency stragglers during shock-front adaptive refinement runs',
      ],
      sparkline: [40, 46, 51, 60, 68, 72, 79, 85, 92],
      githubUrl: 'https://github.com',
    },
    {
      id: 'thermospectra',
      title: 'ThermoSpectra DB',
      tagline: 'Curated thermodynamic phase-envelope dataset & differentiable EOS library',
      category: 'Computational Physics',
      year: '2024',
      role: 'Principal Maintainer',
      metrics: '140,000+ validated flash equilibria · JAX/PyTorch native',
      tags: ['Thermodynamics', 'EOS', 'JAX', 'Open Data'],
      summary:
        'Replaces brittle iterative Rachford-Rice root finders inside ML training loops with an exact implicit-differentiation Peng-Robinson & PC-SAFT thermodynamic layer.',
      architecture: [
        'Implicit Function Theorem custom VJP hooks for exact phase-split gradients',
        'Sub-microsecond batched stability analysis on GPU tensors',
      ],
      outcomes: [
        'Downloaded 48,000+ times via PyPI across chemical & subsurface engineering labs',
      ],
      sparkline: [15, 22, 31, 44, 59, 66, 77, 84, 91],
      githubUrl: 'https://github.com',
    },
  ] as ProjectItem[],

  // ---- Academic Publications ----
  publications: [
    {
      id: 'pub-2026-chronoflux',
      title: 'Conservation-Constrained Fourier-Graph Neural Operators for Multiphase Transport in Fractured Media',
      authors: 'Homayoun K., L. Vance, M. Al-Mansoor, E. Lindqvist',
      venue: 'Journal of Computational Physics (JCP)',
      year: 2026,
      type: 'Journal',
      citations: 42,
      doi: '10.1016/j.jcp.2026.113042',
      topics: ['Neural Operators', 'Multiphase Flow', 'Conservation Laws'],
      abstract:
        'We formulate a hybrid spectral-graph operator architecture that preserves discrete local mass balance across unstructured fractured domains. By coupling global Fourier convolutions with anisotropic edge-flux projections, the model generalizes across unseen fracture networks and boundary pressure regimes while maintaining sub-0.1% cumulative conservation drift.',
      keyFinding:
        'Enforcing discrete divergence projection inside the operator decoder eliminates long-horizon rollout blowup without sacrificing 4,200× inference acceleration.',
      bibtex: `@article{homayoun2026chronoflux,
  title={Conservation-Constrained Fourier-Graph Neural Operators for Multiphase Transport in Fractured Media},
  author={Homayoun, K. and Vance, L. and Al-Mansoor, M. and Lindqvist, E.},
  journal={Journal of Computational Physics},
  year={2026},
  doi={10.1016/j.jcp.2026.113042}
}`,
      pdfUrl: 'https://arxiv.org',
    },
    {
      id: 'pub-2025-implicit-eos',
      title: 'Exact Implicit Differentiation of Compositional Phase Equilibria for Physics-Coupled Learning',
      authors: 'Homayoun K., R. Takahashi',
      venue: 'NeurIPS — Machine Learning and the Physical Sciences',
      year: 2025,
      type: 'Conference',
      citations: 78,
      doi: '10.48550/arXiv.2509.04118',
      topics: ['Differentiable Physics', 'Thermodynamics', 'Implicit Layers'],
      abstract:
        'Coupling compositional transport with neural surrogates often fails due to non-differentiable iterative flash calculations near critical points. We derive analytical implicit Jacobians via the Implicit Function Theorem for cubic and SAFT equations of state, enabling end-to-end gradient flow in O(1) backward memory.',
      keyFinding:
        'Implicit VJP layers reduce memory overhead by 14× compared to unrolling Newton-Raphson iterations while remaining exact near phase boundaries.',
      bibtex: `@inproceedings{homayoun2025implicit,
  title={Exact Implicit Differentiation of Compositional Phase Equilibria for Physics-Coupled Learning},
  author={Homayoun, K. and Takahashi, R.},
  booktitle={NeurIPS Workshop on ML and the Physical Sciences},
  year={2025}
}`,
      pdfUrl: 'https://arxiv.org',
    },
    {
      id: 'pub-2025-aether-lbm',
      title: 'Sparse Brick-Compressed D3Q27 Lattice-Boltzmann Kernels for Digital Rock & Microfluidic Transport',
      authors: 'S. Darvish, Homayoun K., P. Moreau',
      venue: 'Computer Physics Communications',
      year: 2025,
      type: 'Journal',
      citations: 114,
      doi: '10.1016/j.cpc.2025.109211',
      topics: ['Lattice-Boltzmann', 'GPU Computing', 'Pore-Scale Physics'],
      abstract:
        'High-porosity and low-porosity digital core samples impose starkly different memory demands on direct numerical simulation. We present a dynamic 8³ sparse brick-map layout paired with half-precision streaming and FP64 collision accumulators, achieving 1.84 billion lattice updates per second on consumer GPUs.',
      keyFinding:
        'Mixed-precision streaming cuts VRAM bandwidth pressure by 62% with zero measurable shift in relative permeability curves.',
      bibtex: `@article{darvish2025sparse,
  title={Sparse Brick-Compressed D3Q27 Lattice-Boltzmann Kernels for Digital Rock Transport},
  author={Darvish, S. and Homayoun, K. and Moreau, P.},
  journal={Computer Physics Communications},
  year={2025},
  doi={10.1016/j.cpc.2025.109211}
}`,
      pdfUrl: 'https://arxiv.org',
    },
    {
      id: 'pub-2024-adjoint-bayes',
      title: 'Variational Adjoint Inversion of Spatially Heterogeneous Permeability Fields from Sparse Acoustic Data',
      authors: 'Homayoun K., A. Novak, D. Chen',
      venue: 'SIAM Journal on Scientific Computing (SISC)',
      year: 2024,
      type: 'Journal',
      citations: 165,
      doi: '10.1137/24M1648290',
      topics: ['Inverse Problems', 'Bayesian Inference', 'Adjoint Methods'],
      abstract:
        'We introduce a low-rank Hessian-preconditioned variational sampler guided by continuous adjoint sensitivities to quantify posterior uncertainty in ill-posed subsurface inverse problems with under 5% sensor coverage.',
      keyFinding:
        'Preconditioning by randomized SVD of the Gauss-Newton Hessian accelerates posterior mixing by 22×.',
      bibtex: `@article{homayoun2024variational,
  title={Variational Adjoint Inversion of Spatially Heterogeneous Permeability Fields},
  author={Homayoun, K. and Novak, A. and Chen, D.},
  journal={SIAM Journal on Scientific Computing},
  year={2024},
  doi={10.1137/24M1648290}
}`,
      pdfUrl: 'https://arxiv.org',
    },
    {
      id: 'pub-2026-preprint',
      title: 'Self-Verifying Scientific Agents: Closed-Loop Hypothesis Testing Over Differentiable PDE Environments',
      authors: 'Homayoun K., N. Patel',
      venue: 'arXiv Preprint (cs.LG / physics.comp-ph)',
      year: 2026,
      type: 'Preprint',
      citations: 19,
      doi: '10.48550/arXiv.2608.11024',
      topics: ['Scientific Agents', 'Differentiable Physics', 'Neural Operators'],
      abstract:
        'We examine how tool-augmented reasoning models can design numerical experiments, inspect residual convergence diagnostics, and falsify candidate constitutive laws inside sandboxed differentiable simulators.',
      keyFinding:
        'Pairing symbolic hypothesis generation with automated residual-norm falsification cuts spurious physical fits by 79%.',
      bibtex: `@misc{homayoun2026selfverifying,
  title={Self-Verifying Scientific Agents: Closed-Loop Hypothesis Testing Over Differentiable PDE Environments},
  author={Homayoun, K. and Patel, N.},
  year={2026},
  eprint={2608.11024},
  archivePrefix={arXiv}
}`,
      pdfUrl: 'https://arxiv.org',
    },
  ] as PublicationItem[],

  // ---- Career & Academic Timeline ----
  timeline: [
    {
      id: 'tl-1',
      period: '2024 — PRESENT',
      role: 'Principal Investigator & Lead Computational Architect',
      institution: 'Coupled Multiphysics & AI Research Group',
      location: 'Tehran / Remote Collaborations',
      kind: 'Position',
      summary:
        'Directing a cross-disciplinary group of 9 researchers building conservation-preserving neural operators, differentiable thermodynamics, and GPU-native pore-to-field solvers.',
      highlights: [
        'Secured multi-year computational grant for exascale neural surrogate benchmarking',
        'Published 11 peer-reviewed papers in JCP, SIAM SISC, and NeurIPS workshops',
      ],
    },
    {
      id: 'tl-2',
      period: '2023',
      role: 'Visiting Research Fellow — Scientific Machine Learning',
      institution: 'ETH Domain / European Computational Mechanics Consortium',
      location: 'Zurich, Switzerland',
      kind: 'Visiting',
      summary:
        'Developed hybrid Fourier-Graph operator architectures and co-taught the graduate seminar on differentiable partial differential equations.',
      highlights: [
        'Initiated the open-source ChronoFlux benchmark suite',
        'Delivered keynote tutorial on implicit thermodynamic layers',
      ],
    },
    {
      id: 'tl-3',
      period: '2021 — 2024',
      role: 'Senior Research Scientist (Multiphase Simulation & Inverse Modeling)',
      institution: 'Institute for Subsurface & Energy Systems',
      location: 'Tehran',
      kind: 'Position',
      summary:
        'Architected high-order compositional flow engines and Bayesian adjoint history-matching workflows for complex fractured formations.',
      highlights: [
        'Engineered 18× faster sparse-grid solver coupling C++20 and JAX',
        'Awarded Best Applied Computational Paper (2023)',
      ],
    },
    {
      id: 'tl-4',
      period: '2017 — 2021',
      role: 'Ph.D. in Computational Physics & Reservoir Engineering',
      institution: 'Sharif / National University of Science & Technology',
      location: 'Tehran',
      kind: 'Education',
      summary:
        'Dissertation: "Multiscale Operator Splitting and Variational Inversion for Coupled Transport in Heterogeneous Porous Media" — graduated Summa Cum Laude.',
      highlights: [
        'Recipient of the National Elite Foundation Doctoral Fellowship',
        '4 journal publications extracted directly from doctoral thesis',
      ],
    },
  ] as TimelineItem[],

  // ---- Writing / Notes / Monographs ----
  writings: [
    {
      id: 'note-conservation-inductive-bias',
      title: 'Why Unconstrained Neural Surrogates Hallucinate Physics at t > 50',
      subtitle: 'On symplectic structure, flux limiters, and inductive biases that survive rollout',
      date: 'OCT 2026',
      readTime: '7 min read',
      category: 'SCIENTIFIC ML',
      excerpt:
        'A neural network with 0.2% single-step MSE looks flawless in validation tables—until it creates mass out of thin air by step forty. Here is how to bake conservation directly into the architecture.',
      equationCallout: '∑_i V_i (u_i^{n+1} − u_i^n) = −Δt ∑_{f ∈ ∂Ω_i} F_f · n_f  ≡  0  (up to boundary flux)',
      sections: [
        {
          heading: '1. The Illusion of One-Step Accuracy',
          body: 'Most surrogate benchmarks report L2 error averaged over short horizons. Yet physical systems are governed by invariants—mass, momentum, entropy production—whose slightest violation compounds exponentially during autoregressive rollout. When a model predicts cell values directly instead of inter-cell fluxes, conservation errors accumulate as spurious sources and sinks.',
        },
        {
          heading: '2. Predicting Fluxes Rather Than States',
          body: 'By parameterizing the neural operator to output antisymmetric interface fluxes F_{ij} = -F_{ji} between neighboring control volumes and advancing via a conservative finite-volume update, exact global conservation holds by algebraic construction regardless of network weights or training epoch.',
        },
        {
          heading: '3. Calibrated Uncertainty at Regime Shifts',
          body: 'Even conservative surrogates face distribution shift when shock fronts cross unfamiliar heterogeneities. Coupling an inexpensive divergence residual monitor with conformal quantiles lets the solver automatically fall back to exact numerical sub-steps only on cells where local physics residuals spike.',
        },
      ],
    },
    {
      id: 'note-implicit-diff-thermo',
      title: 'Differentiating Through Phase Transitions Without Unrolling Newton Loops',
      subtitle: 'Applying the Implicit Function Theorem to stiff nonlinear equilibrium equations',
      date: 'JUL 2026',
      readTime: '6 min read',
      category: 'NUMERICAL METHODS',
      excerpt:
        'Unrolling 40 Newton iterations through PyTorch autograd wastes gigabytes of VRAM and suffers from vanishing gradients near critical points. Implicit differentiation solves both in three lines of linear algebra.',
      equationCallout: '∂z*/∂θ = −[ ∂g(z*, θ)/∂z ]⁻¹ · ∂g(z*, θ)/∂θ',
      sections: [
        {
          heading: '1. The Memory Trap of Unrolled Solvers',
          body: 'When embedding flash equilibrium or stiff chemical kinetics inside an end-to-end differentiable simulator, naive autograd stores every intermediate Jacobian and line-search step on the tape. Memory balloons linearly with iteration count.',
        },
        {
          heading: '2. Differentiating the Fixed Point Directly',
          body: 'Once any black-box C++ or CUDA solver finds the root g(z*, θ) = 0, the gradient depends solely on the converged state z*. Using a single linear solve on the transpose Jacobian ∂g/∂z at z* yields exact machine-precision sensitivities in O(1) memory.',
        },
      ],
    },
    {
      id: 'note-interactive-monographs',
      title: 'Every Computational Paper Should Ship as a Living Instrument',
      subtitle: 'Moving beyond static PDFs toward inspectable WebGPU scientific artifacts',
      date: 'MAR 2026',
      readTime: '5 min read',
      category: 'OPEN SCIENCE',
      excerpt:
        'Static 300-DPI figures hide sensitivity, failure modes, and boundary behavior. Interactive browser-native field explorers turn passive readers into active experimentalists.',
      sections: [
        {
          heading: '1. What Static Plots Conceal',
          body: 'Every published figure represents a curated slice of parameter space. When readers can drag the Peclet number, toggle heterogeneity variance, or probe residual fields live in their browser, understanding shifts from memorization to intuition.',
        },
        {
          heading: '2. Zero-Install Reproducibility',
          body: 'Modern WebGPU and WebAssembly bring real compute directly to the document layer. Pairing every manuscript with a lightweight browser artifact bridges archival rigor and immediate tactile exploration.',
        },
      ],
    },
  ] as WritingItem[],
};
