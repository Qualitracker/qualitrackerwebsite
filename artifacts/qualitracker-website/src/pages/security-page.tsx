import { Lock, EyeOff, Server, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { useDocumentMeta } from '@/lib/use-document-meta';

/**
 * Real content, grounded in the actual codebase (verified this session,
 * not asserted from a copy doc) — see docs/website/17_WEBSITE_IMPLEMENTATION_PLAN.md.
 * Every claim below maps to something read directly in the source: per-tenant
 * vector store isolation (rag_config.py), Presidio-based PII redaction with
 * custom Tanzanian recognizers (pii_redactor.py), and a self-hosted LLM
 * (rag_pipeline.py's CHAT_MODEL, served via Ollama — no calls to a third-party
 * AI API for inference). No compliance certification is claimed anywhere here.
 */
const PRACTICES = [
  {
    icon: <Lock size={20} />,
    title: 'Per-tenant data isolation',
    copy: "Each laboratory's documents are indexed into a separate vector store — QualiBOT can only retrieve from your lab's own uploaded records, never another tenant's.",
  },
  {
    icon: <EyeOff size={20} />,
    title: 'PII redaction before indexing',
    copy: 'Documents pass through a redaction step before they\'re indexed, including recognizers built for regional identifiers — Tanzanian phone numbers, NIDA national ID format, and TIN numbers — not just generic patterns.',
  },
  {
    icon: <Server size={20} />,
    title: 'Self-hosted inference',
    copy: "QualiBOT's language model runs on infrastructure we control, not a third-party AI API call for every question — consistent with keeping lab data inside a system you can audit.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Answers are gated, not guessed',
    copy: 'Retrieval is scored against a confidence threshold before any answer is generated — below it, QualiBOT says it doesn\'t have the information, rather than filling the gap.',
  },
];

function SecurityPage() {
  useDocumentMeta('Security — QualiTracker', "How QualiTracker isolates lab data, redacts PII, and hosts its own AI inference.", '/security');
  return (
    <PageShell>
      <section className="py-16 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">Security</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            Security boundaries are part of the beta.
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            A description of the current architecture under evaluation — not a certification or a finished assurance report.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="How it's actually built" title="Four things, verified in the codebase, not asserted in a copy deck." />
          <div className="mt-5"><StatusBadge status="private-beta" /></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRACTICES.map((p) => (
              <div key={p.title} className="qt-card p-6" data-testid={`security-practice-${p.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                  {p.icon}
                </div>
                <h3 className="font-brand text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{p.title}</h3>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{p.copy}</p>
              </div>
            ))}
          </div>

          <div className="qt-card mt-10 max-w-[680px] p-8">
            <StatusBadge status="in-development" />
            <h2 className="font-brand mt-4 text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>What's not here yet</h2>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              No compliance certification (SOC 2, ISO 27001, or similar) is claimed — none has been pursued yet. The architecture described above still requires beta validation, security testing, and formal review before broader use. If you need a security assessment for an evaluation, talk to the team directly rather than relying on this page alone.
            </p>
            <div className="mt-6">
              <Button href="/talk-to-team" variant="secondary">Talk to the team</Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default SecurityPage;
