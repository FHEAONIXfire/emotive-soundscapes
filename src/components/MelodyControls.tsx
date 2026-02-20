import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Download } from "lucide-react";
import { EmotionAnalysis, getBPM, EMOTION_COLORS, EMOTION_GRADIENT } from "@/lib/emotionMusicMapping";
import { startMelody, stopMelody, togglePlayback } from "@/lib/melodyGenerator";
import { Button } from "@/components/ui/button";

interface MelodyControlsProps {
  analysis: EmotionAnalysis;
}

export default function MelodyControls({ analysis }: MelodyControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = async () => {
    if (!hasStarted) {
      await startMelody(analysis);
      setHasStarted(true);
      setIsPlaying(true);
    } else {
      const playing = togglePlayback();
      setIsPlaying(playing);
    }
  };

  const handleRegenerate = async () => {
    stopMelody();
    await startMelody(analysis);
    setHasStarted(true);
    setIsPlaying(true);
  };

  const bpm = getBPM(analysis.intensity, analysis.movement);
  const [c1, c2] = EMOTION_GRADIENT[analysis.primary_emotion.toLowerCase()] || EMOTION_GRADIENT.joy;

  // Simple visualizer bars
  const barCount = 16;

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-sm font-display uppercase tracking-widest text-muted-foreground mb-5">
        Melody Engine
      </h3>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-16 mb-6">
        {Array.from({ length: barCount }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full"
            style={{
              background: `linear-gradient(to top, ${c1}, ${c2})`,
            }}
            animate={isPlaying ? {
              height: [8, 20 + Math.random() * 40, 12 + Math.random() * 20, 8],
            } : { height: 8 }}
            transition={isPlaying ? {
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05,
            } : { duration: 0.3 }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handlePlay}
          size="lg"
          className="rounded-full w-14 h-14 glow-primary bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>
        <Button
          onClick={handleRegenerate}
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 border-border/50 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 border-border/50 text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Placeholder for MIDI download
            const blob = new Blob(["MIDI export coming soon"], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "emotive-melody.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        {Math.round(bpm)} BPM • {analysis.temperature === "warm" ? "Acoustic" : "Synth"} • {analysis.movement === "chaotic" ? "Syncopated" : "Steady"}
      </p>
    </motion.div>
  );
}
