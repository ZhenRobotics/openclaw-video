import { SceneData } from './types';

// Premium Styles Test - Showcasing all 5 new high-end styles
export const scenes: SceneData[] = [
  // 1. Elegance - Apple-style opening
  {
    start: 0,
    end: 3,
    type: 'elegance',
    styleTheme: 'premium',
    title: 'OpenClaw Video Generator',
    subtitle: '高端风格系统',
  },

  // 2. Authority - Data-driven narrative
  {
    start: 3,
    end: 6,
    type: 'authority',
    styleTheme: 'premium',
    title: '专业级视觉系统',
    number: '11',
    subtitle: '种场景风格可选',
  },

  // 3. Luxury - High-end texture
  {
    start: 6,
    end: 9,
    type: 'luxury',
    styleTheme: 'premium',
    title: '奢华质感',
    subtitle: '极致克制之美',
  },

  // 4. Minimal - Geometric simplicity
  {
    start: 9,
    end: 12,
    type: 'minimal',
    styleTheme: 'premium',
    title: '极简几何',
    subtitle: '设计的力量',
  },

  // 5. Cinematic - Movie trailer style
  {
    start: 12,
    end: 15,
    type: 'cinematic',
    styleTheme: 'premium',
    title: '电影级叙事',
    subtitle: '震撼视觉体验',
  },

  // 6. Compare with Cyber style (existing)
  {
    start: 15,
    end: 18,
    type: 'emphasis',
    styleTheme: 'cyber',
    title: '赛博炫酷风格',
    xiaomo: 'point',
  },
];

export const videoConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 540, // 18 seconds * 30 fps
  audioPath: 'premium-styles-test.mp3',
};
