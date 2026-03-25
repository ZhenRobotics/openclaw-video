/**
 * Premium Scene Components
 * High-end visual styles for business and luxury content
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { SceneData } from './types';
import { premiumTokens } from './premium-tokens';

// ============================================================================
// 1. ELEGANCE SCENE - Apple-style elegant presentation
// ============================================================================

interface PremiumSceneProps {
  scene: SceneData;
}

export const EleganceScene: React.FC<PremiumSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { elegance } = premiumTokens.colors;
  const typography = premiumTokens.typography.elegance;
  const effects = premiumTokens.effects.elegance;

  // Main title: 2-second slow fade-in with micro scale
  const titleOpacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const titleScale = interpolate(frame, [0, 60], [0.98, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const titleBlur = interpolate(frame, [0, 30], [5, 0], {
    extrapolateRight: 'clamp',
  });

  // Subtitle: delayed 0.5s, float up from bottom
  const subtitleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const subtitleTranslateY = interpolate(frame, [15, 45], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Gradient mask animation
  const maskY = interpolate(frame, [0, 45], [-100, 150], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const maskOpacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: elegance.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Gradient mask effect */}
      <div
        style={{
          position: 'absolute',
          top: `${maskY}%`,
          width: '100%',
          height: '200%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          pointerEvents: 'none',
          opacity: maskOpacity,
        }}
      />

      {/* Main content card */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '90%',
          padding: '40px 60px',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: `blur(${effects.blur}px) saturate(120%)`,
          borderRadius: '20px',
          boxShadow: effects.shadow,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          filter: `blur(${titleBlur}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: typography.fontFamily,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: elegance.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.2,
            margin: 0,
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {scene.subtitle && (
          <p
            style={{
              fontFamily: typography.fontFamily,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: elegance.secondary,
              marginTop: '20px',
              lineHeight: 1.4,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              textShadow: effects.textShadow,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 2. AUTHORITY SCENE - TED-style authoritative narrative
// ============================================================================

export const AuthorityScene: React.FC<PremiumSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { authority } = premiumTokens.colors;
  const typography = premiumTokens.typography.authority;
  const effects = premiumTokens.effects.authority;

  // Title: slide in from left
  const titleTranslateX = interpolate(frame, [0, 45], [-50, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Number counter animation
  const numberScale = interpolate(frame, [15, 45], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.2)),
  });

  const numberOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Quote line animation
  const lineWidth = interpolate(frame, [0, 30], [0, 60], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: 'transparent',  // ✅ 透明背景，显示底层视频
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px',
      }}
    >
      {/* Dark overlay for text readability - 移除，使用全局遮罩 */}

      {/* Quote line */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '35%',
          width: `${lineWidth}px`,
          height: '3px',
          background: authority.line,
          boxShadow: effects.lineShadow,
        }}
      />

      {/* Content container */}
      <div style={{ textAlign: 'left', maxWidth: '80%', marginLeft: '10%' }}>
        {/* Number display */}
        {scene.number && (
          <div
            style={{
              fontSize: `${typography.fontSize.number}px`,
              fontWeight: typography.fontWeight.number,
              fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.number,
              color: authority.number,
              marginBottom: '20px',
              opacity: numberOpacity,
              transform: `scale(${numberScale})`,
              textShadow: effects.textShadow,
            }}
          >
            {scene.number}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.title,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: authority.primary,
            lineHeight: 1.3,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateX(${titleTranslateX}px)`,
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {/* Subtitle */}
        {scene.subtitle && (
          <p
            style={{
              fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.subtitle,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: authority.primary,
              opacity: 0.7,
              marginTop: '15px',
              lineHeight: 1.5,
              textShadow: effects.subtitleShadow || effects.textShadow,  // 添加副标题阴影
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. LUXURY SCENE - High-end luxury brand style
// ============================================================================

export const LuxuryScene: React.FC<PremiumSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { luxury } = premiumTokens.colors;
  const typography = premiumTokens.typography.luxury;
  const effects = premiumTokens.effects.luxury;

  // Ultra-slow 3-second fade-in
  const titleOpacity = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

  // Brightness pulse (breathing effect)
  const brightness = interpolate(
    frame % 120,
    [0, 60, 120],
    [0.85, 1, 0.85],
    {
      easing: Easing.in(Easing.ease),
    }
  );

  // Gold sweep effect
  const sweepX = interpolate(frame, [30, 90], [-100, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const sweepOpacity = interpolate(frame, [30, 45, 75, 90], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: luxury.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Gold sweep effect */}
      <div
        style={{
          position: 'absolute',
          left: `${sweepX}%`,
          width: '30%',
          height: '100%',
          background: effects.goldGradient,
          pointerEvents: 'none',
          opacity: sweepOpacity,
          filter: `blur(${effects.blur}px)`,
        }}
      />

      {/* Main title */}
      <div style={{ textAlign: 'center', maxWidth: '85%' }}>
        <h1
          style={{
            fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.title,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: luxury.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.1,
            margin: 0,
            opacity: titleOpacity,
            filter: `brightness(${brightness})`,
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {/* Subtle decorative line */}
        <div
          style={{
            width: '120px',
            height: '1px',
            background: luxury.decorative,
            margin: '30px auto',
            opacity: titleOpacity,
          }}
        />

        {/* Subtitle */}
        {scene.subtitle && (
          <p
            style={{
              fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.subtitle,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: luxury.primary,
              opacity: titleOpacity * 0.8,
              marginTop: '20px',
              lineHeight: 1.6,
              textShadow: effects.textShadow,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 4. MINIMAL SCENE - Architecture and design style
// ============================================================================

export const MinimalScene: React.FC<PremiumSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { minimal } = premiumTokens.colors;
  const typography = premiumTokens.typography.minimal;

  // Geometric line expansion
  const lineWidth = interpolate(frame, [0, 30], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  // Letter stagger effect
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Letters appear one by one
  const letterCount = Math.floor(interpolate(frame, [0, 30], [0, scene.title.length], {
    extrapolateRight: 'clamp',
  }));

  const visibleTitle = scene.title.substring(0, letterCount);

  return (
    <AbsoluteFill
      style={{
        background: minimal.backgroundDark,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Top geometric line */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${lineWidth}%`,
          height: '2px',
          background: minimal.line,
        }}
      />

      {/* Main title with stagger */}
      <div style={{ textAlign: 'center', maxWidth: '90%' }}>
        <h1
          style={{
            fontFamily: typography.fontFamily,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: minimal.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.1,
            margin: 0,
            opacity: titleOpacity,
          }}
        >
          {visibleTitle}
        </h1>

        {/* Blue accent line */}
        <div
          style={{
            width: `${lineWidth}%`,
            height: '3px',
            background: minimal.accentBlue,
            margin: '25px auto 0',
            maxWidth: '200px',
          }}
        />

        {/* Subtitle */}
        {scene.subtitle && (
          <p
            style={{
              fontFamily: typography.fontFamily,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: minimal.primary,
              opacity: titleOpacity * 0.6,
              marginTop: '20px',
              lineHeight: 1.5,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>

      {/* Bottom geometric line */}
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${lineWidth}%`,
          height: '2px',
          background: minimal.line,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 5. CINEMATIC SCENE - Movie trailer style
// ============================================================================

export const CinematicScene: React.FC<PremiumSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { cinematic } = premiumTokens.colors;
  const typography = premiumTokens.typography.cinematic;
  const effects = premiumTokens.effects.cinematic;

  // Push-in camera effect (dolly zoom)
  const scale = interpolate(frame, [0, 75], [1.2, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Blur to focus
  const blur = interpolate(frame, [0, 40], [8, 0], {
    extrapolateRight: 'clamp',
  });

  // Fade in
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Lens flare position
  const flareX = interpolate(frame, [20, 60], [-20, 120], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const flareOpacity = interpolate(frame, [20, 40, 50, 60], [0, 0.6, 0.6, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: cinematic.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Cinematic black bars */}
      <div style={{ position: 'absolute', top: 0, width: '100%', height: '10%', background: '#000' }} />
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '10%', background: '#000' }} />

      {/* Vignette effect */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: effects.vignette,
          pointerEvents: 'none',
        }}
      />

      {/* Lens flare */}
      <div
        style={{
          position: 'absolute',
          left: `${flareX}%`,
          top: '40%',
          width: '200px',
          height: '400px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          opacity: flareOpacity,
          filter: `blur(${effects.blur}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '85%',
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      >
        <h1
          style={{
            fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.title,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: cinematic.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 0.95,
            margin: 0,
            textTransform: 'uppercase',
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {/* Red accent bar */}
        {scene.subtitle && (
          <>
            <div
              style={{
                width: '80px',
                height: '4px',
                background: cinematic.accentRed,
                margin: '25px auto',
              }}
            />
            <p
              style={{
                fontFamily: typeof typography.fontFamily === 'string' ? typography.fontFamily : typography.fontFamily.subtitle,
                fontSize: `${typography.fontSize.subtitle}px`,
                fontWeight: typography.fontWeight.subtitle,
                color: cinematic.primary,
                opacity: 0.9,
                marginTop: '20px',
                lineHeight: 1.4,
              }}
            >
              {scene.subtitle}
            </p>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
