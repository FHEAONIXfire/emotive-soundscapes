import * as Tone from "tone";
import { EmotionAnalysis, EMOTION_SCALES, getBPM, getOctave } from "./emotionMusicMapping";

let synth: Tone.PolySynth | null = null;
let harmonySynth: Tone.PolySynth | null = null;
let sequence: Tone.Sequence | null = null;
let harmonyLoop: Tone.Loop | null = null;

export function stopMelody() {
  sequence?.stop();
  sequence?.dispose();
  harmonyLoop?.stop();
  harmonyLoop?.dispose();
  synth?.dispose();
  harmonySynth?.dispose();
  sequence = null;
  harmonyLoop = null;
  synth = null;
  harmonySynth = null;
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
}

export async function startMelody(analysis: EmotionAnalysis): Promise<() => void> {
  await Tone.start();
  stopMelody();

  const bpm = getBPM(analysis.intensity, analysis.movement);
  Tone.getTransport().bpm.value = bpm;

  const scale = EMOTION_SCALES[analysis.primary_emotion.toLowerCase()] || EMOTION_SCALES.joy;
  const harmonyScale = EMOTION_SCALES[analysis.secondary_emotion.toLowerCase()] || scale;
  const octave = getOctave(analysis.intensity);

  // Choose synth type based on temperature
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  if (analysis.temperature === "warm") {
    synth.set({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 } });
  } else {
    synth.set({ oscillator: { type: "sine" }, envelope: { attack: 0.3, decay: 0.5, sustain: 0.6, release: 1.2 } });
  }
  synth.volume.value = -8;

  harmonySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" as const },
    envelope: { attack: 0.5, decay: 0.8, sustain: 0.7, release: 2 },
  }).toDestination();
  harmonySynth.volume.value = -18;

  // Add reverb
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).toDestination();
  synth.connect(reverb);
  harmonySynth.connect(reverb);

  // Generate melody notes
  const noteCount = analysis.intensity <= 3 ? 4 : analysis.intensity <= 7 ? 8 : 12;
  const melodyNotes: (string | null)[] = [];
  
  for (let i = 0; i < noteCount; i++) {
    if (analysis.movement === "chaotic" && Math.random() > 0.7) {
      melodyNotes.push(null); // rest for syncopation
    } else {
      const note = scale[Math.floor(Math.random() * scale.length)];
      const oct = octave + (Math.random() > 0.7 ? 1 : 0);
      melodyNotes.push(`${note}${oct}`);
    }
  }

  const subdivision = analysis.intensity > 7 ? "8n" : "4n";
  
  sequence = new Tone.Sequence(
    (time, note) => {
      if (note && synth) {
        const duration = analysis.movement === "chaotic" 
          ? (Math.random() > 0.5 ? "8n" : "4n") 
          : "4n";
        synth.triggerAttackRelease(note, duration, time);
      }
    },
    melodyNotes,
    subdivision
  );

  // Harmony pad
  const harmonyNote1 = `${harmonyScale[0]}${octave - 1}`;
  const harmonyNote2 = `${harmonyScale[2]}${octave - 1}`;
  const harmonyNote3 = `${harmonyScale[4]}${octave - 1}`;

  harmonyLoop = new Tone.Loop((time) => {
    if (harmonySynth) {
      harmonySynth.triggerAttackRelease([harmonyNote1, harmonyNote2, harmonyNote3], "2n", time);
    }
  }, "1m");

  sequence.start(0);
  harmonyLoop.start(0);
  Tone.getTransport().start();

  return stopMelody;
}

export function togglePlayback(): boolean {
  const transport = Tone.getTransport();
  if (transport.state === "started") {
    transport.pause();
    return false;
  } else {
    transport.start();
    return true;
  }
}
