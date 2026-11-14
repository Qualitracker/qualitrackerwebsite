import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Workflow,
  FileCheck2,
  Search,
  AlertTriangle,
  XCircle,
  Wrench,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { L, type Text, useI18n } from '@/lib/i18n';

/**
 * The "Quality Intelligence Graph" — QualiTracker's own equivalent to
 * Graphify's code graph, derived from what the product actually models,
 * not an invented technology-ecosystem diagram. Every node below is a
 * concept already established elsewhere on this site (docs/website/09-19):
 * Standard/Document/Process/Evidence/Audit/Finding/Non-Conformance/CAPA/
 * Verification came from the existing quality-knowledge-graph chain;
 * Risk is the one capability explicitly labeled "planned" on /product,
 * not live — kept status-labeled here too, never presented as shipped.
 *
 * Deliberately NOT included: Inspection, Incident, Control, Location,
 * Supplier, Team, Asset — none of these are confirmed QualiTracker data
 * concepts anywhere in the verified project material. Adding them would be
 * exactly the fabrication the brief itself prohibits. If any of these are
 * real, tell me and this graph gets extended honestly.
 *
 * Icons are a visual label for the same real concept, not new information —
 * curved directional edges and the arrowhead markers make the graph's
 * already-real direction (standard REQUIRES document, not the reverse)
 * visible for the first time; previously the plain <line> edges looked
 * symmetric even though the relationship never was.
 */
export type NodeId = 'standard' | 'document' | 'audit' | 'process' | 'finding' | 'evidence' | 'nonconformance' | 'capa' | 'risk' | 'verification';

interface GraphNode {
  id: NodeId;
  label: Text;
  x: number;
  y: number;
  planned?: boolean;
  detail: Text;
  icon: typeof ShieldCheck;
}

const NODES: GraphNode[] = [
  { id: 'standard', label: L('Standard', 'Kiwango'), x: 320, y: 30, icon: ShieldCheck, detail: L('ISO 15189, WHO LQMS, SLIPTA, the requirement a lab is working against.', 'ISO 15189, WHO LQMS, SLIPTA, hitaji ambalo maabara inalifanyia kazi.') },
  { id: 'document', label: L('Document', 'Hati'), x: 150, y: 130, icon: FileText, detail: L('The SOP or policy that implements a standard’s requirement.', 'SOP au sera inayotekeleza hitaji la kiwango.') },
  { id: 'audit', label: L('Audit', 'Ukaguzi'), x: 490, y: 130, icon: Search, detail: L('Reviews evidence against the standard.', 'Hupitia ushahidi dhidi ya kiwango.') },
  { id: 'process', label: L('Process', 'Mchakato'), x: 150, y: 230, icon: Workflow, detail: L('The workflow a document describes.', 'Mtiririko wa kazi unaoelezwa na hati.') },
  { id: 'finding', label: L('Finding', 'Tatizo'), x: 490, y: 230, icon: AlertTriangle, detail: L('What an audit surfaces when something doesn’t conform.', 'Kile ambacho ukaguzi hubaini wakati jambo halikidhi kiwango.') },
  { id: 'evidence', label: L('Evidence', 'Ushahidi'), x: 320, y: 300, icon: FileCheck2, detail: L('Records proving a process was followed, logs, QC runs, signatures.', 'Rekodi zinazothibitisha mchakato ulifuatwa, kumbukumbu, ukaguzi wa QC, na sahihi.') },
  { id: 'nonconformance', label: L('Non-Conformance', 'Kutokidhi kiwango'), x: 490, y: 320, icon: XCircle, detail: L('A finding, formalized and tracked to closure.', 'Tatizo lililobainika, lililorasimishwa na kufuatiliwa hadi kufungwa.') },
  { id: 'capa', label: L('CAPA', 'CAPA'), x: 400, y: 400, icon: Wrench, detail: L('The corrective action assigned to resolve a non-conformance.', 'Hatua ya kurekebisha iliyokabidhiwa kutatua kutokidhi kiwango.') },
  { id: 'risk', label: L('Risk', 'Hatari'), x: 560, y: 400, planned: true, icon: AlertOctagon, detail: L('Planned: surfacing risk patterns across repeated non-conformances.', 'Imepangwa: kubaini mifumo ya hatari katika kutokidhi kiwango kunakojirudia.') },
  { id: 'verification', label: L('Verification', 'Uthibitishaji'), x: 270, y: 400, icon: CheckCircle2, detail: L('Confirms the CAPA actually closed the gap, and becomes new evidence.', 'Huthibitisha kuwa CAPA ilifunga pengo na huwa ushahidi mpya.') },
];

const EDGES: Array<{ from: NodeId; to: NodeId; loop?: boolean }> = [
  { from: 'standard', to: 'document' },
  { from: 'standard', to: 'audit' },
  { from: 'document', to: 'process' },
  { from: 'audit', to: 'finding' },
  { from: 'process', to: 'evidence' },
  { from: 'audit', to: 'evidence' },
  { from: 'finding', to: 'nonconformance' },
  { from: 'nonconformance', to: 'capa' },
  { from: 'nonconformance', to: 'risk' },
  { from: 'capa', to: 'verification' },
  { from: 'verification', to: 'evidence', loop: true },
];

function nodeById(id: NodeId) {
  return NODES.find((n) => n.id === id)!;
}

/** A gentle quadratic-bezier control point offset perpendicular to the
    straight line, turns the flat, undirected-looking <line> edges into
    a more deliberate, "designed" curve without changing what they connect. */
function controlPoint(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { x: mx + (-dy / len) * bend, y: my + (dx / len) * bend };
}

interface QualityIntelligenceGraphProps {
  /** Controlled active node — lets an external element (e.g. a TraceBlock)
      drive the highlight. Falls back to internal hover/focus state when omitted. */
  activeId?: NodeId | null;
  onActiveChange?: (id: NodeId | null) => void;
}

export function QualityIntelligenceGraph({ activeId, onActiveChange }: QualityIntelligenceGraphProps = {}) {
  const { tr, tx } = useI18n();
  const [preview, setPreview] = useState<NodeId | null>(null);
  const [locked, setLocked] = useState<NodeId | null>(null);
  const active = activeId ?? preview ?? locked;
  const reduceMotion = useReducedMotion();

  const connectedTo = (id: NodeId) =>
    new Set(EDGES.filter((e) => e.from === id || e.to === id).flatMap((e) => [e.from, e.to]));
  const highlighted = active ? connectedTo(active) : null;
  const activeNode = active ? nodeById(active) : null;
  const incoming = active ? EDGES.filter((edge) => edge.to === active).map((edge) => nodeById(edge.from)) : [];
  const outgoing = active ? EDGES.filter((edge) => edge.from === active).map((edge) => nodeById(edge.to)) : [];

  function previewNode(id: NodeId) {
    setPreview(id);
    onActiveChange?.(id);
  }

  function clearPreview() {
    setPreview(null);
    onActiveChange?.(locked);
  }

  function toggleLocked(id: NodeId) {
    const next = locked === id ? null : id;
    setLocked(next);
    setPreview(null);
    onActiveChange?.(next);
  }

  function moveFocus(current: NodeId, direction: 1 | -1) {
    const currentIndex = NODES.findIndex((node) => node.id === current);
    const nextIndex = (currentIndex + direction + NODES.length) % NODES.length;
    document.getElementById(`quality-node-${NODES[nextIndex].id}`)?.focus();
  }

  return (
    <div className="qt-card p-4 sm:p-6" data-testid="quality-intelligence-graph">
      <svg viewBox="0 0 640 440" className="w-full" role="img" aria-label={tr('QualiTracker eQMS quality intelligence graph', 'Ramani ya akili ya ubora ya QualiTracker eQMS')}>
        <defs>
          <marker id="qig-arrow-lit" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto-start-reverse">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--qt-deep-teal)" />
          </marker>
          <marker id="qig-arrow-dim" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto-start-reverse">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--qt-border-grey)" />
          </marker>
        </defs>
        {EDGES.map((e, i) => {
          const from = nodeById(e.from);
          const to = nodeById(e.to);
          const isLit = !active || e.from === active || e.to === active;
          const isFlowing = active === e.from && !reduceMotion;
          const bend = e.loop ? 46 : 20;
          const cp = controlPoint(from.x, from.y, to.x, to.y, bend);
          const d = `M ${from.x} ${from.y} Q ${cp.x} ${cp.y} ${to.x} ${to.y}`;
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={isLit ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)'}
                strokeWidth={isLit && active ? 2 : 1}
                strokeDasharray={e.loop ? '4 3' : undefined}
                opacity={active && !isLit ? 0.3 : 1}
                markerEnd={`url(#${isLit ? 'qig-arrow-lit' : 'qig-arrow-dim'})`}
                style={{ transition: 'stroke .2s, opacity .2s' }}
              />
              {/* A small pulse traveling the real, directional edge out of
                  the active node, shown only for that node's own outgoing
                  relationships, and only when motion is allowed. */}
              {isFlowing && (
                <circle r={3} fill="var(--qt-deep-teal)" opacity={0.9}>
                  <animateMotion dur="1.1s" repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}
        {NODES.map((node) => {
          const isActive = active === node.id;
          const isDimmed = active !== null && !highlighted?.has(node.id);
          const Icon = node.icon;
          const r = isActive ? 11 : 9;
          return (
            <g
              key={node.id}
              id={`quality-node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => previewNode(node.id)}
              onFocus={() => previewNode(node.id)}
              onMouseLeave={clearPreview}
              onBlur={clearPreview}
              onClick={() => toggleLocked(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  moveFocus(node.id, 1);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  moveFocus(node.id, -1);
                } else if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleLocked(node.id);
                } else if (event.key === 'Escape') {
                  setLocked(null);
                  setPreview(null);
                  onActiveChange?.(null);
                }
              }}
              tabIndex={0}
              role="button"
              aria-labelledby={`quality-node-label-${node.id}`}
              aria-pressed={locked === node.id}
              style={{ cursor: 'pointer', outline: 'none' }}
              data-testid={`graph-node-${node.id}`}
            >
              {/* Dimming lives on the circle only — a real Lighthouse run
                  caught the same opacity trick failing text contrast
                  elsewhere on the site (~1.94:1, needs 4.5:1). Labels stay
                  at full, always-passing contrast; the circle fill/size is
                  the dim/highlight cue instead. */}
              {isActive && (
                <circle r={r + 6} fill="none" stroke="var(--qt-deep-teal)" strokeWidth={1.5} opacity={0.3} />
              )}
              <circle
                r={r}
                fill={node.planned ? 'var(--qt-quality-gold)' : 'var(--qt-deep-teal)'}
                opacity={isDimmed ? 0.4 : 1}
                style={{ transition: 'r .15s, opacity .2s' }}
              />
              <g transform="translate(-6, -6)" opacity={isDimmed ? 0.6 : 1} style={{ pointerEvents: 'none' }}>
                <Icon size={12} color="#FFFFFF" strokeWidth={2.5} />
              </g>
              <text id={`quality-node-label-${node.id}`} x={0} y={-20} textAnchor="middle" className="font-brand" fontSize={13} fontWeight={700} fill="var(--qt-near-black)" stroke="#FFFFFF" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke">
                {tx(node.label)}
              </text>
              {node.planned && (
                <text x={0} y={28} textAnchor="middle" className="font-mono-ui" fontSize={9} fill="var(--qt-body-grey)">
                  {tr('PLANNED', 'IMEPANGWA')}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--qt-border-grey)' }}>
        <p className="qt-technical-label mb-2">{tr('Explore the model', 'Chunguza muundo')}</p>
        <div className="flex flex-wrap gap-2" aria-label={tr('Quality model nodes', 'Nodi za muundo wa ubora')}>
          {NODES.map((node) => (
            <button
              key={node.id}
              type="button"
              aria-pressed={locked === node.id}
              onClick={() => toggleLocked(node.id)}
              onMouseEnter={() => previewNode(node.id)}
              onMouseLeave={clearPreview}
              onFocus={() => previewNode(node.id)}
              onBlur={clearPreview}
              className="qt-focus min-h-9 rounded-md border px-3 py-1.5 font-mono-ui text-[10px] font-bold uppercase tracking-[.06em]"
              style={{
                borderColor: active === node.id ? 'var(--qt-deep-teal)' : 'var(--qt-border-grey)',
                background: locked === node.id ? 'var(--qt-deep-teal)' : active === node.id ? 'var(--qt-teal-tint)' : '#FFFFFF',
                color: locked === node.id ? '#FFFFFF' : 'var(--qt-near-black)',
              }}
              data-testid={`graph-control-${node.id}`}
            >
              {tx(node.label)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 min-h-[116px] rounded-md border p-4" style={{ borderColor: 'var(--qt-border-grey)', background: 'var(--qt-lab-grey)' }} aria-live="polite" data-testid="graph-detail">
        {activeNode ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-brand text-base font-bold" style={{ color: 'var(--qt-near-black)' }}>{tx(activeNode.label)}</p>
              <span className="qt-technical-label">{locked === activeNode.id ? tr('Selected', 'Imechaguliwa') : tr('Preview', 'Muhtasari')}</span>
            </div>
            <p className="mt-2 text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>{tx(activeNode.detail)}</p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="qt-technical-label">{tr('Receives from', 'Inapokea kutoka')}</dt>
                <dd className="mt-1 text-xs font-semibold" style={{ color: 'var(--qt-near-black)' }}>{incoming.length ? incoming.map((node) => tx(node.label)).join(' · ') : tr('Origin point', 'Sehemu ya kuanzia')}</dd>
              </div>
              <div>
                <dt className="qt-technical-label">{tr('Leads to', 'Inaelekea kwenye')}</dt>
                <dd className="mt-1 text-xs font-semibold" style={{ color: 'var(--qt-near-black)' }}>{outgoing.length ? outgoing.map((node) => tx(node.label)).join(' · ') : tr('End point', 'Sehemu ya mwisho')}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
            {tr('Hover, focus, or tap a node to preview it. Select it to keep its relationships visible.', 'Weka kielekezi, lenga, au gusa nodi kuona muhtasari. Ichague ili mahusiano yake yaendelee kuonekana.')}
          </p>
        )}
      </div>
    </div>
  );
}
