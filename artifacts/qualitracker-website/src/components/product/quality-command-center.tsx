import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ClipboardList, FileText, LayoutDashboard } from 'lucide-react';
import lockupMark from '@/assets/figma-app/qualitracker-lockup-mark.svg';
import mobileSymbol from '@/assets/figma-app/qualitracker-mobile-symbol.svg';
import { L, useI18n } from '@/lib/i18n';

type Surface = 'dashboard' | 'documents' | 'nonconformance';
type Tone = 'neutral' | 'info' | 'warning' | 'success' | 'critical' | 'accent';

const PREVIEWS = {
  dashboard: {
    icon: LayoutDashboard,
    label: L('Operations overview', 'Muhtasari wa uendeshaji'),
    description: L('See work awaiting review, upcoming deadlines, and readiness indicators.', 'Ona kazi zinazosubiri mapitio, makataa yajayo na viashiria vya utayari.'),
  },
  documents: {
    icon: FileText,
    label: L('Controlled documents', 'Nyaraka zinazodhibitiwa'),
    description: L('Inspect document owners, revision status, and review dates.', 'Angalia wasimamizi wa nyaraka, hali ya matoleo na tarehe za mapitio.'),
  },
  nonconformance: {
    icon: ClipboardList,
    label: L('Quality events', 'Matukio ya ubora'),
    description: L('See how non-conformances are recorded, assigned, and tracked.', 'Ona jinsi matukio ya kutokidhi kiwango yanavyorekodiwa, kugawiwa na kufuatiliwa.'),
  },
};
const SURFACES: Surface[] = ['dashboard', 'documents', 'nonconformance'];

const FIGMA_TOKENS = {
  '--figma-nav': '#012e36', '--figma-primary': '#036173', '--figma-nav-item': '#a5ddd7', '--figma-mint': '#6ecbc2',
  '--figma-canvas': '#f7f9f9', '--figma-sunken': '#eff3f3', '--figma-border': '#cbd4d4', '--figma-border-subtle': '#e2e8e8',
  '--figma-text': '#131a1b', '--figma-text-secondary': '#4b5758', '--figma-text-tertiary': '#6a7878', '--figma-gold': '#c8a24b',
} as CSSProperties;

const NAV_GROUPS = [
  { label: 'Quality', items: [['Non-Conformance', 'nonconformance'], ['QC Review'], ['EQA']] },
  { label: 'Governance', items: [['Audits'], ['Risk Management'], ['Quality Indicators'], ['Management Review']] },
  { label: 'Documents', items: [['Document Register', 'documents'], ['Review Queue'], ['Approvals'], ['Read & Acknowledge'], ['Amend'], ['Obsolete']] },
  { label: 'Preventive Controls', items: [['Temperature'], ['Bench Decontamination'], ['Equipment Maintenance']] },
  { label: 'Assets & Materials', items: [['Equipment'], ['Reagents'], ['Suppliers']] },
  { label: 'People', items: [['Competency & Training'], ['Staff Directory']] },
  { label: 'Administration', items: [['Laboratories'], ['Departments'], ['Users'], ['Roles & Permissions'], ['Geography'], ['Standards & Settings']] },
  { label: 'Insights', items: [['Reports']] },
] as const;

const KPI = [
  ['12', 'Pending my review', '▲ 3 since Monday', '#036173'], ['5', 'Approvals awaiting', '2 due within 48h', '#8f5e14'],
  ['8', 'Open non-conformances', '3 overdue closure', '#992121'], ['6', 'Equipment tasks due', '1 calibration overdue', '#992121'],
  ['4', 'Reagent lots near expiry', '≤ 30 days', '#c8a24b'],
] as const;

const ACTIONS = [
  ['SOP-QC-014 Rev C — Internal QC review', 'Doc review', 'Today', 'Under Review', 'warning'],
  ['NC-2026-041 — Blood culture contamination', 'Non-conf.', '2 Sep', 'Review 2', 'critical'],
  ['Centrifuge C-07 — Quarterly maintenance', 'Equipment', '3 Sep', 'Scheduled', 'info'],
  ['EQA Round M-2026-Q3 — Enter results', 'EQA', '5 Sep', 'Testing', 'neutral'],
  ['POL-BIO-002 — Read & acknowledge', 'Document', '6 Sep', 'Ack. Required', 'accent'],
] as const;

const DOCUMENTS = [
  ['QP-QMS-001', 'Quality Manual', 'Manual', '7', 'A. Kimaro', 'QA', '12 Jan 26', '12 Jan 27', 'Approved', 'success'],
  ['SOP-BIO-014', 'Blood Culture Processing', 'SOP', '3', 'J. Mafie', 'Micro', '04 Mar 26', '04 Mar 27', 'Approved', 'success'],
  ['SOP-QC-014', 'Internal Quality Control', 'SOP', 'C', 'L. Massawe', 'QC', '—', '—', 'Under Review', 'warning'],
  ['POL-BIO-002', 'Specimen Rejection Policy', 'Policy', '2', 'A. Kimaro', 'Micro', '20 Feb 26', '20 Feb 28', 'Ack. Required', 'accent'],
  ['FRM-EQA-009', 'EQA Result Entry Form', 'Form', '4', 'T. Nkya', 'QA', '01 Jun 26', '01 Jun 27', 'Approved', 'success'],
  ['SOP-CHE-021', 'Electrolyte Analyser Operation', 'SOP', '1', 'D. Shirima', 'Chem', '—', '—', 'Under Approval', 'info'],
  ['SOP-BIO-009', 'Gram Stain Procedure', 'SOP', '5', 'J. Mafie', 'Micro', '15 Aug 24', '15 Aug 26', 'Overdue Review', 'critical'],
  ['WI-STO-003', 'Reagent Receiving Work Instruction', 'WI', '2', 'G. Mushi', 'Stores', '09 Apr 26', '09 Apr 27', 'Approved', 'success'],
  ['SOP-BIO-004', 'AST Disc Diffusion (CLSI)', 'SOP', '6', 'L. Massawe', 'Micro', '28 Jul 26', '28 Jul 27', 'Approved', 'success'],
  ['SOP-MOL-002', 'GeneXpert MTB/RIF Testing', 'SOP', '2', 'P. Haule', 'Molec', '—', '—', 'Draft', 'neutral'],
] as const;

const NONCONFORMANCES = [
  ['NC-2026-041', 'Blood culture bottles contaminated on receipt', 'Internal audit', 'P0', 'J. Mafie', '24 Aug', '07 Sep', 'Review 2 Pending', 'critical'],
  ['NC-2026-040', 'EQA Chemistry Round Q2 — 2 analytes outside', 'EQA', 'P1', 'D. Shirima', '19 Aug', '02 Sep', 'Review 1 Complete', 'warning'],
  ['NC-2026-039', 'Centrifuge C-03 temperature excursion during', 'Equipment', 'P1', 'L. Massawe', '15 Aug', '29 Aug', 'Overdue', 'critical'],
  ['NC-2026-038', 'SOP not followed — specimen labelling', 'Supervisor obs.', 'P2', 'A. Kimaro', '12 Aug', '26 Aug', 'Under Review 1', 'info'],
  ['NC-2026-037', 'Reagent lot failed lot-to-lot verification', 'Reagents', 'P1', 'G. Mushi', '08 Aug', '22 Aug', 'Closed', 'success'],
] as const;

function StatusChip({ children, tone }: { children: ReactNode; tone: Tone }) {
  const styles: Record<Tone, CSSProperties> = {
    neutral: { background: '#eff3f3', borderColor: '#cbd4d4', color: '#343f40' }, info: { background: '#deebf6', borderColor: '#84b4da', color: '#124f80' },
    warning: { background: '#fbeed6', borderColor: '#e4b673', color: '#8f5e14' }, success: { background: '#dcf0e4', borderColor: '#7bc79c', color: '#155c34' },
    critical: { background: '#fadede', borderColor: '#e48f8f', color: '#992121' }, accent: { background: '#f6edd6', borderColor: '#c8a24b', color: '#a9832f' },
  };
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-[3px] text-[12px] font-medium leading-4" style={styles[tone]}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}

function Sidebar({ surface, setSurface }: { surface: Surface; setSurface: (surface: Surface) => void }) {
  return <aside className="flex h-full min-h-[1024px] flex-col border-r py-[14px] text-white" style={{ background: 'var(--figma-nav)', borderColor: 'var(--figma-primary)' }} aria-label="Application navigation">
    <div className="flex items-center gap-[9px] px-4 py-[14px]"><img src={lockupMark} width="24" height="27" alt="" /><span className="font-figma-display text-[20px] font-bold"><span>Quali</span><span style={{ color: 'var(--figma-mint)' }}>Tracker</span></span></div>
    <button type="button" onClick={() => setSurface('dashboard')} className="qt-focus flex min-h-6 w-full items-center gap-2.5 border-l-[3px] px-5 py-1 text-left text-[13px] font-medium" style={{ borderColor: surface === 'dashboard' ? 'var(--figma-primary)' : 'transparent', background: surface === 'dashboard' ? 'var(--figma-primary)' : 'transparent', color: surface === 'dashboard' ? '#fff' : 'var(--figma-nav-item)' }}><span className="h-1.5 w-1.5 rounded-full bg-current" />Dashboard</button>
    {NAV_GROUPS.map((group) => <div key={group.label} className="w-full"><p className="mt-2 bg-white px-5 pb-0.5 pt-2 text-[10px] font-bold uppercase leading-[14px] tracking-[1.2px]" style={{ color: 'var(--figma-mint)' }}>{group.label}</p>{group.items.map(([label, target]) => { const selected = target === surface; return <button key={label} type="button" disabled={!target} onClick={() => target && setSurface(target)} className="qt-focus flex min-h-6 w-full items-center gap-2.5 border-l-[3px] px-5 py-1 text-left text-[13px] font-medium disabled:cursor-default" style={{ borderColor: selected ? 'var(--figma-primary)' : 'transparent', background: selected ? 'var(--figma-primary)' : 'transparent', color: selected ? '#fff' : 'var(--figma-nav-item)' }}><span className="h-1.5 w-1.5 rounded-full bg-current" />{label}</button>; })}</div>)}
  </aside>;
}

function Topbar() {
  return <div className="flex h-16 items-center gap-4 border-b bg-white px-6" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="hidden shrink-0 items-center gap-2 rounded-full border py-[5px] pl-2.5 pr-3 lg:flex" style={{ background: '#eef8f6', borderColor: '#84b4da' }}><span className="h-2 w-2 rounded-full" style={{ background: '#155c34' }} /><span className="text-[12px] font-medium">Mikocheni Regional Lab</span><span className="text-[12px]" style={{ color: 'var(--figma-text-tertiary)' }}>· Microbiology</span></div><div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border px-3 py-2 text-[13px]" style={{ background: 'var(--figma-canvas)', borderColor: 'var(--figma-border)', color: 'var(--figma-text-tertiary)' }}><span>⌕</span><span className="truncate">Search documents, NCs, equipment…</span></div><span className="text-[15px]" style={{ color: 'var(--figma-text-secondary)' }}>?</span><span className="rounded-md border p-1 text-[16px] leading-[18px]" style={{ background: 'var(--figma-canvas)', borderColor: 'var(--figma-border)' }}>🔔</span><div className="hidden items-center gap-2 xl:flex"><span className="grid h-7 w-7 place-items-center rounded-full border text-[11px] font-medium" style={{ background: '#f6edd6', borderColor: 'var(--figma-border-subtle)', color: '#a9832f' }}>JM</span><span className="leading-4"><strong className="block text-[12px] font-medium">Justin Mafie</strong><span className="block text-[12px]" style={{ color: 'var(--figma-text-tertiary)' }}>Quality Manager</span></span></div></div>;
}

export function QualityCommandCenter() {
  const { tr, tx } = useI18n();
  const [surface, setSurface] = useState<Surface>('dashboard');
  const hintId = useId();
  const dashboard = surface === 'dashboard';

  return (
    <Tabs.Root
      className="min-w-0"
      value={surface}
      onValueChange={(value) => {
        const next = SURFACES.find((item) => item === value);
        if (next) setSurface(next);
      }}
    >
      <div className="rounded-t-[10px] border border-[var(--qt-border-grey)] bg-white p-3 sm:p-4">
        <Tabs.List
          aria-label={tr('Explore the workspace', 'Chunguza eneo la kazi')}
          className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--qt-lab-grey)] p-1"
        >
          {SURFACES.map((item) => {
            const { icon: Icon, label } = PREVIEWS[item];
            return (
              <Tabs.Trigger
                key={item}
                value={item}
                className="qt-focus flex min-h-12 min-w-0 flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-center text-xs font-semibold leading-tight text-[var(--qt-deep-teal)] motion-safe:transition-colors hover:bg-white/70 data-[state=active]:bg-white data-[state=active]:shadow-sm sm:flex-row sm:text-sm"
              >
                <Icon size={16} aria-hidden="true" className="shrink-0" />
                {tx(label)}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
        <p className="mt-2 px-1 text-sm leading-5 text-[var(--qt-body-grey)]" aria-live="polite">
          {tx(PREVIEWS[surface].description)}
        </p>
        {!dashboard && (
          <p id={hintId} className="mt-1 px-1 text-xs text-[var(--qt-body-grey)] md:hidden">
            {tr('Scroll sideways to explore the desktop preview.', 'Sogeza kando ili kuchunguza mwonekano wa kompyuta.')}
          </p>
        )}
      </div>
      <Tabs.Content
        value={surface}
        aria-describedby={dashboard ? undefined : hintId}
        tabIndex={dashboard ? undefined : 0}
        className="qt-figma-app qt-focus overflow-x-auto rounded-b-[10px] border bg-white qt-shadow-overlay"
        style={{ ...FIGMA_TOKENS, borderColor: 'var(--figma-border-subtle)', color: 'var(--figma-text)' }}
        data-testid="application-command-center"
      >
        <div className={`${dashboard ? 'hidden md:grid' : 'grid min-w-[1040px] md:min-w-0'} min-h-[1024px] grid-cols-[16.667%_83.333%]`}>
          <Sidebar surface={surface} setSurface={setSurface} />
          <div className="min-w-0" style={{ background: 'var(--figma-canvas)' }}>
            <Topbar />
            {surface === 'dashboard' ? <Dashboard /> : surface === 'documents' ? <DocumentRegister /> : <NonConformanceRegister />}
          </div>
        </div>
        {dashboard && <div className="md:hidden"><MobileDashboard /></div>}
      </Tabs.Content>
    </Tabs.Root>
  );
}

function Dashboard() {
  return <div className="p-7 lg:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Dashboard</p><h3 className="font-figma-display mt-1 text-[28px] font-bold leading-[34px]">Quality Operations Command Center</h3><p className="mt-1 text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Mikocheni Regional Lab · Microbiology · Week of 1 Sep 2026 · ISO 15189 · SLIPTA Level 3</p></div><button type="button" className="qt-focus mt-5 shrink-0 rounded-md px-4 py-2.5 text-[14px] font-medium text-white" style={{ background: 'var(--figma-primary)' }}>＋ Log an event</button></div><div className="mt-6 grid grid-cols-5 gap-4">{KPI.map(([value, label, trend, color]) => <div key={label} className="rounded-[10px] border bg-white px-[18px] py-4 shadow-[0_4px_12px_-2px_rgba(13,23,23,.06),0_1px_3px_rgba(13,23,23,.08)]" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="h-[3px] w-9" style={{ background: color }} /><p className="font-figma-display mt-1.5 text-[30px] font-bold leading-[34px]">{value}</p><p className="mt-1 text-[13px] font-medium leading-4" style={{ color: 'var(--figma-text-secondary)' }}>{label}</p><p className="mt-1.5 text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>{trend}</p></div>)}</div><div className="mt-6 flex items-center gap-3 rounded-md border px-4 py-3" style={{ background: '#f6edd6', borderColor: '#c8a24b' }}><span style={{ color: '#a9832f' }}>◇</span><div className="flex-1"><p className="text-[13px] font-medium">Accreditation readiness — 82% ready for SLIPTA re-audit</p><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>11 of 12 checklist areas green. Competency renewals is the open area.</p></div><span className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[1.2px]" style={{ background: 'white', color: '#a9832f' }}>Future enhancement</span></div><div className="mt-6 grid grid-cols-[minmax(0,2.09fr)_minmax(230px,1fr)] gap-6"><ActionTable /><DashboardQueues /></div></div>;
}

function ActionTable() {
  return <section className="overflow-hidden rounded-[10px] border bg-white shadow-[0_4px_12px_-2px_rgba(13,23,23,.06),0_1px_3px_rgba(13,23,23,.08)]" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="flex items-center justify-between border-b px-[18px] py-[14px]" style={{ borderColor: 'var(--figma-border-subtle)' }}><h4 className="text-[16px] font-medium leading-[22px]">Requires your action</h4><button type="button" className="qt-focus text-[12px] font-medium" style={{ color: 'var(--figma-primary)' }}>View all</button></div><div className="overflow-x-auto"><table className="w-full min-w-[690px] table-fixed text-left"><thead><tr className="text-[11px] font-medium uppercase leading-4 tracking-[.6px]" style={{ background: 'var(--figma-sunken)', color: 'var(--figma-text-tertiary)' }}><th className="w-[44%] px-[18px] py-[9px]">Item</th><th className="w-[18%] px-3 py-[9px]">Type</th><th className="w-[11%] px-3 py-[9px]">Due</th><th className="w-[20%] px-3 py-[9px]">Status</th><th className="px-2 py-[9px]" /></tr></thead><tbody>{ACTIONS.map(([item, type, due, status, tone]) => <tr key={item} className="border-t text-[13px] leading-[18px]" style={{ borderColor: 'var(--figma-border-subtle)' }}><td className="truncate px-[18px] py-3">{item}</td><td className="px-3 py-3">{type}</td><td className="px-3 py-3">{due}</td><td className="px-3 py-3"><StatusChip tone={tone}>{status}</StatusChip></td><td className="px-2 py-3 text-[12px] font-medium" style={{ color: 'var(--figma-primary)' }}>Open →</td></tr>)}</tbody></table></div></section>;
}

const QUEUES = [
  ['QC runs to review', [['Chemistry panel — L1 & L2', 'AU480 · 1 Westgard flag (1-2s)', 'Warning', 'warning'], ['Haematology — 3-part diff', 'XN-550 · in control', 'In Control', 'success']]],
  ['EQA rounds in progress', [['M-2026-Q3 Microbiology', 'OneWorld · samples received', 'Testing', 'neutral'], ['C-2026-Q3 Chemistry', 'RCPA · results submitted', 'Under Review', 'info']]],
  ['Temperature charts due', [['Vaccine fridge F-02 — August', '3 readings missing · sign-off due', 'Overdue', 'critical'], ['Reagent fridge F-05 — August', 'complete · awaiting review', 'Under Review', 'warning']]],
  ['Competency renewals', [['Gram stain — 2 staff', 'expires within 30 days', 'Renewal Due', 'accent'], ['Malaria RDT — 1 staff', 'lapsed', 'Expired', 'critical']]],
] as const;

function DashboardQueues() { return <div className="space-y-5">{QUEUES.map(([title, rows]) => <section key={title} className="overflow-hidden rounded-[10px] border bg-white shadow-[0_4px_12px_-2px_rgba(13,23,23,.06),0_1px_3px_rgba(13,23,23,.08)]" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="flex items-center justify-between border-b px-[18px] py-[14px]" style={{ borderColor: 'var(--figma-border-subtle)' }}><h4 className="text-[16px] font-medium leading-[22px]">{title}</h4><span className="text-[12px] font-medium" style={{ color: 'var(--figma-primary)' }}>View all</span></div>{rows.map(([name, detail, status, tone]) => <div key={name} className="flex items-center gap-2.5 border-b px-[18px] py-[11px] last:border-b-0" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium leading-4">{name}</p><p className="truncate text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>{detail}</p></div><StatusChip tone={tone}>{status}</StatusChip></div>)}</section>)}</div>; }

function SummaryCards({ items }: { items: readonly (readonly [string, string])[] }) { return <div className="mt-6 grid grid-cols-5 gap-4">{items.map(([value, label]) => <div key={label} className="rounded-[10px] border bg-white px-4 py-3.5" style={{ borderColor: 'var(--figma-border-subtle)' }}><p className="font-figma-display text-[24px] font-bold leading-7">{value}</p><p className="mt-1 text-[12px] leading-4" style={{ color: 'var(--figma-text-secondary)' }}>{label}</p></div>)}</div>; }

function DocumentRegister() {
  const summary = [['214', 'Controlled documents'], ['6', 'Due for review ≤30d'], ['3', 'Under review'], ['2', 'Under approval'], ['18', 'Awaiting your acknowledgment']] as const;
  return <div className="p-7 lg:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Documents / Controlled Document Register</p><h3 className="font-figma-display mt-1 text-[28px] font-bold leading-[34px]">Controlled Document Register</h3></div><div className="flex gap-2"><button type="button" className="qt-focus rounded-md px-4 py-2.5 text-[14px] font-medium text-white" style={{ background: 'var(--figma-primary)' }}>＋ Create document</button><button type="button" className="qt-focus rounded-md border bg-white px-4 py-2.5 text-[14px] font-medium" style={{ borderColor: 'var(--figma-border)' }}>Export</button></div></div><SummaryCards items={summary} /><div className="mt-6 flex gap-2"><div className="min-w-0 flex-1 rounded-md border bg-white px-3 py-2 text-[13px]" style={{ borderColor: 'var(--figma-border)', color: 'var(--figma-text-tertiary)' }}>⌕ &nbsp; Search documents…</div>{['Type: All', 'Department: All', 'Status: All', 'Effective date', '⚙ Columns'].map((item) => <button key={item} type="button" className="qt-focus shrink-0 rounded-md border bg-white px-3 py-2 text-[12px]" style={{ borderColor: 'var(--figma-border)' }}>{item}{item.includes('All') ? ' ▾' : ''}</button>)}</div><div className="mt-6 overflow-hidden rounded-[10px] border bg-white" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="overflow-x-auto"><table className="w-full min-w-[930px] text-left"><thead><tr className="text-[11px] font-medium uppercase leading-4 tracking-[.6px]" style={{ background: 'var(--figma-sunken)', color: 'var(--figma-text-tertiary)' }}>{['Code', 'Title', 'Type', 'Ver', 'Owner', 'Dept', 'Effective', 'Review due', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{DOCUMENTS.map((row) => <tr key={row[0]} className="border-t text-[13px] leading-[18px]" style={{ borderColor: 'var(--figma-border-subtle)' }}>{row.slice(0, 8).map((cell, i) => <td key={i} className={`px-3 py-3 ${i === 1 ? 'min-w-[190px]' : 'whitespace-nowrap'}`}>{cell}</td>)}<td className="px-3 py-3"><StatusChip tone={row[9]}>{row[8]}</StatusChip></td></tr>)}</tbody></table></div></div><Pagination /><Traceability lines={['module: documents', 'route: /documents/list/', 'template: templates/documents/list.html', 'view: views.document_list', 'permission: document_list', 'status: Existing functionality']} /></div>;
}

function Pagination() { return <div className="mt-6 flex gap-1.5">{['‹', '1', '2', '3', '…', '12', '›'].map((item) => <button key={item} type="button" className="qt-focus grid h-[30px] w-[30px] place-items-center rounded border text-[12px] font-medium" style={{ borderColor: 'var(--figma-border)', background: item === '2' ? 'var(--figma-primary)' : '#fff', color: item === '2' ? '#fff' : 'var(--figma-text-secondary)' }}>{item}</button>)}</div>; }

function NonConformanceRegister() {
  const summary = [['8', 'Open'], ['3', 'Overdue closure'], ['2', 'In Review 2'], ['19', 'Closed this quarter'], ['6.4d', 'Avg. days to close']] as const;
  return <div className="p-7 lg:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Quality / Non-Conformance</p><h3 className="font-figma-display mt-1 text-[28px] font-bold leading-[34px]">Non-Conformance Register</h3></div><div className="flex gap-2"><button type="button" className="qt-focus rounded-md px-4 py-2.5 text-[14px] font-medium text-white" style={{ background: 'var(--figma-primary)' }}>＋ Register NC</button><button type="button" className="qt-focus rounded-md border bg-white px-4 py-2.5 text-[14px] font-medium" style={{ borderColor: 'var(--figma-border)' }}>Export</button></div></div><SummaryCards items={summary} /><div className="mt-6 overflow-hidden rounded-[10px] border bg-white" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="overflow-x-auto"><table className="w-full min-w-[910px] text-left"><thead><tr className="text-[11px] font-medium uppercase leading-4 tracking-[.6px]" style={{ background: 'var(--figma-sunken)', color: 'var(--figma-text-tertiary)' }}>{['NC ID', 'Description', 'Source', 'Severity', 'Owner', 'Raised', 'Due', 'Stage', ''].map((h, i) => <th key={`${h}-${i}`} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{NONCONFORMANCES.map((row) => <tr key={row[0]} className="border-t text-[13px] leading-[18px]" style={{ borderColor: 'var(--figma-border-subtle)' }}><td className="whitespace-nowrap px-3 py-3">{row[0]}</td><td className="min-w-[260px] px-3 py-3">{row[1]}</td><td className="whitespace-nowrap px-3 py-3">{row[2]}</td><td className="px-3 py-3"><span className="rounded px-1.5 py-1 text-[11px] font-medium" style={{ background: row[3] === 'P0' ? '#fadede' : row[3] === 'P1' ? '#fbeed6' : '#deebf6', color: row[3] === 'P0' ? '#992121' : row[3] === 'P1' ? '#8f5e14' : '#124f80' }}>{row[3]}</span></td><td className="whitespace-nowrap px-3 py-3">{row[4]}</td><td className="whitespace-nowrap px-3 py-3">{row[5]}</td><td className="whitespace-nowrap px-3 py-3">{row[6]}</td><td className="px-3 py-3"><StatusChip tone={row[8]}>{row[7]}</StatusChip></td><td className="px-3 py-3 text-[12px] font-medium" style={{ color: 'var(--figma-primary)' }}>Open</td></tr>)}</tbody></table></div></div><Traceability lines={['module: non_conformance', 'route: /non-conformance/register/', 'template: templates/non_conformance/register_list.html', 'view: views.nc_register_list', 'permission: nc_register', 'status: Existing functionality']} /></div>;
}

function Traceability({ lines }: { lines: string[] }) { return <div className="mt-6 rounded-md border px-3.5 py-2.5" style={{ background: 'var(--figma-sunken)', borderColor: 'var(--figma-border-subtle)' }}><p className="text-[10px] font-bold uppercase leading-[14px] tracking-[1.2px]" style={{ color: 'var(--figma-text-tertiary)' }}>Engineering traceability</p>{lines.map((line) => <p key={line} className="font-mono-ui text-[13px] leading-[18px]" style={{ color: 'var(--figma-text-secondary)' }}>{line}</p>)}</div>; }

const MOBILE_ACTIONS = [['SOP-QC-014 — QC review', 'Doc · due today', 'Under Review', 'warning'], ['NC-2026-041 — contamination', 'NC · due 2 Sep', 'Review 2', 'critical'], ['Centrifuge C-07 maintenance', 'Equip · 3 Sep', 'Scheduled', 'info'], ['POL-BIO-002 — acknowledge', 'Doc · 6 Sep', 'Ack. req.', 'accent']] as const;

function MobileDashboard() {
  return <div className="flex min-h-[844px] flex-col bg-white"><div className="flex items-center gap-2.5 px-4 py-[14px] text-white" style={{ background: 'var(--figma-nav)' }}><img src={mobileSymbol} width="14" height="16" alt="" /><span className="flex-1 text-[13px] font-medium">QualiTracker</span><span className="text-[13px]" style={{ color: 'var(--figma-nav-item)' }}>☰</span></div><div className="flex-1 px-4 pb-6 pt-4"><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Wednesday, 1 Sep</p><h3 className="font-figma-display mt-[14px] text-[22px] font-bold leading-7 tracking-[.2px]">Requires your action</h3><div className="mt-[14px] grid grid-cols-3 gap-2.5">{[['12', 'My reviews', '#036173'], ['8', 'Open NCs', '#992121'], ['4', 'Reagents', '#c8a24b']].map(([value, label, color]) => <div key={label} className="rounded-[10px] border px-3 py-2.5" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="h-[3px] w-[22px]" style={{ background: color }} /><p className="font-figma-display mt-0.5 text-[20px] font-bold leading-6">{value}</p><p className="text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>{label}</p></div>)}</div><div className="mt-[14px] overflow-hidden rounded-[10px] border" style={{ borderColor: 'var(--figma-border-subtle)' }}>{MOBILE_ACTIONS.map(([title, detail, status, tone]) => <div key={title} className="border-b px-[14px] py-3 last:border-b-0" style={{ borderColor: 'var(--figma-border-subtle)' }}><div className="flex items-center gap-2"><p className="min-w-0 flex-1 text-[13px] font-medium leading-4">{title}</p><StatusChip tone={tone}>{status}</StatusChip></div><p className="mt-1 text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>{detail}</p></div>)}</div><p className="mt-[14px] text-[12px] leading-4" style={{ color: 'var(--figma-text-tertiary)' }}>Desktop KPI row + 2-column layout collapses to a stacked list. Nav rail → hamburger + bottom tab bar.</p></div><div className="grid grid-cols-5 border-t px-2 pb-2.5 pt-2" style={{ borderColor: 'var(--figma-border-subtle)' }}>{['Home', 'Tasks', 'Scan', 'Alerts', 'More'].map((item) => <div key={item} className="flex flex-col items-center gap-0.5 text-[12px] leading-4" style={{ color: item === 'Tasks' ? 'var(--figma-primary)' : 'var(--figma-text-tertiary)' }}><span className="h-1.5 w-1.5 rounded-full bg-current" />{item}</div>)}</div></div>;
}
