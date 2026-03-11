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
  const finalBgOverlayColor = bgOverlayColor || videoConfig.bgOverlayColor || 'rgba(10, 10, 15, 0.25)';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F', // Dark background (fallback)
        fontFamily: 'Arial, sans-serif',
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
          }}
          volume={0}
          loop
        />
      )}

      {/* Dark overlay for better text visibility */}
      {finalBgVideo && (
        <AbsoluteFill style={{ backgroundColor: finalBgOverlayColor }} />
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
          top: 20,
          right: 20,
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: 14,
        }}
      >
        {currentTime.toFixed(2)}s
      </div>
    </AbsoluteFill>
  );
};
