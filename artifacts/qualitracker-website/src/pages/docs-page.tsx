import { useState } from 'react';
import { Link } from 'wouter';
import { PageShell } from '@/components/site/page-shell';
import { StatusBadge } from '@/components/site/status-badge';
import { Button } from '@/components/site/button';
import { LifecycleTimeline } from '@/components/product/lifecycle-timeline';
import { CAPA_STAGES, DOCUMENT_STAGES } from '@/lib/lifecycles';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { useI18n, L, type Text } from '@/lib/i18n';

interface DocLeaf {
  id: string;
  label: Text;
}
interface DocGroup {
  label: Text;
  items: DocLeaf[];
}

// The full documentation IA the product is being built toward. Only
// getting-started/introduction has real content today, plus Documents and
// CAPA; everything else renders an honest "Coming soon" state rather than
// fabricated depth. See docs/website/08_PIVOT_ADDENDUM.md.
const DOC_GROUPS: DocGroup[] = [
  { label: L('Getting started', 'Kuanza'), items: [
    { id: 'introduction', label: L('Introduction', 'Utangulizi') },
    { id: 'quickstart', label: L('Quickstart', 'Anza haraka') },
    { id: 'platform-overview', label: L('Platform overview', 'Muhtasari wa jukwaa') },
    { id: 'core-concepts', label: L('Core concepts', 'Dhana kuu') },
  ] },
  { label: L('QualiTracker eQMS', 'QualiTracker eQMS'), items: [
    { id: 'dashboard', label: L('Dashboard', 'Dashibodi') },
    { id: 'documents', label: L('Documents', 'Nyaraka') },
    { id: 'sops', label: L('SOPs', 'SOP') },
    { id: 'capa', label: L('CAPA', 'CAPA') },
    { id: 'non-conformances', label: L('Non-conformances', 'Kutokidhi viwango') },
    { id: 'audits', label: L('Audits', 'Ukaguzi') },
    { id: 'equipment', label: L('Equipment', 'Vifaa') },
    { id: 'calibration', label: L('Calibration', 'Urekebishaji wa vifaa') },
    { id: 'personnel', label: L('Personnel', 'Wafanyakazi') },
    { id: 'training', label: L('Training', 'Mafunzo') },
    { id: 'risk', label: L('Risk', 'Hatari') },
    { id: 'reports', label: L('Reports', 'Ripoti') },
  ] },
  { label: L('AI & RAG', 'AI na RAG'), items: [
    { id: 'ai-overview', label: L('Overview', 'Muhtasari') },
    { id: 'knowledge-retrieval', label: L('Knowledge retrieval', 'Upataji wa maarifa') },
    { id: 'sources', label: L('Sources', 'Vyanzo') },
    { id: 'permissions', label: L('Permissions', 'Ruhusa') },
    { id: 'traceability', label: L('Traceability', 'Ufuatiliaji') },
    { id: 'human-verification', label: L('Human verification', 'Uthibitisho wa binadamu') },
  ] },
  { label: L('Integrations', 'Uunganishaji'), items: [
    { id: 'integrations-overview', label: L('Overview', 'Muhtasari') },
    { id: 'api', label: L('API', 'API') },
    { id: 'webhooks', label: L('Webhooks', 'Webhooks') },
    { id: 'external-systems', label: L('External systems', 'Mifumo ya nje') },
  ] },
  { label: L('MCP', 'MCP'), items: [
    { id: 'mcp-introduction', label: L('Introduction', 'Utangulizi') },
    { id: 'mcp-connecting', label: L('Connecting QualiTracker eQMS', 'Kuunganisha QualiTracker eQMS') },
    { id: 'mcp-server-setup', label: L('MCP server setup', 'Kusanidi seva ya MCP') },
    { id: 'mcp-authentication', label: L('Authentication', 'Uthibitishaji') },
    { id: 'mcp-tools', label: L('Tools', 'Zana') },
    { id: 'mcp-resources', label: L('Resources', 'Rasilimali') },
    { id: 'mcp-permissions', label: L('Permissions', 'Ruhusa') },
    { id: 'mcp-examples', label: L('Examples', 'Mifano') },
    { id: 'mcp-troubleshooting', label: L('Troubleshooting', 'Kutatua matatizo') },
  ] },
  { label: L('Reference', 'Marejeo'), items: [
    { id: 'api-reference', label: L('API reference', 'Marejeo ya API') },
    { id: 'security', label: L('Security', 'Usalama') },
    { id: 'compliance', label: L('Compliance', 'Uzingatiaji') },
    { id: 'changelog', label: L('Changelog', 'Orodha ya mabadiliko') },
    { id: 'support', label: L('Support', 'Msaada') },
  ] },
];

const ALL_ITEMS = DOC_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

function IntroductionContent() {
  const { tr } = useI18n();
  return (
    <div className="qt-reveal max-w-[640px]">
      <StatusBadge status="private-beta" />
      <h1 className="font-brand mt-4 text-3xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{tr('Introduction', 'Utangulizi')}</h1>
      <p className="mt-4 text-sm leading-7" style={{ color: 'var(--qt-body-grey)' }}>
        {tr("QualiTracker eQMS is a digital quality-management system for laboratories, made of two connected parts:", "QualiTracker eQMS ni mfumo wa kidijitali wa usimamizi wa ubora kwa maabara, unaoundwa na sehemu mbili zilizounganishwa:")}
      </p>
      <ul className="mt-4 space-y-3">
        <li className="text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
          <strong style={{ color: 'var(--qt-near-black)' }}>{tr('The eQMS', 'eQMS')}</strong>{tr(', a versioned document and record repository: SOPs, policies, quality records, and audit logs, kept in one governed, searchable place.', ', hifadhi ya nyaraka na rekodi zenye matoleo: SOP, sera, rekodi za ubora, na kumbukumbu za ukaguzi, zikiwa mahali pamoja palipodhibitiwa na penye utafutaji.')}
        </li>
        <li className="text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
          <strong style={{ color: 'var(--qt-near-black)' }}>QualiBOT</strong>{tr(", a conversational AI assistant grounded in your lab's own uploaded documents. It answers in plain language, cites its source, and says so plainly when it can't find one, see", ', msaidizi wa AI wa mazungumzo anayetegemea nyaraka ulizopakia za maabara yako. Hujibu kwa lugha rahisi, hutaja chanzo, na husema wazi asipokipata, angalia')} <Link href="/product#ai-rag" style={{ color: 'var(--qt-deep-teal)' }}>{tr('how it works', 'jinsi inavyofanya kazi')}</Link>.
        </li>
      </ul>
      <p className="mt-4 text-sm leading-7" style={{ color: 'var(--qt-body-grey)' }}>
        {tr("The rest of this documentation, quickstart steps, the full QMS module reference, API and MCP integration guides, is being written alongside the product itself. Sections not yet ready are marked clearly rather than left to look finished before they are.", "Sehemu nyingine ya nyaraka hizi, hatua za kuanza haraka, marejeo kamili ya eQMS, na miongozo ya API na MCP, inaandikwa sambamba na bidhaa yenyewe. Sehemu ambazo bado hazijawa tayari zimewekwa alama wazi badala ya kuachwa zionekane zimekamilika kabla ya wakati.")}
      </p>
      <div className="mt-6 rounded-lg border p-5" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }}>
        <p className="qt-technical-label">{tr('Current stage · 30 October 2026', 'Hatua ya sasa · 30 Oktoba 2026')}</p>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
          {tr("QualiTracker is pre-revenue. Controlled eQMS beta testing is planned to begin with a small laboratory cohort in mid-November 2026. QualiBOT is being developed and evaluated separately. Neither is currently available for general purchase.", "QualiTracker bado haijaanza kuuza. Majaribio ya beta ya eQMS yaliyodhibitiwa yamepangwa kuanza na kundi dogo la maabara katikati ya Novemba 2026. QualiBOT inatengenezwa na kutathminiwa kando. Hakuna kati ya hivi viwili kinachopatikana kwa ununuzi wa jumla kwa sasa.")}
        </p>
      </div>
      <div className="mt-6">
        <Button href="/talk-to-team" variant="secondary">{tr("Ask the team a question", "Uliza timu swali")}</Button>
      </div>
    </div>
  );
}

// Pages with real content. Both render the actual workflow states the QMS
// uses, shared with the landing page so the two can never disagree.
function LifecyclePage({ group, label, intro, stages, accent }: { group: string; label: string; intro: string; stages: typeof DOCUMENT_STAGES; accent?: string }) {
  return (
    <div className="max-w-[720px]">
      <p className="qt-technical-label">{group}</p>
      <h1 className="font-brand mt-2 text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{label}</h1>
      <div className="mt-4"><StatusBadge status="private-beta" /></div>
      <p className="mt-4 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>{intro}</p>
      <div className="mt-6">
        <LifecycleTimeline stages={stages} accent={accent} />
      </div>
    </div>
  );
}

function ComingSoon({ label, group }: { label: string; group: string }) {
  const { tr } = useI18n();
  return (
    <div className="qt-reveal max-w-[560px]">
      <p className="qt-technical-label">{group}</p>
      <h1 className="font-brand mt-2 text-2xl font-bold" style={{ color: 'var(--qt-near-black)' }}>{label}</h1>
      <div className="mt-4"><StatusBadge status="coming-soon" /></div>
      <p className="mt-4 text-sm leading-6" style={{ color: 'var(--qt-body-grey)' }}>
        {tr("This page isn't written yet. Documentation is being written alongside the product, so a page appears once that part of the platform is ready to document.", "Ukurasa huu haujaandikwa bado. Nyaraka zinaandikwa sambamba na bidhaa, kwa hiyo ukurasa huonekana pale sehemu hiyo ya jukwaa inapokuwa tayari kuandikiwa.")}
      </p>
      <div className="qt-brackets relative mt-6 p-5">
        <span className="qt-bracket-b absolute inset-0" aria-hidden="true" />
        <p className="qt-technical-label">{tr('In the meantime', 'Wakati huo')}</p>
        <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--qt-body-grey)' }}>
          <li>{tr('See how modules are staged on the', 'Angalia hatua ya kila moduli kwenye')} <Link href="/product" style={{ color: 'var(--qt-deep-teal)' }}>{tr('Product page', 'ukurasa wa Bidhaa')}</Link>.</li>
          <li>{tr('Read what is and is not claimed on the', 'Soma tunachodai na tusichodai kwenye')} <Link href="/security" style={{ color: 'var(--qt-deep-teal)' }}>{tr('Security page', 'ukurasa wa Usalama')}</Link>.</li>
          <li>{tr('Tell us what you need documented first:', 'Tuambie unachohitaji kiandikwe kwanza:')} <Link href="/talk-to-team" style={{ color: 'var(--qt-deep-teal)' }}>{tr('talk to the team', 'ongea na timu')}</Link>.</li>
        </ul>
      </div>
    </div>
  );
}

function DocsPage() {
  const { tr, tx } = useI18n();
  useDocumentMeta('Docs | QualiTracker', 'QualiTracker eQMS documentation: platform overview, QMS modules, AI & RAG, integrations, and MCP.', '/docs');
  const [active, setActive] = useState('introduction');
  const activeItem = ALL_ITEMS.find((i) => i.id === active);

  return (
    <PageShell>
      <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            {DOC_GROUPS.map((group) => (
              <div key={group.label.en} className="mb-6">
                <p className="qt-technical-label mb-2">{tx(group.label)}</p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className="qt-button qt-focus block w-full rounded-md px-2 py-1.5 text-left text-[13px]"
                    style={{
                      background: active === item.id ? 'var(--qt-teal-tint)' : 'transparent',
                      color: active === item.id ? 'var(--qt-deep-teal)' : 'var(--qt-near-black)',
                      fontWeight: active === item.id ? 600 : 400,
                    }}
                    data-testid={`link-docs-${item.id}`}
                  >
                    {tx(item.label)}
                  </button>
                ))}
              </div>
            ))}
          </aside>
          <div>
            {active === 'introduction' ? (
              <IntroductionContent />
            ) : active === 'documents' ? (
              <LifecyclePage group="QualiTracker eQMS" label={tr("Documents", "Nyaraka")} intro={tr("Every controlled document moves through the same states, from a draft to an approved, version-locked record. These are the actual states used by the QMS.", "Kila hati iliyodhibitiwa hupitia hali zile zile, kuanzia rasimu hadi rekodi iliyoidhinishwa na kufungwa toleo. Hizi ni hali halisi zinazotumiwa na QMS.")} stages={DOCUMENT_STAGES} />
            ) : active === 'capa' ? (
              <LifecyclePage group="QualiTracker eQMS" label="CAPA" intro={tr("A finding closes only after two independent reviews and a final sign-off. These are the actual states a corrective action moves through.", "Tatizo lililobainika hufungwa baada ya mapitio mawili huru na idhini ya mwisho tu. Hizi ni hali halisi ambazo hatua ya kurekebisha hupitia.")} stages={CAPA_STAGES} accent="var(--qt-deep-teal)" />
            ) : (
              <ComingSoon label={activeItem ? tx(activeItem.label) : ''} group={activeItem ? tx(activeItem.group) : ''} />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default DocsPage;
