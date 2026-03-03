import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from 'remotion';
import { scenes, videoConfig } from './scenes-data';
import { SceneRenderer } from './SceneRenderer';

export const CyberWireframe: React.FC<{ audioPath?: string }> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Use prop audioPath if provided, otherwise fall back to videoConfig
  const finalAudioPath = audioPath || videoConfig.audioPath;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0F', // Dark background
        fontFamily: 'Arial, sans-serif',
      }}
    >
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
