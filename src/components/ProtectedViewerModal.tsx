import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Maximize2,
  Pause,
  Play,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Lang } from '../data/profile';
import { CmsPost } from '../types/cms';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function PdfCanvasViewer({ url, isRtl }: { url: string; isRtl: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.25);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const task = pdfjsLib.getDocument({ url });
    task.promise
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to render PDF preview');
        setLoading(false);
      });

    return () => {
      cancelled = true;
      task.destroy().catch(() => {});
    };
  }, [url]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    let renderTask: pdfjsLib.RenderTask | null = null;

    pdfDoc.getPage(pageNum).then((page) => {
      if (cancelled || !canvasRef.current) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderTask = page.render({
        canvas,
        canvasContext: ctx,
        viewport,
      });
      renderTask.promise.catch(() => {});
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDoc, pageNum, scale]);

  return (
    <div className="space-y-3 select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Custom Controls — NO Download / NO Print */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/50 border border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pageNum <= 1}
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            className="rounded-lg p-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span dir="ltr" className="font-mono text-xs text-[#F4F1EA]">
            {pageNum} / {numPages || '—'}
          </span>
          <button
            type="button"
            disabled={pageNum >= numPages}
            onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
            className="rounded-lg p-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-35 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.75, +(s - 0.15).toFixed(2)))}
            className="rounded-lg p-1.5 bg-white/5 hover:bg-white/15 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span dir="ltr" className="font-mono text-xs text-[#98A2B3]">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.2, +(s + 0.15).toFixed(2)))}
            className="rounded-lg p-1.5 bg-white/5 hover:bg-white/15 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        data-lenis-prevent
        className="relative max-h-[60vh] overflow-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0b0e14] p-4 flex justify-center"
      >
        {loading && (
          <div className="py-16 text-xs text-[#98A2B3]">
            {isRtl ? 'در حال بارگذاری پیش‌نمایش امن PDF...' : 'Rendering protected PDF canvas...'}
          </div>
        )}
        {error && (
          <div className="py-12 text-center text-xs text-[#F5B971] space-y-2">
            <p>{error}</p>
            <p className="text-[#98A2B3]">
              {isRtl
                ? 'اطمینان حاصل کنید فایل PDF در مسیر صحیح مخزن یا آدرس دارای مجوز CORS قرار دارد.'
                : 'Ensure the PDF resides in this site or allows CORS preview.'}
            </p>
          </div>
        )}
        {!error && (
          <div className="relative inline-block">
            <canvas ref={canvasRef} className="rounded shadow-xl block max-w-full h-auto" />
            {/* View-Only Diagonal Watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 -rotate-12"
            >
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-[#2EE6D6] border border-[#2EE6D6]/40 px-4 py-1.5 rounded">
                MB HOMAYOUN · VIEW-ONLY PROTECTED
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProtectedVideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const enterFullscreen = () => {
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen().catch(() => {});
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/12 bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={url}
        playsInline
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (v && v.duration) {
            setProgress((v.currentTime / v.duration) * 100);
          }
        }}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
        className="w-full max-h-[55vh] bg-black cursor-pointer"
      />

      {/* Subtle watermark badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 end-3 rounded-full bg-black/55 backdrop-blur-md border border-white/15 px-2.5 py-1 font-mono text-[10px] text-[#2EE6D6]/85"
      >
        VIEW-ONLY STREAM
      </div>

      {/* Custom Player Controls (Zero native download menu) */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#090C12] border-t border-white/10">
        <button
          type="button"
          onClick={togglePlay}
          className="rounded-full p-1.5 bg-[#2EE6D6] text-[#050608] cursor-pointer"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            const v = videoRef.current;
            const pct = Number(e.target.value);
            if (v && v.duration) {
              v.currentTime = (pct / 100) * v.duration;
              setProgress(pct);
            }
          }}
          className="flex-1 accent-[#2EE6D6] cursor-pointer"
        />

        <button
          type="button"
          onClick={toggleMute}
          className="rounded-lg p-1.5 text-[#98A2B3] hover:text-[#F4F1EA] cursor-pointer"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={enterFullscreen}
          className="rounded-lg p-1.5 text-[#98A2B3] hover:text-[#F4F1EA] cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ProtectedViewerModal({
  post,
  lang,
  onClose,
}: {
  post: CmsPost | null;
  lang: Lang;
  onClose: () => void;
}) {
  const isRtl = lang === 'fa';

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {post && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? post.titleFa : post.titleEn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onContextMenu={(e) => e.preventDefault()}
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl p-5 sm:p-8 space-y-5 border border-white/15"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2EE6D6]/15 border border-[#2EE6D6]/35 px-2.5 py-0.5 text-[#2EE6D6]">
                    <Lock className="w-3 h-3" />
                    {isRtl ? 'پیش‌نمایش امن · بدون دانلود' : 'View-Only · Protected'}
                  </span>
                  <span className="text-[#F5B971]">
                    {isRtl ? post.tagFa || post.tagEn : post.tagEn || post.tagFa}
                  </span>
                  <span dir="ltr" className="font-mono text-[#98A2B3]">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-semibold text-[#F4F1EA] leading-snug">
                  {isRtl ? post.titleFa || post.titleEn : post.titleEn || post.titleFa}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="rounded-full p-2 bg-white/5 hover:bg-white/15 text-[#98A2B3] hover:text-[#F4F1EA] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Protected Media */}
            {post.mediaType === 'pdf' && post.mediaUrl && (
              <PdfCanvasViewer url={post.mediaUrl} isRtl={isRtl} />
            )}

            {post.mediaType === 'video-file' && post.mediaUrl && (
              <ProtectedVideoPlayer url={post.mediaUrl} />
            )}

            {post.mediaType === 'video-embed' && post.mediaUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-black aspect-video">
                <iframe
                  src={post.mediaUrl}
                  title={post.titleEn || post.titleFa}
                  allow="autoplay; fullscreen; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  className="w-full h-full border-0"
                />
                {/* Shield blocking Drive/external pop-out corner */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-16 h-14 z-10"
                />
              </div>
            )}

            {post.equation && (
              <div
                dir="ltr"
                className="rounded-2xl bg-black/55 border border-[#2EE6D6]/30 p-4 font-mono text-xs sm:text-sm text-[#2EE6D6] overflow-x-auto"
              >
                {post.equation}
              </div>
            )}

            {/* Text Content */}
            <div className="relative rounded-2xl bg-white/[0.02] border border-white/8 p-5 space-y-3 text-sm sm:text-base text-[#D0D5DD] leading-relaxed whitespace-pre-line">
              {isRtl ? post.bodyFa || post.bodyEn : post.bodyEn || post.bodyFa}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 text-[11px] text-[#98A2B3]">
              <span className="inline-flex items-center gap-1.5 text-[#2EE6D6]">
                <ShieldCheck className="w-4 h-4" />
                {isRtl
                  ? 'کپی‌رایت محفوظ · تمامی حقوق متعلق به محمدباقر همایون است.'
                  : 'Copyright Protected · All rights reserved to Mohammad Bagher Homayoun.'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
