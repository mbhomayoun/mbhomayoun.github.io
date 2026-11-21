import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Lock, Mail, Send } from 'lucide-react';
import { Lang, PROFILE_BY_LANG, UI_COPY } from '../data/profile';
import { formatNum } from '../utils/format';

export function ContactSection({
  lang,
  onOpenAdmin,
}: {
  lang: Lang;
  onOpenAdmin?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  const profile = PROFILE_BY_LANG[lang];
  const copy = UI_COPY[lang];
  const isRtl = lang === 'fa';

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(
      form.topic.trim()
        ? `[Website Inquiry] ${form.topic.trim()}`
        : `[Website Inquiry] Message from ${form.name.trim() || 'Visitor'}`
    );
    const body = encodeURIComponent(
      `From: ${form.name.trim()} (${form.email.trim()})\n\n${form.message.trim()}`
    );
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    if (honeypot) return;

    setSending(true);
    setSubmitError(null);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: form.topic.trim()
            ? `[mbhomayoun.github.io] ${form.topic.trim()}`
            : `[mbhomayoun.github.io] Inquiry from ${form.name.trim()}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: form.email.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          topic: form.topic.trim() || 'General Research / Collaboration',
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as { success?: string | boolean; message?: string };
      if (data.success === false || data.success === 'false') {
        const msg = data.message || '';
        if (msg.toLowerCase().includes('activation')) {
          setSubmitError(
            isRtl
              ? `ایمیل فعال‌سازی فرم به نشانی ${profile.email} ارسال شده است. لطفاً صندوق ورودی (یا Spam) را باز کرده و لینک Activate Form را یک‌بار تأیید کنید، سپس دوباره ارسال بزنید.`
              : `Activation link has been sent to ${profile.email}. Please check your inbox (or Spam) and click "Activate Form" once, then send again.`
          );
          return;
        }
        throw new Error(msg || 'Submission rejected by mail relay');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', topic: '', message: '' });
    } catch (err) {
      const detail = err instanceof Error ? err.message : '';
      setSubmitError(
        isRtl
          ? `ارسال مستقیم با خطا مواجه شد${detail ? ` (${detail})` : ''}. لطفاً از دکمه «ارسال با برنامه ایمیل» زیر استفاده کنید.`
          : `Direct delivery failed${detail ? ` (${detail})` : ''}. You can send via your email app below.`
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative pt-14 sm:pt-20 pb-12 overflow-hidden">
      {/* Kinetic Marquee Band (isolated LTR for smooth infinite scroll) */}
      <div
        dir="ltr"
        className="border-y border-white/10 py-3.5 sm:py-4 mb-16 sm:mb-24 bg-white/[0.015] overflow-hidden"
      >
        <div className="animate-marquee flex items-center gap-8">
          {[...profile.marqueeTerms, ...profile.marqueeTerms].map((term, i) => (
            <div key={`${term}-${i}`} className="flex items-center gap-8 shrink-0">
              <span
                className={`text-xl sm:text-3xl text-[#F4F1EA]/70 ${
                  isRtl ? 'font-medium' : 'font-serif italic'
                }`}
              >
                {term}
              </span>
              <span className="h-2 w-2 rounded-full bg-[#2EE6D6]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            <div className="text-[11px] tracking-[0.18em] text-[#2EE6D6]">
              {copy.contact.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-6xl font-semibold tracking-tight leading-[1.08] text-[#F4F1EA]">
              {copy.contact.headingLead}{' '}
              <span
                className={
                  isRtl
                    ? 'text-[#F5B971] font-bold'
                    : 'font-serif italic font-normal text-[#F5B971]'
                }
              >
                {copy.contact.headingAccent}
              </span>{' '}
              {copy.contact.headingTail}
            </h2>
            <p className="text-sm sm:text-base text-[#98A2B3] leading-relaxed max-w-lg">
              {profile.availability}
            </p>

            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-3 max-w-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-xl bg-[#2EE6D6]/15 p-2.5 text-[#2EE6D6] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] tracking-wider text-[#98A2B3]">
                    {copy.contact.directEmail}
                  </div>
                  <div dir="ltr" className="text-sm font-medium text-[#F4F1EA] truncate">
                    {profile.email}
                  </div>
                </div>
              </div>
              <button
                onClick={copyEmail}
                data-cursor="COPY"
                className="rounded-full bg-white/8 hover:bg-[#2EE6D6] hover:text-[#050608] px-3.5 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {copy.contact.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {copy.contact.copy}
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 space-y-2">
              {profile.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="group flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all max-w-md"
                >
                  <div>
                    <span className="text-sm font-medium text-[#F4F1EA] group-hover:text-[#2EE6D6] transition-colors">
                      {link.label}
                    </span>
                    <span className="ms-3 text-xs text-[#98A2B3]">
                      {link.handle}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="lg:col-span-6 glass-panel rounded-3xl p-5 sm:p-8 border border-white/12"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#2EE6D6]/15 border border-[#2EE6D6]/40 flex items-center justify-center text-[#2EE6D6]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-[#F4F1EA]">
                  {copy.contact.sentTitle}
                </h3>
                <p className="text-sm text-[#98A2B3] max-w-sm mx-auto">
                  {copy.contact.sentBodyPrefix}{' '}
                  <a
                    dir="ltr"
                    href={`mailto:${profile.email}`}
                    className="underline text-[#F4F1EA] inline-block"
                  >
                    {profile.email}
                  </a>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-full border border-white/15 px-5 py-2 text-xs text-[#F4F1EA] hover:border-[#2EE6D6]/50 transition-colors cursor-pointer"
                >
                  {copy.contact.sentAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="flex items-center justify-between text-[11px] tracking-wider text-[#98A2B3]">
                  <span>{copy.contact.formTitle}</span>
                  <span className="text-[#2EE6D6]">{copy.contact.formStatus}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#98A2B3]">
                      {copy.contact.nameLabel}
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={copy.contact.namePlaceholder}
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#98A2B3]">
                      {copy.contact.emailLabel}
                    </label>
                    <input
                      required
                      dir="ltr"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={copy.contact.emailPlaceholder}
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#98A2B3]">
                    {copy.contact.topicLabel}
                  </label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder={copy.contact.topicPlaceholder}
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#98A2B3]">
                    {copy.contact.messageLabel}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={copy.contact.messagePlaceholder}
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60 resize-none"
                  />
                </div>

                {submitError && (
                  <div className="rounded-xl bg-[#F5B971]/12 border border-[#F5B971]/35 p-3.5 text-xs text-[#F5B971] space-y-2">
                    <p>{submitError}</p>
                    <a
                      href={buildMailtoHref()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B971] text-[#050608] font-semibold px-3.5 py-1.5 text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {isRtl ? 'ارسال با برنامه ایمیل' : 'Open in Email App'}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  data-cursor="SEND"
                  className="w-full rounded-full bg-[#F4F1EA] hover:bg-[#2EE6D6] disabled:opacity-60 text-[#050608] font-semibold text-sm py-3.5 px-6 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {sending
                    ? isRtl
                      ? 'در حال ارسال...'
                      : 'Sending...'
                    : copy.contact.send}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <footer className="mt-16 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#98A2B3]">
          <div>
            © {formatNum(new Date().getFullYear(), lang)} {profile.fullName} —{' '}
            {copy.contact.footerSuffix}
          </div>
          <div className="flex items-center gap-3">
            <span>{copy.contact.footerShortcut}</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                aria-label="Owner access"
                title="Owner login"
                className="p-1.5 rounded-full text-white/20 hover:text-[#2EE6D6] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
