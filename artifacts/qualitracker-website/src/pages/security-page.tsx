import { Lock, EyeOff, Server, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { DataPath, type DataPathStep } from '@/components/product/data-path';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { useI18n, L } from '@/lib/i18n';

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
    title: L('Per-tenant data isolation', 'Utenganisho wa data kwa kila maabara'),
    copy: L("Each laboratory's documents are indexed into a separate vector store, QualiBOT can only retrieve from your lab's own uploaded records, never another tenant's.", 'Nyaraka za kila maabara huwekwa kwenye hifadhi tofauti ya vekta, QualiBOT inaweza kupata taarifa kutoka kwenye rekodi ulizopakia za maabara yako pekee, kamwe si za maabara nyingine.'),
  },
  {
    icon: <EyeOff size={20} />,
    title: L('PII redaction before indexing', 'Kuficha taarifa binafsi kabla ya kuorodhesha'),
    copy: L("Documents pass through a redaction step before they're indexed, including recognizers built for regional identifiers, Tanzanian phone numbers, NIDA national ID format, and TIN numbers, not just generic patterns.", 'Nyaraka hupitia hatua ya kuficha taarifa binafsi kabla ya kuorodheshwa, ikiwemo vitambuzi vilivyojengwa kwa vitambulisho vya kikanda: namba za simu za Tanzania, muundo wa kitambulisho cha NIDA, na namba za TIN, si mifumo ya jumla pekee.'),
  },
  {
    icon: <Server size={20} />,
    title: L('Self-hosted inference', 'Uchakataji kwenye miundombinu yetu'),
    copy: L("QualiBOT's language model runs on infrastructure we control, not a third-party AI API call for every question, consistent with keeping lab data inside a system you can audit.", 'Modeli ya lugha ya QualiBOT inaendeshwa kwenye miundombinu tunayoidhibiti, si ombi kwa API ya AI ya mtu wa tatu kwa kila swali, ikiendana na kuweka data ya maabara ndani ya mfumo unaoweza kuukagua.'),
  },
  {
    icon: <ShieldCheck size={20} />,
    title: L('Answers are gated, not guessed', 'Majibu hudhibitiwa, hayabahatishwi'),
    copy: L("Retrieval is scored against a confidence threshold before any answer is generated, below it, QualiBOT says it doesn't have the information, rather than filling the gap.", 'Utafutaji hupewa alama dhidi ya kiwango cha uhakika kabla ya jibu lolote kuundwa, chini yake, QualiBOT husema haina taarifa hiyo, badala ya kuziba pengo.'),
  },
];

// Same four practices, ordered as data moves: redact, isolate, gate, generate.
const PATH_ORDER = [
  { key: 'pii-redaction-before-indexing', label: L('Redact', 'Ficha'), practice: PRACTICES[1] },
  { key: 'per-tenant-data-isolation', label: L('Isolate', 'Tenganisha'), practice: PRACTICES[0] },
  { key: 'answers-are-gated-not-guessed', label: L('Gate', 'Dhibiti'), practice: PRACTICES[3] },
  { key: 'self-hosted-inference', label: L('Generate', 'Zalisha'), practice: PRACTICES[2] },
];

function SecurityPage() {
  const { tr, tx } = useI18n();
  const pathSteps: DataPathStep[] = PATH_ORDER.map((s) => ({ key: s.key, label: tx(s.label), icon: s.practice.icon, title: tx(s.practice.title), copy: tx(s.practice.copy) }));
  useDocumentMeta('Security | QualiTracker', "How QualiTracker isolates lab data, redacts PII, and hosts its own AI inference.", '/security');
  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Security', 'Usalama')}</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr("Security boundaries are part of the beta.", "Mipaka ya usalama ni sehemu ya beta.")}
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr("A description of the current architecture under evaluation, not a certification or a finished assurance report.", "Maelezo ya muundo wa sasa unaotathminiwa, si cheti wala ripoti kamili ya uhakikisho.")}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("How it's actually built", "Jinsi ilivyojengwa kweli")} title={tr("Four things, verified in the codebase, not asserted in a copy deck.", "Mambo manne, yaliyothibitishwa kwenye msimbo, si madai ya kwenye makala ya masoko.")} />
          <div className="mt-5"><StatusBadge status="private-beta" /></div>
          <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            {tr("Follow a document and a question through the system. Select each step to see what happens there.", "Fuatilia hati na swali kupitia mfumo. Chagua kila hatua uone kinachotokea hapo.")}
          </p>
          <div className="mt-10">
            <DataPath steps={pathSteps} />
          </div>

          <div className="qt-card mt-10 max-w-[680px] p-8">
            <StatusBadge status="in-development" />
            <h2 className="font-brand mt-4 text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr("What's not here yet", 'Kisichopo bado')}</h2>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              {tr("No compliance certification (SOC 2, ISO 27001, or similar) is claimed, none has been pursued yet. The architecture described above still requires beta validation, security testing, and formal review before broader use. If you need a security assessment for an evaluation, talk to the team directly rather than relying on this page alone.", "Hakuna cheti cha uzingatiaji (SOC 2, ISO 27001, au kinachofanana) kinachodaiwa, hakuna kilichofuatiliwa bado. Muundo ulioelezwa hapo juu bado unahitaji uthibitisho wa beta, majaribio ya usalama, na mapitio rasmi kabla ya matumizi mapana. Kama unahitaji tathmini ya usalama kwa ajili ya kutathmini, ongea na timu moja kwa moja badala ya kutegemea ukurasa huu pekee.")}
            </p>
            <div className="mt-6">
              <Button href="/talk-to-team" variant="secondary">{tr("Talk to the team", "Ongea na timu")}</Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default SecurityPage;
