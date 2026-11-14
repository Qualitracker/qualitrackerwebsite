import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FlaskConical,
  LayoutDashboard,
  PackageOpen,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { L, type Text, useI18n } from '@/lib/i18n';

type Surface = 'dashboard' | 'documents' | 'nonconformance';

const SURFACES: Array<{ id: Surface; label: Text; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: L('Command center', 'Kituo cha amri'), icon: LayoutDashboard },
  { id: 'documents', label: L('Documents', 'Nyaraka'), icon: FileText },
  { id: 'nonconformance', label: L('Non-conformance', 'Kutokidhi kiwango'), icon: AlertTriangle },
];

const DASHBOARD_STATS = [
  { value: '12', label: L('Pending my review', 'Zinasubiri mapitio yangu'), detail: L('3 due today', '3 zinatakiwa leo'), icon: ClipboardCheck },
  { value: '5', label: L('Approvals awaiting', 'Idhini zinasubiri'), detail: L('2 due within 48h', '2 ndani ya saa 48'), icon: CheckCircle2 },
  { value: '8', label: L('Open non-conformances', 'Kutokidhi kiwango kuliko wazi'), detail: L('3 past due', '3 zimepitwa na muda'), icon: AlertTriangle },
  { value: '6', label: L('Equipment tasks due', 'Kazi za vifaa zinatakiwa'), detail: L('2 calibration checks', 'Ukaguzi 2 wa urekebishaji'), icon: Wrench },
  { value: '4', label: L('Reagent lots near expiry', 'Vitendanishi karibu kuisha'), detail: L('1 expires this week', '1 linaisha wiki hii'), icon: PackageOpen },
] as const;

const TASKS = [
  { id: 'CAPA-014', task: L('Reagent storage deviation', 'Mkengeuko wa uhifadhi wa vitendanishi'), type: L('CAPA review', 'Mapitio ya CAPA'), due: L('Today', 'Leo'), status: L('Under review', 'Inapitiwa'), tone: 'warning' },
  { id: 'SOP-QMS-04', task: L('Document control procedure', 'Utaratibu wa udhibiti wa nyaraka'), type: L('Document approval', 'Idhini ya hati'), due: L('Tomorrow', 'Kesho'), status: L('Needs approval', 'Inahitaji idhini'), tone: 'warning' },
  { id: 'NC-2026-041', task: L('Missed incubator temperature check', 'Ukaguzi wa joto la incubator uliokosekana'), type: L('Review 1', 'Mapitio ya 1'), due: L('2 days', 'Siku 2'), status: L('Major', 'Kubwa'), tone: 'error' },
  { id: 'EQA-MIC-02', task: L('Microbiology EQA submission', 'Uwasilishaji wa EQA wa mikrobiolojia'), type: L('EQA round', 'Mzunguko wa EQA'), due: L('3 days', 'Siku 3'), status: L('Scheduled', 'Imepangwa'), tone: 'neutral' },
  { id: 'TRN-009', task: L('Internal audit refresher', 'Mafunzo ya ukumbusho wa ukaguzi wa ndani'), type: L('Competency', 'Umahiri'), due: L('5 days', 'Siku 5'), status: L('Training', 'Mafunzo'), tone: 'success' },
] as const;

const DOCUMENTS = [
  { id: 'SOP-QMS-04', title: L('Document control procedure', 'Utaratibu wa udhibiti wa nyaraka'), owner: L('Quality office', 'Ofisi ya ubora'), version: 'v4', status: L('Under approval', 'Inasubiri idhini') },
  { id: 'SOP-MIC-17', title: L('Freezer monitoring', 'Ufuatiliaji wa friza'), owner: L('Microbiology', 'Mikrobiolojia'), version: 'v3', status: L('Approved', 'Imeidhinishwa') },
  { id: 'POL-QMS-02', title: L('Internal audit policy', 'Sera ya ukaguzi wa ndani'), owner: L('Quality office', 'Ofisi ya ubora'), version: 'v2', status: L('Under review', 'Inapitiwa') },
  { id: 'WI-EQP-08', title: L('Centrifuge calibration', 'Urekebishaji wa centrifuge'), owner: L('Equipment', 'Vifaa'), version: 'v1', status: L('Pending collaboration', 'Inasubiri ushirikiano') },
] as const;

const NONCONFORMANCES = [
  { id: 'NC-2026-041', title: L('Missed incubator temperature check', 'Ukaguzi wa joto la incubator uliokosekana'), classification: L('Major', 'Kubwa'), stage: L('Pending review 1', 'Inasubiri mapitio ya 1'), owner: L('Microbiology', 'Mikrobiolojia') },
  { id: 'NC-2026-039', title: L('Reagent label mismatch', 'Kutolingana kwa lebo ya kitendanishi'), classification: L('Minor', 'Ndogo'), stage: L('Pending review 2', 'Inasubiri mapitio ya 2'), owner: L('Haematology', 'Hematolojia') },
  { id: 'NC-2026-036', title: L('Calibration record gap', 'Pengo katika rekodi ya urekebishaji'), classification: L('Major', 'Kubwa'), stage: L('Pending closure', 'Inasubiri kufungwa'), owner: L('Equipment', 'Vifaa') },
] as const;

const DOCUMENT_SUMMARY: Array<[Text, string]> = [
  [L('Draft', 'Rasimu'), '6'],
  [L('Pending collaboration', 'Inasubiri ushirikiano'), '4'],
  [L('Under review', 'Inapitiwa'), '8'],
  [L('Approved', 'Imeidhinishwa'), '43'],
];

function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  const styles = tone === 'error'
    ? { background: '#FDECEC', color: 'var(--qt-error)' }
    : tone === 'warning'
      ? { background: '#FFF7DD', color: '#7A5B00' }
      : tone === 'success'
        ? { background: '#EAF7EE', color: '#196B36' }
        : { background: 'var(--qt-lab-grey)', color: 'var(--qt-body-grey)' };
  return <span className="inline-flex rounded-full px-2 py-1 font-mono-ui text-[8px] font-bold uppercase tracking-[.04em]" style={styles}>{children}</span>;
}

export function QualityCommandCenter() {
  const { tr, tx } = useI18n();
  const [surface, setSurface] = useState<Surface>('dashboard');
  const [selectedTask, setSelectedTask] = useState<string>(TASKS[0].id);
  const [documentFilter, setDocumentFilter] = useState<'all' | 'review' | 'approved'>('all');
  const [selectedNc, setSelectedNc] = useState<string>(NONCONFORMANCES[0].id);
  const activeTask = TASKS.find((task) => task.id === selectedTask) ?? TASKS[0];
  const activeNc = NONCONFORMANCES.find((item) => item.id === selectedNc) ?? NONCONFORMANCES[0];
  const visibleDocuments = DOCUMENTS.filter((document) => documentFilter === 'all' || (documentFilter === 'approved' ? document.status.en === 'Approved' : document.status.en !== 'Approved'));

  return (
    <div className="overflow-hidden rounded-xl border bg-white qt-shadow-overlay" style={{ borderColor: 'var(--qt-border-grey)' }} data-testid="application-command-center">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <div role="tablist" aria-label={tr('Application screen', 'Skrini ya programu')} className="flex flex-wrap gap-1.5">
          {SURFACES.map((item) => {
            const Icon = item.icon;
            const selected = surface === item.id;
            return <button key={item.id} role="tab" type="button" aria-selected={selected} onClick={() => setSurface(item.id)} className="qt-focus flex min-h-9 items-center gap-2 rounded-md border px-3 text-[10px] font-bold" style={{ borderColor: selected ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)', background: selected ? 'var(--qt-deep-teal)' : '#FFFFFF', color: selected ? '#FFFFFF' : 'var(--qt-near-black)' }}><Icon size={13} />{tx(item.label)}</button>;
          })}
        </div>
        <span className="font-mono-ui text-[8px] uppercase tracking-[.08em]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Figma-aligned · Illustrative data', 'Kulingana na Figma · Data ya mfano')}</span>
      </div>

      <div className="grid min-h-[590px] lg:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="hidden flex-col p-3 lg:flex" style={{ background: '#063E47', color: '#FFFFFF' }} aria-label={tr('Application navigation', 'Urambazaji wa programu')}>
          <div className="flex items-center gap-2 border-b px-2 pb-4" style={{ borderColor: 'rgba(255,255,255,.16)' }}><span className="grid h-7 w-7 place-items-center rounded-md" style={{ background: 'var(--qt-light-teal)', color: '#063E47' }}><ShieldCheck size={16} /></span><div><p className="font-brand text-xs font-bold">QualiTracker</p><p className="font-mono-ui text-[7px] uppercase tracking-[.08em]" style={{ color: 'rgba(255,255,255,.65)' }}>eQMS</p></div></div>
          <nav className="mt-4 space-y-1">{SURFACES.map((item) => { const Icon = item.icon; const selected = surface === item.id; return <button key={item.id} type="button" onClick={() => setSurface(item.id)} className="qt-focus flex w-full min-h-9 items-center gap-2 rounded-md px-2 text-left text-[10px] font-semibold" style={{ background: selected ? 'rgba(95,191,193,.18)' : 'transparent', color: selected ? '#FFFFFF' : 'rgba(255,255,255,.72)' }}><Icon size={13} />{tx(item.label)}</button>; })}</nav>
          <div className="mt-4 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,.16)' }}><p className="px-2 font-mono-ui text-[7px] uppercase tracking-[.1em]" style={{ color: 'rgba(255,255,255,.48)' }}>{tr('Quality modules', 'Moduli za ubora')}</p>{[L('QC review', 'Mapitio ya QC'), L('Reagents', 'Vitendanishi'), L('Equipment', 'Vifaa'), L('Audits', 'Ukaguzi')].map((label) => <div key={label.en} className="mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-[9px]" style={{ color: 'rgba(255,255,255,.62)' }}><FlaskConical size={11} />{tx(label)}</div>)}</div>
          <div className="mt-auto flex items-center gap-2 border-t px-2 pt-4 text-[9px]" style={{ borderColor: 'rgba(255,255,255,.16)' }}><Settings size={12} />{tr('Standards & settings', 'Viwango na mipangilio')}</div>
        </aside>

        <div className="min-w-0" style={{ background: '#F7F8F8' }}>
          <div className="flex min-h-12 items-center gap-3 border-b bg-white px-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
            <button type="button" className="qt-focus hidden min-h-8 rounded-md border px-2 text-[9px] font-semibold sm:block" style={{ borderColor: 'var(--qt-border-grey)' }}>{tr('Demo reference lab', 'Maabara ya marejeo ya mfano')}</button>
            <label className="relative min-w-0 flex-1"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2" size={12} style={{ color: 'var(--qt-body-grey)' }} /><span className="sr-only">{tr('Search the application', 'Tafuta katika programu')}</span><input className="qt-focus h-8 w-full rounded-md border bg-white pl-8 pr-3 text-[9px]" style={{ borderColor: 'var(--qt-border-grey)' }} placeholder={tr('Search documents, NCs, equipment…', 'Tafuta nyaraka, NC, vifaa…')} /></label>
            <button type="button" className="qt-focus relative grid h-8 w-8 place-items-center rounded-md" aria-label={tr('Notifications', 'Arifa')}><Bell size={13} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full" style={{ background: 'var(--qt-error)' }} /></button>
            <div className="hidden text-right sm:block"><p className="text-[9px] font-bold">{tr('Demo user', 'Mtumiaji wa mfano')}</p><p className="text-[7px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Quality manager', 'Meneja wa ubora')}</p></div>
          </div>

          {surface === 'dashboard' && <DashboardScreen selectedTask={selectedTask} setSelectedTask={setSelectedTask} activeTask={activeTask} />}
          {surface === 'documents' && <DocumentsScreen filter={documentFilter} setFilter={setDocumentFilter} documents={visibleDocuments} />}
          {surface === 'nonconformance' && <NonConformanceScreen selectedNc={selectedNc} setSelectedNc={setSelectedNc} activeNc={activeNc} />}
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ selectedTask, setSelectedTask, activeTask }: { selectedTask: string; setSelectedTask: (id: string) => void; activeTask: (typeof TASKS)[number] }) {
  const { tr, tx } = useI18n();
  return <div className="p-4 sm:p-5" aria-live="polite">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="qt-technical-label">{tr('Dashboard', 'Dashibodi')}</p><h3 className="mt-1 font-brand text-lg font-bold">{tr('Quality Operations Command Center', 'Kituo cha Amri cha Uendeshaji wa Ubora')}</h3><p className="mt-1 text-[9px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Microbiology · Week of 5 Oct 2026', 'Mikrobiolojia · Wiki ya 5 Okt 2026')}</p></div><StatusPill tone="success">{tr('Lab view active', 'Mwonekano wa maabara unatumika')}</StatusPill></div>
    <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-5">{DASHBOARD_STATS.map((stat, index) => { const Icon = stat.icon; return <button key={stat.label.en} type="button" onClick={() => setSelectedTask(TASKS[index].id)} className="qt-focus rounded-lg border bg-white p-3 text-left" style={{ borderColor: 'var(--qt-border-grey)' }}><div className="flex items-start justify-between gap-2"><span className="font-brand text-xl font-bold">{stat.value}</span><Icon size={14} style={{ color: 'var(--qt-deep-teal)' }} /></div><p className="mt-2 text-[9px] font-semibold leading-4">{tx(stat.label)}</p><p className="mt-1 text-[8px]" style={{ color: 'var(--qt-body-grey)' }}>{tx(stat.detail)}</p></button>; })}</div>
    <div className="mt-3 flex items-center gap-3 rounded-md border px-3 py-2.5" style={{ borderColor: '#E6D49A', background: '#FFF9E8' }}><ShieldCheck size={15} style={{ color: 'var(--qt-gold-text)' }} /><div className="min-w-0 flex-1"><p className="text-[9px] font-bold">{tr('Accreditation readiness · 41% ready for audit', 'Utayari wa ithibati · 41% tayari kwa ukaguzi')}</p><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-[41%]" style={{ background: 'var(--qt-quality-gold)' }} /></div></div><ChevronRight size={13} /></div>
    <div className="mt-4 grid gap-3 xl:grid-cols-[1.5fr_.75fr]">
      <div className="overflow-hidden rounded-lg border bg-white" style={{ borderColor: 'var(--qt-border-grey)' }}><div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: 'var(--qt-border-grey)' }}><p className="text-[10px] font-bold">{tr('Requires your action', 'Inahitaji hatua yako')}</p><span className="text-[8px]" style={{ color: 'var(--qt-deep-teal)' }}>{tr('View all', 'Ona zote')}</span></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left"><thead><tr className="font-mono-ui text-[7px] uppercase tracking-[.06em]" style={{ color: 'var(--qt-body-grey)' }}><th className="px-3 py-2">{tr('Item', 'Kipengee')}</th><th className="px-3 py-2">{tr('Type', 'Aina')}</th><th className="px-3 py-2">{tr('Due', 'Mwisho')}</th><th className="px-3 py-2">{tr('Status', 'Hali')}</th></tr></thead><tbody>{TASKS.map((task) => <tr key={task.id} onClick={() => setSelectedTask(task.id)} className="cursor-pointer border-t text-[8px]" style={{ borderColor: 'var(--qt-border-grey)', background: selectedTask === task.id ? 'var(--qt-teal-tint)' : '#FFFFFF' }}><td className="px-3 py-2.5"><span className="font-mono-ui font-bold" style={{ color: 'var(--qt-deep-teal)' }}>{task.id}</span><span className="ml-2">{tx(task.task)}</span></td><td className="px-3 py-2.5">{tx(task.type)}</td><td className="px-3 py-2.5">{tx(task.due)}</td><td className="px-3 py-2.5"><StatusPill tone={task.tone}>{tx(task.status)}</StatusPill></td></tr>)}</tbody></table></div></div>
      <div className="space-y-3"><div className="rounded-lg border bg-white p-3" style={{ borderColor: 'var(--qt-border-grey)' }}><div className="flex items-center justify-between"><p className="text-[10px] font-bold">{tr('Selected action', 'Hatua iliyochaguliwa')}</p><ClipboardCheck size={13} style={{ color: 'var(--qt-deep-teal)' }} /></div><p className="mt-3 font-mono-ui text-[9px] font-bold" style={{ color: 'var(--qt-deep-teal)' }}>{activeTask.id}</p><p className="mt-1 text-[10px] font-semibold leading-4">{tx(activeTask.task)}</p><p className="mt-2 text-[8px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>{tr('Review its evidence, owner, due date, and complete audit trail.', 'Pitia ushahidi, mmiliki, tarehe ya mwisho, na historia kamili ya ukaguzi.')}</p></div>{[L('QC runs to review', 'Vipimo vya QC vya kupitia'), L('EQA rounds in progress', 'Mizunguko ya EQA inayoendelea'), L('Competency renewals', 'Upyaji wa umahiri')].map((label, i) => <button key={label.en} type="button" className="qt-focus flex w-full items-center justify-between rounded-lg border bg-white p-3 text-left" style={{ borderColor: 'var(--qt-border-grey)' }}><span className="text-[9px] font-semibold">{tx(label)}</span><StatusPill tone={i === 0 ? 'warning' : i === 1 ? 'success' : 'error'}>{[6, 3, 2][i]}</StatusPill></button>)}</div>
    </div>
  </div>;
}

function DocumentsScreen({ filter, setFilter, documents }: { filter: 'all' | 'review' | 'approved'; setFilter: (filter: 'all' | 'review' | 'approved') => void; documents: typeof DOCUMENTS[number][] }) {
  const { tr, tx } = useI18n();
  return <div className="p-4 sm:p-5" aria-live="polite"><p className="qt-technical-label">{tr('Document control', 'Udhibiti wa nyaraka')}</p><h3 className="mt-1 font-brand text-lg font-bold">{tr('Controlled documents', 'Nyaraka zinazodhibitiwa')}</h3><p className="mt-1 text-[9px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Draft, collaborate, review, approve, and retain every version.', 'Andaa, shirikiana, pitia, idhinisha, na hifadhi kila toleo.')}</p><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{DOCUMENT_SUMMARY.map(([label, value]) => <div key={label.en} className="rounded-lg border bg-white p-3" style={{ borderColor: 'var(--qt-border-grey)' }}><p className="font-brand text-xl font-bold">{value}</p><p className="mt-1 text-[8px]" style={{ color: 'var(--qt-body-grey)' }}>{tx(label)}</p></div>)}</div><div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={tr('Document filter', 'Kichujio cha nyaraka')}>{(['all', 'review', 'approved'] as const).map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className="qt-focus min-h-8 rounded-md border px-3 text-[9px] font-semibold" style={{ borderColor: filter === item ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)', background: filter === item ? 'var(--qt-teal-tint)' : '#FFFFFF' }}>{item === 'all' ? tr('All documents', 'Nyaraka zote') : item === 'review' ? tr('Needs attention', 'Inahitaji hatua') : tr('Approved', 'Imeidhinishwa')}</button>)}</div><div className="mt-3 overflow-hidden rounded-lg border bg-white" style={{ borderColor: 'var(--qt-border-grey)' }}><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead><tr className="font-mono-ui text-[7px] uppercase" style={{ color: 'var(--qt-body-grey)' }}><th className="px-4 py-3">ID</th><th className="px-4 py-3">{tr('Document', 'Hati')}</th><th className="px-4 py-3">{tr('Owner', 'Mmiliki')}</th><th className="px-4 py-3">{tr('Version', 'Toleo')}</th><th className="px-4 py-3">{tr('Status', 'Hali')}</th></tr></thead><tbody>{documents.map((document) => <tr key={document.id} className="border-t text-[9px]" style={{ borderColor: 'var(--qt-border-grey)' }}><td className="px-4 py-3 font-mono-ui font-bold" style={{ color: 'var(--qt-deep-teal)' }}>{document.id}</td><td className="px-4 py-3 font-semibold">{tx(document.title)}</td><td className="px-4 py-3">{tx(document.owner)}</td><td className="px-4 py-3 font-mono-ui">{document.version}</td><td className="px-4 py-3"><StatusPill tone={document.status.en === 'Approved' ? 'success' : 'warning'}>{tx(document.status)}</StatusPill></td></tr>)}</tbody></table></div></div></div>;
}

function NonConformanceScreen({ selectedNc, setSelectedNc, activeNc }: { selectedNc: string; setSelectedNc: (id: string) => void; activeNc: typeof NONCONFORMANCES[number] }) {
  const { tr, tx } = useI18n();
  return <div className="p-4 sm:p-5" aria-live="polite"><p className="qt-technical-label">{tr('Corrective action lifecycle', 'Mzunguko wa hatua za marekebisho')}</p><h3 className="mt-1 font-brand text-lg font-bold">{tr('Non-conformances & CAPA', 'Kutokidhi kiwango na CAPA')}</h3><p className="mt-1 text-[9px]" style={{ color: 'var(--qt-body-grey)' }}>{tr('Every finding is classified, assigned, independently reviewed, and tracked to closure.', 'Kila tatizo linaainishwa, linakabidhiwa, linapitiwa kwa uhuru, na kufuatiliwa hadi kufungwa.')}</p><div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_.8fr]"><div className="overflow-hidden rounded-lg border bg-white" style={{ borderColor: 'var(--qt-border-grey)' }}>{NONCONFORMANCES.map((item) => <button key={item.id} type="button" onClick={() => setSelectedNc(item.id)} className="qt-focus flex w-full items-center gap-3 border-b p-3 text-left last:border-b-0" style={{ borderColor: 'var(--qt-border-grey)', background: selectedNc === item.id ? 'var(--qt-teal-tint)' : '#FFFFFF' }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: item.classification.en === 'Major' ? '#FDECEC' : '#FFF7DD', color: item.classification.en === 'Major' ? 'var(--qt-error)' : '#7A5B00' }}><AlertTriangle size={14} /></span><span className="min-w-0 flex-1"><span className="block font-mono-ui text-[8px] font-bold" style={{ color: 'var(--qt-deep-teal)' }}>{item.id}</span><span className="mt-1 block truncate text-[9px] font-semibold">{tx(item.title)}</span><span className="mt-1 block text-[8px]" style={{ color: 'var(--qt-body-grey)' }}>{tx(item.owner)} · {tx(item.stage)}</span></span><ChevronRight size={13} /></button>)}</div><div className="rounded-lg border bg-white p-4" style={{ borderColor: 'var(--qt-border-grey)' }}><div className="flex items-center justify-between"><p className="font-mono-ui text-[9px] font-bold" style={{ color: 'var(--qt-deep-teal)' }}>{activeNc.id}</p><StatusPill tone={activeNc.classification.en === 'Major' ? 'error' : 'warning'}>{tx(activeNc.classification)}</StatusPill></div><h4 className="mt-3 font-brand text-sm font-bold">{tx(activeNc.title)}</h4><dl className="mt-4 space-y-3 text-[9px]"><div><dt className="qt-technical-label">{tr('Current stage', 'Hatua ya sasa')}</dt><dd className="mt-1 font-semibold">{tx(activeNc.stage)}</dd></div><div><dt className="qt-technical-label">{tr('Responsible team', 'Timu inayohusika')}</dt><dd className="mt-1 font-semibold">{tx(activeNc.owner)}</dd></div></dl><div className="mt-5 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: 'var(--qt-deep-teal)' }} /><div className="h-px flex-1" style={{ background: 'var(--qt-border-grey)' }} /><span className="h-2 w-2 rounded-full" style={{ background: 'var(--qt-quality-gold)' }} /><div className="h-px flex-1" style={{ background: 'var(--qt-border-grey)' }} /><span className="h-2 w-2 rounded-full" style={{ background: 'var(--qt-border-grey)' }} /></div><p className="mt-3 text-[8px] leading-4" style={{ color: 'var(--qt-body-grey)' }}>{tr('Evidence and reviewer decisions remain attached to the record through closure.', 'Ushahidi na maamuzi ya wakaguzi hubaki kwenye rekodi hadi kufungwa.')}</p></div></div></div>;
}
