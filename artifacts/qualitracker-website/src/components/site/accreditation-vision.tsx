import { SectionHeader } from '@/components/site/section-header';
import { StatusBadge } from '@/components/site/status-badge';
import { useI18n } from '@/lib/i18n';

/**
 * The compliance-sensitive distinction the brief is explicit about: QualiTracker
 * is quality-management software today, not an accreditation body. This
 * section exists specifically so that claim never blurs — everywhere this
 * component is used, "current" and "vision" stay visually and textually
 * separate.
 */
export function AccreditationVisionSection() {
  const { tr } = useI18n();
  return (
    <section id="vision" className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <SectionHeader eyebrow={tr("Where we are, and where we're going", 'Tulipo na tunakoelekea')} title={tr('Quality-management software today. An institutional ambition for tomorrow.', 'Programu ya usimamizi wa ubora leo. Dhamira ya kitaasisi kwa kesho.')} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="qt-card p-7">
            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status="private-beta" />
              <span className="font-mono-ui text-[10px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Current product', 'Bidhaa ya sasa')}</span>
            </div>
            <h3 className="font-brand text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Quality-management software', 'Programu ya usimamizi wa ubora')}</h3>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              {tr("QualiTracker eQMS is a digital quality-management system: document control, records, audits, corrective actions, and an AI assistant grounded in a lab's own documents. It helps a laboratory organize and evidence its own quality work, it does not certify, audit on behalf of, or accredit anyone.", "QualiTracker eQMS ni mfumo wa kidijitali wa usimamizi wa ubora: udhibiti wa nyaraka, rekodi, ukaguzi, hatua za kurekebisha, na msaidizi wa AI anayetegemea nyaraka za maabara yenyewe. Husaidia maabara kupanga na kuthibitisha kazi yake ya ubora; haitoi vyeti, haifanyi ukaguzi kwa niaba ya wengine, wala haitoi ithibati.")}
            </p>
          </div>
          <div className="qt-card p-7">
            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status="planned" />
              <span className="font-mono-ui text-[10px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Long-term vision', 'Dira ya muda mrefu')}</span>
            </div>
            <h3 className="font-brand text-xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Contributing to accreditation-readiness infrastructure', 'Kuchangia miundombinu ya utayari wa ithibati')}</h3>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              {tr('Longer term, we want to explore the institutional path toward supporting laboratory accreditation readiness across East Africa and Sub-Saharan Africa. That is a future ambition, contingent on obtaining the appropriate authorization, not a current capability, and not implied by anything else on this site.', 'Kwa muda mrefu, tunataka kuchunguza njia ya kitaasisi ya kusaidia utayari wa ithibati kwa maabara Afrika Mashariki na Afrika Kusini mwa Jangwa la Sahara. Hii ni dhamira ya baadaye inayotegemea kupata idhini inayofaa; si uwezo wa sasa, wala haimaanishwi na jambo lingine lolote kwenye tovuti hii.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
