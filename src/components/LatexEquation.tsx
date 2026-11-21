import { useMemo } from 'react';
import katex from 'katex';

interface LatexEquationProps {
  latex: string;
  accent?: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

export function LatexEquation({
  latex,
  accent = '#2EE6D6',
  label,
  compact = false,
  className = '',
}: LatexEquationProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return '';
    }
  }, [latex]);

  return (
    <div
      dir="ltr"
      className={`latex-card rounded-2xl bg-black/55 border border-white/10 ${
        compact ? 'px-3.5 py-2.5' : 'px-4 py-3.5'
      } overflow-x-auto ${className}`}
      style={{
        borderColor: `${accent}33`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.04)`,
      }}
    >
      {label && (
        <div
          className="text-[9px] uppercase tracking-[0.2em] mb-1.5 opacity-80 font-mono"
          style={{ color: accent }}
        >
          {label}
        </div>
      )}
      {html ? (
        <div
          className="katex-wrapper text-[#F4F1EA] leading-relaxed"
          style={{ '--latex-accent': accent } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code className="font-mono text-xs text-[#2EE6D6]">{latex}</code>
      )}
    </div>
  );
}
