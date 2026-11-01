import { ClipboardCheck, FileCheck2, FlaskConical, Network, Search } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { AccreditationReadinessWidget } from '@/components/product/accreditation-readiness-widget';
import { AskQualiTrackerDemo } from '@/components/product/ask-qualitracker-demo';
import { RagPipelineScroll } from '@/components/product/rag-pipeline-scroll';
import { AccreditationVisionSection } from '@/components/site/accreditation-vision';
import { QualityCommandCenter } from '@/components/product/quality-command-center';
import { QualityIntelligenceGraph } from '@/components/product/quality-intelligence-graph';
import { LifecycleTimeline } from '@/components/product/lifecycle-timeline';
import { ComparisonTable } from '@/components/site/comparison-table';
import { useDocumentMeta, useStructuredData } from '@/lib/use-document-meta';
import { SOFTWARE_APPLICATION_SCHEMA } from '@/lib/structured-data';
import { useI18n } from '@/lib/i18n';
import { HowItWorks } from '@/components/product/how-it-works';
import { RecordTicker } from '@/components/product/record-ticker';
import { PaperToProof } from '@/components/product/paper-to-proof';
import { RoadmapBuildLog } from '@/components/product/roadmap-build-log';
import { Reveal } from '@/components/site/reveal';
import { motion, useReducedMotion } from 'framer-motion';

const REALITY_ITEMS = [
  { icon: <Search size={20} />, title: 'Find the record', copy: 'Search quality documents, actions, and evidence from one place.' },
  { icon: <Network size={20} />, title: 'See the trail', copy: 'Know what changed, who reviewed it, and what still needs attention.' },
  { icon: <ClipboardCheck size={20} />, title: 'Close the loop', copy: 'Turn findings into assigned, visible actions with a clear next step.' },
  { icon: <FlaskConical size={20} />, title: 'Keep the context', copy: "Make your lab's own SOPs the source of truth for everyday questions." },
];

// Real Django model STATUS_CHOICES from the QMS repository (documents/models.py) —
// not an idealized or invented lifecycle.
const DOCUMENT_STAGES = [
  { label: 'Draft', detail: 'A new SOP or policy starts here — editable, not yet in force.' },
  { label: 'Pending Collaboration', detail: 'Open for co-author input before it moves to formal review.' },
  { label: 'Under Review', detail: "A reviewer checks it against the standard it's meant to satisfy." },
  { label: 'Under Approval', detail: 'A final approver signs off before the document takes effect.' },
  { label: 'Approved', detail: 'In force — version-locked, and citable as evidence from this point on.', branch: 'Rejected sends it back to Draft, with the review history kept.' },
];

// Real Django model STATUS_CHOICES from non_conformance/models.py — including
// the actual two-stage independent review, not the simplified version most
// QMS marketing copy assumes.
const CAPA_STAGES = [
  { label: 'Registered', detail: 'A finding is logged with a unique, auto-generated NC number and classified Major or Minor.' },
  { label: 'Pending Review 1', detail: 'Waiting on the first reviewer.' },
  { label: 'Review 1 Complete', detail: 'First reviewer has signed off.' },
  { label: 'Pending Review 2', detail: 'A second, independent reviewer checks the first review — not a rubber stamp.' },
  { label: 'Review 2 Complete', detail: 'Independent sign-off recorded.' },
  { label: 'Pending Closure', detail: 'Corrective action taken; waiting on final closure sign-off.' },
  { label: 'Closed', detail: 'Resolved, with the full two-reviewer trail preserved.', branch: 'Declined at review 2 returns it for further work, not silently dropped.' },
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0.2, 1] as const } },
};

function RealitySequence() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4"
      variants={reduceMotion ? undefined : staggerContainer}
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'show'}
      viewport={{ once: true, margin: '-80px' }}
    >
      {REALITY_ITEMS.map((item, i) => (
        <motion.div
          key={item.title}
          variants={reduceMotion ? undefined : staggerItem}
          className="border-t-2 py-5 pr-6"
          style={{ borderColor: 'var(--qt-quality-gold)' }}
          data-testid={`step-reality-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ color: 'var(--qt-deep-teal)' }}>{item.icon}</span>
          </div>
          <h3 className="font-brand mt-3 text-base font-bold" style={{ color: 'var(--qt-near-black)' }}>{item.title}</h3>
          <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{item.copy}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function LandingPage() {
  const { t, lang } = useI18n();
  useDocumentMeta(
    'QualiTracker — Quality that works for every lab',
    "QualiTracker is a pre-revenue digital quality-management system entering private beta with laboratories in November 2026.",
    '/',
  );
  useStructuredData(SOFTWARE_APPLICATION_SCHEMA);
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 lg:pt-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          {/* The headline gets its own full-width row so it can command the
              viewport the way the brand kit's upper type range calls for —
              splitting it with the widget (as before) capped how large it
              could go before crowding. */}
          <Reveal>
            <p className="qt-eyebrow qt-eyebrow-light">{t('hero.eyebrow')}</p>
            <h1 className="font-brand mt-5 max-w-[960px] text-[clamp(3.5rem,9vw,8rem)] font-bold leading-[0.94] tracking-[-.03em]" style={{ color: '#FFFFFF' }}>
              {lang === 'sw' ? (<>Ubora <span style={{ color: 'var(--qt-quality-gold)' }}>unaofanya kazi</span> kwa kila maabara.</>) : (<>Quality that <span style={{ color: 'var(--qt-quality-gold)' }}>works</span> for every lab.</>)}
            </h1>
          </Reveal>
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            <Reveal delay={0.08}>
              <p className="max-w-[420px] text-[15px] leading-7" style={{ color: 'var(--qt-mint-light)' }}>
                {t('hero.lead')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/waitlist" variant="gold" data-testid="button-hero-waitlist">{t('hero.cta')}</Button>
                <Button href="/talk-to-team" variant="reversed" data-testid="button-hero-talk">{t('hero.cta2')}</Button>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <StatusBadge status="private-beta" />
                <span className="text-xs" style={{ color: 'var(--qt-light-teal)' }}>{t('hero.status')}</span>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <AccreditationReadinessWidget />
            </Reveal>
          </div>
          <div className="mt-14">
            <p className="font-mono-ui mb-3 text-[10px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-light-teal)' }}>Illustrative record activity</p>
            <RecordTicker />
          </div>
        </div>
      </section>

      {/* How it works: blueprint-style list that drives a wireframe and a mono log. */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="font-mono-ui mb-8 inline-block rounded border border-dashed px-3 py-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>{t('hiw.label')}</p>
          <HowItWorks />
        </div>
      </section>

      {/* Pilot truth: current stage, scope, and claim boundary. */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Private beta" title="The next milestone is evidence, not a sales launch." />
            <p className="mt-5 max-w-[620px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              Mid-November testing will put the eQMS in front of laboratory teams so we can observe real workflows, collect structured feedback, and decide what is ready for a wider pilot. QualiBOT is being developed and tested separately as an educational, source-grounded assistant.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Testing now', title: 'eQMS workflows', copy: 'Document control, quality records, and day-to-day usability with a small laboratory cohort.' },
              { label: 'Learning', title: 'What works in practice', copy: 'Training needs, workflow gaps, connectivity constraints, and the changes users need before a wider pilot.' },
              { label: 'Not claiming', title: 'Sales or proven outcomes', copy: 'QualiTracker is pre-revenue. Beta participation is not a customer sale, accreditation result, or performance guarantee.' },
            ].map((item) => (
              <div key={item.label} className="qt-card p-6">
                <p className="qt-technical-label">{item.label}</p>
                <h3 className="font-brand mt-3 text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{item.title}</h3>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified event evidence, explicitly separated from product adoption. */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader light eyebrow="Quality Excellence Challenge · September 2026" title="The laboratory community showed up." />
            <p className="mt-5 max-w-[660px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
              At the 39th MeLSAT Scientific Conference, QualiTracker delivered a timed laboratory-QMS knowledge challenge. These are event participation and feedback results—not evidence of eQMS adoption, recurring product use, or revenue.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'rgba(255,255,255,.14)' }}>
            {[
              { value: '276', label: 'registrations' },
              { value: '154', label: 'completed attempts' },
              { value: '27', label: 'regions represented' },
              { value: '4.35 / 5', label: 'average rating · 57 responses' },
            ].map((metric) => (
              <div key={metric.label} className="p-6" style={{ background: 'var(--qt-dark-navy)' }}>
                <p className="font-brand text-3xl font-bold" style={{ color: 'var(--qt-quality-gold)' }}>{metric.value}</p>
                <p className="mt-2 text-xs" style={{ color: 'var(--qt-mint-light)' }}>{metric.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-[700px] text-[11px] leading-5" style={{ color: 'var(--qt-light-teal)' }}>
            Source: challenge platform records and post-challenge survey summarized in the October 2026 detailed report. Registration records may include duplicates; the rating reflects survey respondents, not all registrants.
          </p>
        </div>
      </section>

      {/* Paper vs digital: the problem laboratories describe, shown as an illustrative example. */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16">
            <Reveal>
              <SectionHeader eyebrow="Why we're building this" title="Most laboratory quality records still live on paper." />
              <p className="mt-5 max-w-[420px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                Laboratories tell us entries get forgotten, misread or misrecorded, and the cost shows up later as repeated work, delayed results, or lost samples. Toggle the example to see what we are testing in the beta.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <PaperToProof />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Roadmap: sourced from the Oct 2026 strategy, product, and technology plans. */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionHeader eyebrow="Where we're going" title="Built in the open, one gate at a time." />
              <p className="mt-5 max-w-[400px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                We would rather show you the plan, and what it depends on, than promise a launch date. Switch between horizons to see what is happening now, next, and later.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { k: 'Ownership first', v: 'No agreement is signed until the company demonstrably owns what it builds.' },
                  { k: 'Evidence before scale', v: 'Beta and event data come before any claim about outcomes.' },
                  { k: 'Safe by default', v: 'The assistant answers only from your documents, cites its source, and says so when it cannot find an answer.' },
                ].map((p) => (
                  <li key={p.k} className="border-l-2 pl-4" style={{ borderColor: 'var(--qt-quality-gold)' }}>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-deep-teal)' }}>{p.k}</p>
                    <p className="mt-1 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{p.v}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <RoadmapBuildLog />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Thesis */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="The reality" title="Your quality system already exists. It's just hiding." />
            <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              In a shared drive. In a WhatsApp thread. In a folder only one person knows how to find. QualiTracker gives the work a home your whole lab can trust.
            </p>
          </Reveal>
          <div className="mt-10">
            <RealitySequence />
          </div>
        </div>
      </section>

      {/* Comparison — every QualiTracker cell restates a fact already
          established elsewhere on this page/site; "generic QMS" cells are
          deliberately hedged, never a specific competitor claim. */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="Why it's different" title="Not a bigger binder. A different kind of system." />
          <div className="mt-10">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* Product proof: the real dashboard shape */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16">
            <Reveal>
              <SectionHeader eyebrow="See it, not just read about it" title="This is what your dashboard actually looks like." />
              <p className="mt-5 max-w-[380px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                Your labs, departments, roles, and people — scoped to who you are and where you work, the moment you log in.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <QualityCommandCenter />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quality Intelligence Graph — the product thesis, shown not told */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="The quality intelligence graph" title="Quality management isn't a pile of disconnected documents. It's a connected system." />
            <p className="mt-5 max-w-[620px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              A standard implies a document. A document describes a process. A process produces evidence. Evidence is what an audit checks — and what a finding, a non-conformance, or a CAPA all trace back to. Hover a node to follow the connection.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 max-w-[720px]">
            <QualityIntelligenceGraph />
          </Reveal>
          <Reveal delay={0.15} className="mt-6">
            <Button href="/product#quality-intelligence" variant="secondary" arrow="arrow">Explore the full system</Button>
          </Reveal>
        </div>
      </section>

      {/* Two-layer system */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="The system" title="Two connected layers, one system of record." />
          <Reveal className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="qt-card-dark p-8">
              <StatusBadge status="private-beta" />
              <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--qt-quality-gold)', color: 'var(--qt-dark-navy)' }}>
                <FileCheck2 size={21} />
              </div>
              <h3 className="font-brand mt-5 text-2xl font-bold" style={{ color: '#FFFFFF' }}>QMS Module</h3>
              <p className="mt-3 max-w-[380px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
                A versioned document and record repository — SOPs, policies, quality records, and audit logs — for lab directors, quality managers, and accreditors.
              </p>
            </div>
            <div className="qt-card p-8">
              <StatusBadge status="in-development" />
              <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                <FlaskConical size={19} />
              </div>
              <h3 className="font-brand mt-5 text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>QualiBOT</h3>
              <p className="mt-3 max-w-[380px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                A conversational assistant grounded in your lab's own uploaded documents, for frontline technologists asking everyday questions in plain language — in English or Swahili.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Document & Evidence Intelligence */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Document & evidence intelligence" title="Every document moves through the same real workflow." />
            <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              No status is invented for this page — these are the actual states a controlled document moves through, end to end.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 max-w-[720px]">
            <LifecycleTimeline stages={DOCUMENT_STAGES} />
          </Reveal>
        </div>
      </section>

      {/* CAPA / Non-Conformance lifecycle */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Corrective action lifecycle" title="Two independent reviewers, not one rubber stamp." />
            <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              Every finding is classified Major or Minor, auto-numbered, and closed only after two separate people have signed off — the same rigor an accreditor expects.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 max-w-[720px]">
            {/* Teal, not gold — gold is reserved for the hero and waitlist/
                talk-to-team CTAs only, per the brand kit's own rule. */}
            <LifecycleTimeline stages={CAPA_STAGES} />
          </Reveal>
        </div>
      </section>

      {/* AI & RAG */}
      <section id="ai-rag" className="py-20 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow="Ask the record" title="An assistant that knows when it doesn't know." />
          <p className="mt-5 max-w-[560px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            Ask in plain language. Get an answer grounded in your lab's own records, with the source beside it — and if there's no relevant record, QualiTracker says so rather than guessing.
          </p>
          <Reveal className="mt-10 mx-auto max-w-[560px]">
            <AskQualiTrackerDemo />
          </Reveal>
        </div>
      </section>

      {/* Signature moment: how that answer actually got built */}
      <section className="py-20 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <Reveal>
            <p className="qt-eyebrow">Keep scrolling</p>
            <h2 className="font-brand mt-2.5 max-w-[560px] font-bold leading-[1.1] tracking-[-.02em]" style={{ color: 'var(--qt-near-black)', fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)' }}>
              That answer above didn't come from nowhere. Here's the path it walked.
            </h2>
          </Reveal>
          <div className="mt-10 max-w-[620px]">
            <RagPipelineScroll />
          </div>
        </div>
      </section>

      <AccreditationVisionSection />

      {/* Final CTA */}
      <section className="py-20 lg:py-24 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <Reveal className="mx-auto max-w-[1280px] px-5 text-center lg:px-8">
          <SectionHeader align="center" light eyebrow="Start the conversation" title="Let's make quality easier to see." />
          <p className="mx-auto mt-5 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            QualiTracker is pre-revenue and not available for purchase. Register your interest for a future beta cohort, or talk to the team about research, institutional evaluation, or the Quality Excellence Challenge.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/waitlist" variant="gold">Register beta interest</Button>
            <Button href="/talk-to-team" variant="reversed">Talk to the team</Button>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

export default LandingPage;
