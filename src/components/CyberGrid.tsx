import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { designTokens } from '../styles/design-tokens';

export const CyberGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.3 }) => {
  const frame = useCurrentFrame();

  // 网格移动动画
  const gridOffset = interpolate(
    frame,
    [0, 120],
    [0, 100],
    {
      extrapolateRight: 'extend',
    }
  );

  return (
    <AbsoluteFill
      style={{
        zIndex: designTokens.layout.zIndex.background + 1,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          opacity,
          transform: `translateY(${gridOffset % 100}px)`,
        }}
      >
        <defs>
          <pattern
            id="cyber-grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 255, 0)" />
            <stop offset="30%" stopColor="rgba(0, 255, 255, 1)" />
            <stop offset="70%" stopColor="rgba(0, 255, 255, 1)" />
            <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
          </linearGradient>
        </defs>

        <rect
          width="100%"
          height="200%"
          fill="url(#cyber-grid)"
          style={{
            opacity: 0.2,
          }}
        />

        {/* 水平扫描线 */}
        {Array.from({ length: 5 }, (_, i) => {
          const scanY = interpolate(
            (frame + i * 30) % 150,
            [0, 150],
            [-10, 110],
            { extrapolateRight: 'clamp' }
          );

          return (
            <line
              key={i}
              x1="0"
              y1={`${scanY}%`}
              x2="100%"
              y2={`${scanY}%`}
              stroke="rgba(0, 255, 255, 0.6)"
              strokeWidth="2"
              style={{
                filter: 'blur(3px)',
              }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
