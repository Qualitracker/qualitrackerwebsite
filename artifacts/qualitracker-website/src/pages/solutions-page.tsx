import { Link } from 'wouter';
import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { StatusBadge } from '@/components/site/status-badge';
import { TechnicalRecordBlock } from '@/components/site/technical-block';
import { BetaJourney } from '@/components/product/beta-journey';
import { ShiftHandover } from '@/components/product/shift-handover';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { useI18n, L } from '@/lib/i18n';

// Medical laboratories get the featured slot deliberately — it's the
// segment every other real page (product/security/company) is written
// against; the rest are real segments too, just not yet the primary focus.
const FEATURED_SEGMENT = { label: L('Medical laboratories', 'Maabara za kimatibabu'), copy: L('Clinical diagnostics labs working toward ISO 15189, WHO LQMS, or SLIPTA readiness, the primary segment the private beta is designed to learn from.', 'Maabara za uchunguzi wa kliniki zinazofanyia kazi utayari wa ISO 15189, WHO LQMS, au SLIPTA, kundi kuu ambalo beta ya faragha imeundwa kujifunza kutoka kwake.') };
const OTHER_SEGMENTS = [
  { label: L('Testing laboratories', 'Maabara za upimaji'), copy: L('Non-clinical testing labs with their own document-control and quality-record needs.', 'Maabara za upimaji zisizo za kliniki zenye mahitaji yao ya udhibiti wa nyaraka na rekodi za ubora.') },
  { label: L('Research laboratories', 'Maabara za utafiti'), copy: L('Research settings that need traceable documentation without a clinical QMS.', 'Mazingira ya utafiti yanayohitaji nyaraka zinazoweza kufuatiliwa bila QMS ya kliniki.') },
  { label: L('Multi-site organizations', 'Taasisi zenye vituo vingi'), copy: L('Networks and institutions coordinating quality across more than one facility.', 'Mitandao na taasisi zinazoratibu ubora katika zaidi ya kituo kimoja.') },
];

/** Segment-specific positioning is still being written — honest stub, not fabricated depth. */
function SolutionsPage() {
  const { tr, tx } = useI18n();
  useDocumentMeta(
    'Solutions | QualiTracker',
    'QualiTracker eQMS for medical, testing, and research laboratories, and multi-site organizations.',
    '/solutions',
  );
  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Solutions', 'Suluhisho')}</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr("Built for quality-intensive laboratory work.", "Imejengwa kwa kazi za maabara zinazohitaji ubora wa hali ya juu.")}
          </h1>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("Who we're building for", "Tunajengea nani")} title={tr("Segment-specific pages are in progress.", "Kurasa maalum kwa kila kundi ziko kwenye maandalizi.")} />
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="qt-card-dark flex flex-col justify-between p-8" data-testid="card-segment-medical-laboratories">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="qt-eyebrow qt-eyebrow-light">{tr("Primary segment", "Kundi kuu")}</p>
                  <StatusBadge status="private-beta" />
                </div>
                <h3 className="font-brand text-2xl font-bold" style={{ color: '#FFFFFF' }}>{tx(FEATURED_SEGMENT.label)}</h3>
                <p className="mt-3 max-w-[420px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>{tx(FEATURED_SEGMENT.copy)}</p>
              </div>
            </div>
            <div className="space-y-4">
              {OTHER_SEGMENTS.map((seg) => (
                <div key={seg.label.en} className="qt-card p-5" data-testid={`card-segment-${seg.label.en.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-brand text-sm font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(seg.label)}</h3>
                    <StatusBadge status="in-development" />
                  </div>
                  <p className="text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tx(seg.copy)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeader eyebrow={tr("Taking part in the beta", "Kushiriki kwenye beta")} title={tr("What a laboratory actually does, step by step.", "Kinachofanywa na maabara hatua kwa hatua.")} />
              <p className="mt-5 max-w-[400px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                {tr("The beta is a controlled test, not a rollout. Laboratories learn first, commit second, and the outcome is a written decision rather than an assumption.", "Beta ni jaribio lililodhibitiwa, si usambazaji. Maabara hujifunza kwanza, hujitolea baadaye, na matokeo ni uamuzi ulioandikwa badala ya dhana.")}
              </p>
            </div>
            <BetaJourney />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeader eyebrow={tr("A day in the lab", "Siku moja maabarani")} title={tr("What gets lost between shifts.", "Kinachopotea kati ya zamu.")} />
              <p className="mt-5 max-w-[400px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                {tr("Shift handover is where small things disappear. Try the same four notes on paper and in a shared record.", "Makabidhiano ya zamu ndiyo mahali mambo madogo hupotea. Jaribu maelezo yale yale manne kwenye karatasi na kwenye rekodi ya pamoja.")}
              </p>
            </div>
            <ShiftHandover />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("What every segment shares", "Kinachofanana kwa kila kundi")} title={tr("One core system, whatever the setting.", "Mfumo mmoja wa msingi, mazingira yoyote.")} />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <p className="max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
              {tr('The segment pages above are about positioning, not a different product, every laboratory type runs on the same QualiTracker eQMS and QualiBOT stack described on', 'Makundi yaliyo hapo juu ni kuhusu mwelekeo, si bidhaa tofauti, kila aina ya maabara hutumia QualiTracker eQMS na QualiBOT zilezile zilizoelezwa kwenye')}{' '}
              <Link href="/product" style={{ color: 'var(--qt-deep-teal)' }}>{tr('the product page', 'ukurasa wa bidhaa')}</Link>
              {tr('. What changes by segment is which standards and workflows matter most, not the underlying system.', '. Kinachobadilika kwa kila kundi ni viwango na mtiririko wa kazi unaoongoza, si mfumo wa msingi.')}
            </p>
            <TechnicalRecordBlock
              eyebrow={tr("SYSTEM / ALL SEGMENTS", "MFUMO / MAKUNDI YOTE")}
              fields={[
                { label: tr('CORE STACK', 'MFUMO WA MSINGI'), value: 'QualiTracker eQMS + QualiBOT' },
                { label: tr('STANDARDS', 'VIWANGO'), value: 'ISO 15189 · SLIPTA · WHO LQMS' },
                { label: tr('SEGMENT PAGES', 'KURASA ZA MAKUNDI'), value: tr('IN DEVELOPMENT', 'ZINAANDALIWA') },
              ]}
            />
          </div>
          <p className="mt-8 max-w-[520px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
            {tr("If you'd like to talk through your laboratory's specific setup before these pages are ready, reach out directly.", "Kama ungependa kujadili mpangilio mahususi wa maabara yako kabla kurasa hizi hazijawa tayari, wasiliana nasi moja kwa moja.")}
          </p>
          <div className="mt-6">
            <Button href="/talk-to-team" variant="secondary">{tr("Talk to the team", "Ongea na timu")}</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default SolutionsPage;
