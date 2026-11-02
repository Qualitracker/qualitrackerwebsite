import { PageShell } from '@/components/site/page-shell';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { useI18n } from '@/lib/i18n';

/**
 * A plain-language description of what this site actually does with
 * submitted details, written strictly from the code (lib/leads.ts): two
 * forms, sent as email through EmailJS, no database, no cookies, no
 * analytics. It deliberately does NOT assert a legal basis, retention
 * period or jurisdiction-specific rights we haven't decided; those need
 * counsel. Update this page whenever the data flow changes (for example
 * when analytics or a CRM is added). Restored from the version that was live
 * before the redesign, and updated to match the current forms.
 */
type Text = { en: string; sw: string };
const SECTIONS: Array<{ heading: Text; body: Text }> = [
  {
    heading: { en: 'What we collect', sw: 'Tunachokusanya' },
    body: {
      en: 'Only what you type into the two forms on this site. Register beta interest: your name, work email, organization, organization type, country, role, and which quality workflow you would want to test. Talk to the team: your name, work email, the type of inquiry, your message, and optionally your organization and country.',
      sw: 'Tu yale unayoandika kwenye fomu mbili za tovuti hii. Onyesha nia ya beta: jina lako, barua pepe ya kazi, taasisi, aina ya taasisi, nchi, wadhifa, na mtiririko wa kazi wa ubora ungependa kujaribu. Ongea na timu: jina lako, barua pepe ya kazi, aina ya swali, ujumbe wako, na hiari taasisi na nchi yako.',
    },
  },
  {
    heading: { en: 'Why we collect it', sw: 'Kwa nini tunakusanya' },
    body: {
      en: 'To reply to you about a future beta cohort of QualiTracker eQMS, or about the inquiry you sent. We do not use these details for anything else.',
      sw: 'Ili kukujibu kuhusu kundi la beta la baadaye la QualiTracker eQMS, au kuhusu swali ulilotuma. Hatutumii taarifa hizi kwa jambo lingine lolote.',
    },
  },
  {
    heading: { en: 'Where it goes', sw: 'Inakwenda wapi' },
    body: {
      en: "When you submit a form, your details are sent as an email to the QualiTracker team through EmailJS, a third-party email-sending service. The team's inbox is where they are read and kept. This website itself has no database and does not store what you submit.",
      sw: 'Unapotuma fomu, taarifa zako hutumwa kama barua pepe kwa timu ya QualiTracker kupitia EmailJS, huduma ya nje ya kutuma barua pepe. Barua hizo husomwa na kuhifadhiwa kwenye kikasha cha timu. Tovuti yenyewe haina hifadhidata na haihifadhi unachotuma.',
    },
  },
  {
    heading: { en: 'Cookies, analytics and fonts', sw: 'Vidakuzi, takwimu na fonti' },
    body: {
      en: 'At the time of writing this site sets no cookies and runs no analytics. Your language choice is remembered in your own browser only. Page fonts are loaded from Google Fonts, which means your browser contacts Google to fetch them, as with any site that uses them. If we add analytics later we will update this notice first.',
      sw: 'Wakati wa kuandika, tovuti hii haiweki vidakuzi na haitumii takwimu za wageni. Lugha uliyochagua inakumbukwa kwenye kivinjari chako pekee. Fonti za kurasa hupakiwa kutoka Google Fonts, kwa hiyo kivinjari chako huwasiliana na Google ili kuzipata, kama tovuti nyingine zinazozitumia. Tukiongeza takwimu baadaye tutasasisha taarifa hii kwanza.',
    },
  },
  {
    heading: { en: 'How long we keep it', sw: 'Tunahifadhi kwa muda gani' },
    body: {
      en: 'We keep submissions only as long as we need them to follow up. We have not set a fixed retention period yet; when we do, it will be stated here.',
      sw: 'Tunahifadhi ujumbe tuliopokea kwa muda tunaouhitaji kufuatilia tu. Bado hatujaweka muda maalum wa kuhifadhi; tutakapoweka, utaandikwa hapa.',
    },
  },
  {
    heading: { en: 'Your choices', sw: 'Chaguo zako' },
    body: {
      en: 'You can ask us what we hold about you, ask us to correct it, or ask us to delete it, by writing to info@qualitracker.com.',
      sw: 'Unaweza kutuuliza tunashikilia nini kukuhusu, kutuomba tusahihishe, au kutuomba tufute, kwa kuandika kwa info@qualitracker.com.',
    },
  },
];

function PrivacyPage() {
  useDocumentMeta('Privacy notice | QualiTracker', 'What QualiTracker collects through its website forms, where it goes, and how to ask us to change or delete it.', '/privacy');
  const { tr } = useI18n();
  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Privacy', 'Faragha')}</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr('Privacy notice.', 'Taarifa ya faragha.')}
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr('What this website collects, where it goes, and how to ask us to change or delete it.', 'Tovuti hii inakusanya nini, inakwenda wapi, na jinsi ya kutuomba tubadilishe au tufute.')}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[720px] px-5 lg:px-8">
          <p className="qt-technical-label mb-8" data-testid="privacy-draft-banner">
            {tr('Draft, pending legal review. Qualitracker Limited, Dar es Salaam, Tanzania.', 'Rasimu, inasubiri mapitio ya kisheria. Qualitracker Limited, Dar es Salaam, Tanzania.')}
          </p>
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.heading.en}>
                <h2 className="font-brand text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr(s.heading.en, s.heading.sw)}</h2>
                <p className="mt-2 text-sm leading-7" style={{ color: 'var(--qt-body-grey)' }}>{tr(s.body.en, s.body.sw)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default PrivacyPage;
