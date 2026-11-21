import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react';
import { PROFILE } from '../data/profile';

const MARQUEE_TERMS = [
  'PETROLEUM GEOMECHANICS',
  'ROCK–CEMENT–CASING INTEGRITY',
  'CARBONATE ACID FRACTURING',
  'WELLBORE CFD HYDRAULICS',
  'ENERGY GOVERNANCE',
  'SUBSIDY REFORM',
  'AMIRKABIR UNIVERSITY',
];

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', topic: '', message: '' });
    }, 300);
  };

  return (
    <section id="contact" className="relative pt-20 pb-14 overflow-hidden">
      {/* Kinetic Marquee Band */}
      <div className="border-y border-white/10 py-4 mb-24 bg-white/[0.015] overflow-hidden">
        <div className="animate-marquee flex items-center gap-8">
          {[...MARQUEE_TERMS, ...MARQUEE_TERMS].map((term, i) => (
            <div key={`${term}-${i}`} className="flex items-center gap-8 shrink-0">
              <span className="font-serif italic text-2xl sm:text-3xl text-[#F4F1EA]/70">
                {term}
              </span>
              <span className="h-2 w-2 rounded-full bg-[#2EE6D6]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Invite & Academic Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#2EE6D6]">
              06 // COLLABORATE &amp; CONNECT
            </div>
            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02] text-[#F4F1EA]">
              Let&apos;s build something{' '}
              <span className="font-serif italic font-normal text-[#F5B971]">
                verifiable
              </span>{' '}
              &amp; enduring.
            </h2>
            <p className="text-base text-[#98A2B3] leading-relaxed max-w-lg">
              {PROFILE.availability}. Reach out for joint research grants, keynote invitations, peer-review discussions, or computational consulting.
            </p>

            {/* One-click copy email box */}
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-3 max-w-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-xl bg-[#2EE6D6]/15 p-2.5 text-[#2EE6D6]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#98A2B3]">
                    Direct Correspondence
                  </div>
                  <div className="text-sm font-medium text-[#F4F1EA] truncate">
                    {PROFILE.email}
                  </div>
                </div>
              </div>
              <button
                onClick={copyEmail}
                data-cursor="COPY"
                className="rounded-full bg-white/8 hover:bg-[#2EE6D6] hover:text-[#050608] px-3.5 py-2 text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Academic & Social Links */}
            <div className="pt-2 space-y-2">
              {PROFILE.links.map((link) => (
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
                    <span className="ml-3 font-mono text-xs text-[#98A2B3]">
                      {link.handle}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#2EE6D6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Interactive Message Composer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-white/12"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#2EE6D6]/15 border border-[#2EE6D6]/40 flex items-center justify-center text-[#2EE6D6]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold text-[#F4F1EA]">
                  Dispatch Prepared
                </h3>
                <p className="text-sm text-[#98A2B3] max-w-sm mx-auto">
                  Your inquiry has been formatted locally. Connect a backend endpoint (Formspree, Resend, or Web3Forms) in{' '}
                  <code className="text-[#2EE6D6]">ContactSection.tsx</code> or mail{' '}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="underline text-[#F4F1EA]"
                  >
                    {PROFILE.email}
                  </a>
                  .
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-full border border-white/15 px-5 py-2 text-xs font-mono text-[#F4F1EA] hover:border-[#2EE6D6]/50 transition-colors cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[#98A2B3]">
                  <span>TRANSMIT RESEARCH INQUIRY</span>
                  <span className="text-[#2EE6D6]">ENCRYPTED CHANNEL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-[#98A2B3]">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Elena Vance"
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] text-[#98A2B3]">
                      Institutional / Work Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="elena@ethz.ch"
                      className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] text-[#98A2B3]">
                    Subject / Collaboration Focus
                  </label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="Joint Grant · Neural Operator Benchmark · Keynote"
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-2.5 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] text-[#98A2B3]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share context, timelines, or manuscript references..."
                    className="w-full rounded-xl bg-black/45 border border-white/10 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#98A2B3]/50 focus:outline-none focus:border-[#2EE6D6]/60 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  data-cursor="SEND"
                  className="w-full rounded-full bg-[#F4F1EA] hover:bg-[#2EE6D6] text-[#050608] font-semibold text-sm py-3.5 px-6 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send Transmission
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#98A2B3]">
          <div>
            © {new Date().getFullYear()} {PROFILE.fullName} — Built as an Interactive Scientific Observatory.
          </div>
          <div className="flex items-center gap-4">
            <span>PRESS ⌘K FOR COMMAND PALETTE</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
