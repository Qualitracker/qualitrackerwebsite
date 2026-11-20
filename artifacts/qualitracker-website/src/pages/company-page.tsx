import { PageShell } from '@/components/site/page-shell';
import { SectionHeader } from '@/components/site/section-header';
import { Button } from '@/components/site/button';
import { AccreditationVisionSection } from '@/components/site/accreditation-vision';
import { HorizonMap } from '@/components/product/horizon-map';
import { useDocumentMeta, useStructuredData } from '@/lib/use-document-meta';
import { useI18n, L } from '@/lib/i18n';

const MISSION = { eyebrow: L('Mission', 'Dhamira'), title: L('Replace the binder.', 'Badilisha faili za karatasi.'), copy: L('Empower every medical laboratory in East Africa with affordable, intelligent, standards-aligned quality-management tools.', 'Kuwezesha kila maabara ya kimatibabu Afrika Mashariki kwa zana za usimamizi wa ubora zenye gharama nafuu, akili, na zinazoendana na viwango.') };
const SECONDARY_PILLARS = [
  { eyebrow: L('Vision', 'Dira'), title: L('A regional standard', 'Kiwango cha kikanda'), copy: L('Become the leading laboratory quality-management platform across Sub-Saharan Africa.', 'Kuwa jukwaa kuu la usimamizi wa ubora wa maabara kote Afrika Kusini mwa Jangwa la Sahara.') },
  { eyebrow: L('Essence', 'Kiini'), title: L('Quality Through Digital Precision', 'Ubora kupitia Usahihi wa Kidijitali'), copy: L('The single idea every QualiTracker touchpoint must communicate.', 'Wazo moja ambalo kila mahali tunapokutana na wateja lazima lilifikishe.') },
];

const VALUES = [L('Scientific Accuracy', 'Usahihi wa Kisayansi'), L('African-First Design', 'Muundo Unaoanza na Afrika'), L('Radical Accessibility', 'Upatikanaji Kamili'), L('Transparency & Accountability', 'Uwazi na Uwajibikaji'), L('Community Before Capital', 'Jamii Kabla ya Mtaji')];

// Founding team — name and role only, per explicit instruction not to invent
// bios, employers, universities, credentials, or quotes.
const TEAM = [
  { initials: 'DJK', name: 'Damian Job Kahamba', role: L('Chief Executive Officer', 'Mkurugenzi Mtendaji') },
  { initials: 'JM', name: 'Justin Mafie', role: L('Chief Technology Officer', 'Mkurugenzi wa Teknolojia') },
  { initials: 'IM', name: 'Ibrahim Mauki', role: L('Chief Marketing Officer', 'Mkurugenzi wa Masoko') },
  { initials: 'RB', name: 'Robert Baluhya', role: L('Chief Product Officer', 'Mkurugenzi wa Bidhaa') },
  { initials: 'HM', name: 'Henry Mlay', role: L('Chief Operations Officer', 'Mkurugenzi wa Uendeshaji') },
  { initials: 'LN', name: 'Leah Nanyaro', role: L('Chief Community Officer / Finance', 'Mkurugenzi wa Jamii / Fedha') },
  { initials: 'NG', name: 'Nickson Gabriel', role: L('Chief Strategy Officer', 'Mkurugenzi wa Mkakati') },
];

// Built directly from TEAM above — never a separate, hand-maintained list
// that could drift from the real roster shown on the page.
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.qualitracker.com/#organization',
  name: 'Qualitracker Limited',
  url: 'https://www.qualitracker.com/',
  founder: TEAM.map((person) => ({ '@type': 'Person', name: person.name, jobTitle: person.role.en })),
};

function CompanyPage() {
  const { tr, tx } = useI18n();
  useDocumentMeta(
    'Company | QualiTracker',
    'Qualitracker Limited is building digital quality infrastructure for laboratories, built in East Africa for East Africa.',
    '/company',
  );
  useStructuredData(ORGANIZATION_SCHEMA);
  return (
    <PageShell>
      <section className="py-12 lg:py-20 qt-texture-grid" style={{ backgroundColor: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <p className="qt-eyebrow qt-eyebrow-light">{tr('Company', 'Kampuni')}</p>
          <h1 className="font-brand mt-3 max-w-[640px] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[-.02em]" style={{ color: '#FFFFFF' }}>
            {tr("Built in East Africa, for East Africa.", "Imejengwa Afrika Mashariki, kwa ajili ya Afrika Mashariki.")}
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>
            {tr("Qualitracker Limited is building digital quality infrastructure for laboratories, starting with the everyday reality of running a quality system on paper.", "Qualitracker Limited inajenga miundombinu ya kidijitali ya ubora kwa maabara, ikianzia na hali halisi ya kila siku ya kuendesha mfumo wa ubora kwa karatasi.")}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Mission gets the editorial, large-type treatment — the one
                statement everything else on this page supports. */}
            <div className="qt-card-dark flex flex-col justify-center p-9 lg:p-12">
              <p className="qt-eyebrow qt-eyebrow-light">{tx(MISSION.eyebrow)}</p>
              <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.08]" style={{ color: '#FFFFFF' }}>
                {tx(MISSION.title)}
              </h2>
              <p className="mt-4 max-w-[440px] text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>{tx(MISSION.copy)}</p>
            </div>
            <div className="flex flex-col gap-4">
              {SECONDARY_PILLARS.map((p) => (
                <div key={p.eyebrow.en} className="qt-card p-6">
                  <p className="qt-eyebrow">{tx(p.eyebrow)}</p>
                  <h3 className="font-brand mt-2 text-lg font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(p.title)}</h3>
                  <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tx(p.copy)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <span key={v.en} className="font-mono-ui rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[.06em]" style={{ background: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' }}>
                {tx(v)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-dark-navy)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader light eyebrow={tr("Our story", "Hadithi yetu")} title={tr("This is not a technology gap. It is a relevance gap.", "Hili si pengo la teknolojia. Ni pengo la ulinganifu na mahitaji halisi.")} />
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg md:grid-cols-3" style={{ background: 'rgba(255,255,255,.14)' }}>
            {[
              { k: L('The problem', 'Tatizo'), v: L('East African laboratories have invested in ISO 15189, SLIPTA and WHO LQMS for years, yet quality records still often live on paper: charts, binders and folders. Existing digital tools were built for hospitals with IT staff, reliable internet and large budgets.', 'Maabara za Afrika Mashariki zimewekeza kwenye ISO 15189, SLIPTA na WHO LQMS kwa miaka mingi, lakini rekodi za ubora bado mara nyingi ziko kwenye karatasi: chati, mafaili na folda. Zana za kidijitali zilizopo zilijengwa kwa hospitali zenye wataalamu wa TEHAMA, intaneti thabiti na bajeti kubwa.') },
              { k: L('How we began', 'Tulivyoanza'), v: L('QualiTracker started as a chatbot for asking questions of laboratory SOPs in plain language. The deeper need became clear: a complete digital quality system, with AI retrieval as one layer of it.', 'QualiTracker ilianza kama chatbot ya kuuliza maswali kuhusu SOP za maabara kwa lugha rahisi. Hitaji la kina likawa wazi: mfumo kamili wa kidijitali wa ubora, ukiwa na utafutaji wa AI kama tabaka moja lake.') },
              { k: L('What we are doing now', 'Tunachofanya sasa'), v: L('We are preparing a controlled beta of the eQMS with a small cohort of laboratories, and testing the assistant separately before it reaches users.', 'Tunaandaa beta iliyodhibitiwa ya eQMS na kundi dogo la maabara, na tunajaribu msaidizi kando kabla hajafikia watumiaji.') },
            ].map((item) => (
              <div key={item.k.en} className="p-6" style={{ background: 'var(--qt-dark-navy)' }}>
                <p className="font-mono-ui text-[11px] uppercase tracking-[.1em]" style={{ color: 'var(--qt-quality-gold)' }}>{tx(item.k)}</p>
                <p className="mt-3 text-sm leading-6" style={{ color: 'var(--qt-mint-light)' }}>{tx(item.v)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("Founding team", "Timu ya waanzilishi")} title={tr("The people building QualiTracker.", "Watu wanaojenga QualiTracker.")} />
          {/* A directory list, not a grid of identical avatar cards — every
              row carries equal visual weight (no invented seniority tiers
              among the founders), the technical-mono role label is the one
              new texture over the equivalent list on /security and /product. */}
          <div className="mt-10 divide-y" style={{ borderColor: 'var(--qt-border-grey)' }}>
            {TEAM.map((person) => (
              <div
                key={person.initials}
                className="flex flex-col items-start gap-1 border-t py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                style={{ borderColor: 'var(--qt-border-grey)' }}
                data-testid={`card-team-${person.initials.toLowerCase()}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'var(--qt-teal-tint)', color: 'var(--qt-deep-teal)' }}
                  >
                    {person.initials}
                  </span>
                  <h3 className="font-brand text-base font-bold" style={{ color: 'var(--qt-near-black)' }}>{person.name}</h3>
                </div>
                <p className="qt-technical-label pl-14 sm:pl-0">{tx(person.role)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AccreditationVisionSection />

      <section className="py-14 lg:py-24" style={{ background: 'var(--qt-lab-grey)' }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <SectionHeader eyebrow={tr("Where we're headed", "Tunakoelekea")} title={tr("From Tanzania, outward.", "Kutoka Tanzania, kuelekea nje.")} />
          <div className="mt-10 max-w-[760px]">
            <HorizonMap />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20" style={{ background: 'var(--qt-clinical-white)' }}>
        <div className="mx-auto flex max-w-[1280px] flex-col items-center px-5 text-center lg:px-8">
          <h2 className="font-brand text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr("Want to build with us, or learn more?", "Ungependa kujenga nasi, au kujifunza zaidi?")}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/waitlist" variant="gold">{tr("Register beta interest", "Onyesha nia ya beta")}</Button>
            <Button href="/talk-to-team" variant="secondary">{tr("Talk to the team", "Ongea na timu")}</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default CompanyPage;
