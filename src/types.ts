// Scene data structure for video generation
export interface SceneData {
  start: number;        // Start time in seconds
  end: number;          // End time in seconds
  type: SceneType;      // Scene animation type
  title: string;        // Main title text
  subtitle?: string;    // Optional subtitle
  number?: string;      // Optional number to highlight
  highlight?: string;   // Optional text to highlight
  xiaomo?: XiaomoAction; // Optional mascot action
}

export type SceneType =
  | 'title'       // Title scene with glitch effect
  | 'emphasis'    // Emphasis with slam effect
  | 'pain'        // Pain point scene
  | 'circle'      // Circle highlight with paw
  | 'content'     // Regular content scene
  | 'end';        // Ending scene

export type XiaomoAction =
  | 'peek'        // Peeking from corner
  | 'lie'         // Lying down
  | 'point'       // Pointing
  | 'circle'      // Drawing circle
  | 'think'       // Thinking pose
  | 'wave';       // Waving

// Video configuration
export interface VideoConfig {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  audioPath?: string;
}
