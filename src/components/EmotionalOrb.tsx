import { motion } from "framer-motion";

interface EmotionalOrbProps {
  bpm: number;
  primaryColor: string;
  secondaryColor: string;
}

export default function EmotionalOrb({ bpm, primaryColor, secondaryColor }: EmotionalOrbProps) {
  const pulseDuration = 60 / bpm;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-8">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${primaryColor}, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: pulseDuration * 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${secondaryColor}, transparent 70%)`,
        }}
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: pulseDuration * 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main orb */}
      <motion.div
        className="relative w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 0 60px ${primaryColor}80, 0 0 120px ${secondaryColor}40`,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbiting particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? primaryColor : secondaryColor,
            boxShadow: `0 0 8px ${i % 2 === 0 ? primaryColor : secondaryColor}`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={{
            x: Math.cos((i * 2 * Math.PI) / 5) * (80 + i * 10),
            y: Math.sin((i * 2 * Math.PI) / 5) * (80 + i * 10),
          }}
        />
      ))}
    </div>
  );
}
