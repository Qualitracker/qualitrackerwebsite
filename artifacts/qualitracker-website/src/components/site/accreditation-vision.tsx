import { SectionHeader } from '@/components/site/section-header';
import { StatusBadge } from '@/components/site/status-badge';

/**
 * The compliance-sensitive distinction the brief is explicit about: QualiTracker
 * is quality-management software today, not an accreditation body. This
 * section exists specifically so that claim never blurs — everywhere this
 * component is used, "current" and "vision" stay visually and textually
 * separate.
 */
export function AccreditationVisionSection() {
  return (
    <section id="vision" className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <SectionHeader eyebrow="Where we are, and where we're going" title="Quality-management software today. An institutional ambition for tomorrow." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="qt-card p-7">
            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status="private-beta" />
              <span className="font-mono-ui text-[10px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-body-grey)' }}>Current product</span>
            </div>
            <h3 className="font-brand text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>Quality-management software</h3>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              QualiTracker eQMS is a digital quality-management system: document control, records, audits, corrective actions, and an AI assistant grounded in a lab's own documents. It helps a laboratory organize and evidence its own quality work, it does not certify, audit on behalf of, or accredit anyone.
            </p>
          </div>
          <div className="qt-card p-7">
            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status="planned" />
              <span className="font-mono-ui text-[10px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-body-grey)' }}>Long-term vision</span>
            </div>
            <h3 className="font-brand text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>Contributing to accreditation-readiness infrastructure</h3>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              Longer term, we want to explore the institutional path toward supporting laboratory accreditation readiness across East Africa and Sub-Saharan Africa. That is a future ambition, contingent on obtaining the appropriate authorization, not a current capability, and not implied by anything else on this site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
