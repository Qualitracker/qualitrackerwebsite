import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { TextField, SelectField, TextareaField } from '@/components/site/form-field';
import { HONEYPOT_FIELD_NAME, submitLead } from '@/lib/leads';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { useI18n } from '@/lib/i18n';

// "Usually handled by" is role-level only, taken from the leadership split in
// the company plan. No individual is named or promised a reply time.
type Text = { en: string; sw: string };
const ROUTES: Array<{ id: string; label: Text; by: Text; covers: Text }> = [
  { id: 'Laboratory interest', label: { en: 'Laboratory interest', sw: 'Nia ya maabara' }, by: { en: 'Product', sw: 'Bidhaa' }, covers: { en: 'Which workflows to test, and whether your laboratory fits a future beta cohort.', sw: 'Mtiririko gani wa kazi wa kujaribu, na kama maabara yako inafaa kundi la beta la baadaye.' } },
  { id: 'Institutional partnership', label: { en: 'Institutional partnership', sw: 'Ushirikiano wa kitaasisi' }, by: { en: 'CEO and Strategy', sw: 'Mkurugenzi Mtendaji na Mkakati' }, covers: { en: 'Professional bodies, ministries, funders, and partner organisations.', sw: 'Vyama vya kitaaluma, wizara, wafadhili, na taasisi washirika.' } },
  { id: 'Regulatory / accreditation discussion', label: { en: 'Regulatory / accreditation discussion', sw: 'Majadiliano ya udhibiti / ithibati' }, by: { en: 'Product', sw: 'Bidhaa' }, covers: { en: 'How the system maps to ISO 15189, SLIPTA, and WHO LQMS expectations.', sw: 'Jinsi mfumo unavyolingana na matarajio ya ISO 15189, SLIPTA, na WHO LQMS.' } },
  { id: 'Technical integration', label: { en: 'Technical integration', sw: 'Uunganishaji wa kiufundi' }, by: { en: 'Technology', sw: 'Teknolojia' }, covers: { en: 'Data, security questions, and how QualiTracker eQMS would fit your systems.', sw: 'Data, maswali ya usalama, na jinsi QualiTracker eQMS ingeunganishwa na mifumo yako.' } },
  { id: 'Research collaboration', label: { en: 'Research collaboration', sw: 'Ushirikiano wa utafiti' }, by: { en: 'Strategy and Product', sw: 'Mkakati na Bidhaa' }, covers: { en: 'Studies, evaluations, and shared learning from the beta.', sw: 'Tafiti, tathmini, na mafunzo yatakayoshirikiwa kutoka kwenye beta.' } },
  { id: 'General inquiry', label: { en: 'General inquiry', sw: 'Swali la jumla' }, by: { en: 'The team', sw: 'Timu' }, covers: { en: 'Anything else. We will route it to the right person.', sw: 'Jambo lingine lolote. Tutaipeleka kwa mtu sahihi.' } },
];


function TalkToTeamPage() {
  const { tr } = useI18n();
  useDocumentMeta('Talk to the team | QualiTracker', 'Reach the QualiTracker team for institutional, regulatory, or partnership inquiries.', '/talk-to-team');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategoryState] = useState('');
  const route = ROUTES.find((r) => r.id === category);

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
      setError(tr('Please fill in your name, email, and inquiry type.', 'Tafadhali jaza jina lako, barua pepe, na aina ya swali.'));
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
      setError(tr('Something went wrong. Please try again.', 'Kuna tatizo limetokea. Tafadhali jaribu tena.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Institutional inquiries', 'Maswali ya kitaasisi')}</p>
          <h1 className="font-brand mt-3 max-w-[560px] text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr('Talk to the team.', 'Ongea na timu.')}
          </h1>
          <p className="mt-4 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr('For laboratories, institutions, regulators, partners, and researchers evaluating QualiTracker eQMS directly.', 'Kwa maabara, taasisi, wasimamizi, washirika, na watafiti wanaotathmini QualiTracker eQMS moja kwa moja.')}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto grid max-w-[1080px] gap-10 px-5 lg:grid-cols-[1fr_560px] lg:items-start lg:gap-14 lg:px-8">
          <div>
            <p className="font-mono-ui inline-block rounded border border-dashed px-3 py-1.5 text-[11px]" style={{ borderColor: 'var(--qt-border-grey)', color: 'var(--qt-body-grey)' }}>{tr('Pick a route', 'Chagua njia')}</p>
            <div role="radiogroup" aria-label={tr('Inquiry type', 'Aina ya swali')} className="mt-5 flex flex-wrap gap-2">
              {ROUTES.map((r) => {
                const on = r.id === category;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setCategoryState(r.id)}
                    className="qt-focus rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                    style={{
                      background: on ? 'var(--qt-dark-navy)' : '#FFFFFF',
                      color: on ? '#FFFFFF' : 'var(--qt-near-black)',
                      borderColor: on ? 'var(--qt-dark-navy)' : 'var(--qt-border-grey)',
                      borderStyle: on ? 'solid' : 'dashed',
                    }}
                    data-testid={`route-${r.id.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  >
                    {tr(r.label.en, r.label.sw)}
                  </button>
                );
              })}
            </div>
            <div className="qt-brackets relative mt-6 p-5" aria-live="polite" data-testid="route-detail">
              <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
              {route ? (
                <>
                  <p className="qt-technical-label">{tr('Usually handled by', 'Kwa kawaida hushughulikiwa na')} · {tr(route.by.en, route.by.sw)}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{tr(route.covers.en, route.covers.sw)}</p>
                </>
              ) : (
                <p className="text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{tr('Choose what your message is about and we will show who usually picks it up.', 'Chagua ujumbe wako unahusu nini nasi tutakuonyesha nani huushughulikia kwa kawaida.')}</p>
              )}
            </div>
            <p className="mt-5 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
              {tr('QualiTracker is pre-revenue and is not selling during the beta. We read every message, but we cannot promise a reply time.', 'QualiTracker bado haijaanza kuuza na haiuzi wakati wa beta. Tunasoma kila ujumbe, lakini hatuwezi kuahidi muda wa kujibu.')}
            </p>
          </div>
        <div className="w-full">
          {submitted ? (
            <div className="qt-card flex flex-col items-center p-10 text-center">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}>
                <Check size={23} />
              </span>
              <h2 className="font-brand text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Message received.', 'Ujumbe umepokelewa.')}</h2>
              <p className="mt-3 max-w-[360px] text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
                {tr("Thank you for reaching out, we'll route this to the right person on the team and follow up.", 'Asante kwa kuwasiliana nasi, tutaupeleka ujumbe huu kwa mtu sahihi kwenye timu na kukufuatilia.')}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="qt-card space-y-4 p-8">
              <TextField label={tr('Full name', 'Jina kamili')} name="name" required placeholder={tr('Your name', 'Jina lako')} data-testid="input-talk-name" />
              <TextField label={tr('Work email', 'Barua pepe ya kazi')} name="email" type="email" required placeholder="you@organization.org" data-testid="input-talk-email" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={tr('Organization (optional)', 'Taasisi (hiari)')} name="institution" placeholder={tr('Organization or institution', 'Taasisi au shirika')} data-testid="input-talk-institution" />
                <TextField label={tr('Country (optional)', 'Nchi (hiari)')} name="country" placeholder={tr('Country', 'Nchi')} data-testid="input-talk-country" />
              </div>
              <SelectField label={tr("What's this about?", 'Ujumbe huu unahusu nini?')} name="category" required value={category} onChange={(e) => setCategoryState(e.target.value)} data-testid="select-talk-category">
                <option value="" disabled>{tr('Select an inquiry type', 'Chagua aina ya swali')}</option>
                {ROUTES.map((r) => <option key={r.id} value={r.id}>{tr(r.label.en, r.label.sw)}</option>)}
              </SelectField>
              <TextareaField label={tr('Message (optional)', 'Ujumbe (hiari)')} name="message" placeholder={tr('Tell us a bit more…', 'Tuambie zaidi kidogo…')} data-testid="textarea-talk-message" />
              <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                {tr('Leave this field empty', 'Acha sehemu hii wazi')}
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
                {submitting ? tr('Sending…', 'Inatuma…') : tr('Send message', 'Tuma ujumbe')}
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
