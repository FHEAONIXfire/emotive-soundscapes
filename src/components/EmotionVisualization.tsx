import { motion } from "framer-motion";
import { EmotionAnalysis, EMOTION_COLORS, getBPM } from "@/lib/emotionMusicMapping";

interface EmotionVisualizationProps {
  analysis: EmotionAnalysis;
}

export default function EmotionVisualization({ analysis }: EmotionVisualizationProps) {
  const bpm = getBPM(analysis.intensity, analysis.movement);

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Primary Emotion */}
      <div className="glass rounded-2xl p-5 col-span-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Primary</p>
        <p className="text-xl font-display font-bold capitalize" style={{ color: EMOTION_COLORS[analysis.primary_emotion.toLowerCase()] }}>
          {analysis.primary_emotion}
        </p>
      </div>

      {/* Secondary Emotion */}
      <div className="glass rounded-2xl p-5 col-span-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Secondary</p>
        <p className="text-xl font-display font-bold capitalize" style={{ color: EMOTION_COLORS[analysis.secondary_emotion.toLowerCase()] }}>
          {analysis.secondary_emotion}
        </p>
      </div>

      {/* BPM */}
      <div className="glass rounded-2xl p-5 col-span-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">BPM</p>
        <p className="text-xl font-display font-bold text-primary">{Math.round(bpm)}</p>
      </div>

      {/* Intensity */}
      <div className="glass rounded-2xl p-5 col-span-2 md:col-span-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Intensity</p>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))` }}
            initial={{ width: "0%" }}
            animate={{ width: `${analysis.intensity * 10}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{analysis.intensity}/10</p>
      </div>

      {/* Temperature */}
      <div className={`glass rounded-2xl p-5 col-span-1 ${analysis.temperature === "warm" ? "glow-warm" : "glow-cold"}`}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Temperature</p>
        <p className={`text-xl font-display font-bold capitalize ${analysis.temperature === "warm" ? "text-warm" : "text-cold"}`}>
          {analysis.temperature}
        </p>
      </div>

      {/* Movement */}
      <div className="glass rounded-2xl p-5 col-span-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Movement</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-display font-bold capitalize text-foreground">
            {analysis.movement}
          </p>
          {/* Wave indicator */}
          <svg width="40" height="20" viewBox="0 0 40 20" className="text-primary">
            {analysis.movement === "stable" ? (
              <path d="M0 10 Q5 5, 10 10 Q15 15, 20 10 Q25 5, 30 10 Q35 15, 40 10" fill="none" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M0 10 L5 2 L10 18 L15 5 L20 15 L25 3 L30 17 L35 8 L40 12" fill="none" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
