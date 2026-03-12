import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Video, staticFile } from 'remotion';
import { SceneData } from './types';

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
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
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
              zIndex: 0,
            }}
            volume={0}
            loop
          />
          {/* Dark overlay for scene background */}
          <AbsoluteFill style={{ backgroundColor: 'rgba(10, 10, 15, 0.6)', zIndex: 1 }} />
        </>
      )}

      {/* Main title with background bar */}
      <div
        style={{
          position: 'relative',
          padding: '15px 50px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85), rgba(0,0,0,0.6))',
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          zIndex: 2,
          maxWidth: '90%',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: scene.color || '#FFFFFF',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            transform: `scale(${animation.scale}) translateY(${animation.translateY}px)`,
            opacity: animation.opacity,
            textShadow: scene.type === 'title'
              ? animation.glitch
              : `
                0 0 10px rgba(0, 255, 255, 0.4),
                0 0 20px rgba(0, 255, 255, 0.2),
                0 4px 10px rgba(0, 0, 0, 0.9),
                -2px -2px 0 rgba(0, 0, 0, 0.8),
                2px -2px 0 rgba(0, 0, 0, 0.8),
                -2px 2px 0 rgba(0, 0, 0, 0.8),
                2px 2px 0 rgba(0, 0, 0, 0.8)
              `,
            lineHeight: 1.2,
          }}
        >
          {highlightText(scene.title, scene.highlight)}
        </div>
      </div>

      {/* Subtitle */}
      {scene.subtitle && (
        <div
          style={{
            fontSize: 40,
            color: '#888888',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            marginTop: 40,
            opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
            position: 'relative',
            zIndex: 2,
          }}
        >
          {highlightText(scene.subtitle, scene.highlight)}
        </div>
      )}

      {/* Number highlight */}
      {scene.number && (
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: '#FFD700',
            position: 'absolute',
            top: '40%',
            transform: `scale(${spring({ frame, fps, from: 0, to: 1 })})`,
            zIndex: 2,
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
            bottom: 100,
            right: 100,
            fontSize: 60,
            zIndex: 2,
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
    scale: spring({ frame, fps, from: 0.8, to: 1 }),
    translateY: 0,
    opacity: 1,
    glitch: `${glitchAmount}px 0 0 rgba(255, 0, 0, 0.7), ${-glitchAmount}px 0 0 rgba(0, 255, 255, 0.7)`,
  };
}

function getEmphasisAnimation(frame: number, fps: number) {
  return {
    scale: spring({ frame, fps, from: 1.5, to: 1, config: { damping: 10 } }),
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
    scale: spring({ frame, fps, from: 0.5, to: 1 }),
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
            <span style={{ color: '#00FFFF' }}>{highlight}</span>
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
