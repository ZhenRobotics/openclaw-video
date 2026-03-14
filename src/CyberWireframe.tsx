import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  Video,
  staticFile,
} from 'remotion';
import { scenes, videoConfig } from './scenes-data';
import { SceneRenderer } from './SceneRenderer';
import { designTokens } from './styles/design-tokens';

export const CyberWireframe: React.FC<{
  audioPath?: string;
  bgVideo?: string;
  bgOpacity?: number;
  bgOverlayColor?: string;
}> = ({ audioPath, bgVideo, bgOpacity, bgOverlayColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Use prop values if provided, otherwise fall back to videoConfig
  const finalAudioPath = audioPath || videoConfig.audioPath;
  const finalBgVideo = bgVideo || videoConfig.bgVideo;
  const finalBgOpacity = bgOpacity !== undefined ? bgOpacity : (videoConfig.bgOpacity ?? 0.7);
  const finalBgOverlayColor = bgOverlayColor || videoConfig.bgOverlayColor || designTokens.colors.background.translucentDark;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: designTokens.colors.background.dark,
        fontFamily: designTokens.typography.fontFamily.primary,
      }}
    >
      {/* Global background video layer */}
      {finalBgVideo && (
        <Video
          src={staticFile(finalBgVideo)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: finalBgOpacity,
            zIndex: designTokens.layout.zIndex.background,
          }}
          volume={0}
          loop
        />
      )}

      {/* Dark overlay for better text visibility */}
      {finalBgVideo && (
        <AbsoluteFill
          style={{
            backgroundColor: finalBgOverlayColor,
            zIndex: designTokens.layout.zIndex.overlay,
          }}
        />
      )}

      {/* Audio track (if available) */}
      {finalAudioPath && (
        <Audio src={staticFile(finalAudioPath)} />
      )}

      {/* Render each scene */}
      {scenes.map((scene, index) => {
        const startFrame = Math.round(scene.start * fps);
        const durationInFrames = Math.round((scene.end - scene.start) * fps);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}

      {/* Debug info (optional, comment out in production) */}
      <div
        style={{
          position: 'absolute',
          top: designTokens.spacing[5],
          right: designTokens.spacing[5],
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: designTokens.typography.fontSize.xs,
          fontFamily: designTokens.typography.fontFamily.secondary,
          zIndex: designTokens.layout.zIndex.debug,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
        }}
      >
        {currentTime.toFixed(2)}s
      </div>
    </AbsoluteFill>
  );
};
