import { ChangeEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  CloudUpload,
  KeyRound,
  Languages,
  Linkedin,
  Lock,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Lang } from '../data/profile';
import {
  aiAutoTranslatePost,
  aiDraftPost,
  aiParseLinkedInProfile,
} from '../services/geminiAi';
import {
  publishCmsToGitHub,
  syncOpenAlexPublications,
  uploadMaterialFileToGitHub,
  verifyGitHubToken,
} from '../services/githubSync';
import { CmsPayload, CmsPost, ContentPlacement } from '../types/cms';

const GITHUB_TOKEN_KEY = 'observatory-gh-token';
const GEMINI_KEY_STORAGE = 'observatory-gemini-key';

interface AdminStudioModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  cmsData: CmsPayload;
  onUpdateCms: (next: CmsPayload) => void;
}

export function AdminStudioModal({
  open,
  onClose,
  lang,
  cmsData,
  onUpdateCms,
}: AdminStudioModalProps) {
  const isRtl = lang === 'fa';

  // Auth & API settings
  const [ghToken, setGhToken] = useState(
    () => window.localStorage.getItem(GITHUB_TOKEN_KEY) ?? ''
  );
  const [ghStatus, setGhStatus] = useState<'disconnected' | 'verified' | 'local'>(
    () => (window.localStorage.getItem(GITHUB_TOKEN_KEY) ? 'verified' : 'disconnected')
  );
  const [geminiKey, setGeminiKey] = useState(
    () => window.localStorage.getItem(GEMINI_KEY_STORAGE) ?? ''
  );
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  // Single-Section Composer State
  const [placement, setPlacement] = useState<ContentPlacement>('blog');
  const [urgent, setUrgent] = useState(false);
  const [sourceLang, setSourceLang] = useState<'en' | 'fa'>(lang);
  const [srcTag, setSrcTag] = useState('');
  const [srcTitle, setSrcTitle] = useState('');
  const [srcSummary, setSrcSummary] = useState('');
  const [srcBody, setSrcBody] = useState('');
  const [equation, setEquation] = useState('');

  // Auto-Translated Opposite Language Preview State
  const [trTag, setTrTag] = useState('');
  const [trTitle, setTrTitle] = useState('');
  const [trSummary, setTrSummary] = useState('');
  const [trBody, setTrBody] = useState('');

  // Media / File attachment
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [externalVideoUrl, setExternalVideoUrl] = useState('');
  const [durationOrPages, setDurationOrPages] = useState('');

  // LinkedIn / Scholar Sync Drawer inside the same single Studio
  const [linkedInPaste, setLinkedInPaste] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'ok' | 'err';
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleConnectGitHub = async () => {
    if (!ghToken.trim()) return;
    setBusy('auth');
    const res = await verifyGitHubToken(ghToken);
    setBusy(null);
    if (res.ok) {
      window.localStorage.setItem(GITHUB_TOKEN_KEY, ghToken.trim());
      setGhStatus('verified');
      setAuthMsg(
        isRtl
          ? `متصل شد به مخزن با حساب ${res.login} (انتشار سراسری فعال)`
          : `Connected as ${res.login} — Global GitHub Pages publishing active.`
      );
    } else {
      setAuthMsg(res.error ?? 'Token check failed.');
    }
  };

  const handleSaveGeminiKey = (val: string) => {
    setGeminiKey(val);
    window.localStorage.setItem(GEMINI_KEY_STORAGE, val.trim());
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setMediaFile(f);
    if (f) {
      if (f.type.includes('pdf')) setPlacement('pdf');
      else if (f.type.startsWith('video/')) setPlacement('video');
    }
  };

  const handleAiPolish = async () => {
    if (!geminiKey.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'ابتدا کلید رایگان Gemini API را در بخش تنظیمات بالا وارد کنید.'
          : 'Enter your Gemini API key in the settings bar above first.',
      });
      return;
    }
    const seed = [srcTitle, srcSummary, srcBody].filter(Boolean).join('\n');
    if (!seed.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'ابتدا چند خط ایده یا عنوان بنویسید تا هوش مصنوعی متن را تکمیل کند.'
          : 'Write a short idea or title first for AI to expand.',
      });
      return;
    }
    setBusy('draft');
    setStatusBanner(null);
    try {
      const out = await aiDraftPost({
        apiKey: geminiKey,
        sourceLang,
        placement,
        promptOrDraft: seed,
      });
      setSrcTag(out.tag);
      setSrcTitle(out.title);
      setSrcSummary(out.summary);
      setSrcBody(out.body);
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? 'متن با Gemini 4 Hydrogen نگارش/بهبود یافت.'
          : 'Draft polished with Gemini 4 Hydrogen.',
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'AI draft failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const handleAiTranslate = async () => {
    if (!geminiKey.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'برای ترجمه خودکار، کلید رایگان Gemini API را وارد کنید.'
          : 'Enter your Gemini API key above to auto-translate.',
      });
      return;
    }
    if (!srcTitle.trim() && !srcBody.trim()) return;
    setBusy('translate');
    setStatusBanner(null);
    try {
      const res = await aiAutoTranslatePost({
        apiKey: geminiKey,
        fromLang: sourceLang,
        tag: srcTag || placement,
        title: srcTitle,
        summary: srcSummary,
        body: srcBody,
      });
      setTrTag(res.translatedTag);
      setTrTitle(res.translatedTitle);
      setTrSummary(res.translatedSummary);
      setTrBody(res.translatedBody);
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? 'پیش‌نمایش ترجمه دوزبانه آماده شد!'
          : 'Auto-translation preview ready! Inspect both versions below before publishing.',
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'Translation failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const handlePublishPost = async () => {
    if (!srcTitle.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl ? 'عنوان مطلب را وارد کنید.' : 'Please enter a title before publishing.',
      });
      return;
    }

    setBusy('publish');
    setStatusBanner(null);
    try {
      let mediaUrl: string | undefined = externalVideoUrl.trim() || undefined;
      let mediaType: CmsPost['mediaType'] = externalVideoUrl.trim()
        ? 'video-embed'
        : 'none';

      if (mediaFile) {
        if (ghStatus === 'verified' && ghToken.trim()) {
          mediaUrl = await uploadMaterialFileToGitHub({
            token: ghToken,
            file: mediaFile,
          });
        } else {
          // Local instant browser preview URL for session testing
          mediaUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(mediaFile);
          });
        }
        mediaType = mediaFile.type.includes('pdf') ? 'pdf' : 'video-file';
      }

      const isEn = sourceLang === 'en';
      const newPost: CmsPost = {
        id: `post-${Date.now()}`,
        placement,
        urgent: urgent || placement === 'alert',
        date: new Date().toISOString().slice(0, 10),
        tagEn: isEn ? srcTag || placement.toUpperCase() : trTag || srcTag || placement.toUpperCase(),
        tagFa: isEn ? trTag || srcTag || 'مطلب جدید' : srcTag || 'مطلب جدید',
        titleEn: isEn ? srcTitle : trTitle || srcTitle,
        titleFa: isEn ? trTitle || srcTitle : srcTitle,
        summaryEn: isEn ? srcSummary : trSummary || srcSummary,
        summaryFa: isEn ? trSummary || srcSummary : srcSummary,
        bodyEn: isEn ? srcBody : trBody || srcBody,
        bodyFa: isEn ? trBody || srcBody : srcBody,
        equation: equation.trim() || undefined,
        mediaUrl,
        mediaType,
        durationOrPages: durationOrPages.trim() || undefined,
      };

      const nextPayload: CmsPayload = {
        ...cmsData,
        lastSyncedAt: new Date().toISOString(),
        posts: [newPost, ...cmsData.posts],
      };

      if (ghStatus === 'verified' && ghToken.trim()) {
        await publishCmsToGitHub({
          token: ghToken,
          payload: nextPayload,
          commitMessage: `cms: publish "${newPost.titleEn.slice(0, 48)}"`,
        });
      }

      onUpdateCms(nextPayload);
      setSrcTag('');
      setSrcTitle('');
      setSrcSummary('');
      setSrcBody('');
      setTrTag('');
      setTrTitle('');
      setTrSummary('');
      setTrBody('');
      setEquation('');
      setMediaFile(null);
      setExternalVideoUrl('');
      setDurationOrPages('');

      setStatusBanner({
        type: 'ok',
        msg:
          ghStatus === 'verified'
            ? isRtl
              ? 'با موفقیت روی گیت‌هاب منتشر شد و برای همه بازدیدکنندگان فعال است!'
              : 'Published globally to GitHub! Live visitors will see it automatically.'
            : isRtl
              ? 'در پیش‌نمایش محلی مرورگر منتشر شد (برای انتشار همگانی توکن گیت‌هاب را متصل کنید).'
              : 'Published in Local Browser Mode! Connect a GitHub token above to push live globally.',
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'Publish failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const handleDeletePost = async (id: string) => {
    const nextPayload: CmsPayload = {
      ...cmsData,
      posts: cmsData.posts.filter((p) => p.id !== id),
    };
    if (ghStatus === 'verified' && ghToken.trim()) {
      await publishCmsToGitHub({
        token: ghToken,
        payload: nextPayload,
        commitMessage: `cms: remove item ${id}`,
      });
    }
    onUpdateCms(nextPayload);
  };

  const handleSyncOpenAlex = async () => {
    setBusy('sync');
    setStatusBanner(null);
    try {
      const synced = await syncOpenAlexPublications(
        cmsData.openAlexAuthorId || 'A5120058838'
      );
      const nextPayload: CmsPayload = {
        ...cmsData,
        lastSyncedAt: new Date().toISOString(),
        syncedPublications: synced,
      };
      if (ghStatus === 'verified' && ghToken.trim()) {
        await publishCmsToGitHub({
          token: ghToken,
          payload: nextPayload,
          commitMessage: 'chore(sync): update publications from OpenAlex',
        });
      }
      onUpdateCms(nextPayload);
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? `${synced.length} اثر پژوهشی از OpenAlex همگام‌سازی شد.`
          : `Synced ${synced.length} works live from OpenAlex.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'OpenAlex sync failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const handleImportLinkedIn = async () => {
    if (!geminiKey.trim() || !linkedInPaste.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'متن پروفایل لینکدین و کلید Gemini را وارد کنید.'
          : 'Paste LinkedIn text and enter your Gemini API key above.',
      });
      return;
    }
    setBusy('linkedin');
    setStatusBanner(null);
    try {
      const entries = await aiParseLinkedInProfile({
        apiKey: geminiKey,
        rawText: linkedInPaste,
      });
      const nextPayload: CmsPayload = {
        ...cmsData,
        timelineOverrides: [...entries, ...cmsData.timelineOverrides],
      };
      if (ghStatus === 'verified' && ghToken.trim()) {
        await publishCmsToGitHub({
          token: ghToken,
          payload: nextPayload,
          commitMessage: 'cms: update career timeline from LinkedIn',
        });
      }
      onUpdateCms(nextPayload);
      setLinkedInPaste('');
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? `${entries.length} سابقه جدید دوزبانه به مسیر علمی افزوده شد.`
          : `Added ${entries.length} bilingual milestones from LinkedIn to your Chronicle.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'LinkedIn parse failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  if (typeof document === 'undefined') return null;

  const placementOptions: { key: ContentPlacement; label: string }[] = isRtl
    ? [
        { key: 'alert', label: 'اعلان فوری زنگوله' },
        { key: 'blog', label: 'وبلاگ و اطلاعیه' },
        { key: 'video', label: 'ویدئو آموزشی' },
        { key: 'note', label: 'جزوه متنی' },
        { key: 'pdf', label: 'فایل PDF (بدون دانلود)' },
      ]
    : [
        { key: 'alert', label: 'Urgent Top-Bar Alert' },
        { key: 'blog', label: 'Blog & News' },
        { key: 'video', label: 'Lecture Video' },
        { key: 'note', label: 'Lecture Note' },
        { key: 'pdf', label: 'Protected PDF' },
      ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Admin Studio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="glass-panel w-full max-w-5xl max-h-[92vh] overflow-y-auto overscroll-contain rounded-3xl p-5 sm:p-7 space-y-6 border border-white/15"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#2EE6D6]/15 p-2.5 text-[#2EE6D6]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-semibold text-[#F4F1EA]">
                    {isRtl
                      ? 'پنل یکپارچه مدیریت محتوا و دستیار هوش مصنوعی'
                      : 'Unified Admin Studio & AI Publisher'}
                  </h2>
                  <p className="text-xs text-[#98A2B3]">
                    {isRtl
                      ? 'انتخاب محل نمایش، بارگذاری منبع فقط‌خواندنی، پیش‌نمایش ترجمه Gemini و همگام‌سازی مقالات در یک صفحه.'
                      : 'Single-screen control: pick where it appears, upload view-only media, preview AI translation, and publish.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auth & API Keys Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* GitHub Auth Box */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F4F1EA] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#2EE6D6]" />
                    {isRtl ? 'احراز هویت انتشار سراسری (GitHub Token)' : 'Admin Login (GitHub Token for Live Global Site)'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      ghStatus === 'verified'
                        ? 'bg-[#2EE6D6]/15 text-[#2EE6D6]'
                        : 'bg-[#F5B971]/15 text-[#F5B971]'
                    }`}
                  >
                    {ghStatus === 'verified'
                      ? isRtl ? 'متصل' : 'Live Sync'
                      : isRtl ? 'حالت محلی' : 'Local Mode'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    dir="ltr"
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="github_pat_... (repo contents:write)"
                    className="flex-1 rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />
                  <button
                    type="button"
                    onClick={handleConnectGitHub}
                    disabled={busy === 'auth'}
                    className="rounded-xl bg-[#F4F1EA] text-[#050608] px-3.5 py-2 text-xs font-semibold hover:bg-[#2EE6D6] cursor-pointer shrink-0"
                  >
                    {busy === 'auth' ? '...' : isRtl ? 'اتصال' : 'Connect'}
                  </button>
                </div>
                {authMsg && <p className="text-[11px] text-[#2EE6D6]">{authMsg}</p>}
              </div>

              {/* Gemini API Key Box */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F4F1EA] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B971]" />
                    {isRtl ? 'کلید رایگان Gemini API (دستیار نگارش و ترجمه)' : 'Google Gemini API Key (AI Writing & Translation)'}
                  </span>
                  <span className="font-mono text-[10px] text-[#98A2B3]">gemini-4-hydrogen</span>
                </div>
                <input
                  type="password"
                  dir="ltr"
                  value={geminiKey}
                  onChange={(e) => handleSaveGeminiKey(e.target.value)}
                  placeholder="AIzaSy... (saved only in your browser)"
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                />
              </div>
            </div>

            {statusBanner && (
              <div
                className={`rounded-xl px-4 py-2.5 text-xs border flex items-center gap-2 ${
                  statusBanner.type === 'ok'
                    ? 'bg-[#2EE6D6]/12 border-[#2EE6D6]/35 text-[#2EE6D6]'
                    : 'bg-[#F5B971]/12 border-[#F5B971]/35 text-[#F5B971]'
                }`}
              >
                {statusBanner.type === 'ok' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusBanner.msg}</span>
              </div>
            )}

            {/* SINGLE UNIFIED COMPOSER */}
            <div className="rounded-3xl bg-white/[0.025] border border-white/12 p-4 sm:p-6 space-y-5">
              {/* Step 1: Where to show it (Placement Tag) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[#F4F1EA]">
                    {isRtl ? '۱. محل نمایش (انتخاب برچسب بخش):' : '1. Where should this appear? (Select Tag):'}
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-[#F5B971] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={urgent || placement === 'alert'}
                      onChange={(e) => setUrgent(e.target.checked)}
                      className="accent-[#F5B971]"
                    />
                    <span>{isRtl ? 'نمایش در زنگوله هشدار بالای صفحه' : 'Pin to Top-Bar Alert Bell'}</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  {placementOptions.map((opt) => {
                    const active = placement === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setPlacement(opt.key)}
                        className={`rounded-full px-3.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2EE6D6] text-[#050608] border-[#2EE6D6] font-semibold'
                            : 'bg-white/5 text-[#98A2B3] border-white/10 hover:text-[#F4F1EA]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Source Editor + Side-by-Side AI Auto-Translation Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Source Draft Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2EE6D6]">
                      {isRtl ? '۲. متن اصلی شما' : '2. Your Post / Material'}
                    </span>
                    <div className="flex items-center gap-1 rounded-full bg-black/50 p-1 border border-white/10 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSourceLang('en')}
                        className={`px-2.5 py-0.5 rounded-full cursor-pointer ${
                          sourceLang === 'en' ? 'bg-[#F4F1EA] text-[#050608] font-semibold' : 'text-[#98A2B3]'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceLang('fa')}
                        className={`px-2.5 py-0.5 rounded-full cursor-pointer ${
                          sourceLang === 'fa' ? 'bg-[#F4F1EA] text-[#050608] font-semibold' : 'text-[#98A2B3]'
                        }`}
                      >
                        فارسی
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                      type="text"
                      value={srcTag}
                      onChange={(e) => setSrcTag(e.target.value)}
                      placeholder={sourceLang === 'fa' ? 'برچسب کوتاه (مثلاً جزوه فصل ۲)' : 'Tag (e.g. Lecture 04)'}
                      className="rounded-xl bg-black/45 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />
                    <input
                      type="text"
                      value={durationOrPages}
                      onChange={(e) => setDurationOrPages(e.target.value)}
                      placeholder={sourceLang === 'fa' ? 'مدت / صفحات (مثلاً ۱۸ اسلاید)' : 'Duration / Pages (e.g. 22 min)'}
                      className="rounded-xl bg-black/45 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />
                  </div>

                  <input
                    dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                    type="text"
                    value={srcTitle}
                    onChange={(e) => setSrcTitle(e.target.value)}
                    placeholder={sourceLang === 'fa' ? 'عنوان مطلب یا فایل...' : 'Post, announcement, or file title...'}
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />

                  <input
                    dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                    type="text"
                    value={srcSummary}
                    onChange={(e) => setSrcSummary(e.target.value)}
                    placeholder={sourceLang === 'fa' ? 'خلاصه کوتاه نمایش در کارت...' : 'Short summary line...'}
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />

                  <textarea
                    dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                    rows={5}
                    value={srcBody}
                    onChange={(e) => setSrcBody(e.target.value)}
                    placeholder={
                      sourceLang === 'fa'
                        ? 'متن کامل اطلاعیه، وبلاگ یا یادداشت درسی (می‌توانید چند خط بنویسید و دکمه نگارش AI را بزنید)...'
                        : 'Full text, lecture notes, or rough bullets for AI to polish...'
                    }
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />

                  {/* File Upload (View-Only Protected) + External Video URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className="rounded-xl border border-dashed border-white/20 hover:border-[#2EE6D6]/60 bg-black/35 px-3 py-2.5 text-xs text-[#98A2B3] flex items-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4 text-[#2EE6D6] shrink-0" />
                      <span className="truncate">
                        {mediaFile ? mediaFile.name : isRtl ? 'آپلود PDF یا ویدئو (فقط‌خواندنی)' : 'Upload PDF / Video (View-Only)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,video/mp4,video/webm"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <input
                      dir="ltr"
                      type="url"
                      value={externalVideoUrl}
                      onChange={(e) => setExternalVideoUrl(e.target.value)}
                      placeholder="Or embed URL (YouTube / Aparat / Vimeo)"
                      className="rounded-xl bg-black/45 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />
                  </div>

                  {/* AI Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAiPolish}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/45 px-4 py-2 text-xs text-[#F4F1EA] hover:bg-[#8B7CFF]/35 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
                      <span>{busy === 'draft' ? '...' : isRtl ? 'نگارش و بهبود با AI' : 'AI Draft / Polish'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAiTranslate}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B971]/20 border border-[#F5B971]/45 px-4 py-2 text-xs text-[#F4F1EA] hover:bg-[#F5B971]/35 cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5 text-[#F5B971]" />
                      <span>
                        {busy === 'translate'
                          ? '...'
                          : isRtl
                            ? 'ترجمه خودکار و پیش‌نمایش'
                            : 'AI Auto-Translate & Preview'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Auto-Translated Opposite Language Live Preview */}
                <div className="rounded-2xl bg-black/45 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5B971]">
                        {sourceLang === 'en'
                          ? '۳. پیش‌نمایش ترجمه خودکار (فارسی)'
                          : '3. Auto-Translated Preview (English)'}
                      </span>
                      <span className="text-[10px] text-[#98A2B3]">
                        {isRtl ? 'قابل ویرایش پیش از انتشار' : 'Editable before publish'}
                      </span>
                    </div>

                    <input
                      dir={sourceLang === 'en' ? 'rtl' : 'ltr'}
                      type="text"
                      value={trTag}
                      onChange={(e) => setTrTag(e.target.value)}
                      placeholder={sourceLang === 'en' ? 'برچسب فارسی...' : 'Translated tag...'}
                      className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                    />

                    <input
                      dir={sourceLang === 'en' ? 'rtl' : 'ltr'}
                      type="text"
                      value={trTitle}
                      onChange={(e) => setTrTitle(e.target.value)}
                      placeholder={sourceLang === 'en' ? 'عنوان فارسی ترجمه‌شده...' : 'Translated English title...'}
                      className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                    />

                    <input
                      dir={sourceLang === 'en' ? 'rtl' : 'ltr'}
                      type="text"
                      value={trSummary}
                      onChange={(e) => setTrSummary(e.target.value)}
                      placeholder={sourceLang === 'en' ? 'خلاصه فارسی...' : 'Translated English summary...'}
                      className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                    />

                    <textarea
                      dir={sourceLang === 'en' ? 'rtl' : 'ltr'}
                      rows={5}
                      value={trBody}
                      onChange={(e) => setTrBody(e.target.value)}
                      placeholder={
                        sourceLang === 'en'
                          ? 'پیش‌نمایش متن فارسی اینجا ظاهر می‌شود...'
                          : 'Translated English body will appear here...'
                      }
                      className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-xs sm:text-sm text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePublishPost}
                    disabled={busy !== null}
                    className="w-full rounded-full bg-[#2EE6D6] hover:bg-[#F4F1EA] text-[#050608] font-semibold text-sm py-3 px-6 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>
                      {busy === 'publish'
                        ? isRtl ? 'در حال انتشار...' : 'Publishing...'
                        : isRtl ? 'انتشار هم‌زمان در نسخه فارسی و انگلیسی' : 'Publish to Both EN & FA Versions'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-Sync Scholar / OpenAlex & LinkedIn Updater Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-black/35 border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F4F1EA]">
                    {isRtl ? 'همگام‌سازی خودکار مقالات (OpenAlex / Scholar)' : 'Auto-Sync Publications (OpenAlex & Weekly Cron)'}
                  </span>
                  <span dir="ltr" className="font-mono text-[10px] text-[#98A2B3]">
                    ID: {cmsData.openAlexAuthorId || 'A5120058838'}
                  </span>
                </div>
                <p className="text-[11px] text-[#98A2B3]">
                  {isRtl
                    ? 'یک GitHub Action هفتگی مقالات جدید شما را به طور خودکار می‌گیرد؛ همچنین می‌توانید همین لحظه همگام‌سازی کنید.'
                    : 'A free weekly GitHub Action auto-updates new papers; click below to sync immediately.'}
                </p>
                <button
                  type="button"
                  onClick={handleSyncOpenAlex}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2EE6D6]/40 bg-[#2EE6D6]/12 px-4 py-2 text-xs text-[#2EE6D6] hover:bg-[#2EE6D6]/20 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${busy === 'sync' ? 'animate-spin' : ''}`} />
                  <span>{isRtl ? 'به‌روزرسانی فوری مقالات' : 'Sync New Papers Now'}</span>
                </button>
              </div>

              <div className="rounded-2xl bg-black/35 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
                  <Linkedin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isRtl ? 'به‌روزرسانی مسیر علمی از متن لینکدین (AI)' : 'Import LinkedIn Experience → Bilingual Chronicle'}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkedInPaste}
                    onChange={(e) => setLinkedInPaste(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'متن سوابق یا درباره من را از لینکدین پیست کنید...'
                        : 'Paste LinkedIn Experience / Education text...'
                    }
                    className="flex-1 rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#38BDF8]"
                  />
                  <button
                    type="button"
                    onClick={handleImportLinkedIn}
                    disabled={busy !== null}
                    className="rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 px-3.5 py-2 text-xs text-[#38BDF8] hover:bg-[#38BDF8]/30 cursor-pointer shrink-0"
                  >
                    {busy === 'linkedin' ? '...' : isRtl ? 'تبدیل و افزودن' : 'AI Import'}
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Published Items Quick List */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#98A2B3]">
                {isRtl ? `مطالب منتشرشده (${cmsData.posts.length})` : `Published Items (${cmsData.posts.length})`}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto overscroll-contain">
                {cmsData.posts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-black/40 border border-white/8 px-4 py-2.5 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="text-[#2EE6D6] me-2">[{p.placement}]</span>
                      <span className="text-[#F4F1EA] font-medium truncate">
                        {isRtl ? p.titleFa || p.titleEn : p.titleEn || p.titleFa}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(p.id)}
                      aria-label="Delete item"
                      className="rounded-lg p-1.5 text-[#98A2B3] hover:text-[#F5B971] hover:bg-white/5 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
