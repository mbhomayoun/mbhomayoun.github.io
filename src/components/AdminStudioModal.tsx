import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  CloudUpload,
  Languages,
  Linkedin,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Lang } from '../data/profile';
import {
  clearUnlockedVaultSession,
  getUnlockedVaultSession,
  unlockAdminVault,
  UnlockedVaultSession,
} from '../services/adminVault';
import {
  smartAutoTranslatePost,
  smartDraftPost,
  smartParseLinkedIn,
} from '../services/freeAiAssistant';
import {
  publishCmsToGitHub,
  syncOpenAlexPublications,
  uploadMaterialFileToGitHub,
} from '../services/githubSync';
import { formatNum } from '../utils/format';
import { CmsPayload, CmsPost, ContentPlacement } from '../types/cms';

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

  // Strict Email + Password Gate State
  const [session, setSession] = useState<UnlockedVaultSession | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Single-Section Composer State (only mounted once session !== null)
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

  const [linkedInPaste, setLinkedInPaste] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'ok' | 'err';
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setSession(getUnlockedVaultSession());
    setLoginError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setBusy('login');
    try {
      const unlocked = await unlockAdminVault(loginEmail, loginPassword);
      setSession(unlocked);
      setLoginPassword('');
    } catch (err) {
      setLoginError(
        err instanceof Error
          ? err.message
          : isRtl
            ? 'ایمیل یا رمز عبور نادرست است.'
            : 'Invalid email or password.'
      );
    } finally {
      setBusy(null);
    }
  };

  const handleSignOut = () => {
    clearUnlockedVaultSession();
    setSession(null);
    setStatusBanner(null);
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
    if (!session) return;
    const seed = [srcTitle, srcSummary, srcBody].filter(Boolean).join('\n');
    if (!seed.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'ابتدا چند خط ایده یا عنوان بنویسید تا دستیار هوشمند متن را تکمیل کند.'
          : 'Write a short idea or title first for the AI assistant to expand.',
      });
      return;
    }
    setBusy('draft');
    setStatusBanner(null);
    try {
      const out = await smartDraftPost({
        geminiKey: session.geminiKey,
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
        msg:
          out.engine === 'gemini'
            ? isRtl
              ? 'متن با هوش مصنوعی Gemini نگارش و بهبود یافت.'
              : 'Draft polished with Gemini AI.'
            : isRtl
              ? 'متن با دستیار داخلی ساختاردهی و آماده شد.'
              : 'Draft structured cleanly with built-in academic assistant.',
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
    if (!session) return;
    if (!srcTitle.trim() && !srcBody.trim()) return;
    setBusy('translate');
    setStatusBanner(null);
    try {
      const res = await smartAutoTranslatePost({
        geminiKey: session.geminiKey,
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
        msg:
          res.engine === 'gemini'
            ? isRtl
              ? 'پیش‌نمایش ترجمه هوشمند Gemini آماده شد!'
              : 'Gemini AI translation preview ready! Review both versions before publishing.'
            : isRtl
              ? 'پیش‌نمایش ترجمه دوزبانه آماده شد (موتور ترجمه آزاد)!'
              : 'Bilingual translation preview ready! Review both versions before publishing.',
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
    if (!session) return;
    if (!srcTitle.trim()) {
      setStatusBanner({
        type: 'err',
        msg: isRtl
          ? 'عنوان مطلب را وارد کنید.'
          : 'Please enter a title before publishing.',
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
        mediaUrl = await uploadMaterialFileToGitHub({
          token: session.githubToken,
          file: mediaFile,
        });
        mediaType = mediaFile.type.includes('pdf') ? 'pdf' : 'video-file';
      }

      const isEn = sourceLang === 'en';
      const newPost: CmsPost = {
        id: `post-${Date.now()}`,
        placement,
        urgent: urgent || placement === 'alert',
        date: new Date().toISOString().slice(0, 10),
        tagEn: isEn
          ? srcTag || placement.toUpperCase()
          : trTag || srcTag || placement.toUpperCase(),
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

      await publishCmsToGitHub({
        token: session.githubToken,
        payload: nextPayload,
        commitMessage: `cms: publish "${newPost.titleEn.slice(0, 48)}"`,
      });

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
        msg: isRtl
          ? 'با موفقیت روی وب‌سایت زنده منتشر شد!'
          : 'Published globally to your live website!',
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
    if (!session) return;
    setBusy('delete');
    try {
      const nextPayload: CmsPayload = {
        ...cmsData,
        posts: cmsData.posts.filter((p) => p.id !== id),
      };
      await publishCmsToGitHub({
        token: session.githubToken,
        payload: nextPayload,
        commitMessage: `cms: remove item ${id}`,
      });
      onUpdateCms(nextPayload);
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const handleSyncOpenAlex = async () => {
    if (!session) return;
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
      await publishCmsToGitHub({
        token: session.githubToken,
        payload: nextPayload,
        commitMessage: 'chore(sync): update publications from OpenAlex',
      });
      onUpdateCms(nextPayload);
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? `${synced.length} اثر پژوهشی از OpenAlex همگام‌سازی و منتشر شد.`
          : `Synced & published ${synced.length} works from OpenAlex.`,
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
    if (!session || !linkedInPaste.trim()) return;
    setBusy('linkedin');
    setStatusBanner(null);
    try {
      const entries = await smartParseLinkedIn({
        geminiKey: session.geminiKey,
        rawText: linkedInPaste,
      });
      const nextPayload: CmsPayload = {
        ...cmsData,
        timelineOverrides: [...entries, ...cmsData.timelineOverrides],
      };
      await publishCmsToGitHub({
        token: session.githubToken,
        payload: nextPayload,
        commitMessage: 'cms: update career timeline from LinkedIn',
      });
      onUpdateCms(nextPayload);
      setLinkedInPaste('');
      setStatusBanner({
        type: 'ok',
        msg: isRtl
          ? `${entries.length} سابقه جدید دوزبانه به مسیر علمی افزوده و منتشر شد.`
          : `Added & published ${entries.length} bilingual milestones to your Chronicle.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'err',
        msg: err instanceof Error ? err.message : 'LinkedIn import failed.',
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
          aria-label="Private Owner Login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          {!session ? (
            /* STRICT LOCKED LOGIN GATE — Nothing else exists in DOM before authentication */
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 border border-white/15"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#2EE6D6]/15 p-2.5 text-[#2EE6D6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[#F4F1EA]">
                      {isRtl ? 'ورود اختصاصی مدیر' : 'Owner Sign In'}
                    </h2>
                    <p className="text-xs text-[#98A2B3]">
                      {isRtl
                        ? 'دسترسی صرفاً با ایمیل و رمز عبور تأییدشده'
                        : 'Restricted to authenticated owner credentials'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close login"
                  className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#98A2B3]">
                    {isRtl ? 'ایمیل مدیر' : 'Admin Email'}
                  </label>
                  <input
                    required
                    dir="ltr"
                    type="email"
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#98A2B3]">
                    {isRtl ? 'رمز عبور' : 'Password'}
                  </label>
                  <input
                    required
                    dir="ltr"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                  />
                </div>

                {loginError && (
                  <div className="rounded-xl bg-[#F5B971]/12 border border-[#F5B971]/35 px-3.5 py-2.5 text-xs text-[#F5B971]">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy === 'login'}
                  className="w-full rounded-full bg-[#2EE6D6] hover:bg-[#F4F1EA] text-[#050608] font-semibold text-sm py-3 px-6 transition-colors cursor-pointer"
                >
                  {busy === 'login'
                    ? isRtl
                      ? 'در حال ورود...'
                      : 'Signing in...'
                    : isRtl
                      ? 'ورود به پنل مدیریت'
                      : 'Sign In'}
                </button>
              </form>
            </motion.div>
          ) : (
            /* AUTHENTICATED SINGLE-SECTION COMPOSER */
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="glass-panel w-full max-w-5xl max-h-[92vh] overflow-y-auto overscroll-contain rounded-3xl p-5 sm:p-7 space-y-6 border border-white/15"
            >
              {/* Top Authenticated Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#2EE6D6]/15 p-2.5 text-[#2EE6D6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-semibold text-[#F4F1EA]">
                      {isRtl
                        ? 'پنل یکپارچه انتشار و دستیار هوش مصنوعی'
                        : 'Private Owner Studio & AI Publisher'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#98A2B3] mt-0.5">
                      <span dir="ltr" className="text-[#2EE6D6]">
                        {session.email}
                      </span>
                      <span>·</span>
                      <span>
                        {session.geminiKey
                          ? isRtl
                            ? 'دستیار Gemini + مترجم آزاد فعال'
                            : 'Gemini AI + Built-in Translator Active'
                          : isRtl
                            ? 'دستیار داخلی و مترجم آزاد فعال'
                            : 'Built-in AI & Free Translator Active'}
                      </span>
                      <span>·</span>
                      <span>
                        {isRtl ? 'انتشار سراسری گیت‌هاب فعال' : 'Live Publishing Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-white/12 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs text-[#98A2B3] hover:text-[#F4F1EA] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'خروج' : 'Sign Out'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-[#F4F1EA]">
                      {isRtl
                        ? '۱. محل نمایش (انتخاب برچسب بخش):'
                        : '1. Where should this appear? (Select Tag):'}
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-[#F5B971] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urgent || placement === 'alert'}
                        onChange={(e) => setUrgent(e.target.checked)}
                        className="accent-[#F5B971]"
                      />
                      <span>
                        {isRtl
                          ? 'نمایش در زنگوله هشدار بالای صفحه'
                          : 'Pin to Top-Bar Alert Bell'}
                      </span>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                            sourceLang === 'en'
                              ? 'bg-[#F4F1EA] text-[#050608] font-semibold'
                              : 'text-[#98A2B3]'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => setSourceLang('fa')}
                          className={`font-fa-force px-2.5 py-0.5 rounded-full cursor-pointer ${
                            sourceLang === 'fa'
                              ? 'bg-[#F4F1EA] text-[#050608] font-semibold'
                              : 'text-[#98A2B3]'
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
                        placeholder={
                          sourceLang === 'fa' ? 'برچسب کوتاه...' : 'Tag (e.g. Lecture 04)'
                        }
                        className="rounded-xl bg-black/45 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                      />
                      <input
                        type="text"
                        value={durationOrPages}
                        onChange={(e) => setDurationOrPages(e.target.value)}
                        placeholder={
                          sourceLang === 'fa' ? 'مدت / صفحات...' : 'Duration / Pages'
                        }
                        className="rounded-xl bg-black/45 border border-white/10 px-3 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                      />
                    </div>

                    <input
                      dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                      type="text"
                      value={srcTitle}
                      onChange={(e) => setSrcTitle(e.target.value)}
                      placeholder={sourceLang === 'fa' ? 'عنوان مطلب یا فایل...' : 'Title...'}
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />

                    <input
                      dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                      type="text"
                      value={srcSummary}
                      onChange={(e) => setSrcSummary(e.target.value)}
                      placeholder={sourceLang === 'fa' ? 'خلاصه کوتاه...' : 'Short summary...'}
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />

                    <textarea
                      dir={sourceLang === 'fa' ? 'rtl' : 'ltr'}
                      rows={5}
                      value={srcBody}
                      onChange={(e) => setSrcBody(e.target.value)}
                      placeholder={
                        sourceLang === 'fa'
                          ? 'متن کامل یا چند نکته کوتاه برای نگارش با AI...'
                          : 'Full text or rough bullets for AI to polish...'
                      }
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F1EA] focus:outline-none focus:border-[#2EE6D6]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label className="rounded-xl border border-dashed border-white/20 hover:border-[#2EE6D6]/60 bg-black/35 px-3 py-2.5 text-xs text-[#98A2B3] flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-[#2EE6D6] shrink-0" />
                        <span className="truncate">
                          {mediaFile
                            ? mediaFile.name
                            : isRtl
                              ? 'آپلود PDF یا ویدئو (فقط‌خواندنی)'
                              : 'Upload PDF / Video (View-Only)'}
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

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleAiPolish}
                        disabled={busy !== null}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/45 px-4 py-2 text-xs text-[#F4F1EA] hover:bg-[#8B7CFF]/35 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
                        <span>
                          {busy === 'draft'
                            ? '...'
                            : isRtl
                              ? 'نگارش و بهبود با AI'
                              : 'AI Draft / Polish'}
                        </span>
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
                        placeholder={
                          sourceLang === 'en'
                            ? 'عنوان فارسی ترجمه‌شده...'
                            : 'Translated English title...'
                        }
                        className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#F5B971]"
                      />

                      <input
                        dir={sourceLang === 'en' ? 'rtl' : 'ltr'}
                        type="text"
                        value={trSummary}
                        onChange={(e) => setTrSummary(e.target.value)}
                        placeholder={
                          sourceLang === 'en'
                            ? 'خلاصه فارسی...'
                            : 'Translated English summary...'
                        }
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
                          ? isRtl
                            ? 'در حال انتشار...'
                            : 'Publishing...'
                          : isRtl
                            ? 'انتشار هم‌زمان در نسخه فارسی و انگلیسی'
                            : 'Publish to Both EN & FA Versions'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* OpenAlex & LinkedIn Sync Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-black/35 border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F4F1EA]">
                      {isRtl
                        ? 'همگام‌سازی خودکار مقالات (OpenAlex / Scholar)'
                        : 'Auto-Sync Publications (OpenAlex & Weekly Cron)'}
                    </span>
                    <span dir="ltr" className="font-mono text-[10px] text-[#98A2B3]">
                      ID: {cmsData.openAlexAuthorId || 'A5120058838'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncOpenAlex}
                    disabled={busy !== null}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2EE6D6]/40 bg-[#2EE6D6]/12 px-4 py-2 text-xs text-[#2EE6D6] hover:bg-[#2EE6D6]/20 cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${busy === 'sync' ? 'animate-spin' : ''}`}
                    />
                    <span>
                      {isRtl ? 'به‌روزرسانی فوری مقالات' : 'Sync New Papers Now'}
                    </span>
                  </button>
                </div>

                <div className="rounded-2xl bg-black/35 border border-white/10 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
                    <Linkedin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>
                      {isRtl
                        ? 'به‌روزرسانی مسیر علمی از متن لینکدین (AI)'
                        : 'Import LinkedIn Experience → Bilingual Chronicle'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={linkedInPaste}
                      onChange={(e) => setLinkedInPaste(e.target.value)}
                      placeholder={
                        isRtl
                          ? 'متن سوابق را از لینکدین پیست کنید...'
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
                      {busy === 'linkedin' ? '...' : isRtl ? 'تبدیل و انتشار' : 'AI Import'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Published Items */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-[#98A2B3]">
                  {isRtl
                    ? `مطالب منتشرشده (${formatNum(cmsData.posts.length, 'fa')})`
                    : `Published Items (${cmsData.posts.length})`}
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
                        disabled={busy !== null}
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
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
