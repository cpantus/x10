import { motion } from 'framer-motion';
import type { LogoIconProps } from './types';

// 5 nodes in a compact neural network layout
const NODES = [
  { cx: 20, cy: 8 },   // top
  { cx: 8, cy: 20 },   // left
  { cx: 32, cy: 20 },  // right
  { cx: 14, cy: 34 },  // bottom-left
  { cx: 28, cy: 34 },  // bottom-right
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [1, 3],
  [2, 4],
  [3, 4],
];

export default function NeuralLogo({ className }: LogoIconProps) {
  return (
    <div className={`w-10 h-10 ${className || ''}`}>
      <svg viewBox="0 0 40 42" className="w-full h-full">
        {/* Connection lines */}
        {CONNECTIONS.map(([a, b], i) => (
          <line
            key={`c-${i}`}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke="var(--color-accent-primary)"
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        ))}

        {/* Nodes with staggered pulse */}
        {NODES.map((node, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={3.5}
            fill="var(--color-accent-primary)"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
          />
        ))}

        {/* Traveling dot along a connection */}
        <motion.circle
          r={1.5}
          fill="var(--color-accent-secondary)"
          animate={{
            cx: [NODES[0].cx, NODES[2].cx, NODES[4].cx, NODES[3].cx, NODES[1].cx, NODES[0].cx],
            cy: [NODES[0].cy, NODES[2].cy, NODES[4].cy, NODES[3].cy, NODES[1].cy, NODES[0].cy],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
}
