import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A dashed wireframe surface, drawn as an SVG lattice that slowly breathes.
 * Purely decorative (aria-hidden): the three "shapes" stand for a record,
 * a trail of linked records, and a closed loop.
 */
const SHAPES = ['record', 'trail', 'loop'] as const;
export type LatticeShape = (typeof SHAPES)[number];

function points(shape: LatticeShape, t: number): Array<Array<[number, number]>> {
  const rows = 14;
  const cols = 14;
  const grid: Array<Array<[number, number]>> = [];
  for (let r = 0; r < rows; r++) {
    const row: Array<[number, number]> = [];
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      const v = r / (rows - 1);
      let x: number;
      let y: number;
      if (shape === 'record') {
        x = 40 + u * 220 + Math.sin(v * 3 + t) * 8;
        y = 30 + v * 200 + Math.cos(u * 3 + t) * 8;
      } else if (shape === 'trail') {
        const a = u * Math.PI * 1.6 + t * 0.5;
        x = 150 + Math.cos(a) * (50 + v * 90);
        y = 30 + v * 200 + Math.sin(a) * 28;
      } else {
        const a = u * Math.PI * 2 + t * 0.4;
        const rad = 40 + v * 90;
        x = 150 + Math.cos(a) * rad;
        y = 140 + Math.sin(a) * rad * 0.62;
      }
      row.push([x, y]);
    }
    grid.push(row);
  }
  return grid;
}

export function DashedLattice({ shape }: { shape: LatticeShape }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      // Throttled to roughly 20fps; this is background texture, not motion.
      if (now - last > 50) {
        setT((v) => v + 0.04);
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const grid = points(shape, t);
  const lines: string[] = [];
  grid.forEach((row) => lines.push('M' + row.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')));
  for (let c = 0; c < grid[0].length; c++) {
    lines.push('M' + grid.map((row) => `${row[c][0].toFixed(1)} ${row[c][1].toFixed(1)}`).join('L'));
  }

  return (
    <svg viewBox="0 0 300 260" className="h-full w-full" aria-hidden="true" focusable="false">
      <path d={lines.join('')} fill="none" stroke="var(--qt-deep-teal)" strokeWidth="0.9" strokeDasharray="2.5 3" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}
