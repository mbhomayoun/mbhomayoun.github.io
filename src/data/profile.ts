// ============================================================================
// BILINGUAL SINGLE SOURCE OF TRUTH — MOHAMMAD BAGHER HOMAYOUN (MB HOMAYOUN)
// Supports English (en / LTR) and Persian (fa / RTL) seamlessly.
// ============================================================================

export type Lang = 'en' | 'fa';
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
  categoryLabel: string;
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
  typeLabel: string;
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
  kind: string;
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

export interface ProfileData {
  pageTitle: string;
  monogram: string;
  fullName: string;
  shortName: string;
  brandSubtitle: string;
  roleTitle: string;
  affiliation: string;
  location: string;
  availability: string;
  email: string;
  coordinates: string;
  heroEyebrow: string;
  heroHeadlineTop: string;
  heroHeadlineItalic: string;
  heroHeadlineBottom: string;
  heroDescription: string;
  stats: { label: string; value: number; suffix: string }[];
  links: { label: string; handle: string; url: string }[];
  pillars: ResearchPillar[];
  projects: ProjectItem[];
  publications: PublicationItem[];
  timeline: TimelineItem[];
  writings: WritingItem[];
  marqueeTerms: string[];
}

export interface UICopy {
  nav: { id: string; label: string }[];
  indexLabel: string;
  langSwitchLabel: string;
  langSwitchShort: string;
  preloaderInit: string;
  preloaderCaption: string;
  preloaderConvergence: string;
  hero: {
    exploreLab: string;
    publications: string;
    dragHint: string;
    modes: { id: 'stress' | 'cfd' | 'fracture'; label: string }[];
  };
  lab: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    pillarLabel: string;
    ofLabel: string;
    scrollMorph: string;
    liveSim: string;
    interactHint: string;
    stageLabel: string;
  };
  projects: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    allLabel: string;
    categories: {
      key: 'All' | ProjectItem['category'];
      label: string;
    }[];
    benchmark: string;
    overview: string;
    architecture: string;
    outcomes: string;
    recordLink: string;
    paperLink: string;
    closeAria: string;
  };
  publications: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    featuredWorks: string;
    venuesLabel: string;
    searchPlaceholder: string;
    topicNodes: string;
    allClusters: string;
    types: { key: 'All' | PublicationItem['type']; label: string }[];
    bibtex: string;
    copiedBibtex: string;
    pdfLink: string;
    keyFinding: string;
    citationsSuffix: string;
    emptyState: string;
  };
  chronicle: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
  };
  writing: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    subtitle: string;
    readNote: string;
    closeAria: string;
  };
  contact: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    headingTail: string;
    directEmail: string;
    copy: string;
    copied: string;
    formTitle: string;
    formStatus: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    topicLabel: string;
    topicPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    sentTitle: string;
    sentBodyPrefix: string;
    sentAnother: string;
    footerSuffix: string;
    footerShortcut: string;
  };
  command: {
    placeholder: string;
    empty: string;
    copiedEmail: string;
    copiedBibtex: string;
    groups: {
      navigate: string;
      visual: string;
      utilities: string;
      projects: string;
      citations: string;
    };
    navLabels: { id: string; label: string; hint: string }[];
    motionEnableFull: string;
    motionEnableLow: string;
    motionActive: string;
    motionFull: string;
    copyEmailPrefix: string;
    bibtexPrefix: string;
  };
}

export const UI_COPY: Record<Lang, UICopy> = {
  en: {
    nav: [
      { id: 'laboratory', label: 'Lab' },
      { id: 'projects', label: 'Projects' },
      { id: 'publications', label: 'Papers' },
      { id: 'chronicle', label: 'Chronicle' },
      { id: 'academy', label: 'Blog & Vault' },
      { id: 'contact', label: 'Contact' },
    ],
    indexLabel: 'Menu',
    langSwitchLabel: 'Switch to Persian',
    langSwitchShort: 'فارسی',
    preloaderInit: 'OBSERVATORY // INIT',
    preloaderCaption: 'Calibrating 3D Field & Publications Index',
    preloaderConvergence: 'RESIDUAL CONVERGENCE',
    hero: {
      exploreLab: 'Explore Research Lab',
      publications: 'Publications',
      dragHint: 'DRAG SPACE TO ORBIT 3D FIELD',
      modes: [
        { id: 'stress', label: 'Stress Core' },
        { id: 'cfd', label: 'CFD Helices' },
        { id: 'fracture', label: 'Fracture Matrix' },
      ],
    },
    lab: {
      eyebrow: '01 // SCROLL-DRIVEN RESEARCH LABORATORY',
      headingLead: 'Four Pillars of',
      headingAccent: 'Inquiry',
      pillarLabel: 'PILLAR',
      ofLabel: '/',
      scrollMorph: 'SCROLL TO MORPH ↓',
      liveSim: 'LIVE SIMULATION //',
      interactHint: 'MOVE POINTER TO PERTURB',
      stageLabel: 'Stage',
    },
    projects: {
      eyebrow: '02 // RESEARCH ARTIFACTS & CASE STUDIES',
      headingLead: 'Selected Systems &',
      headingAccent: 'Studies',
      allLabel: 'All',
      categories: [
        { key: 'All', label: 'All' },
        { key: 'Geomechanics', label: 'Geomechanics' },
        { key: 'Stimulation', label: 'Stimulation' },
        { key: 'Drilling & CFD', label: 'Drilling & CFD' },
        { key: 'Energy Policy', label: 'Energy Policy' },
      ],
      benchmark: 'BENCHMARK //',
      overview: 'Overview',
      architecture: 'Methodological Highlights',
      outcomes: 'Scientific & Practical Outcomes',
      recordLink: 'Publication / Record',
      paperLink: 'DOI / Full Text',
      closeAria: 'Close case study',
    },
    publications: {
      eyebrow: '03 // ACADEMIC ARCHIVE & CITATION MATRIX',
      headingLead: 'Publications &',
      headingAccent: 'Monographs',
      featuredWorks: 'Indexed Works',
      venuesLabel: 'Journals & Press',
      searchPlaceholder: 'Search title, co-author, venue, or topic...',
      topicNodes: 'TOPIC NODES:',
      allClusters: 'All Clusters',
      types: [
        { key: 'All', label: 'All' },
        { key: 'Journal', label: 'Journal' },
        { key: 'Preprint', label: 'Preprint' },
        { key: 'Book', label: 'Book' },
      ],
      bibtex: 'BibTeX',
      copiedBibtex: 'Copied BibTeX',
      pdfLink: 'Link',
      keyFinding: 'Key Finding:',
      citationsSuffix: 'citations',
      emptyState: 'No publications match your current filter. Try clearing the search or topic node.',
    },
    chronicle: {
      eyebrow: '04 // ACADEMIC & RESEARCH CHRONICLE',
      headingLead: 'Trajectory &',
      headingAccent: 'Milestones',
    },
    writing: {
      eyebrow: '06 // TECHNICAL NOTES & FIELD ESSAYS',
      headingLead: 'Writing &',
      headingAccent: 'Briefs',
      subtitle:
        'Focused technical notes on viscoelastic wellbore mechanics, carbonate acidizing, and institutional energy reform.',
      readNote: 'Read Brief',
      closeAria: 'Close reader',
    },
    contact: {
      eyebrow: '07 // COLLABORATE & CONNECT',
      headingLead: "Let's build something",
      headingAccent: 'verifiable',
      headingTail: '& enduring.',
      directEmail: 'Direct Correspondence',
      copy: 'Copy',
      copied: 'Copied',
      formTitle: 'TRANSMIT RESEARCH INQUIRY',
      formStatus: 'DIRECT CHANNEL',
      nameLabel: 'Your Name',
      namePlaceholder: 'Dr. Ali Rezaei',
      emailLabel: 'Institutional / Work Email',
      emailPlaceholder: 'name@university.ac.ir',
      topicLabel: 'Subject / Collaboration Focus',
      topicPlaceholder: 'Geomechanics · CFD Simulation · Energy Policy',
      messageLabel: 'Message',
      messagePlaceholder: 'Share context, collaboration details, or manuscript references...',
      send: 'Prepare Transmission',
      sentTitle: 'Dispatch Prepared',
      sentBodyPrefix: 'Your inquiry is ready. You can connect a form endpoint or reach me directly at',
      sentAnother: 'Send Another Note',
      footerSuffix: 'Academic Observatory & Interactive Research Portfolio.',
      footerShortcut: 'PRESS ⌘K TO OPEN MENU',
    },
    command: {
      placeholder: 'Jump to section, blog, or copy BibTeX...',
      empty: 'No matching entries.',
      copiedEmail: 'Email copied to clipboard',
      copiedBibtex: 'BibTeX citation copied',
      groups: {
        navigate: 'Navigate',
        visual: 'Accessibility',
        utilities: 'Quick Actions',
        projects: 'Research Studies',
        citations: 'Copy Citation',
      },
      navLabels: [
        { id: 'hero', label: 'Observatory Home', hint: '00' },
        { id: 'laboratory', label: 'Scroll-Driven Research Lab', hint: '01' },
        { id: 'projects', label: 'Selected Systems & Studies', hint: '02' },
        { id: 'publications', label: 'Academic Publications & Book', hint: '03' },
        { id: 'chronicle', label: 'Academic Chronicle', hint: '04' },
        { id: 'academy', label: 'Blog, Alerts & Learning Vault', hint: '05' },
        { id: 'writing', label: 'Technical Notes & Briefs', hint: '06' },
        { id: 'contact', label: 'Contact & Collaborations', hint: '07' },
      ],
      motionEnableFull: 'Enable Full 3D & Scroll Motion',
      motionEnableLow: 'Enable Low-Motion Accessibility Mode',
      motionActive: 'Low',
      motionFull: 'Full',
      copyEmailPrefix: 'Copy Email',
      bibtexPrefix: 'BibTeX:',
    },
  },

  fa: {
    nav: [
      { id: 'laboratory', label: 'پژوهش' },
      { id: 'projects', label: 'پروژه‌ها' },
      { id: 'publications', label: 'مقالات' },
      { id: 'chronicle', label: 'مسیر علمی' },
      { id: 'academy', label: 'وبلاگ و آموزش' },
      { id: 'contact', label: 'تماس' },
    ],
    indexLabel: 'منو',
    langSwitchLabel: 'تغییر زبان به انگلیسی',
    langSwitchShort: 'EN',
    preloaderInit: 'رصدخانه علمی // راه‌اندازی',
    preloaderCaption: 'کالیبراسیون میدان سه‌بعدی و نمایه مقالات علمی',
    preloaderConvergence: 'همگرایی عددی مدل',
    hero: {
      exploreLab: 'ورود به آزمایشگاه پژوهش',
      publications: 'مقالات و آثار علمی',
      dragHint: 'فضای سه‌بعدی را برای چرخش بکشید',
      modes: [
        { id: 'stress', label: 'هسته تنش' },
        { id: 'cfd', label: 'مارپیچ CFD' },
        { id: 'fracture', label: 'ماتریس شکاف' },
      ],
    },
    lab: {
      eyebrow: '۰۱ // آزمایشگاه پژوهش همگام با اسکرول',
      headingLead: 'چهار رکن اصلی',
      headingAccent: 'پژوهش',
      pillarLabel: 'محور',
      ofLabel: 'از',
      scrollMorph: 'برای تغییر فاز اسکرول کنید ↓',
      liveSim: 'شبیه‌سازی زنده //',
      interactHint: 'برای برهم‌کنش نشانگر را حرکت دهید',
      stageLabel: 'مرحله',
    },
    projects: {
      eyebrow: '۰۲ // دستاوردهای مهندسی و مطالعات موردی',
      headingLead: 'سامانه‌ها و',
      headingAccent: 'پژوهش‌های برگزیده',
      allLabel: 'همه',
      categories: [
        { key: 'All', label: 'همه' },
        { key: 'Geomechanics', label: 'ژئومکانیک' },
        { key: 'Stimulation', label: 'انگیزش مخزن' },
        { key: 'Drilling & CFD', label: 'حفاری و CFD' },
        { key: 'Energy Policy', label: 'سیاست انرژی' },
      ],
      benchmark: 'معیار فنی //',
      overview: 'مرور اجمالی',
      architecture: 'نوآوری‌های روش‌شناختی',
      outcomes: 'دستاوردهای علمی و کاربردی',
      recordLink: 'مشاهده سند / شناسه',
      paperLink: 'متن / DOI',
      closeAria: 'بستن پنجره',
    },
    publications: {
      eyebrow: '۰۳ // آرشیو آثار علمی و استنادات',
      headingLead: 'مقالات و',
      headingAccent: 'تألیفات دانشگاهی',
      featuredWorks: 'آثار ثبت‌شده',
      venuesLabel: 'نشریات و ناشران',
      searchPlaceholder: 'جستجو در عنوان، نویسنده همکار، نشریه یا کلیدواژه...',
      topicNodes: 'خوشه‌های موضوعی:',
      allClusters: 'همه موضوعات',
      types: [
        { key: 'All', label: 'همه' },
        { key: 'Journal', label: 'مقاله علمی' },
        { key: 'Preprint', label: 'پیش‌چاپ' },
        { key: 'Book', label: 'کتاب' },
      ],
      bibtex: 'BibTeX',
      copiedBibtex: 'کپی شد',
      pdfLink: 'پیوند',
      keyFinding: 'یافته کلیدی:',
      citationsSuffix: 'استناد',
      emptyState: 'مقاله‌ای با این فیلتر یافت نشد. جستجو یا خوشه موضوعی را پاک کنید.',
    },
    chronicle: {
      eyebrow: '۰۴ // کارنامه دانشگاهی و سوابق پژوهشی',
      headingLead: 'مسیر علمی و',
      headingAccent: 'دستاوردها',
    },
    writing: {
      eyebrow: '۰۶ // یادداشت‌های تخصصی و مقالات تحلیلی',
      headingLead: 'یادداشت‌ها و',
      headingAccent: 'گزارش‌های فنی',
      subtitle:
        'تحلیل‌های تخصصی درباره مکانیک زمان‌مند چاه، اسیدکاری کربناته و اصلاح نهادهای سیاست‌گذاری انرژی.',
      readNote: 'مطالعه یادداشت',
      closeAria: 'بستن متن',
    },
    contact: {
      eyebrow: '۰۷ // همکاری‌های پژوهشی و ارتباط',
      headingLead: 'مسیر پژوهش‌های',
      headingAccent: 'دقیق',
      headingTail: 'و ماندگار.',
      directEmail: 'مکاتبه مستقیم',
      copy: 'کپی',
      copied: 'کپی شد',
      formTitle: 'ارسال پیام و پیشنهاد همکاری',
      formStatus: 'کانال مستقیم',
      nameLabel: 'نام و نام خانوادگی',
      namePlaceholder: 'دکتر علی رضایی',
      emailLabel: 'ایمیل دانشگاهی یا سازمانی',
      emailPlaceholder: 'name@aut.ac.ir',
      topicLabel: 'موضوع همکاری',
      topicPlaceholder: 'ژئومکانیک مخازن · شبیه‌سازی CFD · حکمرانی انرژی',
      messageLabel: 'متن پیام',
      messagePlaceholder: 'توضیحات پروژه، طرح پژوهشی یا مقاله مورد نظر را بنویسید...',
      send: 'آماده‌سازی پیام',
      sentTitle: 'پیام آماده ارسال است',
      sentBodyPrefix: 'می‌توانید این فرم را به سرویس ایمیل متصل کنید یا مستقیماً به نشانی زیر ایمیل بزنید:',
      sentAnother: 'ارسال پیام جدید',
      footerSuffix: 'پایگاه علمی و رزومه تعاملی پژوهشگر.',
      footerShortcut: 'کلید ⌘K برای باز کردن منو',
    },
    command: {
      placeholder: 'پرش به بخش، وبلاگ یا کپی استناد BibTeX...',
      empty: 'موردی یافت نشد.',
      copiedEmail: 'نشانی ایمیل در کلیپ‌بورد کپی شد',
      copiedBibtex: 'استناد BibTeX کپی شد',
      groups: {
        navigate: 'بخش‌های سایت',
        visual: 'دسترس‌پذیری و حرکت',
        utilities: 'ابزارهای سریع',
        projects: 'پژوهش‌ها و پروژه‌ها',
        citations: 'کپی استناد علمی',
      },
      navLabels: [
        { id: 'hero', label: 'نمای اصلی رصدخانه', hint: '۰۰' },
        { id: 'laboratory', label: 'آزمایشگاه چهار رکن پژوهش', hint: '۰۱' },
        { id: 'projects', label: 'سامانه‌ها و مطالعات موردی', hint: '۰۲' },
        { id: 'publications', label: 'مقالات و کتاب دانشگاهی', hint: '۰۳' },
        { id: 'chronicle', label: 'کارنامه و مسیر علمی', hint: '۰۴' },
        { id: 'academy', label: 'وبلاگ، اطلاعیه‌ها و مخزن آموزشی', hint: '۰۵' },
        { id: 'writing', label: 'یادداشت‌های فنی', hint: '۰۶' },
        { id: 'contact', label: 'ارتباط و همکاری', hint: '۰۷' },
      ],
      motionEnableFull: 'فعال‌سازی کامل انیمیشن سه‌بعدی',
      motionEnableLow: 'فعال‌سازی حالت حرکت ملایم',
      motionActive: 'ملایم',
      motionFull: 'کامل',
      copyEmailPrefix: 'کپی ایمیل',
      bibtexPrefix: 'استناد:',
    },
  },
};

export const PROFILE_BY_LANG: Record<Lang, ProfileData> = {
  en: {
    pageTitle: 'MB Homayoun (Mohammad Bagher Homayoun) — Petroleum Geomechanics & Energy Systems',
    monogram: 'MBH.',
    fullName: 'Mohammad Bagher Homayoun',
    shortName: 'MB Homayoun',
    brandSubtitle: 'Observatory',
    roleTitle: 'Ph.D. Candidate in Petroleum Engineering & Energy Systems Researcher',
    affiliation: 'Department of Petroleum Engineering · Amirkabir University of Technology (Tehran Polytechnic)',
    location: 'Tehran, Iran',
    availability: 'Open to Research Collaborations, Subsurface Geomechanics & Energy Policy Projects',
    email: 'mb.homayoun@aut.ac.ir',
    coordinates: '35.7022° N, 51.4090° E',
    heroEyebrow: 'PETROLEUM GEOMECHANICS · WELLBORE CFD · ENERGY GOVERNANCE',
    heroHeadlineTop: 'Engineering Subsurface',
    heroHeadlineItalic: 'Mechanics & Energy',
    heroHeadlineBottom: 'Systems.',
    heroDescription:
      'I am Mohammad Bagher Homayoun (MB Homayoun), a doctoral researcher at Amirkabir University of Technology bridging viscoelastic-plastic wellbore integrity, carbonate acid-fracture mechanics, multiphase drilling CFD, and national energy governance reform.',
    stats: [
      { label: 'Peer-Reviewed & Preprints', value: 7, suffix: '+' },
      { label: 'Academic Textbook', value: 1, suffix: ' Vol.' },
      { label: 'Core Research Tracks', value: 4, suffix: '' },
      { label: 'OpenAlex Works Indexed', value: 4, suffix: '+' },
    ],
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
    ],
    projects: [
      {
        id: 'creep-casing-3d',
        title: '3D Rock–Cement–Casing Creep Solver',
        tagline: 'Sequential viscoelastic-plastic wellbore integrity modeling under anisotropic in-situ stress',
        category: 'Geomechanics',
        categoryLabel: 'Geomechanics',
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
        categoryLabel: 'Stimulation',
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
        categoryLabel: 'Drilling & CFD',
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
        categoryLabel: 'Drilling & CFD',
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
        categoryLabel: 'Energy Policy',
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
        categoryLabel: 'Energy Policy',
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
    ],
    publications: [
      {
        id: 'pub-2026-scirep-ilam',
        title: 'Experimental investigation into the influence of rock mechanical properties and etching patterns on acid fracture conductivity in the ilam carbonate formation',
        authors: 'Mohammadreza Akbari, Mohammad Javad Ameri, Mohammad Bagher Homayoun',
        venue: 'Scientific Reports (Nature Portfolio)',
        year: 2026,
        type: 'Journal',
        typeLabel: 'Journal',
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
        typeLabel: 'Preprint',
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
        typeLabel: 'Journal',
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
        typeLabel: 'Journal',
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
        typeLabel: 'Journal',
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
        typeLabel: 'Journal',
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
        typeLabel: 'Journal',
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
        typeLabel: 'Book',
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
    ],
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
    ],
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
    ],
    marqueeTerms: [
      'PETROLEUM GEOMECHANICS',
      'ROCK–CEMENT–CASING INTEGRITY',
      'CARBONATE ACID FRACTURING',
      'WELLBORE CFD HYDRAULICS',
      'ENERGY GOVERNANCE',
      'SUBSIDY REFORM',
      'AMIRKABIR UNIVERSITY',
    ],
  },

  fa: {
    pageTitle: 'محمدباقر همایون (MB Homayoun) — ژئومکانیک مخازن، حفاری و سامانه‌های انرژی',
    monogram: 'م‌ه‌.',
    fullName: 'محمدباقر همایون',
    shortName: 'محمدباقر همایون',
    brandSubtitle: 'رصدخانه علمی',
    roleTitle: 'دانشجوی دکتری مهندسی نفت و پژوهشگر سامانه‌های انرژی',
    affiliation: 'دانشکده مهندسی نفت · دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)',
    location: 'تهران، ایران',
    availability: 'آماده همکاری در پروژه‌های پژوهشی ژئومکانیک زیرسطحی، شبیه‌سازی عددی و سیاست‌گذاری انرژی',
    email: 'mb.homayoun@aut.ac.ir',
    coordinates: '35.7022° N, 51.4090° E',
    heroEyebrow: 'ژئومکانیک نفت · دینامیک سیالات محاسباتی چاه · حکمرانی انرژی',
    heroHeadlineTop: 'مهندسی مکانیک',
    heroHeadlineItalic: 'سنگ و سامانه‌های',
    heroHeadlineBottom: 'انرژی.',
    heroDescription:
      'من محمدباقر همایون (MB Homayoun)، پژوهشگر دکتری در دانشگاه صنعتی امیرکبیر هستم و در تقاطع مکانیک ویسکوالاستوپلاستیک چاه، رسانایی شکستگی اسیدی مخازن کربناته، شبیه‌سازی CFD حفاری و اصلاح حکمرانی انرژی پژوهش می‌کنم.',
    stats: [
      { label: 'مقالات علمی و پیش‌چاپ‌ها', value: 7, suffix: '+' },
      { label: 'تألیف کتاب دانشگاهی', value: 1, suffix: ' جلد' },
      { label: 'محور اصلی پژوهش', value: 4, suffix: '' },
      { label: 'آثار نمایه OpenAlex', value: 4, suffix: '+' },
    ],
    links: [
      {
        label: 'Google Scholar',
        handle: 'MB Homayoun · نمایه مقالات علمی',
        url: 'https://scholar.google.com/scholar?q=%22Mohammad+Bagher+Homayoun%22',
      },
      {
        label: 'LinkedIn',
        handle: 'MB Homayoun · لینکدین',
        url: 'https://www.linkedin.com/search/results/all/?keywords=MB%20Homayoun',
      },
      {
        label: 'ResearchGate',
        handle: 'Mohammad Bagher Homayoun',
        url: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
      },
      {
        label: 'OpenAlex',
        handle: 'شناسه نویسنده: A5120058838',
        url: 'https://openalex.org/A5120058838',
      },
      {
        label: 'GitHub',
        handle: 'github.com/homayounmb',
        url: 'https://github.com/homayounmb',
      },
    ],
    pillars: [
      {
        id: 'pillar-geomechanics',
        index: '۰۱',
        title: 'یکپارچگی ویسکوالاستوپلاستیک چاه',
        subtitle: 'خزش بلندمدت سازند و برهم‌کنش سنگ–سیمان–لوله جداری',
        description:
          'سازندهای عمیق هیدروکربنی دارای رفتار خزشی وابسته به زمان هستند که توزیع تنش شعاعی اطراف چاه را طی سال‌های بهره‌برداری دگرگون می‌کند. ما مدل‌های اجزای محدود متوالی سه‌بعدی را برای تحلیل کوپلینگ سنگ–سیمان–جداری و کاهش ضریب ایمنی تحت تنش‌های ناهمسانگرد تدوین می‌کنیم.',
        equation: 'ε(t) = ε_el + ε_ve(t) + ε_vp(σ, τ)   |   σ_eq ≤ σ_yield / SF(t)',
        metrics: [
          { label: 'محیط کوپل‌شده', value: 'سنگ–سیمان–فولاد' },
          { label: 'رژیم تنش', value: 'سه‌بعدی ناهمسانگرد' },
          { label: 'تمرکز مدل', value: 'خزش بلندمدت' },
        ],
        simulationMode: 'lattice',
        accent: '#2EE6D6',
      },
      {
        id: 'pillar-stimulation',
        index: '۰۲',
        title: 'رسانایی شکستگی اسیدی کربناته',
        subtitle: 'تفکیک مکانیک سنگ و هندسه حفر اسید در سازند آهکی ایلام',
        description:
          'پیش‌بینی رسانایی شکستگی پس از اسیدکاری مستلزم جداسازی بسته‌شدن مکانیکی از الگوی انحلال تصادفی اسید است. با آزمایش رسانایی فشاربالای API RP-61 روی مغزه‌های شکاف‌دار سنگ آهک سازند ایلام، نقش عمق و پهنای کانال‌های ماشین‌کاری‌شده در پایداری رسانایی سنجیده می‌شود.',
        equation: 'k_f w_f (σ_c) = f(E, ν, d_etch, w_etch)   |   API RP-61 Cell',
        metrics: [
          { label: 'ابعاد مغزه', value: '۱۸.۴ × ۴.۷۵ سانتی‌متر' },
          { label: 'عمق کانال', value: '۰.۶ تا ۱.۶ میلی‌متر' },
          { label: 'نشریه', value: 'Scientific Reports' },
        ],
        simulationMode: 'wave',
        accent: '#F5B971',
      },
      {
        id: 'pillar-cfd',
        index: '۰۳',
        title: 'هیدرولیک حفاری و شبیه‌سازی CFD چاه',
        subtitle: 'انتقال دوفازی کنده‌های حفاری و بهینه‌سازی شبکه مش چهاروجهی',
        description:
          'پیشگیری از گیر افتادن لوله و تشکیل بستر کنده نیازمند شبیه‌سازی دقیق جریان جامد–مایع بدون هزینه محاسباتی گزاف است. مدل بهینه‌شده E2-475 با اعتبارسنجی در مدار جریان آزمایشگاهی دانشگاه امیرکبیر، دقت تجربی را با چگالی شبکه بهینه برقرار می‌سازد.',
        equation: '∂ₜ(α_s ρ_s u_s) + ∇·(α_s ρ_s u_s ⊗ u_s) = −α_s∇p + M_drag + α_s ρ_s g',
        metrics: [
          { label: 'شبکه بهینه', value: '۴۷۵ هزار المان' },
          { label: 'رژیم جریان', value: 'دوفازی جامد–مایع' },
          { label: 'مرجع درسی', value: 'سیال حفاری جلد ۱' },
        ],
        simulationMode: 'curl',
        accent: '#8B7CFF',
      },
      {
        id: 'pillar-policy',
        index: '۰۴',
        title: 'حکمرانی انرژی و اصلاح نظام یارانه‌ها',
        subtitle: 'چارچوب TIS، صندوق بهینه‌سازی مصرف و سیاست کلان نفت و گاز',
        description:
          'دستاوردهای مهندسی بدون اصلاح نهادهای مشوق اقتصادی به بهره‌وری ملی منتهی نمی‌شوند. پژوهش‌های بین‌رشته‌ای ما چارچوب صندوق بهینه‌سازی مصرف انرژی، بازتوزیع هدفمند یارانه‌های برق و گاز و نظام‌های نوآوری فناورانه (TIS) بخش صنعت را طراحی می‌کند.',
        equation: 'Welfare_net = ∑ ΔE_saved · P_shadow − Cost_transition   |   TIS Matrix',
        metrics: [
          { label: 'شکاف بهره‌وری', value: 'حدود ۳۰٪ اتلاف' },
          { label: 'حامل‌های هدف', value: 'گاز طبیعی و برق' },
          { label: 'مطالعه تطبیقی', value: 'ایران و عربستان' },
        ],
        simulationMode: 'network',
        accent: '#2EE6D6',
      },
    ],
    projects: [
      {
        id: 'creep-casing-3d',
        title: 'حل‌گر خزش سه‌بعدی سنگ–سیمان–جداری',
        tagline: 'مدل‌سازی متوالی ویسکوالاستوپلاستیک یکپارچگی چاه تحت تنش‌های ناهمسانگرد درجا',
        category: 'Geomechanics',
        categoryLabel: 'ژئومکانیک',
        year: '۲۰۲۶',
        role: 'پژوهشگر اصلی (توسعه پایان‌نامه ارشد و پیش‌چاپ SSRN)',
        featured: true,
        metrics: 'کوپلینگ متوالی سه‌بعدی · تقلیل ظرفیت لوله جداری در گذر زمان',
        tags: ['ویسکوالاستیسیته', 'خزش سازند', 'طراحی جداری', 'تنش ناهمسانگرد'],
        summary:
          'توسعه‌یافته از پایان‌نامه کارشناسی ارشد درباره اثر خزش سازندهای ایران تا تدوین فرمولاسیون ریاضی کامل و شبیه‌سازی متوالی سه‌بعدی برای ارزیابی انتقال بارهای برشی و له‌شدگی ناشی از خزش درازمدت سنگ از غلاف سیمان به لوله جداری.',
        architecture: [
          'قانون رفتاری کوپل‌شده ویسکوالاستوپلاستیک برای مدل‌سازی خزش اولیه و پایدار سازند',
          'شبیه‌سازی متوالی حفاری، سیمان‌کاری و افت فشار تولید به صورت سه‌بعدی',
          'استخراج منحنی‌های تقلیل ظرفیت له‌شدگی جداری تحت تنش‌های افقی ناهمسانگرد',
        ],
        outcomes: [
          'انتشار به صورت پیش‌چاپ کامل در SSRN Electronic Journal (DOI: 10.2139/ssrn.7545360)',
          'ارائه معیارهای عملی تعدیل ضریب ایمنی در طراحی جداری لایه‌های نمکی و شیلی خزنده',
        ],
        sparkline: [20, 28, 36, 48, 57, 68, 79, 89, 96],
        githubUrl: 'https://doi.org/10.2139/ssrn.7545360',
        liveUrl: 'https://doi.org/10.2139/ssrn.7545360',
      },
      {
        id: 'ilam-acid-fracturing',
        title: 'رسانایی شکستگی اسیدی سازند کربناته ایلام',
        tagline: 'تفکیک آزمایشگاهی مکانیک سنگ از هندسه حفر اسید در سلول فشاربالای API RP-61',
        category: 'Stimulation',
        categoryLabel: 'انگیزش مخزن',
        year: '۲۰۲۶',
        role: 'نویسنده همکار · مجله Scientific Reports (نیچر)',
        featured: true,
        metrics: 'سلول API RP-61 · مغزه‌های آهکی کرتاسه سازند ایلام',
        tags: ['اسیدکاری شکستگی', 'مکانیک سنگ', 'مخازن کربناته', 'API RP-61'],
        summary:
          'طراحی آزمایشگاهی برای جداسازی بسته‌شدن مکانیکی شکستگی از انحلال تصادفی اسید، از طریق ماشین‌کاری کانال‌های معین روی مغزه‌های ۱۸.۴ × ۴.۷۵ سانتی‌متری سنگ آهک ایلام و اندازه‌گیری رسانایی تحت تنش‌های بسته‌شدن.',
        architecture: [
          'ماتریس دقیق عمق کانال (۰.۶ تا ۱.۶ میلی‌متر) و پهنا (۱.۴ تا ۲.۴۸ میلی‌متر)',
          'آزمایش‌های رسانایی فشاربالای مطابق استاندارد API RP-61 در گام‌های تنش',
          'همبستگی‌سنجی مدول یانگ، سختی سنگ و نسبت ابعادی کانال با افت رسانایی',
        ],
        outcomes: [
          'منتشرشده در نشریه معتبر Scientific Reports (DOI: 10.1038/s41598-026-76933-8)',
          'ایجاد معیارهای دقیق برای طراحی عملیات انگیزش مخازن کربناته جنوب غرب ایران',
        ],
        sparkline: [25, 34, 42, 55, 63, 74, 83, 91, 98],
        githubUrl: 'https://doi.org/10.1038/s41598-026-76933-8',
        liveUrl: 'https://doi.org/10.1038/s41598-026-76933-8',
      },
      {
        id: 'wellbore-cfd-e2475',
        title: 'شبیه‌سازی CFD پاک‌سازی چاه و شبکه E2-475',
        tagline: 'مطالعه استقلال از شبکه و جریان دوفازی ANSYS با اعتبارسنجی مدار آزمایشگاهی امیرکبیر',
        category: 'Drilling & CFD',
        categoryLabel: 'حفاری و CFD',
        year: '۲۰۲۳',
        role: 'نویسنده اول · پژوهش‌های نفت (RIPI)',
        metrics: '۴۷۵ هزار المان بهینه · اعتبارسنجی انتقال کنده‌های CaCO3',
        tags: ['ANSYS CFD', 'انتقال کنده‌ها', 'استقلال از مش', 'هیدرولیک حفاری'],
        summary:
          'بررسی نظام‌مند حساسیت شبکه مش چهاروجهی (۱۰۰، ۲۰۰، ۴۷۵ و ۵۰۰ هزار المان) روی شبیه‌ساز مته چهارنازله به منظور ایجاد توازن میان دقت پیش‌بینی غلظت کنده‌ها و زمان اجرای حل‌گر.',
        architecture: [
          'مدل‌سازی هندسه نازل مته و شرایط مرزی منطبق بر مدار جریان آزمایشگاهی امیرکبیر',
          'فرمولاسیون اویلری–اویلری دوفازی آب و ذرات کربنات کلسیم (CaCO3)',
          'پیکربندی بهینه Model E2-475 با کاهش چشمگیر زمان حل نسبت به شبکه‌های فوق‌ریز',
        ],
        outcomes: [
          'منتشرشده در فصلنامه علمی پژوهش‌های نفت پژوهشگاه صنعت نفت (۱۴۰۱/۲۰۲۳)',
          'مرجع پایه برای اعتبارسنجی شبیه‌سازی‌های تحصیلات تکمیلی هیدرولیک حفاری',
        ],
        sparkline: [32, 41, 49, 60, 69, 77, 84, 90, 94],
        githubUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
      },
      {
        id: 'drilling-fluid-textbook',
        title: 'مهندسی حفاری؛ دفتر یکم: سیال حفاری',
        tagline: 'کتاب تخصصی دانشگاهی منتشرشده توسط انتشارات دانشگاه صنعتی امیرکبیر',
        category: 'Drilling & CFD',
        categoryLabel: 'حفاری و CFD',
        year: '۲۰۲۳',
        role: 'مؤلف همکار (به همراه دکتر محسن ده‌ودار)',
        metrics: 'انتشارات دانشگاه صنعتی امیرکبیر · مرجع کارشناسی و ارشد',
        tags: ['سیال حفاری', 'رئولوژی', 'تجهیزات دکل', 'تألیف دانشگاهی'],
        summary:
          'کتاب جامع دانشگاهی درباره تاریخچه و مبانی مهندسی سیال حفاری، اجزای فاز پیوسته و افزایه‌ها، خواص فیزیکی و شیمیایی، تجهیزات گردش گل روی دکل و روش‌های پیشگیری و رفع مشکلات عملیاتی چاه.',
        architecture: [
          'اصول فرمولاسیون فاز پیوسته و افزودنی‌های شیمیایی کنترل‌کننده صافاب و رئولوژی',
          'دستورالعمل‌های آزمون‌های آزمایشگاهی و انتخاب نوع سیال متناسب با سازند',
          'تحلیل مشکلات رایج حفاری از جمله گیر لوله، هرزروی گل و ناپایداری دیواره چاه',
        ],
        outcomes: [
          'منتشرشده توسط انتشارات دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)',
          'مورد استفاده دانشجویان مهندسی نفت و مهندسان عملیات حفاری در صنعت کشور',
        ],
        sparkline: [28, 35, 46, 54, 62, 70, 79, 86, 92],
        githubUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
      },
      {
        id: 'energy-optimization-fund',
        title: 'صندوق بهینه‌سازی مصرف و اصلاح یارانه‌های انرژی',
        tagline: 'طراحی ابزارهای غیرقیمتی و بازتوزیع یارانه برق و گاز طبیعی برای کاهش اتلاف ملی',
        category: 'Energy Policy',
        categoryLabel: 'سیاست انرژی',
        year: '۲۰۲۴',
        role: 'نویسنده اصلی و همکار · نشریات سیاست‌گذاری عمومی',
        metrics: 'پاسخ به شکاف ~۳۰٪ اتلاف انرژی · بررسی موردی برق و گاز',
        tags: ['یارانه انرژی', 'صندوق بهینه‌سازی', 'سیاست‌گذاری عمومی', 'اقتصاد انرژی'],
        summary:
          'مجموعه پژوهش‌های سیاست‌گذاری در تدوین چارچوب نهادی «صندوق بهینه‌سازی مصرف انرژی» و الگوی نوین بازتوزیع یارانه‌ها که سرمایه‌گذاری بهره‌وری در صنعت و خانوار را با رفاه اجتماعی هم‌راستا می‌سازد.',
        architecture: [
          'آسیب‌شناسی تطبیقی ابزارهای قیمتی در برابر سیاست‌های غیرقیمتی بهینه‌سازی',
          'طراحی معماری بازتوزیع سهمیه‌محور یارانه در حامل‌های برق و گاز طبیعی',
          'سازوکار تأمین مالی گردشی برای پروژه‌های نوسازی و کاهش شدت انرژی صنایع',
        ],
        outcomes: [
          'منتشرشده در فصلنامه‌های مدیریت بهبود و تحول (DOAJ) و مطالعات راهبردی سیاست‌گذاری عمومی',
        ],
        sparkline: [19, 30, 41, 52, 64, 71, 80, 87, 93],
        githubUrl: 'https://doaj.org/article/df9976e1dd4a403d87eb8cc15acdd513',
        liveUrl: 'https://doaj.org/article/df9976e1dd4a403d87eb8cc15acdd513',
      },
      {
        id: 'tis-oil-governance',
        title: 'سیاست فناوری انرژی (TIS) و حکمرانی نفت و گاز',
        tagline: 'نقشه سیاست‌گذاری بخش صنعت و فناوری و تحلیل تطبیقی حکمرانی شرکت آرامکو',
        category: 'Energy Policy',
        categoryLabel: 'سیاست انرژی',
        year: '۲۰۲۵',
        role: 'نویسنده همکار · مدیریت بهبود و دانش حکمرانی',
        metrics: 'روش ترکیبی کیفی · تحلیل زنجیره صنعت نفت، گاز و فناوری',
        tags: ['حکمرانی انرژی', 'چارچوب TIS', 'صنعت نفت و گاز', 'مطالعه تطبیقی'],
        summary:
          'بررسی سیاست‌های ماموریت‌گرا و اشاعه‌گرای انرژی در بخش صنعت و فناوری با بهره‌گیری از کارکردهای نظام نوآوری فناورانه (TIS) و کالبدشکافی ابعاد حکمرانی انرژی در عربستان سعودی.',
        architecture: [
          'تحلیل کارکردی نظام نوآوری فناورانه (TIS) برای اشاعه فناوری‌های پایدار صنعتی',
          'ارزیابی نهادی ساختار حکمرانی حاکمیتی و شرکتی در صنعت نفت و گاز عربستان (آرامکو)',
        ],
        outcomes: [
          'منتشرشده در فصلنامه مدیریت بهبود و تحول (۲۰۲۵) و دوفصلنامه دانش حکمرانی (۲۰۲۴)',
        ],
        sparkline: [22, 29, 39, 50, 60, 68, 76, 85, 91],
        githubUrl: 'https://doaj.org/article/fea4975615494821ae6f863020c30ff0',
        liveUrl: 'https://doaj.org/article/fea4975615494821ae6f863020c30ff0',
      },
    ],
    publications: [
      {
        id: 'pub-2026-scirep-ilam',
        title: 'Experimental investigation into the influence of rock mechanical properties and etching patterns on acid fracture conductivity in the ilam carbonate formation',
        authors: 'Mohammadreza Akbari, Mohammad Javad Ameri, Mohammad Bagher Homayoun',
        venue: 'Scientific Reports (Nature Portfolio)',
        year: 2026,
        type: 'Journal',
        typeLabel: 'مقاله ژورنال',
        citations: 0,
        doi: '10.1038/s41598-026-76933-8',
        topics: ['اسیدکاری شکستگی', 'مکانیک کربناته', 'API RP-61'],
        abstract:
          'در این پژوهش با ماشین‌کاری کانال‌های هندسی معین بر روی مغزه‌های شکاف‌دار سنگ آهک سازند ایلام (۱۸.۴ × ۴.۷۵ سانتی‌متر) و آزمایش در سلول رسانایی فشاربالای API RP-61، اثر بسته‌شدن مکانیکی سنگ از الگوی انحلال تصادفی اسید تفکیک و کمی‌سازی شده است.',
        keyFinding:
          'تفکیک هندسه مشخص کانال (عمق ۰.۶ تا ۱.۶ میلی‌متر و عرض ۱.۴ تا ۲.۴۸ میلی‌متر) نشان می‌دهد چگونه سفتی مکانیکی سنگ کربناته حفظ رسانایی را تحت تنش بسته‌شدن کنترل می‌کند.',
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
        typeLabel: 'پیش‌چاپ',
        citations: 0,
        doi: '10.2139/ssrn.7545360',
        topics: ['یکپارچگی چاه', 'خزش سازند', 'ژئومکانیک سه‌بعدی'],
        abstract:
          'در این مقاله چارچوب ریاضی و شبیه‌سازی متوالی سه‌بعدی اجزای محدود برای برهم‌کنش ویسکوالاستوپلاستیک بلندمدت میان سازند سنگی، غلاف سیمان و لوله جداری فولادی تدوین شده و میزان افت یکپارچگی جداری تحت میدان تنش‌های ناهمسانگرد اندازه‌گیری می‌شود.',
        keyFinding:
          'تنش‌های افقی ناهمسانگرد در ترکیب با خزش سازند میزبان، بیضی‌شدگی و انتقال تنش برشی از سیمان به جداری را شتاب داده و نیازمند معیارهای تقلیل ظرفیت زمان‌مند هستند.',
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
        title: 'پیشنهاد سیاست‌های کلی انرژی در حوزه صنعت و فناوری (A Policy Framework for Energy in the Industry and Technology Sector)',
        authors: 'حسین حیرانی، محمدرضا اکبری، محمدباقر همایون',
        venue: 'فصلنامه علمی مدیریت بهبود و تحول',
        year: 2025,
        type: 'Journal',
        typeLabel: 'مقاله علمی',
        citations: 0,
        doi: '10.22034/jmi.2025.537444.3223',
        topics: ['سیاست انرژی', 'چارچوب TIS', 'صنعت و فناوری'],
        abstract:
          'این مطالعه با هدف ارائه پیشنهادهای سیاستی برای بازنگری سیاست‌های کلی انرژی از منظر بخش صنعت و فناوری، با روش ترکیبی کیفی (تحلیل اسناد بالادستی، مطالعه تطبیقی کشورها و مصاحبه خبرگان) سیاست‌های ماموریت‌گرا و اشاعه‌گرا را در قالب کارکردهای نظام نوآوری فناورانه (TIS) تحلیل می‌کند.',
        keyFinding:
          'هم‌افزایی اهداف ماموریت‌گرای کلان با ابزارهای اشاعه‌گرای نظام نوآوری فناورانه (TIS) موانع نهادی پذیرش فناوری‌های بهینه‌سازی انرژی در صنعت را برطرف می‌سازد.',
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
        title: 'ارائه چارچوب مفهومی صندوق بهینه‌سازی مصرف انرژی؛ راهکاری سیاستی برای کاهش اتلاف انرژی',
        authors: 'حسین حیرانی، محمدباقر همایون، محمدرضا اکبری، حمید حیدری، امیرحسین سوهانکار، سید مجید میری لاری‌می',
        venue: 'فصلنامه علمی مدیریت بهبود و تحول',
        year: 2024,
        type: 'Journal',
        typeLabel: 'مقاله علمی',
        citations: 0,
        doi: '10.22034/jmi.2024.451038.3080',
        topics: ['سیاست انرژی', 'صندوق بهینه‌سازی', 'کاهش اتلاف'],
        abstract:
          'با توجه به شدت انرژی بالا و اتلاف حدود ۳۰ درصد انرژی کشور، این پژوهش راهکارها را به دو دسته قیمتی و غیرقیمتی تفکیک کرده و چارچوب نهادی جامعی را برای تأسیس «صندوق بهینه‌سازی مصرف انرژی» با تکیه بر ارزیابی تجارب تاریخی ارائه می‌دهد.',
        keyFinding:
          'راه‌اندازی صندوق مستقل بهینه‌سازی مصرف انرژی، تنگنای سرمایه پروژه‌های کاهش تلفات را برطرف کرده و مکمل سیاست‌های تدریجی اصلاح قیمت است.',
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
        title: 'بررسی ابعاد حکمرانی انرژی با محوریت صنعت نفت و گاز؛ مطالعه موردی کشور عربستان سعودی',
        authors: 'محمدباقر همایون، محمدرضا اکبری، حمید حیدری، امیرحسین سوهانکار',
        venue: 'دوفصلنامه علمی دانش حکمرانی',
        year: 2024,
        type: 'Journal',
        typeLabel: 'مقاله علمی',
        citations: 0,
        doi: 'نمایه مگیران / دانش حکمرانی',
        topics: ['حکمرانی انرژی', 'صنعت نفت و گاز', 'حکمرانی شرکتی'],
        abstract:
          'تحلیل ابعاد نهادی، رگولاتوری و حکمرانی شرکتی مدیریت منابع هیدروکربنی در عربستان سعودی و ساختار شرکت ملی آرامکو با هدف استخراج درس‌آموخته‌های کاربردی برای سیاست‌گذاری بخش بالادست و پایین‌دست نفت و گاز.',
        keyFinding:
          'تفکیک شفاف وظایف حاکمیتی و تنظیم‌گری از استقلال تجاری شرکت ملی نفت، پایداری سرمایه‌گذاری در زنجیره ارزش هیدروکربن را تقویت می‌کند.',
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
        title: 'اصلاح نظام یارانه‌های انرژی ایران با معرفی رویکرد جدید بازتوزیع یارانه‌های انرژی؛ مطالعه موردی برق و گاز طبیعی',
        authors: 'محمدباقر همایون، محمدرضا اکبری، اسماعیل سقاب اصفهانی و همکاران',
        venue: 'فصلنامه مطالعات راهبردی سیاست‌گذاری عمومی',
        year: 2024,
        type: 'Journal',
        typeLabel: 'مقاله علمی',
        citations: 0,
        doi: 'نمایه پرتال نشریات / انسانی',
        topics: ['سیاست انرژی', 'اصلاح یارانه', 'برق و گاز طبیعی'],
        abstract:
          'معرفی سازوکار ساختاریافته بازتوزیع یارانه‌های برق و گاز طبیعی برای مهار ناکارآمدی مصرف، حفظ پایداری مالی دولت، صیانت از رفاه خانوارها و ایجاد انگیزه اقتصادی برای مصرف بهینه انرژی.',
        keyFinding:
          'بازتوزیع شفاف سهمیه‌ای، یارانه‌های پنهان و ناکارآمد را بدون ایجاد شوک معیشتی به مشوق مستقیم بهره‌وری انرژی تبدیل می‌کند.',
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
        title: 'مقایسه و طراحی اندازه شبکه بهینه در مدل دینامیک سیالات محاسباتی (CFD) تمیزکاری چاه',
        authors: 'محمدباقر همایون، محسن ده‌ودار، امیرحسین اشهر',
        venue: 'فصلنامه علمی پژوهش‌های نفت (پژوهشگاه صنعت نفت)',
        year: 2023,
        type: 'Journal',
        typeLabel: 'مقاله علمی',
        citations: 0,
        doi: 'نمایه RIPI / SID',
        topics: ['هیدرولیک حفاری', 'CFD چاه', 'بهینه‌سازی مش'],
        abstract:
          'ارزیابی اندازه‌های مختلف شبکه مش چهاروجهی (۱۰۰، ۲۰۰، ۴۷۵ و ۵۰۰ هزار المان) در شبیه‌سازی دوفازی جامد–مایع تمیزکاری چاه با نرم‌افزار ANSYS و اعتبارسنجی در برابر داده‌های آزمایشگاهی مدار جریان دانشگاه صنعتی امیرکبیر.',
        keyFinding:
          'مدل بهینه E2-475 (با حدود ۴۷۵ هزار المان) رفتار انتقال کنده‌های کربنات کلسیم را با دقت بالا و هزینه محاسباتی کمتر بازتولید می‌کند.',
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
        title: 'مهندسی حفاری؛ دفتر یکم: سیال حفاری (Drilling Engineering — Vol. 1: Drilling Fluid)',
        authors: 'محسن ده‌ودار، محمدباقر همایون',
        venue: 'انتشارات دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)',
        year: 2023,
        type: 'Book',
        typeLabel: 'کتاب دانشگاهی',
        citations: 0,
        doi: 'کتاب دانشگاهی · انتشارات امیرکبیر',
        topics: ['هیدرولیک حفاری', 'سیال حفاری', 'کتاب درسی'],
        abstract:
          'کتاب تخصصی دانشگاهی در مهندسی حفاری شامل تاریخچه و تعاریف پایه، وظایف و اجزای تشکیل‌دهنده سیال حفاری، خواص فیزیکی و شیمیایی افزودنی‌ها، انواع گل‌های حفاری، تجهیزات سطحی دکل و دستورالعمل‌های رفع مشکلات عملیاتی.',
        keyFinding:
          'جمع‌بندی منسجم دانش دانشگاهی و تجربه عملیاتی دانشکده مهندسی نفت دانشگاه امیرکبیر به عنوان منبع درسی دانشجویان و مهندسان حفاری.',
        bibtex: `@book{dehvedar2023drilling,
  title={Drilling Engineering -- Volume 1: Drilling Fluid},
  author={Dehvedar, Mohsen and Homayoun, Mohammad Bagher},
  publisher={Amirkabir University of Technology Publications},
  year={2023}
}`,
        pdfUrl: 'https://www.researchgate.net/profile/Mohammad-Bagher-Homayoun',
      },
    ],
    timeline: [
      {
        id: 'tl-phd',
        period: '۱۴۰۲ — اکنون (۲۰۲۳ — PRESENT)',
        role: 'دانشجوی دکتری تخصصی مهندسی نفت',
        institution: 'دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)',
        location: 'تهران، ایران',
        kind: 'پژوهش دکتری',
        summary:
          'انجام پژوهش‌های دکتری در زمینه مکانیک سنگ زیرسطحی، برهم‌کنش ویسکوالاستوپلاستیک سنگ–سیمان–لوله جداری تحت تنش‌های ناهمسانگرد و بررسی آزمایشگاهی رسانایی شکستگی اسیدی سازندهای کربناته.',
        highlights: [
          'مؤلف همکار مقاله ۲۰۲۶ نشریه Scientific Reports درباره رسانایی اسیدکاری سازند کربناته ایلام',
          'تدوین فرمولاسیون سه‌بعدی یکپارچگی ویسکوالاستوپلاستیک سنگ–سیمان–جداری (SSRN، ۲۰۲۶)',
        ],
      },
      {
        id: 'tl-policy',
        period: '۱۴۰۲ — ۱۴۰۴ (۲۰۲۳ — ۲۰۲۵)',
        role: 'پژوهشگر حکمرانی و سیاست‌گذاری انرژی',
        institution: 'همکاری‌های بین‌رشته‌ای سیاست انرژی (از جمله پژوهشگران NRISP)',
        location: 'تهران، ایران',
        kind: 'سیاست‌گذاری انرژی',
        summary:
          'همکاری با پژوهشگران اقتصاد و سیاست‌گذاری فناوری برای طراحی چارچوب‌های عملیاتی بازتوزیع یارانه انرژی، صندوق بهینه‌سازی مصرف و حکمرانی صنعت نفت و گاز.',
        highlights: [
          'انتشار دو مقاله علمی–پژوهشی در فصلنامه مدیریت بهبود و تحول (۲۰۲۴ و ۲۰۲۵)',
          'تألیف مطالعه تطبیقی حکمرانی آرامکو در دانش حکمرانی و الگوی بازتوزیع یارانه برق و گاز (۲۰۲۴)',
        ],
      },
      {
        id: 'tl-msc',
        period: '۱۴۰۰ — شهریور ۱۴۰۲ (۲۰۲۱ — ۲۰۲۳)',
        role: 'کارشناسی ارشد مهندسی نفت (حفاری و مکانیک چاه)',
        institution: 'دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)',
        location: 'تهران، ایران',
        kind: 'پایان‌نامه ارشد',
        summary:
          'دفاع از پایان‌نامه کارشناسی ارشد با عنوان «بررسی اثر خزش سازند بر طراحی جداری در یکی از سازندهای ایران» به راهنمایی دکتر محمدجواد عامری شهرابی.',
        highlights: [
          'انتشار مقاله بهینه‌سازی شبکه مش CFD پاک‌سازی چاه در پژوهش‌های نفت (۲۰۲۳)',
          'اعتبارسنجی شبیه‌سازی انتقال دوفازی کنده‌ها در برابر مدار آزمایشگاهی چهارنازله امیرکبیر',
        ],
      },
      {
        id: 'tl-book',
        period: '۱۴۰۲ (۲۰۲۳)',
        role: 'مؤلف همکار کتاب دانشگاهی مهندسی حفاری',
        institution: 'انتشارات دانشگاه صنعتی امیرکبیر',
        location: 'تهران، ایران',
        kind: 'تألیف کتاب',
        summary:
          'تألیف و انتشار کتاب تخصصی «مهندسی حفاری؛ دفتر یکم: سیال حفاری» با همکاری دکتر محسن ده‌ودار.',
        highlights: [
          'پوشش جامع رئولوژی گل حفاری، افزایه‌های شیمیایی، تجهیزات گردش سیال و رفع گیر لوله',
          'منبع کمک‌آموزشی دانشجویان کارشناسی، ارشد و مهندسان عملیات حفاری',
        ],
      },
    ],
    writings: [
      {
        id: 'note-creep-casing',
        title: 'چرا خزش سازند سال‌ها پس از تکمیل چاه یکپارچگی جداری را تهدید می‌کند؟',
        subtitle: 'کوپلینگ ویسکوالاستیسیته سنگ میزبان، سفتی غلاف سیمان و انتقال تنش ناهمسانگرد',
        date: '۲۰۲۶',
        readTime: '۶ دقیقه مطالعه',
        category: 'ژئومکانیک چاه',
        excerpt:
          'طراحی الاستیک مرسوم تنها بارهای لحظه‌ای حین تکمیل را می‌سنجد؛ اما در سازندهای تبخیری و شیل‌های خزنده، همگرایی تدریجی دیواره چاه تنش‌های برشی و له‌شدگی را به سیمان و جداری منتقل می‌کند.',
        equationCallout: 'ε_total(t) = ε_elastic + ε_viscoelastic(t) + ε_viscoplastic(σ_eff, t)',
        sections: [
          {
            heading: '۱. فراتر از طراحی الاستیک ایستا',
            body: 'در روش‌های کلاسیک طراحی لوله جداری فرض می‌شود سازند اطراف پس از پایان حفاری در تعادل ایستا باقی می‌ماند؛ حال آنکه در لایه‌های خزنده ایران، آسایش تنش انحرافی در گذر زمان موجب انتقال پیوسته بار شعاعی بر غلاف سیمان و لوله جداری می‌شود.',
          },
          {
            heading: '۲. اهمیت ناهمسانگردی تنش‌های افقی',
            body: 'هنگامی که تنش‌های اصلی افقی نابرابر باشند (σ_H > σ_h)، بارگذاری یکنواخت جای خود را به فشار بیضوی نامتقارن می‌دهد و باعث ایجاد ممان خمشی موضعی در فولاد جداری و ترک‌خوردگی کششی در سیمان شکننده می‌گردد.',
          },
          {
            heading: '۳. شبیه‌سازی متوالی سه‌بعدی',
            body: 'مدل‌سازی گام‌به‌گام مراحل حفاری، فشار گل، هیدراتاسیون سیمان و تولید درازمدت امکان تعدیل واقعی ظرفیت له‌شدگی جداری را به جای اتکای صرف به ضرایب ایمنی تجربی فراهم می‌کند.',
          },
        ],
      },
      {
        id: 'note-acid-fracture',
        title: 'تفکیک هندسه انحلال اسید از بسته‌شدن مکانیکی در شکستگی‌های کربناته',
        subtitle: 'درس‌هایی از کانال‌های ماشین‌کاری‌شده معین در مغزه‌های سنگ آهک سازند ایلام',
        date: '۲۰۲۶',
        readTime: '۵ دقیقه مطالعه',
        category: 'انگیزش مخزن',
        excerpt:
          'عملیات اسیدکاری میدانی سطوح زبر و تصادفی ایجاد می‌کند. ماشین‌کاری کانال‌های منظم روی مغزه‌های شکاف‌دار ایلام نشان می‌دهد چگونه عمق، عرض و سفتی سنگ رسانایی نهایی را تعیین می‌کنند.',
        equationCallout: 'k_f w_f (σ_c)  ∝  f(d_channel, w_channel, E_rock, σ_closure)',
        sections: [
          {
            heading: '۱. ابهام تصادفی بودن سطوح اسیدخورده',
            body: 'واکنش اسید کلریدریک با سنگ کربناته ناهمگن تقریباً هیچ‌گاه دو سطح کاملاً یکسان تولید نمی‌کند؛ بنابراین در آزمایش‌های متداول نمی‌توان به روشنی تشخیص داد که افت رسانایی ناشی از ضعف مکانیکی ستون‌های سنگ است یا عمق ناکافی کانال‌های جریان.',
          },
          {
            heading: '۲. معیار آزمایشگاهی استاندارد API RP-61',
            body: 'با ایجاد کانال‌هایی با عمق معین (۰.۶ تا ۱.۶ میلی‌متر) و پهنای مشخص (۱.۴ تا ۲.۴۸ میلی‌متر) بر روی مغزه‌های استاندارد ۱۸.۴ × ۴.۷۵ سانتی‌متری سازند ایلام، تغییرشکل مکانیکی به طور دقیق ایزوله شده و داده مرجع برای مدل‌های پیش‌بینی رسانایی فراهم می‌شود.',
          },
        ],
      },
      {
        id: 'note-energy-policy',
        title: 'چرا بهره‌وری مهندسی نیازمند طراحی نهادهای سیاست‌گذاری انرژی است؟',
        subtitle: 'پیوند تولید بهینه زیرسطحی با صندوق بهینه‌سازی مصرف و نظام نوآوری فناورانه (TIS)',
        date: '۲۰۲۵',
        readTime: '۵ دقیقه مطالعه',
        category: 'سیاست انرژی',
        excerpt:
          'افزایش راندمان استخراج زیرزمینی تنها نیمی از مسیر است اگر در بخش پایین‌دست حدود ۳۰ درصد انرژی کشور تلف شود. هم‌راستاسازی ابزارهای قیمتی با صندوق بهینه‌سازی مصرف، حلقه مفقوده سرمایه‌گذاری بهره‌وری است.',
        sections: [
          {
            heading: '۱. توازن میان ابزارهای قیمتی و غیرقیمتی',
            body: 'اصلاح شوک‌درمانی قیمت انرژی بدون سپر حمایتی و کانال سرمایه‌گذاری با مقاومت اجتماعی روبه‌رو می‌شود و یارانه فراگیر نیز اتلاف را تثبیت می‌کند. ترکیب بازتوزیع سهمیه‌ای یارانه با صندوق بهینه‌سازی مصرف، سرمایه پایدار برای نوسازی صنعتی می‌آفریند.',
          },
          {
            heading: '۲. کارکردهای نظام نوآوری فناورانه (TIS)',
            body: 'ارزیابی راهبردهای انرژی بخش صنعت در قالب اهداف ماموریت‌گرا و کارکردهای اشاعه‌گرای TIS تضمین می‌کند پژوهش‌های فنی به کاهش واقعی شدت انرژی صنایع منجر شوند.',
          },
        ],
      },
    ],
    marqueeTerms: [
      'ژئومکانیک مخازن نفت',
      'برهم‌کنش سنگ–سیمان–جداری',
      'اسیدکاری شکستگی کربناته',
      'شبیه‌سازی CFD حفاری',
      'حکمرانی و سیاست انرژی',
      'اصلاح یارانه انرژی',
      'دانشگاه صنعتی امیرکبیر',
    ],
  },
};

export const PROFILE = PROFILE_BY_LANG.en;
