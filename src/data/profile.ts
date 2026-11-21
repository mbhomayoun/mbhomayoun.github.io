// ============================================================================
// SINGLE SOURCE OF TRUTH — MOHAMMAD BAGHER HOMAYOUN (MB HOMAYOUN)
// Edit any field below to customize bio, links, publications, projects, or CV.
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
  category: 'Geomechanics' | 'Drilling & CFD' | 'Stimulation' | 'Energy Policy';
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
  type: 'Journal' | 'Preprint' | 'Book';
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
  kind: 'Ph.D. Research' | 'M.Sc. Thesis' | 'Policy Collaboration' | 'Book & Authorship';
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
  monogram: 'MBH.',
  fullName: 'Mohammad Bagher Homayoun',
  shortName: 'MB Homayoun',
  roleTitle: 'Ph.D. Candidate in Petroleum Engineering & Energy Systems Researcher',
  affiliation: 'Department of Petroleum Engineering · Amirkabir University of Technology (Tehran Polytechnic)',
  location: 'Tehran, Iran',
  availability: 'Open to Research Collaborations, Subsurface Geomechanics & Energy Policy Projects',
  email: 'mb.homayoun@aut.ac.ir',
  coordinates: '35.7022° N, 51.4090° E',

  // ---- Hero Copy ----
  heroEyebrow: 'PETROLEUM GEOMECHANICS · WELLBORE CFD · ENERGY GOVERNANCE',
  heroHeadlineTop: 'Engineering Subsurface',
  heroHeadlineItalic: 'Mechanics & Energy',
  heroHeadlineBottom: 'Systems.',
  heroDescription:
    'I am Mohammad Bagher Homayoun (MB Homayoun), a doctoral researcher at Amirkabir University of Technology bridging viscoelastic-plastic wellbore integrity, carbonate acid-fracture mechanics, multiphase drilling CFD, and national energy governance reform.',

  // ---- Verified Telemetry / Output Strip ----
  stats: [
    { label: 'Peer-Reviewed & Preprints', value: 7, suffix: '+' },
    { label: 'Academic Textbook', value: 1, suffix: ' Vol.' },
    { label: 'Core Research Tracks', value: 4, suffix: '' },
    { label: 'OpenAlex Works Indexed', value: 4, suffix: '+' },
  ],

  // ---- Academic & Professional Profiles ----
  links: [
    {
      label: 'Google Scholar',
      handle: 'MB Homayoun · Publications Index',
      url: 'https://scholar.google.com/scholar?q=%22Mohammad+Bagher+Homayoun%22',
    },
    {
      label: 'LinkedIn',
      handle: 'MB Homayoun · LinkedIn',
      url: 'https://www.linkedin.com/search/results/all/?keywords=MB%20Homayoun',
    },
    {
      label: 'ResearchGate',
      handle: 'Mohammad Bagher Homayoun',
      url: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
    },
    {
      label: 'OpenAlex',
      handle: 'Author ID: A5120058838',
      url: 'https://openalex.org/A5120058838',
    },
    {
      label: 'GitHub',
      handle: 'github.com/homayounmb',
      url: 'https://github.com/homayounmb',
    },
  ],

  // ---- Pinned Scroll Laboratory Pillars ----
  pillars: [
    {
      id: 'pillar-geomechanics',
      index: '01',
      title: 'Viscoelastic-Plastic Wellbore Integrity',
      subtitle: 'Long-term formation creep & rock–cement–casing interaction',
      description:
        'Deep hydrocarbon formations exhibit time-dependent creep that reshapes radial stresses around wellbores over years of production. We formulate 3D sequential finite-element models capturing viscoelastic-plastic rock–cement–casing coupling and integrity derating under anisotropic tectonic stresses.',
      equation: 'ε(t) = ε_el + ε_ve(t) + ε_vp(σ, τ)   |   σ_eq ≤ σ_yield / SF(t)',
      metrics: [
        { label: 'Coupled Domains', value: 'Rock–Cement–Steel' },
        { label: 'Stress Regime', value: '3D Anisotropic' },
        { label: 'Focus', value: 'Long-Term Creep' },
      ],
      simulationMode: 'lattice',
      accent: '#2EE6D6',
    },
    {
      id: 'pillar-stimulation',
      index: '02',
      title: 'Carbonate Acid-Fracture Conductivity',
      subtitle: 'Decoupling rock mechanics & deterministic etching in Ilam limestone',
      description:
        'Predicting post-acidizing fracture conductivity requires separating rock mechanical closure from stochastic dissolution patterns. Using API RP-61 high-pressure conductivity testing on Ilam carbonate split core plugs, we quantify how machined channel depth and width govern closure resistance.',
      equation: 'k_f w_f (σ_c) = f(E, ν, d_etch, w_etch)   |   API RP-61 Cell',
      metrics: [
        { label: 'Core Plugs', value: '18.4 × 4.75 cm' },
        { label: 'Etch Depth', value: '0.6 – 1.6 mm' },
        { label: 'Published In', value: 'Scientific Reports' },
      ],
      simulationMode: 'wave',
      accent: '#F5B971',
    },
    {
      id: 'pillar-cfd',
      index: '03',
      title: 'Drilling Hydraulics & Wellbore CFD',
      subtitle: 'Multiphase cuttings transport & tetrahedral mesh optimization',
      description:
        'Preventing stuck pipe and cutting beds demands accurate solid–liquid multiphase fluid dynamics without prohibitive compute overhead. Validated against Amirkabir flow-loop experiments with four-nozzle bit geometry, our Model E2-475 achieves experimental fidelity at optimal mesh density.',
      equation: '∂ₜ(α_s ρ_s u_s) + ∇·(α_s ρ_s u_s ⊗ u_s) = −α_s∇p + M_drag + α_s ρ_s g',
      metrics: [
        { label: 'Optimal Mesh', value: '475k Elements' },
        { label: 'Flow Regime', value: 'Solid–Liquid 2φ' },
        { label: 'Textbook', value: 'Drilling Fluid Vol. 1' },
      ],
      simulationMode: 'curl',
      accent: '#8B7CFF',
    },
    {
      id: 'pillar-policy',
      index: '04',
      title: 'Energy Governance & Subsidy Reform',
      subtitle: 'TIS frameworks, optimization funds & hydrocarbon macro-policy',
      description:
        'Technical engineering gains stall without sound institutional incentives. Our multidisciplinary research designs national energy consumption optimization funds, electricity and natural gas subsidy redistribution mechanisms, and Technological Innovation System (TIS) industrial energy frameworks.',
      equation: 'Welfare_net = ∑ ΔE_saved · P_shadow − Cost_transition   |   TIS Matrix',
      metrics: [
        { label: 'Energy Waste Focus', value: '~30% Target Gap' },
        { label: 'Carriers Studied', value: 'Gas & Electricity' },
        { label: 'Benchmarks', value: 'Iran & Saudi Arabia' },
      ],
      simulationMode: 'network',
      accent: '#2EE6D6',
    },
  ] as ResearchPillar[],

  // ---- Featured Research Systems & Works ----
  projects: [
    {
      id: 'creep-casing-3d',
      title: '3D Rock–Cement–Casing Creep Solver',
      tagline: 'Sequential viscoelastic-plastic wellbore integrity modeling under anisotropic in-situ stress',
      category: 'Geomechanics',
      year: '2026',
      role: 'Lead Investigator (SSRN & M.Sc. Thesis Extension)',
      featured: true,
      metrics: '3D sequential coupling · Time-dependent casing integrity derating',
      tags: ['Viscoelasticity', 'Formation Creep', 'Casing Design', 'Anisotropic Stress'],
      summary:
        'Developed from M.Sc. thesis investigations on Iranian creeping formations into a full mathematical formulation and 3D sequential simulation framework evaluating how long-term rock creep transfers shear and radial collapse loads through the cement sheath onto production casing.',
      architecture: [
        'Coupled viscoelastic-plastic constitutive law modeling primary and steady-state formation creep',
        '3D sequential wellbore excavation, cementing, and production pressure loading steps',
        'Quantitative casing collapse & integrity derating curves under anisotropic horizontal stresses',
      ],
      outcomes: [
        'Published as full technical preprint on SSRN Electronic Journal (DOI: 10.2139/ssrn.7545360)',
        'Provides practical safety-factor derating guidelines for casing design in creeping salt/shale zones',
      ],
      sparkline: [20, 28, 36, 48, 57, 68, 79, 89, 96],
      githubUrl: 'https://doi.org/10.2139/ssrn.7545360',
      liveUrl: 'https://doi.org/10.2139/ssrn.7545360',
    },
    {
      id: 'ilam-acid-fracturing',
      title: 'Ilam Carbonate Acid-Fracture Conductivity',
      tagline: 'Experimental decoupling of rock mechanics & deterministic etching geometry under API RP-61',
      category: 'Stimulation',
      year: '2026',
      role: 'Co-Author · Scientific Reports (Nature)',
      featured: true,
      metrics: 'API RP-61 High-Pressure Cell · Cretaceous Ilam Limestone Plugs',
      tags: ['Acid Fracturing', 'Rock Mechanics', 'Carbonate Reservoir', 'API RP-61'],
      summary:
        'Experimental program isolating mechanical fracture closure from stochastic acid dissolution by machining deterministic channel profiles onto 18.4 × 4.75 cm Ilam carbonate split core plugs and measuring conductivity across varying stress regimes.',
      architecture: [
        'Precision-machined channel depth (0.6–1.6 mm) and width (1.4–2.48 mm) geometry matrix',
        'High-pressure API RP-61 conductivity testing across stepwise closure stresses',
        'Correlation linking Young’s modulus, rock hardness, and channel aspect ratio to conductivity retention',
      ],
      outcomes: [
        'Published in Scientific Reports (Nature Portfolio, 2026, DOI: 10.1038/s41598-026-76933-8)',
        'Establishes deterministic benchmarks for carbonate stimulation design in southwest Iranian reservoirs',
      ],
      sparkline: [25, 34, 42, 55, 63, 74, 83, 91, 98],
      githubUrl: 'https://doi.org/10.1038/s41598-026-76933-8',
      liveUrl: 'https://doi.org/10.1038/s41598-026-76933-8',
    },
    {
      id: 'wellbore-cfd-e2475',
      title: 'Wellbore Cleanup CFD & Mesh E2-475',
      tagline: 'Grid-independence & ANSYS multiphase solid–liquid simulation validated against AUT flow loop',
      category: 'Drilling & CFD',
      year: '2023',
      role: 'First Author · Journal of Petroleum Research',
      metrics: '475,000 optimal elements · CaCO3 cuttings transport validation',
      tags: ['ANSYS CFD', 'Cuttings Transport', 'Mesh Independence', 'Drilling Hydraulics'],
      summary:
        'Systematic mesh-sensitivity study comparing 100k, 200k, 475k, and 500k tetrahedral grids on a four-nozzle bit wellbore simulator to balance cuttings-concentration accuracy against solver runtime.',
      architecture: [
        'Four-nozzle bit simulator boundary modeling matching the Amirkabir experimental flow loop',
        'Eulerian-Eulerian two-phase water + CaCO3 drill cuttings transport formulation',
        'Model E2-475 configuration minimizing numerical diffusion while cutting runtime vs 500k grids',
      ],
      outcomes: [
        'Published in Journal of Petroleum Research (RIPI, 2023)',
        'Benchmark reference for graduate drilling-hydraulics CFD validation studies',
      ],
      sparkline: [32, 41, 49, 60, 69, 77, 84, 90, 94],
      githubUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
    },
    {
      id: 'drilling-fluid-textbook',
      title: 'Drilling Engineering: Vol. 1 — Drilling Fluid',
      tagline: 'University textbook published by Amirkabir University of Technology Press (مهندسی حفاری)',
      category: 'Drilling & CFD',
      year: '2023',
      role: 'Co-Author (with Dr. Mohsen Dehvedar)',
      metrics: 'AUT Press Publication · Undergraduate & M.Sc. Core Curriculum',
      tags: ['Drilling Fluids', 'Rheology', 'Rig Circulation', 'Textbook'],
      summary:
        'Comprehensive Persian-language academic volume covering drilling fluid chemistry, rheological engineering, mud additives, rig surface circulation equipment, and operational hole-problem mitigation.',
      architecture: [
        'Continuous-phase and chemical additive formulation principles',
        'Physical-chemical testing protocols and mud-type selection matrices',
        'Troubleshooting stuck pipe, lost circulation, and wellbore instability on the rig',
      ],
      outcomes: [
        'Published by Amirkabir University of Technology (Tehran Polytechnic) Publications',
        'Adopted by Petroleum Engineering students and field drilling engineers across Iran',
      ],
      sparkline: [28, 35, 46, 54, 62, 70, 79, 86, 92],
      githubUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
    },
    {
      id: 'energy-optimization-fund',
      title: 'Energy Consumption Optimization Fund & Subsidy Reform',
      tagline: 'Non-price & redistributive policy mechanisms curbing national electricity and natural gas waste',
      category: 'Energy Policy',
      year: '2024',
      role: 'Lead & Co-Author · Public Policy Journals',
      metrics: 'Addresses ~30% national energy intensity gap · Gas & Electricity cases',
      tags: ['Energy Subsidies', 'Optimization Fund', 'Public Policy', 'Energy Economics'],
      summary:
        'Multi-paper policy suite formulating an institutional Energy Consumption Optimization Fund alongside targeted subsidy-redistribution mechanisms that align industrial efficiency investments with social welfare.',
      architecture: [
        'Comparative diagnosis of price-based vs. non-price efficiency instruments',
        'Redistributive subsidy architecture decoupling household welfare from carrier price distortions',
        'Revolving financing mechanics for industrial energy-efficiency retrofits',
      ],
      outcomes: [
        'Published across Journal of Improvement Management (DOAJ) & Strategic Studies of Public Policy',
      ],
      sparkline: [19, 30, 41, 52, 64, 71, 80, 87, 93],
      githubUrl: 'https://doaj.org/article/df9976e1dd4a403d87eb8cc15acdd513',
      liveUrl: 'https://doaj.org/article/df9976e1dd4a403d87eb8cc15acdd513',
    },
    {
      id: 'tis-oil-governance',
      title: 'Industrial TIS Energy Policy & Oil Governance',
      tagline: 'Technological Innovation Systems (TIS) & comparative corporate governance in Saudi Aramco',
      category: 'Energy Policy',
      year: '2025',
      role: 'Co-Author · Improvement Management & Governance Knowledge',
      metrics: 'Mixed-methods policy analysis · Industry & Oil/Gas Value Chain',
      tags: ['Energy Governance', 'TIS Framework', 'Oil & Gas Policy', 'Comparative Case Study'],
      summary:
        'Evaluates mission-oriented versus diffusion-oriented energy technology policies for the industrial sector and dissects institutional and corporate governance pillars in major hydrocarbon-producing states.',
      architecture: [
        'Technological Innovation System (TIS) functional mapping for sustainable industrial technologies',
        'Comparative institutional assessment of Saudi Arabia’s oil & gas regulatory and Aramco governance',
      ],
      outcomes: [
        'Published in Journal of Improvement Management (2025) & Quarterly Journal of Governance Knowledge (2024)',
      ],
      sparkline: [22, 29, 39, 50, 60, 68, 76, 85, 91],
      githubUrl: 'https://doaj.org/article/fea4975615494821ae6f863020c30ff0',
      liveUrl: 'https://doaj.org/article/fea4975615494821ae6f863020c30ff0',
    },
  ] as ProjectItem[],

  // ---- Real Academic Publications & Book ----
  publications: [
    {
      id: 'pub-2026-scirep-ilam',
      title: 'Experimental investigation into the influence of rock mechanical properties and etching patterns on acid fracture conductivity in the ilam carbonate formation',
      authors: 'Mohammadreza Akbari, Mohammad Javad Ameri, Mohammad Bagher Homayoun',
      venue: 'Scientific Reports (Nature Portfolio)',
      year: 2026,
      type: 'Journal',
      citations: 0,
      doi: '10.1038/s41598-026-76933-8',
      topics: ['Acid Fracturing', 'Carbonate Mechanics', 'API RP-61'],
      abstract:
        'Acid fracturing represents a primary stimulation technique for unlocking commercial hydrocarbon productivity in tight carbonate reservoirs, yet predicting post-treatment fracture conductivity under closure stress remains challenging due to coupled dissolution geometry and rock mechanical deformation. This study decouples mechanical closure from stochastic dissolution kinetics by machining deterministic, idealized channel geometries onto standardized split core plugs (18.4 cm × 4.75 cm) of Cretaceous Ilam formation limestone from southwest Iran using an API RP-61 compliant high-pressure conductivity cell.',
      keyFinding:
        'Decoupling deterministic channel geometry (0.6–1.6 mm depth, 1.4–2.48 mm width) from stochastic acid etching clarifies how carbonate mechanical stiffness governs fracture conductivity retention under closure stress.',
      bibtex: `@article{akbari2026experimental,
  title={Experimental investigation into the influence of rock mechanical properties and etching patterns on acid fracture conductivity in the ilam carbonate formation},
  author={Akbari, Mohammadreza and Ameri, Mohammad Javad and Homayoun, Mohammad Bagher},
  journal={Scientific Reports},
  year={2026},
  doi={10.1038/s41598-026-76933-8}
}`,
      pdfUrl: 'https://doi.org/10.1038/s41598-026-76933-8',
    },
    {
      id: 'pub-2026-ssrn-creep',
      title: 'Long-Term Viscoelastic-Plastic Rock-Cement-Casing Interaction: Mathematical Formulation, 3D Sequential Simulation, and Integrity Derating under Anisotropic Stresses',
      authors: 'Mohammad Bagher Homayoun, Mohammad Javad Ameri, Mohammadreza Akbari',
      venue: 'SSRN Electronic Journal',
      year: 2026,
      type: 'Preprint',
      citations: 0,
      doi: '10.2139/ssrn.7545360',
      topics: ['Wellbore Integrity', 'Formation Creep', '3D Geomechanics'],
      abstract:
        'Formulates the coupled mathematical and 3D sequential finite-element framework governing long-term viscoelastic-plastic interaction across the host rock formation, cement sheath, and steel casing assembly, quantifying time-dependent stress redistribution and casing integrity derating under anisotropic subsurface stress fields.',
      keyFinding:
        'Anisotropic far-field stresses combined with host-rock creep accelerate ovalization and shear stress transfer across the cement sheath, requiring time-dependent casing derating criteria.',
      bibtex: `@article{homayoun2026viscoelastic,
  title={Long-Term Viscoelastic-Plastic Rock-Cement-Casing Interaction: Mathematical Formulation, 3D Sequential Simulation, and Integrity Derating under Anisotropic Stresses},
  author={Homayoun, Mohammad Bagher and Ameri, Mohammad Javad and Akbari, Mohammadreza},
  journal={SSRN Electronic Journal},
  year={2026},
  doi={10.2139/ssrn.7545360}
}`,
      pdfUrl: 'https://doi.org/10.2139/ssrn.7545360',
    },
    {
      id: 'pub-2025-jmi-policy',
      title: 'A Policy Framework for Energy in the Industry and Technology Sector',
      authors: 'Hossein Heirani, Mohammad Reza Akbari, Mohammad Bagher Homayoun',
      venue: 'Journal of Improvement Management',
      year: 2025,
      type: 'Journal',
      citations: 0,
      doi: '10.22034/jmi.2025.537444.3223',
      topics: ['Energy Policy', 'TIS Framework', 'Industrial Technology'],
      abstract:
        'Provides policy recommendations for revising national energy policies from the perspective of the industry and technology sector. Employing qualitative mixed methods—content analysis of policy documents, cross-country comparative studies, and semi-structured expert interviews—the study synthesizes mission-oriented and diffusion-oriented policies using the Technological Innovation System (TIS) framework.',
      keyFinding:
        'Integrating mission-oriented national targets with TIS diffusion-oriented instruments resolves coordination failures in industrial energy-efficiency technology adoption.',
      bibtex: `@article{heirani2025policy,
  title={A Policy Framework for Energy in the Industry and Technology Sector},
  author={Heirani, Hossein and Akbari, Mohammad Reza and Homayoun, Mohammad Bagher},
  journal={Journal of Improvement Management},
  year={2025},
  doi={10.22034/jmi.2025.537444.3223}
}`,
      pdfUrl: 'https://doaj.org/article/fea4975615494821ae6f863020c30ff0',
    },
    {
      id: 'pub-2024-jmi-fund',
      title: 'Providing the conceptual framework of Energy consumption optimization fund; A policy solution to reduce energy waste',
      authors: 'Hossein Heirani, Mohammad Bagher Homayoun, Mohammad Reza Akbari, Hamid Heidari, Amirhossein Sohankar, Sayyed Majid Miri Larimi',
      venue: 'Journal of Improvement Management',
      year: 2024,
      type: 'Journal',
      citations: 0,
      doi: '10.22034/jmi.2024.451038.3080',
      topics: ['Energy Policy', 'Optimization Fund', 'Energy Efficiency'],
      abstract:
        'Addresses high national energy intensity and roughly 30% energy output waste by classifying policy instruments into price-based and non-price-based mechanisms and designing a comprehensive institutional framework for an Energy Consumption Optimization Fund grounded in historical policy evaluation.',
      keyFinding:
        'A dedicated Energy Consumption Optimization Fund bridges capital barriers for efficiency retrofits while complementing gradual price-reform instruments.',
      bibtex: `@article{heirani2024optimization,
  title={Providing the conceptual framework of Energy consumption optimization fund; A policy solution to reduce energy waste},
  author={Heirani, Hossein and Homayoun, Mohammad Bagher and Akbari, Mohammad Reza and Heidari, Hamid and Sohankar, Amirhossein and Miri Larimi, Sayyed Majid},
  journal={Journal of Improvement Management},
  year={2024},
  doi={10.22034/jmi.2024.451038.3080}
}`,
      pdfUrl: 'https://doaj.org/article/df9976e1dd4a403d87eb8cc15acdd513',
    },
    {
      id: 'pub-2024-jokog-saudi',
      title: 'Examining the dimensions of energy governance, focusing on the oil and gas industry; A case study of Saudi Arabia',
      authors: 'Mohammad Bagher Homayoun, Mohammadreza Akbari, Hamid Heydari, Amirhossein Sohankar',
      venue: 'Quarterly Journal of Governance Knowledge',
      year: 2024,
      type: 'Journal',
      citations: 0,
      doi: 'Indexed in Magiran / Jokog',
      topics: ['Energy Governance', 'Oil & Gas Industry', 'Corporate Governance'],
      abstract:
        'Analyzes the institutional, regulatory, and corporate-governance dimensions of oil and gas sector management, examining Saudi Arabia’s hydrocarbon governance model and Saudi Aramco’s corporate structure to draw transferable lessons for resource-rich economies.',
      keyFinding:
        'Clear separation of sovereign regulatory oversight from commercially autonomous national oil company governance underpins long-term upstream investment resilience.',
      bibtex: `@article{homayoun2024governance,
  title={Examining the dimensions of energy governance, focusing on the oil and gas industry; A case study of Saudi Arabia},
  author={Homayoun, Mohammad Bagher and Akbari, Mohammadreza and Heydari, Hamid and Sohankar, Amirhossein},
  journal={Quarterly Journal of Governance Knowledge},
  year={2024}
}`,
      pdfUrl: 'https://scholar.google.com/scholar?q=%22Examining+the+dimensions+of+energy+governance%22+Homayoun',
    },
    {
      id: 'pub-2024-sspp-subsidies',
      title: "Iran's energy subsidies reform by introducing the new approach of redistributing energy subsidies; A case study of electricity and natural gas",
      authors: 'Mohammad Bagher Homayoun, Mohammadreza Akbari, Esmail Saghab Esfahani, et al.',
      venue: 'Strategic Studies of Public Policy',
      year: 2024,
      type: 'Journal',
      citations: 0,
      doi: 'Indexed in IranJournals / Ensani',
      topics: ['Energy Policy', 'Subsidy Reform', 'Gas & Electricity'],
      abstract:
        'Introduces a structured subsidy-redistribution framework targeting electricity and natural gas consumption inefficiencies, balancing state fiscal sustainability, equitable household protection, and incentives for rational energy use.',
      keyFinding:
        'Direct quota-linked redistribution turns flat hidden energy subsidies into transparent efficiency incentives without regressive shocks on vulnerable households.',
      bibtex: `@article{homayoun2024subsidies,
  title={Iran's energy subsidies reform by introducing the new approach of redistributing energy subsidies; A case study of electricity and natural gas},
  author={Homayoun, Mohammad Bagher and Akbari, Mohammadreza and Saghab Esfahani, Esmail},
  journal={Strategic Studies of Public Policy},
  year={2024}
}`,
      pdfUrl: 'https://scholar.google.com/scholar?q=%22redistributing+energy+subsidies%22+Homayoun',
    },
    {
      id: 'pub-2023-ripi-cfd',
      title: 'Comparison and Design of Optimal Mesh Size in Computational Fluid Dynamics Model of Well Cleaning',
      authors: 'Mohammad Bagher Homayoun, Mohsen Dehvedar, Amir Hossein Ashhar',
      venue: 'Journal of Petroleum Research (RIPI)',
      year: 2023,
      type: 'Journal',
      citations: 0,
      doi: 'Indexed in RIPI / SID',
      topics: ['Drilling Hydraulics', 'Wellbore CFD', 'Mesh Optimization'],
      abstract:
        'Evaluates tetrahedral mesh resolutions (100k, 200k, 475k, and 500k elements) in ANSYS CFD simulations of solid–liquid two-phase wellbore cleaning, benchmarked against Amirkabir University of Technology flow-loop experiments featuring a four-nozzle bit simulator and CaCO3 cuttings transport.',
      keyFinding:
        'The optimized Model E2-475 (~475,000 elements) reproduces experimental cuttings-transport behavior while lowering computational cost relative to over-refined grids.',
      bibtex: `@article{homayoun2023optimal,
  title={Comparison and Design of Optimal Mesh Size in Computational Fluid Dynamics Model of Well Cleaning},
  author={Homayoun, Mohammad Bagher and Dehvedar, Mohsen and Ashhar, Amir Hossein},
  journal={Journal of Petroleum Research},
  year={2023}
}`,
      pdfUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
    },
    {
      id: 'pub-book-drilling',
      title: 'Drilling Engineering — Volume 1: Drilling Fluid (مهندسی حفاری؛ دفتر یکم: سیال حفاری)',
      authors: 'Mohsen Dehvedar, Mohammad Bagher Homayoun',
      venue: 'Amirkabir University of Technology (Tehran Polytechnic) Publications',
      year: 2023,
      type: 'Book',
      citations: 0,
      doi: 'University Textbook · AUT Press',
      topics: ['Drilling Hydraulics', 'Drilling Fluids', 'Academic Textbook'],
      abstract:
        'University textbook detailing drilling fluid history, continuous-phase and additive chemistry, physical-chemical laboratory measurements, fluid classification, surface circulation equipment, and preventive solutions for drilling operational problems.',
      keyFinding:
        'Synthesizes Amirkabir University of Technology drilling-fluid curriculum and field practice into a structured reference for petroleum engineering students and practitioners.',
      bibtex: `@book{dehvedar2023drilling,
  title={Drilling Engineering -- Volume 1: Drilling Fluid},
  author={Dehvedar, Mohsen and Homayoun, Mohammad Bagher},
  publisher={Amirkabir University of Technology Publications},
  year={2023}
}`,
      pdfUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
    },
  ] as PublicationItem[],

  // ---- Academic & Research Chronicle ----
  timeline: [
    {
      id: 'tl-phd',
      period: '2023 — PRESENT',
      role: 'Ph.D. Candidate in Petroleum Engineering',
      institution: 'Amirkabir University of Technology (Tehran Polytechnic)',
      location: 'Tehran, Iran',
      kind: 'Ph.D. Research',
      summary:
        'Conducting doctoral research on coupled subsurface rock mechanics, viscoelastic-plastic rock–cement–casing wellbore integrity under anisotropic stresses, and experimental carbonate acid-fracture conductivity.',
      highlights: [
        'Co-authored 2026 Scientific Reports paper on Ilam carbonate acid-fracture conductivity',
        'Developed 3D sequential viscoelastic-plastic rock–cement–casing integrity formulation (SSRN, 2026)',
      ],
    },
    {
      id: 'tl-policy',
      period: '2023 — 2025',
      role: 'Energy Governance & Public Policy Researcher',
      institution: 'Multidisciplinary Policy Collaborations (incl. NRISP Researchers)',
      location: 'Tehran, Iran',
      kind: 'Policy Collaboration',
      summary:
        'Collaborated with technology-policy and energy-economics scholars to formulate actionable frameworks for energy subsidy redistribution, national optimization funds, and oil & gas governance.',
      highlights: [
        'Published peer-reviewed frameworks in Journal of Improvement Management (2024, 2025)',
        'Co-authored comparative Saudi Aramco oil governance study & gas/electricity subsidy reform model (2024)',
      ],
    },
    {
      id: 'tl-msc',
      period: '2021 — SEP 2023',
      role: 'M.Sc. in Petroleum Engineering (Drilling & Wellbore Mechanics)',
      institution: 'Amirkabir University of Technology (Tehran Polytechnic)',
      location: 'Tehran, Iran',
      kind: 'M.Sc. Thesis',
      summary:
        'Completed Master’s thesis titled "Study of the effect of formation creep on casing design in one of Iranian formations" under the supervision of Dr. Mohammad Javad Ameri Shahrabi.',
      highlights: [
        'Published CFD mesh-optimization study for multiphase wellbore cleaning in Journal of Petroleum Research (2023)',
        'Validated ANSYS two-phase cuttings transport simulations against AUT four-nozzle flow loop',
      ],
    },
    {
      id: 'tl-book',
      period: '2023',
      role: 'Co-Author — University Drilling Engineering Textbook',
      institution: 'Amirkabir University of Technology Publications',
      location: 'Tehran, Iran',
      kind: 'Book & Authorship',
      summary:
        'Co-authored "Drilling Engineering — Volume 1: Drilling Fluid" (مهندسی حفاری؛ دفتر یکم: سیال حفاری) alongside Dr. Mohsen Dehvedar.',
      highlights: [
        'Covers drilling fluid rheology, additive design, rig circulation equipment, and wellbore troubleshooting',
        'Adopted as a reference textbook for undergraduate and graduate drilling engineering courses',
      ],
    },
  ] as TimelineItem[],

  // ---- Technical Notes & Research Briefs ----
  writings: [
    {
      id: 'note-creep-casing',
      title: 'Why Formation Creep Changes Wellbore Integrity Years After Completion',
      subtitle: 'Coupling host-rock viscoelasticity, cement sheath stiffness, and anisotropic stress transfer',
      date: '2026',
      readTime: '6 min read',
      category: 'GEOMECHANICS',
      excerpt:
        'Elastic casing design checks only initial completion loads. In creeping evaporites and ductile shales, time-dependent radial closure gradually concentrates shear and collapse loads onto the cement–casing interface.',
      equationCallout: 'ε_total(t) = ε_elastic + ε_viscoelastic(t) + ε_viscoplastic(σ_eff, t)',
      sections: [
        {
          heading: '1. Beyond Static Elastic Casing Design',
          body: 'Conventional burst and collapse design assumes the surrounding formation stays frozen at initial drilling equilibrium. In creeping Iranian formations, however, deviatoric stress relaxes slowly into the wellbore annulus, shifting contact pressures onto the cement sheath and steel casing long after rig release.',
        },
        {
          heading: '2. Why Anisotropic Far-Field Stress Matters',
          body: 'When horizontal principal stresses differ (σ_H > σ_h), uniform radial closure breaks down into asymmetric elliptical loading. Even moderate non-uniformity triggers localized bending moments in casing and tensile radial cracking in brittle cement sheaths.',
        },
        {
          heading: '3. Sequential 3D Simulation',
          body: 'Modeling excavation, mud pressure support, cement hydration, and multi-year production sequentially allows engineers to derate casing collapse capacity realistically rather than relying on arbitrary empirical safety factors.',
        },
      ],
    },
    {
      id: 'note-acid-fracture',
      title: 'Separating Etching Geometry from Rock Closure in Carbonate Acid Fracturing',
      subtitle: 'Lessons from deterministic machined channels in Cretaceous Ilam limestone plugs',
      date: '2026',
      readTime: '5 min read',
      category: 'STIMULATION',
      excerpt:
        'Field acid treatments produce complex stochastic etched surfaces. Machining idealized channels onto split Ilam core plugs isolates how channel depth, width, and mechanical stiffness jointly control conductivity.',
      equationCallout: 'k_f w_f (σ_c)  ∝  f(d_channel, w_channel, E_rock, σ_closure)',
      sections: [
        {
          heading: '1. The Stochastic Ambiguity of Acid Etching',
          body: 'When hydrochloric acid reacts with heterogeneous carbonate rock, two plugs rarely yield identical surface roughness. That variability makes it hard to tell whether conductivity loss under closure stress stems from weak rock pillars or shallow dissolution valleys.',
        },
        {
          heading: '2. Deterministic API RP-61 Benchmarks',
          body: 'By machining controlled channel depths (0.6–1.6 mm) and widths (1.4–2.48 mm) onto standardized 18.4 × 4.75 cm Ilam core plugs, we isolate mechanical pillar deformation cleanly—producing calibrated benchmarks for closure-conductivity models.',
        },
      ],
    },
    {
      id: 'note-energy-policy',
      title: 'Why Engineering Efficiency Needs Institutional Energy Policy Design',
      subtitle: 'Bridging subsurface productivity with energy consumption optimization funds and TIS frameworks',
      date: '2025',
      readTime: '5 min read',
      category: 'ENERGY POLICY',
      excerpt:
        'Extracting energy efficiently underground solves only half the equation if downstream consumption wastes 30% of output. Linking technical innovation systems with targeted optimization funds aligns incentives across the value chain.',
      sections: [
        {
          heading: '1. Price vs. Non-Price Policy Instruments',
          body: 'Abrupt energy price hikes without capital channels or social protection rarely survive politically, yet flat universal subsidies lock in chronic waste. Combining quota-aware subsidy redistribution with a dedicated Energy Consumption Optimization Fund creates sustainable retrofit capital.',
        },
        {
          heading: '2. Technological Innovation Systems (TIS)',
          body: 'Evaluating national industrial energy strategies through mission-oriented targets and TIS diffusion functions ensures R&D investments translate into measurable industrial energy-intensity reductions.',
        },
      ],
    },
  ] as WritingItem[],
};
