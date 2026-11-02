import { useState } from 'react';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { ModuleMap } from '@/components/product/module-map';
import { QualityIntelligenceGraph, type NodeId } from '@/components/product/quality-intelligence-graph';
import { AskQualiTrackerDemo } from '@/components/product/ask-qualitracker-demo';
import { TraceBlock, ExplorerFrame, StatusIndicator } from '@/components/site/technical-block';
import { useDocumentMeta, useStructuredData } from '@/lib/use-document-meta';
import { SOFTWARE_APPLICATION_SCHEMA } from '@/lib/structured-data';

// The same nine real entities as QualityIntelligenceGraph's node chain,
// re-expressed as a linear path — hovering a step here highlights the
// matching graph node. Kept at the same concept-level abstraction as the
// graph's own node labels (not invented instance IDs like "SOP-014" or
// "CAPA-0082") — this is the general model, not a specific lab's record;
// see quality-intelligence-graph.tsx's own fabrication guard.
const TRACE_STEPS: Array<{ id: NodeId; label: string; relation?: string }> = [
  { id: 'standard', label: 'STANDARD' },
  { id: 'document', label: 'DOCUMENT', relation: 'requires' },
  { id: 'process', label: 'PROCESS', relation: 'governs' },
  { id: 'evidence', label: 'EVIDENCE', relation: 'produces' },
  { id: 'audit', label: 'AUDIT', relation: 'reviewed_in' },
  { id: 'finding', label: 'FINDING', relation: 'surfaces' },
  { id: 'nonconformance', label: 'NON-CONFORMANCE', relation: 'formalizes' },
  { id: 'capa', label: 'CAPA', relation: 'resolved_by' },
  { id: 'verification', label: 'VERIFICATION', relation: 'confirmed_by' },
];


function ProductPage() {
  const [activeGraphNode, setActiveGraphNode] = useState<NodeId | null>(null);
  useDocumentMeta(
    'Product — QualiTracker',
    'The QMS Module and QualiBOT: document control, quality records, and an AI assistant grounded in your lab’s own documents.',
    '/product',
  );
  useStructuredData(SOFTWARE_APPLICATION_SCHEMA);
  return (
    <PageShell>
      <section className="py-16 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">Product</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            The platform, module by module.
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            Two connected layers — a QMS Module for document and record control, and QualiBOT, an AI assistant grounded in your lab's own documents.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <StatusBadge status="private-beta" />
            <span className="text-xs" style={{ color: 'var(--qt-light-teal)' }}>Pre-revenue · not commercially available</span>
          </div>
        </div>
      </section>

      <section id="quality-intelligence" className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="Quality intelligence" title="One record, traced from standard to verification." />
          <p className="mt-5 max-w-[520px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            Every finding in QualiTracker stays linked to the requirement it came from, and the corrective action that closed it — so nothing gets separated from the work it proves. Hover a node — or a step in the trace path — to see how it connects.
          </p>
          <div className="mt-10">
            <ExplorerFrame
              title="QUALITY INTELLIGENCE"
              status={<StatusIndicator label="INTERACTIVE MODEL" tone="verified" light />}
              footer={
                <p className="qt-technical-label whitespace-nowrap" style={{ color: 'var(--qt-body-grey)' }}>
                  <span style={{ color: 'var(--qt-deep-teal)', fontWeight: 700 }}>TRACE</span>{'  '}
                  {TRACE_STEPS.map((s) => s.label).join('  →  ')}
                </p>
              }
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="max-w-[680px]">
                  <QualityIntelligenceGraph activeId={activeGraphNode} onActiveChange={setActiveGraphNode} />
                </div>
                <TraceBlock<NodeId> eyebrow="Traceability path" steps={TRACE_STEPS} activeId={activeGraphNode} onStepFocus={(id) => setActiveGraphNode(id)} />
              </div>
            </ExplorerFrame>
          </div>
        </div>
      </section>

      <section id="ai-rag" className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="AI & RAG" title="QualiBOT: grounded, cited, honest when it doesn't know." />
          <div className="mt-10 mx-auto max-w-[560px]">
            <AskQualiTrackerDemo />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="What we're building" title="The full platform, honestly staged." />
          <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            Every module sits in the stage it has actually reached. Select one to see what it is for.
          </p>
          <div className="mt-10">
            <ModuleMap />
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/docs" variant="secondary" arrow="arrow">Read the docs</Button>
            <Button href="/talk-to-team" variant="ghost">Talk to the team about your lab</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default ProductPage;
