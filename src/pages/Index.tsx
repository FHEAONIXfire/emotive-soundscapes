import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmotionAnalysis, EmotionFingerprint, EMOTION_COLORS, EMOTION_GRADIENT, getBPM } from "@/lib/emotionMusicMapping";
import ParticleBackground from "@/components/ParticleBackground";
import EmotionalOrb from "@/components/EmotionalOrb";
import EmotionVisualization from "@/components/EmotionVisualization";
import EmotionRadarChart from "@/components/EmotionRadarChart";
import MelodyControls from "@/components/MelodyControls";
import { Button } from "@/components/ui/button";

const EMOTION_HUES: Record<string, number> = {
  joy: 50, sadness: 220, anger: 0, fear: 270, love: 340, hope: 160,
};

const Index = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [fingerprint, setFingerprint] = useState<EmotionFingerprint | null>(null);
  const [emotionHue, setEmotionHue] = useState(185);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);
    setFingerprint(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-emotion", {
        body: { text },
      });

      if (error) throw error;

      const result: EmotionAnalysis = {
        primary_emotion: data.primary_emotion,
        secondary_emotion: data.secondary_emotion,
        intensity: data.intensity,
        temperature: data.temperature,
        movement: data.movement,
      };

      const fp: EmotionFingerprint = data.fingerprint || {
        joy: data.primary_emotion === "joy" ? result.intensity * 10 : 15,
        sadness: data.primary_emotion === "sadness" ? result.intensity * 10 : 15,
        anger: data.primary_emotion === "anger" ? result.intensity * 10 : 15,
        fear: data.primary_emotion === "fear" ? result.intensity * 10 : 15,
        love: data.primary_emotion === "love" ? result.intensity * 10 : 15,
        hope: data.primary_emotion === "hope" ? result.intensity * 10 : 15,
      };

      setAnalysis(result);
      setFingerprint(fp);
      setEmotionHue(EMOTION_HUES[result.primary_emotion.toLowerCase()] || 185);
    } catch (e) {
      console.error("Analysis error:", e);
    } finally {
      setLoading(false);
    }
  };

  const bpm = analysis ? getBPM(analysis.intensity, analysis.movement) : 80;
  const [c1, c2] = analysis
    ? EMOTION_GRADIENT[analysis.primary_emotion.toLowerCase()] || ["hsl(185,80%,55%)", "hsl(260,50%,55%)"]
    : ["hsl(185,80%,55%)", "hsl(260,50%,55%)"];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground emotionHue={emotionHue} />
      <div className="bg-gradient-mesh fixed inset-0 z-0" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-3 text-gradient-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              EMOTIVE
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground font-light tracking-wide mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Turn Feelings Into Living Sound
            </motion.p>

            {/* Text Input */}
            <motion.div
              className="w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe how you feel... pour your emotions here..."
                rows={4}
                className="w-full glass-strong rounded-2xl p-5 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-base"
              />

              <motion.div className="mt-5">
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  size="lg"
                  className="rounded-full px-10 py-6 text-base font-display font-semibold glow-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My Melody
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator when no analysis */}
          {!analysis && !loading && (
            <motion.div
              className="absolute bottom-10"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
                <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
              </div>
            </motion.div>
          )}
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {analysis && fingerprint && (
            <motion.section
              className="px-4 pb-20 max-w-5xl mx-auto space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Emotional Orb */}
              <EmotionalOrb bpm={bpm} primaryColor={c1} secondaryColor={c2} />

              {/* Emotion Data */}
              <EmotionVisualization analysis={analysis} />

              {/* Melody + Radar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MelodyControls analysis={analysis} />
                <EmotionRadarChart fingerprint={fingerprint} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
