import { motion } from "framer-motion";
import { EmotionFingerprint } from "@/lib/emotionMusicMapping";

interface EmotionRadarChartProps {
  fingerprint: EmotionFingerprint;
}

const LABELS = ["Joy", "Sadness", "Anger", "Fear", "Love", "Hope"];
const KEYS: (keyof EmotionFingerprint)[] = ["joy", "sadness", "anger", "fear", "love", "hope"];
const COLORS = ["#EAB308", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899", "#10B981"];

export default function EmotionRadarChart({ fingerprint }: EmotionRadarChartProps) {
  const cx = 150, cy = 150, r = 110;
  const angles = KEYS.map((_, i) => (Math.PI * 2 * i) / KEYS.length - Math.PI / 2);
  
  const points = KEYS.map((key, i) => {
    const val = (fingerprint[key] || 0) / 100;
    return {
      x: cx + Math.cos(angles[i]) * r * val,
      y: cy + Math.sin(angles[i]) * r * val,
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-display uppercase tracking-widest text-muted-foreground mb-4">
        Emotion Fingerprint
      </h3>
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={angles
              .map((a) => `${cx + Math.cos(a) * r * scale},${cy + Math.sin(a) * r * scale}`)
              .join(" ")}
            fill="none"
            stroke="hsl(228, 15%, 18%)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
            stroke="hsl(228, 15%, 18%)"
            strokeWidth="1"
          />
        ))}

        {/* Data shape */}
        <motion.path
          d={pathD}
          fill="hsl(185, 80%, 55%)"
          fillOpacity={0.15}
          stroke="hsl(185, 80%, 55%)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={COLORS[i]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        ))}

        {/* Labels */}
        {angles.map((a, i) => {
          const lx = cx + Math.cos(a) * (r + 24);
          const ly = cy + Math.sin(a) * (r + 24);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-[10px] font-body"
            >
              {LABELS[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
