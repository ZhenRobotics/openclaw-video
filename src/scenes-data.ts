import { SceneData } from './types';

// Auto-generated from Whisper timestamps
// Generated at: 2026-03-03T05:39:57.189Z
export const scenes: SceneData[] = [
  {
    "start": 0,
    "end": 2.4000000953674316,
    "type": "title",
    "title": "视频三家巨头同一天说了一件事",
    "xiaomo": "peek"
  },
  {
    "start": 2.4000000953674316,
    "end": 5.599999904632568,
    "type": "emphasis",
    "title": "微软说Copilot已经能写掉90%的代码",
    "highlight": "Copilot",
    "xiaomo": "think"
  },
  {
    "start": 5.599999904632568,
    "end": 9,
    "type": "pain",
    "title": "OpenAI说GPT-5能替代大部分程序员",
    "highlight": "GPT"
  },
  {
    "start": 9,
    "end": 11.800000190734863,
    "type": "pain",
    "title": "Google说Gemini 2.0改变游戏规则",
    "highlight": "Gemini"
  },
  {
    "start": 11.800000190734863,
    "end": 13,
    "type": "content",
    "title": "但真相是什么",
    "xiaomo": "point"
  },
  {
    "start": 13,
    "end": 14.699999809265137,
    "type": "content",
    "title": "AI不会取代开发者",
    "highlight": "AI",
    "xiaomo": "point"
  },
  {
    "start": 14.699999809265137,
    "end": 17.600000381469727,
    "type": "content",
    "title": "而是让优秀开发者效率提升10倍",
    "highlight": "10倍",
    "xiaomo": "point"
  },
  {
    "start": 17.600000381469727,
    "end": 19,
    "type": "end",
    "title": "关注我学习AI工具",
    "highlight": "AI",
    "xiaomo": "wave"
  }
];

// Video metadata
export const videoConfig = {
  fps: 30,
  width: 1080,
  height: 1920,  // Vertical video for 视频号
  durationInFrames: 570,  // 19.00 seconds * 30 fps
  audioPath: 'generated.mp3',  // Audio file path (relative to public/)
};
