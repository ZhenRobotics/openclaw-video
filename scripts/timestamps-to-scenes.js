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
  timestamps-to-scenes.js <timestamps.json> [--out scenes-data.ts] [--audio audio.mp3]

Example:
  timestamps-to-scenes.js audio/example-timestamps.json
  timestamps-to-scenes.js audio/example-timestamps.json --out src/scenes-data.ts
  timestamps-to-scenes.js audio/generated-timestamps.json --audio audio/generated.mp3
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

// Parse args
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--out' && i + 1 < args.length) {
    outputFile = args[i + 1];
    i++;
  } else if (args[i] === '--audio' && i + 1 < args.length) {
    audioPath = args[i + 1];
    i++;
  }
}

// Auto-infer audio path from timestamps filename if not specified
if (!audioPath && inputFile.includes('-timestamps.json')) {
  const fullAudioPath = inputFile.replace('-timestamps.json', '.mp3');

  // Copy audio file to public directory if it exists
  if (fs.existsSync(fullAudioPath)) {
    const audioFileName = path.basename(fullAudioPath);
    const publicAudioPath = path.join('public', audioFileName);

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
  audioPath: ${audioPath ? `'${audioPath}'` : 'undefined'},  // Audio file path (relative to public/)
};
`;

// Write output
fs.writeFileSync(outputFile, tsCode, 'utf8');

console.log(`✅ Converted ${timestamps.length} segments to ${scenes.length} scenes`);
console.log(`📄 Output: ${outputFile}`);
console.log(`⏱️  Duration: ${duration.toFixed(2)}s (${durationInFrames} frames)`);
