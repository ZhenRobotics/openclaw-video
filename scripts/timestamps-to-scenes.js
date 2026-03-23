#!/usr/bin/env node
/**
 * Convert Whisper timestamps to Remotion scene data
 * Usage: node timestamps-to-scenes.js <timestamps.json> [--out scenes-data.ts]
 */

const fs = require('fs');
const path = require('path');

function usage() {
  console.error(`
Usage:
  timestamps-to-scenes.js <timestamps.json> [options]

Options:
  --out <file>           Output file path (default: src/scenes-data.ts)
  --audio <file>         Audio file path
  --bg-video <file>      Background video file (will be copied to public/)
  --bg-opacity <number>  Background video opacity (0-1, default: 0.3)
  --bg-overlay <color>   Background overlay color (default: rgba(10, 10, 15, 0.6))

Examples:
  timestamps-to-scenes.js audio/example-timestamps.json
  timestamps-to-scenes.js audio/example-timestamps.json --out src/scenes-data.ts
  timestamps-to-scenes.js audio/generated-timestamps.json --audio audio/generated.mp3
  timestamps-to-scenes.js audio/generated-timestamps.json --bg-video public/background.mp4 --bg-opacity 0.5
`);
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
  usage();
}

const inputFile = args[0];
let outputFile = 'src/scenes-data.ts';
let audioPath = undefined;
let bgVideoPath = undefined;
let bgOpacity = 0.3;
let bgOverlayColor = 'rgba(10, 10, 15, 0.6)';

// Parse args
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--out' && i + 1 < args.length) {
    outputFile = args[i + 1];
    i++;
  } else if (args[i] === '--audio' && i + 1 < args.length) {
    audioPath = args[i + 1];
    i++;
  } else if (args[i] === '--bg-video' && i + 1 < args.length) {
    bgVideoPath = args[i + 1];
    i++;
  } else if (args[i] === '--bg-opacity' && i + 1 < args.length) {
    bgOpacity = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '--bg-overlay' && i + 1 < args.length) {
    bgOverlayColor = args[i + 1];
    i++;
  }
}

// Auto-infer audio path from timestamps filename if not specified
if (!audioPath && inputFile.includes('-timestamps.json')) {
  const fullAudioPath = path.resolve(inputFile.replace('-timestamps.json', '.mp3'));

  // Copy audio file to public directory if it exists
  if (fs.existsSync(fullAudioPath)) {
    // Check file size (max 100MB for audio files)
    const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
    const stats = fs.statSync(fullAudioPath);

    if (stats.size > MAX_AUDIO_SIZE) {
      console.error(`❌ Audio file too large: ${(stats.size / 1024 / 1024).toFixed(1)}MB (max 100MB)`);
      process.exit(1);
    }

    const audioFileName = path.basename(fullAudioPath);
    const scriptDir = __dirname.endsWith('scripts') ? path.join(__dirname, '..') : __dirname;
    const publicAudioPath = path.resolve(scriptDir, 'public', audioFileName);

    // Create public directory if it doesn't exist
    const publicDir = path.dirname(publicAudioPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Copy to public directory
    fs.copyFileSync(fullAudioPath, publicAudioPath);
    console.log(`📂 Copied audio to: ${publicAudioPath}`);

    // Use filename only (relative to public/)
    audioPath = audioFileName;
  } else {
    console.log(`⚠️  Audio file not found: ${fullAudioPath}`);
    audioPath = undefined;
  }
}

// Process background video if provided
if (bgVideoPath) {
  const fullBgVideoPath = path.resolve(bgVideoPath);

  if (fs.existsSync(fullBgVideoPath)) {
    // Check file size (max 500MB to prevent DoS)
    const MAX_BG_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
    const stats = fs.statSync(fullBgVideoPath);

    if (stats.size > MAX_BG_VIDEO_SIZE) {
      console.error(`❌ Background video too large: ${(stats.size / 1024 / 1024).toFixed(1)}MB (max 500MB)`);
      process.exit(1);
    }

    const bgVideoFileName = path.basename(fullBgVideoPath);
    const scriptDir = __dirname.endsWith('scripts') ? path.join(__dirname, '..') : __dirname;
    const publicBgVideoPath = path.resolve(scriptDir, 'public', bgVideoFileName);

    // Create public directory if it doesn't exist
    const publicDir = path.dirname(publicBgVideoPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Copy to public directory
    fs.copyFileSync(fullBgVideoPath, publicBgVideoPath);
    console.log(`🎬 Copied background video to: ${publicBgVideoPath}`);

    // Use filename only (relative to public/)
    bgVideoPath = bgVideoFileName;
  } else {
    console.log(`⚠️  Background video file not found: ${fullBgVideoPath}`);
    bgVideoPath = undefined;
  }
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Read timestamps
const timestamps = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Determine scene types based on content
function determineSceneType(index, total, text) {
  if (index === 0) return 'title';
  if (index === total - 1) return 'end';

  // Simple heuristics
  if (text.includes('90%') || text.includes('%')) return 'emphasis';
  if (text.includes('说') || text.includes('问题')) return 'pain';
  if (text.includes('真相') || text.includes('但')) return 'content';

  return 'content';
}

// Determine Xiaomo action
function determineXiaomo(sceneType, index, total) {
  const actions = {
    'title': 'peek',
    'pain': null,
    'emphasis': 'think',
    'circle': 'circle',
    'content': 'point',
    'end': 'wave',
  };
  return actions[sceneType] || null;
}

// Extract highlight words
function extractHighlight(text) {
  const keywords = ['Copilot', 'GPT', 'GPT-5', 'GPT5', 'Gemini', 'AI', '90%', '10倍'];
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

// Convert timestamps to scenes
const scenes = timestamps.map((segment, index) => {
  const sceneType = determineSceneType(index, timestamps.length, segment.text);
  const xiaomo = determineXiaomo(sceneType, index, timestamps.length);
  const highlight = extractHighlight(segment.text);

  const scene = {
    start: segment.start,
    end: segment.end,
    type: sceneType,
    title: segment.text,
  };

  if (highlight) {
    scene.highlight = highlight;
  }

  if (xiaomo) {
    scene.xiaomo = xiaomo;
  }

  return scene;
});

// Calculate video duration
const duration = timestamps[timestamps.length - 1].end;
const durationInFrames = Math.ceil(duration * 30); // 30 fps

// Generate TypeScript code
const tsCode = `import { SceneData } from './types';

// Auto-generated from Whisper timestamps
// Generated at: ${new Date().toISOString()}
export const scenes: SceneData[] = ${JSON.stringify(scenes, null, 2)};

// Video metadata
export const videoConfig = {
  fps: 30,
  width: 1080,
  height: 1920,  // Vertical video for 视频号
  durationInFrames: ${durationInFrames},  // ${duration.toFixed(2)} seconds * 30 fps
  audioPath: ${audioPath ? `'${audioPath}'` : 'undefined'},  // Audio file path (relative to public/)${bgVideoPath ? `
  bgVideo: '${bgVideoPath}',  // Background video file (relative to public/)
  bgOpacity: ${bgOpacity},  // Background video opacity (0-1)
  bgOverlayColor: '${bgOverlayColor}',  // Overlay color for better text visibility` : ''}
};
`;

// Write output
fs.writeFileSync(outputFile, tsCode, 'utf8');

console.log(`✅ Converted ${timestamps.length} segments to ${scenes.length} scenes`);
console.log(`📄 Output: ${outputFile}`);
console.log(`⏱️  Duration: ${duration.toFixed(2)}s (${durationInFrames} frames)`);
