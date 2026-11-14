import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { TextField, TextareaField } from '@/components/site/form-field';
import { HONEYPOT_FIELD_NAME, submitLead } from '@/lib/leads';
import { useI18n } from '@/lib/i18n';
import { useDocumentMeta } from '@/lib/use-document-meta';

function WaitlistPage() {
  const { tr } = useI18n();
  useDocumentMeta('Register beta interest | QualiTracker', 'Tell QualiTracker which laboratory workflow you would want to test in a future private-beta cohort.', '/waitlist');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const honeypot = data.get(HONEYPOT_FIELD_NAME);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const institution = String(data.get('institution') ?? '').trim();
    const country = String(data.get('country') ?? '').trim();
    const organizationType = String(data.get('organizationType') ?? '').trim();
    const role = String(data.get('role') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !institution || !country || !organizationType || !role || !message) {
      setError(tr('Please fill in every required field.', 'Tafadhali jaza sehemu zote zinazohitajika.'));
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        kind: 'waitlist',
        email,
        firstName: name,
        institution,
        country,
        organizationType,
        role,
        message,
        source: 'waitlist-page',
        consent: true,
        website: honeypot ? String(honeypot) : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message === 'ALREADY_SUBSCRIBED'
          ? tr('Your interest is already recorded.', 'Nia yako tayari imerekodiwa.')
          : tr('Something went wrong. Please try again.', 'Kuna tatizo limetokea. Tafadhali jaribu tena.'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Private beta · pre-revenue', 'Beta ya faragha · bado hatujaanza kuuza')}</p>
          <h1 className="font-brand mt-3 max-w-[560px] text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr('Tell us about your laboratory.', 'Tuambie kuhusu maabara yako.')}
          </h1>
          <p className="mt-4 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr('Controlled eQMS testing begins with a small cohort in mid-November 2026. QualiTracker is not currently selling the product or onboarding general customers; this form records interest for future beta cohorts.', 'Majaribio yaliyodhibitiwa ya eQMS yanaanza na kundi dogo katikati ya Novemba 2026. QualiTracker haiuzi bidhaa wala kupokea wateja kwa sasa; fomu hii inarekodi nia kwa makundi ya beta ya baadaye.')}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[560px] px-5 lg:px-8">
          {submitted ? (
            <div className="qt-card flex flex-col items-center p-10 text-center">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                <Check size={23} />
              </span>
              <h2 className="font-brand text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Your interest is recorded.', 'Nia yako imerekodiwa.')}</h2>
              <p className="mt-3 max-w-[360px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                {tr("Thank you for sharing your laboratory's needs. This is not a purchase or a confirmed beta place; the team will follow up if a future cohort is a fit.", 'Asante kwa kushiriki mahitaji ya maabara yako. Huu si ununuzi wala nafasi iliyothibitishwa ya beta; timu itakufuatilia kama kundi la baadaye linakufaa.')}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="qt-card space-y-4 p-8">
              <TextField label={tr('Full name', 'Jina kamili')} name="name" required placeholder="Dr. D. Kayamba" data-testid="input-waitlist-name" />
              <TextField label={tr('Work email', 'Barua pepe ya kazi')} name="email" type="email" required placeholder="you@yourlab.org" data-testid="input-waitlist-email" />
              <TextField label={tr('Laboratory / organization', 'Maabara / taasisi')} name="institution" required placeholder={tr('Regional medical laboratory', 'Maabara ya kimatibabu ya mkoa')} data-testid="input-waitlist-institution" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={tr('Organization type', 'Aina ya taasisi')} name="organizationType" required placeholder={tr('e.g. Medical laboratory', 'mf. Maabara ya kimatibabu')} data-testid="input-waitlist-org-type" />
                <TextField label={tr('Country', 'Nchi')} name="country" required placeholder={tr('e.g. Tanzania', 'mf. Tanzania')} data-testid="input-waitlist-country" />
              </div>
              <TextField label={tr('Your role', 'Wadhifa wako')} name="role" required placeholder={tr('e.g. Laboratory manager', 'mf. Meneja wa maabara')} data-testid="input-waitlist-role" />
              <TextareaField label={tr('Which quality workflow would you want to test?', 'Ungependa kujaribu mtiririko gani wa kazi wa ubora?')} name="message" required placeholder={tr('For example: document control, quality records, CAPA, or audit follow-up.', 'Kwa mfano: udhibiti wa nyaraka, rekodi za ubora, CAPA, au ufuatiliaji wa ukaguzi.')} data-testid="textarea-waitlist-message" />
              <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                {tr('Leave this field empty', 'Acha sehemu hii wazi')}
                <input tabIndex={-1} autoComplete="off" name={HONEYPOT_FIELD_NAME} />
              </label>
              {error && <p role="alert" className="text-sm font-semibold" style={{ color: 'var(--qt-error)' }}>{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="qt-button qt-focus flex w-full items-center justify-center rounded-md text-sm font-semibold"
                style={{ height: 44, background: 'var(--qt-quality-gold)', color: 'var(--qt-dark-navy)', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                data-testid="button-submit-waitlist"
              >
                {submitting ? tr('Submitting…', 'Inatuma…') : tr('Submit beta interest', 'Tuma nia ya beta')}
              </button>
              <p className="text-center text-[11px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>{tr("We'll only use this to assess and follow up on beta interest. Submission does not guarantee access.", 'Tutatumia hii kutathmini na kufuatilia nia ya beta pekee. Kutuma hakuhakikishi nafasi.')}</p>
            </form>
          )}
        </div>
      </section>
      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="font-mono-ui inline-block rounded border border-dashed px-3 py-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>{tr('After you submit', 'Baada ya kutuma')}</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { n: '01', t: { en: 'We read it', sw: 'Tunaisoma' }, c: { en: 'The team reads every submission to understand which workflows laboratories want to test.', sw: 'Timu inasoma kila ombi ili kuelewa ni mtiririko gani wa kazi maabara zinataka kujaribu.' } },
              { n: '02', t: { en: 'We may follow up', sw: 'Tunaweza kukufuatilia' }, c: { en: 'If a future cohort fits your laboratory, we will contact you. Not every submission leads to a place.', sw: 'Kama kundi la baadaye linaifaa maabara yako, tutawasiliana nawe. Si kila ombi hupata nafasi.' } },
              { n: '03', t: { en: 'Nothing is charged', sw: 'Hakuna malipo' }, c: { en: 'This is not a purchase or a commitment. QualiTracker is pre-revenue and is not selling during the beta.', sw: 'Huu si ununuzi wala ahadi. QualiTracker bado haijaanza kuuza na haiuzi wakati wa beta.' } },
            ].map((s) => (
              <li key={s.n} className="border-l-2 pl-4" style={{ borderColor: 'var(--qt-quality-gold)' }}>
                <p className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{s.n}</p>
                <h2 className="font-brand mt-1 text-base font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr(s.t.en, s.t.sw)}</h2>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tr(s.c.en, s.c.sw)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}

export default WaitlistPage;
