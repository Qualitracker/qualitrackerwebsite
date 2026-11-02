import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { TextField, TextareaField } from '@/components/site/form-field';
import { HONEYPOT_FIELD_NAME, submitLead } from '@/lib/leads';
import { useDocumentMeta } from '@/lib/use-document-meta';

function WaitlistPage() {
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
      setError('Please fill in every required field.');
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
      setError(err instanceof Error && err.message === 'ALREADY_SUBSCRIBED' ? "Your interest is already recorded." : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">Private beta · pre-revenue</p>
          <h1 className="font-brand mt-3 max-w-[560px] text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            Tell us about your laboratory.
          </h1>
          <p className="mt-4 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            Controlled eQMS testing begins with a small cohort in mid-November 2026. QualiTracker is not currently selling the product or onboarding general customers; this form records interest for future beta cohorts.
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
              <h2 className="font-brand text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>Your interest is recorded.</h2>
              <p className="mt-3 max-w-[360px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                Thank you for sharing your laboratory's needs. This is not a purchase or a confirmed beta place; the team will follow up if a future cohort is a fit.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="qt-card space-y-4 p-8">
              <TextField label="Full name" name="name" required placeholder="Dr. D. Kayamba" data-testid="input-waitlist-name" />
              <TextField label="Work email" name="email" type="email" required placeholder="you@yourlab.org" data-testid="input-waitlist-email" />
              <TextField label="Laboratory / organization" name="institution" required placeholder="Regional medical laboratory" data-testid="input-waitlist-institution" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Organization type" name="organizationType" required placeholder="e.g. Medical laboratory" data-testid="input-waitlist-org-type" />
                <TextField label="Country" name="country" required placeholder="e.g. Tanzania" data-testid="input-waitlist-country" />
              </div>
              <TextField label="Your role" name="role" required placeholder="e.g. Laboratory manager" data-testid="input-waitlist-role" />
              <TextareaField label="Which quality workflow would you want to test?" name="message" required placeholder="For example: document control, quality records, CAPA, or audit follow-up." data-testid="textarea-waitlist-message" />
              <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                Leave this field empty
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
                {submitting ? 'Submitting…' : 'Submit beta interest'}
              </button>
              <p className="text-center text-[11px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>We'll only use this to assess and follow up on beta interest. Submission does not guarantee access.</p>
            </form>
          )}
        </div>
      </section>
      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="font-mono-ui inline-block rounded border border-dashed px-3 py-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>After you submit</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { n: '01', t: 'We read it', c: 'The team reads every submission to understand which workflows laboratories want to test.' },
              { n: '02', t: 'We may follow up', c: 'If a future cohort fits your laboratory, we will contact you. Not every submission leads to a place.' },
              { n: '03', t: 'Nothing is charged', c: 'This is not a purchase or a commitment. QualiTracker is pre-revenue and is not selling during the beta.' },
            ].map((s) => (
              <li key={s.n} className="border-l-2 pl-4" style={{ borderColor: 'var(--qt-quality-gold)' }}>
                <p className="font-mono-ui text-[11px]" style={{ color: 'var(--qt-body-grey)' }}>{s.n}</p>
                <h2 className="font-brand mt-1 text-base font-bold" style={{ color: 'var(--qt-near-black)' }}>{s.t}</h2>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{s.c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}

export default WaitlistPage;
