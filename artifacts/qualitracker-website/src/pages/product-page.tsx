import { useState } from 'react';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { ModuleMap } from '@/components/product/module-map';
import { QualityIntelligenceGraph, type NodeId } from '@/components/product/quality-intelligence-graph';
import { AskQualiTrackerDemo } from '@/components/product/ask-qualitracker-demo';
import { ProductTheatre } from '@/components/product/product-theatre';
import { TraceBlock, ExplorerFrame, StatusIndicator } from '@/components/site/technical-block';
import { useDocumentMeta, useStructuredData } from '@/lib/use-document-meta';
import { useI18n, L, type Text } from '@/lib/i18n';
import { SOFTWARE_APPLICATION_SCHEMA } from '@/lib/structured-data';

// The same nine real entities as QualityIntelligenceGraph's node chain,
// re-expressed as a linear path — hovering a step here highlights the
// matching graph node. Kept at the same concept-level abstraction as the
// graph's own node labels (not invented instance IDs like "SOP-014" or
// "CAPA-0082") — this is the general model, not a specific lab's record;
// see quality-intelligence-graph.tsx's own fabrication guard.
const TRACE_STEPS: Array<{ id: NodeId; label: Text; relation?: Text }> = [
  { id: 'standard', label: L('STANDARD', 'KIWANGO') },
  { id: 'document', label: L('DOCUMENT', 'HATI'), relation: L('requires', 'inahitaji') },
  { id: 'process', label: L('PROCESS', 'MCHAKATO'), relation: L('governs', 'inasimamia') },
  { id: 'evidence', label: L('EVIDENCE', 'USHAHIDI'), relation: L('produces', 'inazalisha') },
  { id: 'audit', label: L('AUDIT', 'UKAGUZI'), relation: L('reviewed_in', 'hukaguliwa_katika') },
  { id: 'finding', label: L('FINDING', 'TATIZO'), relation: L('surfaces', 'hubainisha') },
  { id: 'nonconformance', label: L('NON-CONFORMANCE', 'KUTOKIDHI KIWANGO'), relation: L('formalizes', 'hurasimisha') },
  { id: 'capa', label: L('CAPA', 'CAPA'), relation: L('resolved_by', 'hutatuliwa_na') },
  { id: 'verification', label: L('VERIFICATION', 'UTHIBITISHO'), relation: L('confirmed_by', 'huthibitishwa_na') },
];


function ProductPage() {
  const { tr, tx } = useI18n();
  const traceSteps = TRACE_STEPS.map((s) => ({ id: s.id, label: tx(s.label), relation: s.relation ? tx(s.relation) : undefined }));
  const [activeGraphNode, setActiveGraphNode] = useState<NodeId | null>(null);
  useDocumentMeta(
    'Product | QualiTracker',
    'The QMS Module and QualiBOT: document control, quality records, and an AI assistant grounded in your lab’s own documents.',
    '/product',
  );
  useStructuredData(SOFTWARE_APPLICATION_SCHEMA);
  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Product', 'Bidhaa')}</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr("The platform, module by module.", "Jukwaa, moduli kwa moduli.")}
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr("Two connected layers, QualiTracker eQMS for document and record control, and QualiBOT, an AI assistant grounded in your lab's own documents.", "Tabaka mbili zilizounganishwa: QualiTracker eQMS kwa udhibiti wa nyaraka na rekodi, na QualiBOT, msaidizi wa AI anayetegemea nyaraka za maabara yako.")}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <StatusBadge status="private-beta" />
            <span className="text-xs" style={{ color: 'var(--qt-light-teal)' }}>{tr('Pre-revenue · not commercially available', 'Bado hatujaanza kuuza · haipatikani kibiashara')}</span>
          </div>
        </div>
      </section>

      <section id="quality-intelligence" className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("Quality intelligence", "Akili ya ubora")} title={tr("One record, traced from standard to verification.", "Rekodi moja, inayofuatiliwa kutoka kiwango hadi uthibitisho.")} />
          <p className="mt-5 max-w-[520px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            {tr("Every finding in QualiTracker eQMS stays linked to the requirement it came from, and the corrective action that closed it, so nothing gets separated from the work it proves. Hover a node, or a step in the trace path, to see how it connects.", "Kila tatizo lililobainika kwenye QualiTracker eQMS hubaki limeunganishwa na sharti lililolisababisha, na hatua ya kurekebisha iliyolifunga, ili kisitenganishwe na kazi kinayoithibitisha. Weka kielekezi juu ya nodi, au hatua kwenye njia ya ufuatiliaji, uone inavyounganika.")}
          </p>
          <div className="mt-10">
            <ProductTheatre
              variant="intelligence"
              label={tr('QualiTracker product model', 'Mfano wa bidhaa wa QualiTracker')}
              status={tr('Interactive system map', 'Ramani shirikishi ya mfumo')}
              caption={tr('Quality intelligence explorer', 'Kichunguzi cha akili ya ubora')}
              detail={tr('Graph and trace move together', 'Grafu na ufuatiliaji husogea pamoja')}
              markers={[tr('Standard', 'Kiwango'), tr('Evidence', 'Ushahidi'), tr('Verification', 'Uthibitisho')]}
            >
              <ExplorerFrame
                title={tr("QUALITY INTELLIGENCE", "AKILI YA UBORA")}
                status={<StatusIndicator label={tr("INTERACTIVE MODEL", "MFANO SHIRIKISHI")} tone="verified" light />}
                footer={
                  <p className="qt-technical-label whitespace-nowrap" style={{ color: 'var(--qt-body-grey)' }}>
                    <span style={{ color: 'var(--qt-deep-teal)', fontWeight: 700 }}>{tr('TRACE', 'UFUATILIAJI')}</span>{'  '}
                    {traceSteps.map((s) => s.label).join('  →  ')}
                  </p>
                }
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                  <div className="max-w-[680px]">
                    <QualityIntelligenceGraph activeId={activeGraphNode} onActiveChange={setActiveGraphNode} />
                  </div>
                  <TraceBlock<NodeId> eyebrow={tr("Traceability path", "Njia ya ufuatiliaji")} steps={traceSteps} activeId={activeGraphNode} onStepFocus={(id) => setActiveGraphNode(id)} />
                </div>
              </ExplorerFrame>
            </ProductTheatre>
          </div>
        </div>
      </section>

      <section id="ai-rag" className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="AI & RAG" title={tr("QualiBOT: grounded, cited, honest when it doesn't know.", "QualiBOT: inategemea nyaraka, hutaja chanzo, mkweli asipojua.")} />
          <div className="mt-10 mx-auto max-w-[720px]">
            <ProductTheatre
              variant="assistant"
              label="QualiBOT"
              status={tr('Interactive evidence demo', 'Onyesho shirikishi la ushahidi')}
              caption={tr('Grounded answer workspace', 'Eneo la jibu linalotegemea ushahidi')}
              detail={tr('Source shown · human review required', 'Chanzo kinaonyeshwa · mapitio ya binadamu yanahitajika')}
              markers={[tr('Source', 'Chanzo'), tr('Trace', 'Ufuatiliaji'), tr('No record found', 'Hakuna rekodi iliyopatikana')]}
            >
              <AskQualiTrackerDemo />
            </ProductTheatre>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("What we're building", "Tunachojenga")} title={tr("The full platform, honestly staged.", "Jukwaa zima, hatua kwa hatua kwa uaminifu.")} />
          <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            {tr("Every module sits in the stage it has actually reached. Select one to see what it is for.", "Kila moduli iko kwenye hatua iliyofikia kweli. Chagua moja uone inatumika kwa nini.")}
          </p>
          <div className="mt-10">
            <ProductTheatre
              variant="workflow"
              label={tr('Platform modules', 'Moduli za jukwaa')}
              status={tr('Interactive build map', 'Ramani shirikishi ya ujenzi')}
              caption={tr('Product maturity map', 'Ramani ya ukomavu wa bidhaa')}
              detail={tr('Select a module to inspect its current stage', 'Chagua moduli ili kuona hatua yake ya sasa')}
              markers={[tr('Private beta', 'Beta ya faragha'), tr('In development', 'Inaendelezwa'), tr('Planned', 'Imepangwa')]}
            >
              <ModuleMap />
            </ProductTheatre>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/docs" variant="secondary" arrow="arrow">{tr("Read the docs", "Soma nyaraka")}</Button>
            <Button href="/talk-to-team" variant="ghost">{tr("Talk to the team about your lab", "Ongea na timu kuhusu maabara yako")}</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default ProductPage;
