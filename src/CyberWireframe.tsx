import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Video,
  staticFile,
  Series,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
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
  const finalBgOpacity =
    bgOpacity !== undefined ? bgOpacity : videoConfig.bgOpacity ?? 0.7;
  const finalBgOverlayColor =
    bgOverlayColor ||
    videoConfig.bgOverlayColor ||
    designTokens.colors.background.translucentDark;

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
      {finalAudioPath && <Audio src={staticFile(finalAudioPath)} />}

      {/* Render scenes with transitions */}
      <TransitionSeries>
        {scenes.map((scene, index) => {
          const durationInFrames = Math.round((scene.end - scene.start) * fps);

          // Choose transition type based on scene type
          const getTransition = () => {
            if (index >= scenes.length - 1) return null;

            const nextScene = scenes[index + 1];

            // Different transitions for different scene types
            if (scene.type === 'title' || nextScene.type === 'title') {
              // Wipe transition for title scenes
              return wipe({ direction: 'from-left' });
            } else if (scene.type === 'end') {
              // Slide up for end scenes
              return slide({ direction: 'from-bottom' });
            } else {
              // Default: slide from right
              return slide({ direction: 'from-right' });
            }
          };

          const transition = getTransition();
          const transitionDuration = 15; // 0.5 seconds at 30fps

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={durationInFrames}>
                <SceneRenderer scene={scene} />
              </TransitionSeries.Sequence>

              {transition && (
                <TransitionSeries.Transition
                  presentation={transition}
                  timing={linearTiming({ durationInFrames: transitionDuration })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

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
