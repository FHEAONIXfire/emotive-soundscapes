export interface EmotionAnalysis {
  primary_emotion: string;
  secondary_emotion: string;
  intensity: number;
  temperature: "warm" | "cold";
  movement: "stable" | "chaotic";
}

export interface EmotionFingerprint {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  love: number;
  hope: number;
}

export const EMOTION_SCALES: Record<string, string[]> = {
  joy: ["C", "D", "E", "F", "G", "A", "B"],          // Major
  sadness: ["A", "B", "C", "D", "E", "F", "G"],      // Natural Minor
  anger: ["E", "F", "G", "A", "Bb", "C", "D"],       // Phrygian
  fear: ["B", "C", "D", "Eb", "F", "Gb", "Ab"],      // Diminished
  love: ["C", "D", "E", "F#", "G", "A", "B"],        // Lydian
  hope: ["C", "D", "E", "F", "G", "A", "B"],         // Major 7
};

export const EMOTION_COLORS: Record<string, string> = {
  joy: "hsl(50, 90%, 55%)",
  sadness: "hsl(220, 70%, 50%)",
  anger: "hsl(0, 80%, 50%)",
  fear: "hsl(270, 60%, 45%)",
  love: "hsl(340, 80%, 60%)",
  hope: "hsl(160, 70%, 50%)",
};

export const EMOTION_GRADIENT: Record<string, [string, string]> = {
  joy: ["hsl(45, 90%, 55%)", "hsl(30, 95%, 60%)"],
  sadness: ["hsl(220, 70%, 45%)", "hsl(240, 60%, 40%)"],
  anger: ["hsl(0, 80%, 50%)", "hsl(20, 90%, 45%)"],
  fear: ["hsl(270, 60%, 45%)", "hsl(290, 50%, 35%)"],
  love: ["hsl(340, 80%, 55%)", "hsl(320, 70%, 50%)"],
  hope: ["hsl(160, 70%, 50%)", "hsl(185, 80%, 55%)"],
};

export function getBPM(intensity: number, movement: "stable" | "chaotic"): number {
  const baseBPM = intensity <= 3 ? 70 : intensity <= 7 ? 100 : 130;
  return movement === "chaotic" ? baseBPM + Math.random() * 20 : baseBPM;
}

export function getOctave(intensity: number): number {
  return intensity <= 3 ? 3 : intensity <= 7 ? 4 : 5;
}

export function generateFingerprint(analysis: EmotionAnalysis): EmotionFingerprint {
  const emotions = ["joy", "sadness", "anger", "fear", "love", "hope"];
  const fp: Record<string, number> = {};
  
  for (const e of emotions) {
    fp[e] = 10;
    if (e === analysis.primary_emotion.toLowerCase()) fp[e] = analysis.intensity * 10;
    else if (e === analysis.secondary_emotion.toLowerCase()) fp[e] = analysis.intensity * 6;
    else fp[e] = Math.random() * 20 + 5;
  }
  
  return fp as unknown as EmotionFingerprint;
}
