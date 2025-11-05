import React, { useMemo } from 'react';
import { useTheme } from '../../src/context/ThemeContext';

const HeroBackgroundSVG = ({ className = "" }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const palette = useMemo(() => (
    isDark
      ? {
          background: '#0b1220',
          glowPrimary: '#1d4ed8',
          glowSecondary: '#22d3ee',
          glowAccent: '#9333ea',
          softOverlay: 'rgba(15, 23, 42, 0.6)',
        }
      : {
          background: '#ffffff',
          glowPrimary: '#3b82f6',
          glowSecondary: '#06b6d4',
          glowAccent: '#8b5cf6',
          softOverlay: 'rgba(59, 130, 246, 0.12)',
        }
  ), [isDark]);

  return (
    <svg
      className={`absolute inset-0 w-full h-full z-0 transition-colors duration-500 ${className}`}
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="hero-glow-1" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor={palette.glowPrimary} stopOpacity={isDark ? 0.35 : 0.18} />
          <stop offset="100%" stopColor={palette.glowPrimary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-2" cx="50%" cy="50%" r="50%" fx="70%" fy="30%">
          <stop offset="0%" stopColor={palette.glowAccent} stopOpacity={isDark ? 0.3 : 0.15} />
          <stop offset="100%" stopColor={palette.glowAccent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-3" cx="50%" cy="50%" r="50%" fx="50%" fy="70%">
          <stop offset="0%" stopColor={palette.glowSecondary} stopOpacity={isDark ? 0.28 : 0.12} />
          <stop offset="100%" stopColor={palette.glowSecondary} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="600" fill={palette.background} />

      <circle cx="220" cy="200" r="260" fill="url(#hero-glow-1)" />
      <circle cx="900" cy="180" r="220" fill="url(#hero-glow-2)" />
      <circle cx="600" cy="420" r="280" fill="url(#hero-glow-3)" />

      <path
        d="M0,380 C180,340 320,260 520,300 C720,340 940,460 1200,380 L1200,600 L0,600 Z"
        fill={palette.softOverlay}
      />

      {/* <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={isDark ? 0.45 : 0.25}>
        <path d="M80 260 Q200 220 340 260" stroke={palette.glowPrimary} strokeOpacity="0.5" />
        <path d="M950 160 Q1030 120 1120 170" stroke={palette.glowSecondary} strokeOpacity="0.45" />
        <path d="M460 420 Q600 360 720 420" stroke={palette.glowAccent} strokeOpacity="0.35" />
      </g> */}

      <g opacity={isDark ? 0.22 : 0.12}>
        <circle cx="180" cy="120" r="40" fill={palette.glowSecondary} />
        <circle cx="1080" cy="420" r="50" fill={palette.glowPrimary} />
        <circle cx="360" cy="460" r="35" fill={palette.glowAccent} />
      </g>
    </svg>
  );
};

export default HeroBackgroundSVG;
