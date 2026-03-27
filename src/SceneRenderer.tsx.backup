import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Video, staticFile } from 'remotion';
import { SceneData } from './types';
import { designTokens, getTextShadow, getGlitchShadow } from './styles/design-tokens';

interface SceneRendererProps {
  scene: SceneData;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation logic based on scene type
  const getAnimation = () => {
    switch (scene.type) {
      case 'title':
        return getTitleAnimation(frame, fps);
      case 'emphasis':
        return getEmphasisAnimation(frame, fps);
      case 'pain':
        return getPainAnimation(frame, fps);
      case 'circle':
        return getCircleAnimation(frame, fps);
      case 'end':
        return getEndAnimation(frame, fps);
      default:
        return getContentAnimation(frame, fps);
    }
  };

  const animation = getAnimation();

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: designTokens.spacing[40],  // 150px
      }}
    >
      {/* Scene-specific background video (overrides global background) */}
      {scene.bgVideo && (
        <>
          <Video
            src={staticFile(scene.bgVideo)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: scene.bgOpacity ?? 0.3,
              zIndex: designTokens.layout.zIndex.background,
            }}
            volume={0}
            loop
          />
          {/* Dark overlay for scene background */}
          <AbsoluteFill
            style={{
              backgroundColor: designTokens.colors.background.translucentLight,
              zIndex: designTokens.layout.zIndex.overlay,
            }}
          />
        </>
      )}

      {/* Main title with background bar */}
      <div
        style={{
          position: 'relative',
          padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`,  // ~15px 50px
          background: designTokens.colors.gradients.darkenCenter,
          borderRadius: designTokens.effects.borderRadius.md,
          backdropFilter: designTokens.effects.blur.medium,
          boxShadow: designTokens.effects.shadow.soft,
          zIndex: designTokens.layout.zIndex.content,
          maxWidth: designTokens.layout.maxWidth.text,
        }}
      >
        <div
          style={{
            fontSize: designTokens.typography.fontSize['5xl'],  // 80px
            fontWeight: designTokens.typography.fontWeight.bold,
            fontFamily: designTokens.typography.fontFamily.primary,
            color: scene.color || designTokens.colors.text.primary,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            transform: `scale(${animation.scale}) translateY(${animation.translateY}px)`,
            opacity: animation.opacity,
            textShadow: scene.type === 'title'
              ? animation.glitch
              : designTokens.effects.textEffect.cyberGlow,
            lineHeight: designTokens.typography.lineHeight.normal,
            letterSpacing: designTokens.typography.letterSpacing.tight,
          }}
        >
          {highlightText(scene.title, scene.highlight)}
        </div>
      </div>

      {/* Subtitle */}
      {scene.subtitle && (
        <div
          style={{
            fontSize: designTokens.typography.fontSize['2xl'],  // 40px
            fontFamily: designTokens.typography.fontFamily.primary,
            fontWeight: designTokens.typography.fontWeight.regular,
            color: designTokens.colors.text.tertiary,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            marginTop: designTokens.spacing[10],  // 40px
            opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            position: 'relative',
            zIndex: designTokens.layout.zIndex.content,
            textShadow: designTokens.effects.textEffect.subtleDepth,
            lineHeight: designTokens.typography.lineHeight.relaxed,
          }}
        >
          {highlightText(scene.subtitle, scene.highlight)}
        </div>
      )}

      {/* Number highlight */}
      {scene.number && (
        <div
          style={{
            fontSize: designTokens.typography.fontSize['6xl'],  // 120px
            fontFamily: designTokens.typography.fontFamily.primary,
            fontWeight: designTokens.typography.fontWeight.bold,
            color: designTokens.colors.accent.gold,
            position: 'absolute',
            top: '40%',
            transform: `scale(${spring({
              frame,
              fps,
              from: 0,
              to: 1,
              config: designTokens.animation.spring.bouncy,
            })})`,
            zIndex: designTokens.layout.zIndex.content,
            textShadow: designTokens.effects.textEffect.goldShine,
            letterSpacing: designTokens.typography.letterSpacing.normal,
          }}
        >
          {scene.number}
        </div>
      )}

      {/* Xiaomo mascot placeholder */}
      {scene.xiaomo && (
        <div
          style={{
            position: 'absolute',
            bottom: designTokens.spacing[24],  // ~100px
            right: designTokens.spacing[24],   // ~100px
            fontSize: 60,
            zIndex: designTokens.layout.zIndex.foreground,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))',
          }}
        >
          {getXiaomoEmoji(scene.xiaomo)}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Animation functions
function getTitleAnimation(frame: number, fps: number) {
  const glitchAmount = Math.sin(frame * 0.5) * 3;
  return {
    scale: spring({
      frame,
      fps,
      from: 0.8,
      to: 1,
      config: designTokens.animation.spring.smooth,
    }),
    translateY: 0,
    opacity: 1,
    glitch: getGlitchShadow(glitchAmount),
  };
}

function getEmphasisAnimation(frame: number, fps: number) {
  return {
    scale: spring({
      frame,
      fps,
      from: 1.5,
      to: 1,
      config: designTokens.animation.spring.bouncy,
    }),
    translateY: 0,
    opacity: 1,
    glitch: '',
  };
}

function getPainAnimation(frame: number, fps: number) {
  return {
    scale: 1,
    translateY: interpolate(frame, [0, 10], [-50, 0], { extrapolateRight: 'clamp' }),
    opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
    glitch: '',
  };
}

function getCircleAnimation(frame: number, fps: number) {
  return {
    scale: 1,
    translateY: 0,
    opacity: 1,
    glitch: '',
  };
}

function getContentAnimation(frame: number, fps: number) {
  return {
    scale: 1,
    translateY: interpolate(frame, [0, 20], [80, 0], { extrapolateRight: 'clamp' }),  // Slide up from bottom
    opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
    glitch: '',
  };
}

function getEndAnimation(frame: number, fps: number) {
  return {
    scale: spring({
      frame,
      fps,
      from: 0.5,
      to: 1,
      config: designTokens.animation.spring.gentle,
    }),
    translateY: 0,
    opacity: 1,
    glitch: '',
  };
}

// Helper function to highlight specific text
function highlightText(text: string, highlight?: string) {
  if (!highlight) return text;

  const parts = text.split(highlight);
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span
              style={{
                color: designTokens.colors.primary.cyan,
                textShadow: designTokens.effects.glow.cyan.strong,
              }}
            >
              {highlight}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// Placeholder mascot emojis (will be replaced with SVG later)
function getXiaomoEmoji(action: string): string {
  const emojis: Record<string, string> = {
    peek: '👀',
    lie: '😺',
    point: '👉',
    circle: '⭕',
    think: '🤔',
    wave: '👋',
  };
  return emojis[action] || '🐱';
}
