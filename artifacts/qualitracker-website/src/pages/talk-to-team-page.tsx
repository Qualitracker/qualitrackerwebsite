import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { TextField, SelectField, TextareaField } from '@/components/site/form-field';
import { HONEYPOT_FIELD_NAME, submitLead } from '@/lib/leads';
import { useDocumentMeta } from '@/lib/use-document-meta';

// "Usually handled by" is role-level only, taken from the leadership split in
// the company plan. No individual is named or promised a reply time.
const ROUTES = [
  { label: 'Laboratory interest', by: 'Product', covers: 'Which workflows to test, and whether your laboratory fits a future beta cohort.' },
  { label: 'Institutional partnership', by: 'CEO and Strategy', covers: 'Professional bodies, ministries, funders, and partner organisations.' },
  { label: 'Regulatory / accreditation discussion', by: 'Product', covers: 'How the system maps to ISO 15189, SLIPTA, and WHO LQMS expectations.' },
  { label: 'Technical integration', by: 'Technology', covers: 'Data, security questions, and how QualiTracker would fit your systems.' },
  { label: 'Research collaboration', by: 'Strategy and Product', covers: 'Studies, evaluations, and shared learning from the beta.' },
  { label: 'General inquiry', by: 'The team', covers: 'Anything else. We will route it to the right person.' },
];
const CATEGORIES = ROUTES.map((r) => r.label);

function TalkToTeamPage() {
  useDocumentMeta('Talk to the team — QualiTracker', 'Reach the QualiTracker team for institutional, regulatory, or partnership inquiries.', '/talk-to-team');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategoryState] = useState('');
  const route = ROUTES.find((r) => r.label === category);

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
    const note = String(data.get('message') ?? '').trim();

    if (!name || !email || !category) {
      setError('Please fill in your name, email, and inquiry type.');
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        kind: 'talk_to_team',
        email,
        firstName: name,
        institution: institution || undefined,
        country: country || undefined,
        message: `Inquiry: ${category}${note ? `\n\n${note}` : ''}`,
        source: 'talk-to-team-page',
        consent: true,
        website: honeypot ? String(honeypot) : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error && err.message === 'ALREADY_SUBSCRIBED' ? "We've already got a message from this email." : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="py-16 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">Institutional inquiries</p>
          <h1 className="font-brand mt-3 max-w-[560px] text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            Talk to the team.
          </h1>
          <p className="mt-4 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            For laboratories, institutions, regulators, partners, and researchers evaluating QualiTracker directly.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto grid max-w-[1080px] gap-10 px-5 lg:grid-cols-[1fr_560px] lg:items-start lg:gap-14 lg:px-8">
          <div>
            <p className="font-mono-ui inline-block rounded border border-dashed px-3 py-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>Pick a route</p>
            <div role="radiogroup" aria-label="Inquiry type" className="mt-5 flex flex-wrap gap-2">
              {ROUTES.map((r) => {
                const on = r.label === category;
                return (
                  <button
                    key={r.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setCategoryState(r.label)}
                    className="qt-focus rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                    style={{
                      background: on ? 'var(--qt-dark-navy)' : '#FFFFFF',
                      color: on ? '#FFFFFF' : 'var(--qt-near-black)',
                      borderColor: on ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
                      borderStyle: on ? 'solid' : 'dashed',
                    }}
                    data-testid={`route-${r.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <div className="qt-brackets relative mt-6 p-5" aria-live="polite" data-testid="route-detail">
              <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
              {route ? (
                <>
                  <p className="qt-technical-label">Usually handled by · {route.by}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{route.covers}</p>
                </>
              ) : (
                <p className="text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>Choose what your message is about and we will show who usually picks it up.</p>
              )}
            </div>
            <p className="mt-5 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
              QualiTracker is pre-revenue and is not selling during the beta. We read every message, but we cannot promise a reply time.
            </p>
          </div>
        <div className="w-full">
          {submitted ? (
            <div className="qt-card flex flex-col items-center p-10 text-center">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                <Check size={23} />
              </span>
              <h2 className="font-brand text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>Message received.</h2>
              <p className="mt-3 max-w-[360px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                Thank you for reaching out — we'll route this to the right person on the team and follow up.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="qt-card space-y-4 p-8">
              <TextField label="Full name" name="name" required placeholder="Your name" data-testid="input-talk-name" />
              <TextField label="Work email" name="email" type="email" required placeholder="you@organization.org" data-testid="input-talk-email" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Organization (optional)" name="institution" placeholder="Organization or institution" data-testid="input-talk-institution" />
                <TextField label="Country (optional)" name="country" placeholder="Country" data-testid="input-talk-country" />
              </div>
              <SelectField label="What's this about?" name="category" required value={category} onChange={(e) => setCategoryState(e.target.value)} data-testid="select-talk-category">
                <option value="" disabled>Select an inquiry type</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </SelectField>
              <TextareaField label="Message (optional)" name="message" placeholder="Tell us a bit more…" data-testid="textarea-talk-message" />
              <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                Leave this field empty
                <input tabIndex={-1} autoComplete="off" name={HONEYPOT_FIELD_NAME} />
              </label>
              {error && <p role="alert" className="text-sm font-semibold" style={{ color: 'var(--qt-error)' }}>{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="qt-button qt-focus flex w-full items-center justify-center rounded-md text-sm font-semibold"
                style={{ height: 44, background: 'var(--qt-deep-teal)', color: '#FFFFFF', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                data-testid="button-submit-talk"
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
        </div>
      </section>
    </PageShell>
  );
}

export default TalkToTeamPage;
