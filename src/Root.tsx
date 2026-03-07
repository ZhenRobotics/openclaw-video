import { Composition } from 'remotion';
import { CyberWireframe } from './CyberWireframe.js';
import { videoConfig } from './scenes-data.js';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={CyberWireframe}
        durationInFrames={videoConfig.durationInFrames}
        fps={videoConfig.fps}
        width={videoConfig.width}
        height={videoConfig.height}
        defaultProps={{}}
      />
    </>
  );
};
