import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { Lang, PROFILE_BY_LANG } from './data/profile';
import { CmsPayload, CmsPost } from './types/cms';
import {
  DEFAULT_CMS,
  fetchInitialCms,
  loadDismissedAlerts,
  saveDismissedAlerts,
  saveLocalCmsOverride,
} from './services/cms';
import { Preloader } from './components/Preloader';
import { WebGLBackdrop } from './components/WebGLBackdrop';
import { MagneticCursor } from './components/MagneticCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PinnedLabShowcase } from './components/PinnedLabShowcase';
import { ProjectsSection } from './components/ProjectsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { TimelineSection } from './components/TimelineSection';
import { LearningHubSection } from './components/LearningHubSection';
import { WritingSection } from './components/WritingSection';
import { ContactSection } from './components/ContactSection';
import { CommandPalette } from './components/CommandPalette';

const ProtectedViewerModal = lazy(() =>
  import('./components/ProtectedViewerModal').then((m) => ({
    default: m.ProtectedViewerModal,
  }))
);

const AdminStudioModal = lazy(() =>
  import('./components/AdminStudioModal').then((m) => ({
    default: m.AdminStudioModal,
  }))
);

export function App() {
  const [ready, setReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash === '#admin' : false
  );
  const [previewPost, setPreviewPost] = useState<CmsPost | null>(null);
  const [cmsData, setCmsData] = useState<CmsPayload>(DEFAULT_CMS);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() =>
    typeof window !== 'undefined' ? loadDismissedAlerts() : []
  );

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('observatory-lang');
    return saved === 'fa' ? 'fa' : 'en';
  });
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    fetchInitialCms().then((payload) => {
      setCmsData(payload);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = PROFILE_BY_LANG[lang].pageTitle;
    window.localStorage.setItem('observatory-lang', lang);
  }, [lang]);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isDesktop = window.innerWidth >= 1024;
    if (reducedMotion || !isFinePointer || !isDesktop) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Lock background page scroll whenever ANY modal / Menu palette / Drawer is open
  useEffect(() => {
    const syncScrollLock = () => {
      const hasDialog =
        cmdOpen ||
        adminOpen ||
        Boolean(previewPost) ||
        Boolean(document.querySelector('[role="dialog"]'));

      if (hasDialog) {
        document.body.style.overflow = 'hidden';
        lenisRef.current?.stop();
      } else {
        document.body.style.overflow = '';
        lenisRef.current?.start();
      }
    };

    syncScrollLock();
    const observer = new MutationObserver(syncScrollLock);
    observer.observe(document.body, { childList: true, subtree: false });

    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
      lenisRef.current?.start();
    };
  }, [cmdOpen, adminOpen, previewPost]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, duration: 1.25 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'fa' : 'en'));
  }, []);

  const urgentAlerts = useMemo(
    () =>
      cmsData.posts.filter((p) => p.urgent || p.placement === 'alert'),
    [cmsData.posts]
  );

  const handleDismissAllAlerts = useCallback(() => {
    const ids = urgentAlerts.map((a) => a.id);
    setDismissedAlertIds(ids);
    saveDismissedAlerts(ids);
  }, [urgentAlerts]);

  const handleUpdateCms = useCallback((next: CmsPayload) => {
    setCmsData(next);
    saveLocalCmsOverride(next);
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <Preloader onComplete={() => setReady(true)} lang={lang} />
      <WebGLBackdrop mode="interference" reducedMotion={reducedMotion} />
      <MagneticCursor />

      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        onNavigate={navigateTo}
        onOpenCommand={() => setCmdOpen(true)}
        alerts={urgentAlerts}
        dismissedAlertIds={dismissedAlertIds}
        onDismissAllAlerts={handleDismissAllAlerts}
        onOpenAlert={(post) => setPreviewPost(post)}
      />

      <main className="relative">
        <HeroSection
          lang={lang}
          onNavigate={navigateTo}
          ready={ready}
          reducedMotion={reducedMotion}
        />
        <PinnedLabShowcase lang={lang} />
        <ProjectsSection lang={lang} />
        <PublicationsSection
          lang={lang}
          syncedPublications={cmsData.syncedPublications}
        />
        <TimelineSection
          lang={lang}
          timelineOverrides={cmsData.timelineOverrides}
        />
        <LearningHubSection
          lang={lang}
          posts={cmsData.posts}
          onPreview={(post) => setPreviewPost(post)}
        />
        <WritingSection lang={lang} />
        <ContactSection lang={lang} onOpenAdmin={() => setAdminOpen(true)} />
      </main>

      <CommandPalette
        lang={lang}
        onToggleLang={toggleLang}
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigateTo}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((v) => !v)}
      />

      <Suspense fallback={null}>
        {previewPost && (
          <ProtectedViewerModal
            post={previewPost}
            lang={lang}
            onClose={() => setPreviewPost(null)}
          />
        )}

        {adminOpen && (
          <AdminStudioModal
            open={adminOpen}
            onClose={() => setAdminOpen(false)}
            lang={lang}
            cmsData={cmsData}
            onUpdateCms={handleUpdateCms}
          />
        )}
      </Suspense>
    </MotionConfig>
  );
}

export default App;
