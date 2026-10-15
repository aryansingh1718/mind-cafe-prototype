"use client";

import { motion, useReducedMotion } from "framer-motion";

function Steam({ x, delay }: { x: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={`M${x} 292 q-6 -8 0 -16 q6 -8 0 -16`}
      fill="none"
      stroke="#C9B89A"
      strokeWidth={2.5}
      strokeLinecap="round"
      initial={{ opacity: 0, y: 0 }}
      animate={reduce ? { opacity: 0.5 } : { opacity: [0, 0.8, 0], y: [0, -14] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

export default function CafeScene() {
  const reduce = useReducedMotion();
  const sit = (delay: number) => ({
    initial: reduce ? false : { y: -28, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 70, damping: 14, delay },
  });

  return (
    <svg
      viewBox="0 0 720 420"
      role="img"
      aria-label="Two chairs at a small cafe table. You sit on the left as an anonymous avatar, and your doctor sits on the right."
      className="h-auto w-full"
    >
      {/* wall, window, floor */}
      <rect width="720" height="420" fill="#F3EEE3" />
      <path d="M300 120 a60 60 0 0 1 120 0 v110 h-120 z" fill="#FFF8E6" stroke="#E4DAC4" strokeWidth="4" />
      <path d="M360 60 V230 M300 150 H420" stroke="#E4DAC4" strokeWidth="3" />
      <rect y="330" width="720" height="90" fill="#E8DEC9" />
      <rect y="328" width="720" height="5" fill="#D9CCB0" />

      {/* pendant lamps */}
      <circle cx="200" cy="92" r="42" fill="#FFE9B8" opacity="0.45" />
      <circle cx="520" cy="98" r="42" fill="#FFE9B8" opacity="0.45" />
      <path d="M200 0 V60 M520 0 V66" stroke="#8B6F5A" strokeWidth="2" />
      <path d="M176 84 a24 24 0 0 1 48 0 z" fill="#C4623A" />
      <path d="M496 90 a24 24 0 0 1 48 0 z" fill="#C4623A" />

      {/* plant */}
      <ellipse cx="660" cy="332" rx="10" ry="30" fill="#86AB89" transform="rotate(-25 660 350)" />
      <ellipse cx="672" cy="330" rx="10" ry="30" fill="#73987A" transform="rotate(20 672 350)" />
      <ellipse cx="666" cy="322" rx="9" ry="28" fill="#A3BFA6" />
      <path d="M644 350 h44 l-5 38 h-34 z" fill="#C4623A" />

      {/* user chair + avatar */}
      <rect x="105" y="312" width="130" height="22" rx="10" fill="#A9502E" />
      <rect x="118" y="334" width="8" height="40" rx="3" fill="#8A4025" />
      <rect x="214" y="334" width="8" height="40" rx="3" fill="#8A4025" />
      <rect x="120" y="170" width="100" height="150" rx="22" fill="#C4623A" />
      <motion.g {...sit(0.4)}>
        <rect x="138" y="296" width="64" height="18" rx="9" fill="#6B8575" />
        <rect x="138" y="255" width="64" height="62" rx="24" fill="#86AB89" />
        <circle cx="170" cy="225" r="28" fill="#6F9873" />
        <ellipse cx="171" cy="229" rx="14" ry="16" fill="#F1DFCB" />
      </motion.g>

      {/* doctor chair + doctor */}
      <rect x="485" y="312" width="130" height="22" rx="10" fill="#5F8663" />
      <rect x="498" y="334" width="8" height="40" rx="3" fill="#4D6F51" />
      <rect x="594" y="334" width="8" height="40" rx="3" fill="#4D6F51" />
      <rect x="500" y="170" width="100" height="150" rx="22" fill="#6E9573" />
      <motion.g {...sit(0.9)}>
        <rect x="518" y="296" width="64" height="18" rx="9" fill="#4A4A55" />
        <rect x="518" y="255" width="64" height="62" rx="24" fill="#FFFDF8" stroke="#E4DAC4" strokeWidth="2" />
        <path d="M540 262 v22 a10 10 0 0 0 20 0 v-22" fill="none" stroke="#2F3837" strokeWidth="3" strokeLinecap="round" />
        <circle cx="550" cy="226" r="24" fill="#E8B894" />
        <path d="M526 222 a24 24 0 0 1 48 0 q-24 -14 -48 0 z" fill="#2F3837" />
        <circle cx="542" cy="228" r="6" fill="none" stroke="#2F3837" strokeWidth="1.5" />
        <circle cx="558" cy="228" r="6" fill="none" stroke="#2F3837" strokeWidth="1.5" />
        <path d="M544 238 q6 5 12 0" fill="none" stroke="#2F3837" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* table + cups + steam */}
      <rect x="356" y="318" width="8" height="52" fill="#6E4A3A" />
      <ellipse cx="360" cy="372" rx="32" ry="7" fill="#6E4A3A" />
      <ellipse cx="360" cy="318" rx="72" ry="12" fill="#8B5E4B" />
      <rect x="326" y="298" width="18" height="14" rx="4" fill="#FFFDF8" />
      <rect x="376" y="298" width="18" height="14" rx="4" fill="#FFFDF8" />
      <Steam x={335} delay={1.6} />
      <Steam x={385} delay={2.4} />

      {/* speech bubble */}
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 120, damping: 14 }}
        style={{ transformOrigin: "560px 152px" }}
      >
        <rect x="470" y="116" width="190" height="36" rx="18" fill="#FFFDF8" stroke="#E4DAC4" strokeWidth="2" />
        <path d="M540 152 l10 14 l6 -14 z" fill="#FFFDF8" stroke="#E4DAC4" strokeWidth="2" strokeLinejoin="round" />
        <rect x="538" y="150" width="20" height="4" fill="#FFFDF8" />
        <text x="565" y="139" textAnchor="middle" fontSize="13" fill="#2F3837" fontFamily="var(--font-body), sans-serif">
          Take your time. I&apos;m listening.
        </text>
      </motion.g>

      {/* name tags */}
      <g fontFamily="var(--font-body), sans-serif" fontSize="13" fontWeight="600" fill="#2F3837" textAnchor="middle">
        <rect x="100" y="384" width="140" height="26" rx="13" fill="#FFFDF8" />
        <text x="170" y="402">You, anonymous</text>
        <rect x="475" y="384" width="150" height="26" rx="13" fill="#FFFDF8" />
        <text x="550" y="402">Dr. Meera, psychiatrist</text>
      </g>
    </svg>
  );
}