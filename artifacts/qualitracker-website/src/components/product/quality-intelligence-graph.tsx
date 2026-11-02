import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  label: string;
  x: number;
  y: number;
  planned?: boolean;
  detail: string;
  icon: typeof ShieldCheck;
}

const NODES: GraphNode[] = [
  { id: 'standard', label: 'Standard', x: 320, y: 30, icon: ShieldCheck, detail: 'ISO 15189, WHO LQMS, SLIPTA, the requirement a lab is working against.' },
  { id: 'document', label: 'Document', x: 150, y: 130, icon: FileText, detail: 'The SOP or policy that implements a standard’s requirement.' },
  { id: 'audit', label: 'Audit', x: 490, y: 130, icon: Search, detail: 'Reviews evidence against the standard.' },
  { id: 'process', label: 'Process', x: 150, y: 230, icon: Workflow, detail: 'The workflow a document describes.' },
  { id: 'finding', label: 'Finding', x: 490, y: 230, icon: AlertTriangle, detail: 'What an audit surfaces when something doesn’t conform.' },
  { id: 'evidence', label: 'Evidence', x: 320, y: 300, icon: FileCheck2, detail: 'Records proving a process was followed, logs, QC runs, signatures.' },
  { id: 'nonconformance', label: 'Non-Conformance', x: 490, y: 320, icon: XCircle, detail: 'A finding, formalized and tracked to closure.' },
  { id: 'capa', label: 'CAPA', x: 400, y: 400, icon: Wrench, detail: 'The corrective action assigned to resolve a non-conformance.' },
  { id: 'risk', label: 'Risk', x: 560, y: 400, planned: true, icon: AlertOctagon, detail: 'Planned: surfacing risk patterns across repeated non-conformances.' },
  { id: 'verification', label: 'Verification', x: 270, y: 400, icon: CheckCircle2, detail: 'Confirms the CAPA actually closed the gap, and becomes new evidence.' },
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

function bezierSample(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) {
  const u = 1 - t;
  return {
    x: u * u * x1 + 2 * u * t * cx + t * t * x2,
    y: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
}

interface QualityIntelligenceGraphProps {
  /** Controlled active node — lets an external element (e.g. a TraceBlock)
      drive the highlight. Falls back to internal hover/focus state when omitted. */
  activeId?: NodeId | null;
  onActiveChange?: (id: NodeId | null) => void;
}

export function QualityIntelligenceGraph({ activeId, onActiveChange }: QualityIntelligenceGraphProps = {}) {
  const [internalActive, setInternalActive] = useState<NodeId | null>(null);
  const isControlled = activeId !== undefined;
  const active = isControlled ? activeId : internalActive;
  const setActive = (id: NodeId | null) => {
    if (!isControlled) setInternalActive(id);
    onActiveChange?.(id);
  };
  const reduceMotion = useReducedMotion();

  const connectedTo = (id: NodeId) =>
    new Set(EDGES.filter((e) => e.from === id || e.to === id).flatMap((e) => [e.from, e.to]));
  const highlighted = active ? connectedTo(active) : null;

  return (
    <div className="qt-card p-4 sm:p-6">
      <svg viewBox="0 0 640 440" className="w-full" role="img" aria-label="QualiTracker eQMS quality intelligence graph">
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
          const isLit = !active || (highlighted?.has(e.from) && highlighted?.has(e.to));
          const isFlowing = active === e.from && !reduceMotion;
          const bend = e.loop ? 46 : 20;
          const cp = controlPoint(from.x, from.y, to.x, to.y, bend);
          const d = `M ${from.x} ${from.y} Q ${cp.x} ${cp.y} ${to.x} ${to.y}`;
          const samples = isFlowing ? Array.from({ length: 9 }, (_, s) => bezierSample(from.x, from.y, cp.x, cp.y, to.x, to.y, s / 8)) : null;
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
              {samples && (
                <motion.circle
                  r={3}
                  fill="var(--qt-deep-teal)"
                  animate={{ cx: samples.map((p) => p.x), cy: samples.map((p) => p.y), opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                />
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
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
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
              <text x={0} y={-20} textAnchor="middle" className="font-brand" fontSize={13} fontWeight={700} fill="var(--qt-near-black)" stroke="#FFFFFF" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke">
                {node.label}
              </text>
              {node.planned && (
                <text x={0} y={28} textAnchor="middle" className="font-mono-ui" fontSize={9} fill="var(--qt-body-grey)">
                  PLANNED
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-4 min-h-[20px] text-xs leading-5" style={{ color: 'var(--qt-body-grey)' }}>
        {active ? nodeById(active).detail : 'Hover or focus a node to see how it connects.'}
      </p>
    </div>
  );
}
