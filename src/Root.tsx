import { Composition } from 'remotion';
import { CyberWireframe } from './CyberWireframe';
import { videoConfig } from './scenes-data';

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
