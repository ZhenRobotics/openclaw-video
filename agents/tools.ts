#!/usr/bin/env node
/**
 * Video Generation Tools for OpenClaw Agent
 *
 * These tools can be called by the OpenClaw Agent to generate videos.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const WORK_DIR = '/home/justin/openclaw-video';
const AUDIO_DIR = path.join(WORK_DIR, 'audio');
const OUTPUT_DIR = path.join(WORK_DIR, 'out');

interface TTSParams {
  text: string;
  voice?: string;
  speed?: number;
  output_file: string;
}

interface WhisperParams {
  audio_file: string;
}

interface ScenesParams {
  timestamps_file: string;
}

interface RenderParams {
  output_file: string;
  audio_file: string;
}

interface OptimizeScriptParams {
  original_script: string;
  target_duration?: number;
  style?: string;
}

/**
 * Tool: generate_tts
 * Generate speech from text using OpenAI TTS
 */
export async function generate_tts(params: TTSParams): Promise<{ success: boolean; audio_path: string; error?: string }> {
  try {
    const { text, voice = 'nova', speed = 1.15, output_file } = params;

    // Ensure output path
    const audioPath = path.join(AUDIO_DIR, output_file);

    // Call TTS script
    const cmd = `cd ${WORK_DIR} && ./scripts/tts-generate.sh "${text.replace(/"/g, '\\"')}" --out "${audioPath}" --voice ${voice} --speed ${speed}`;

    console.log('[TTS] Generating speech...');
    const result = execSync(cmd, { encoding: 'utf-8' });

    return {
      success: true,
      audio_path: audioPath,
    };
  } catch (error) {
    return {
      success: false,
      audio_path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Tool: extract_timestamps
 * Extract timestamps from audio using Whisper
 */
export async function extract_timestamps(params: WhisperParams): Promise<{ success: boolean; timestamps_path: string; error?: string }> {
  try {
    const { audio_file } = params;

    // Call Whisper script
    const cmd = `cd ${WORK_DIR} && ./scripts/whisper-timestamps.sh "${audio_file}"`;

    console.log('[Whisper] Extracting timestamps...');
    const result = execSync(cmd, { encoding: 'utf-8' });

    // Parse output to get timestamps file path
    const timestampsPath = result.trim();

    return {
      success: true,
      timestamps_path: timestampsPath,
    };
  } catch (error) {
    return {
      success: false,
      timestamps_path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Tool: generate_scenes
 * Convert Whisper timestamps to Remotion scenes
 */
export async function generate_scenes(params: ScenesParams): Promise<{ success: boolean; scenes_path: string; error?: string }> {
  try {
    const { timestamps_file } = params;

    // Call scene conversion script
    const cmd = `cd ${WORK_DIR} && node scripts/timestamps-to-scenes.js "${timestamps_file}"`;

    console.log('[Scenes] Converting timestamps to scenes...');
    execSync(cmd, { encoding: 'utf-8' });

    const scenesPath = path.join(WORK_DIR, 'src/scenes-data.ts');

    return {
      success: true,
      scenes_path: scenesPath,
    };
  } catch (error) {
    return {
      success: false,
      scenes_path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Tool: render_video
 * Render video using Remotion
 */
export async function render_video(params: RenderParams): Promise<{ success: boolean; video_path: string; error?: string }> {
  try {
    const { output_file, audio_file } = params;

    // Ensure output path
    const videoPath = path.join(OUTPUT_DIR, output_file);
    const absoluteAudioPath = path.resolve(audio_file);

    // Call Remotion render
    const cmd = `cd ${WORK_DIR} && pnpm exec remotion render Main "${videoPath}" --props '{"audioPath": "${absoluteAudioPath}"}'`;

    console.log('[Remotion] Rendering video...');
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });

    return {
      success: true,
      video_path: videoPath,
    };
  } catch (error) {
    return {
      success: false,
      video_path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Tool: optimize_script
 * Optimize script for short video format
 */
export async function optimize_script(params: OptimizeScriptParams): Promise<{ success: boolean; optimized_script: string; suggestions: string[]; error?: string }> {
  try {
    const { original_script, target_duration = 15, style = '快节奏' } = params;

    // Simple optimization heuristics
    const suggestions: string[] = [];
    let optimized = original_script;

    // Count sentences
    const sentences = original_script.split(/[。！？]/).filter(s => s.trim());
    const estimatedDuration = sentences.length * 2.5; // ~2.5s per sentence

    suggestions.push(`📊 原脚本分析：${sentences.length} 句话，预计 ${estimatedDuration.toFixed(1)} 秒`);

    if (estimatedDuration > target_duration * 1.2) {
      suggestions.push('⚠️  脚本稍长，建议精简语句或加快语速');
    } else if (estimatedDuration < target_duration * 0.8) {
      suggestions.push('💡 脚本稍短，可以增加更多内容或细节');
    } else {
      suggestions.push('✅ 脚本长度适中');
    }

    // Style-specific suggestions
    if (style === '快节奏') {
      suggestions.push('🚀 快节奏风格：每句话尽量简短有力，使用数字和对比');
      if (!original_script.match(/\d+/)) {
        suggestions.push('💡 建议：加入具体数字（如"90%"、"10倍"）增强说服力');
      }
    } else if (style === '教程') {
      suggestions.push('📚 教程风格：使用"第一步"、"第二步"等结构化表达');
    }

    // Check for keywords
    const keywords = ['AI', 'GPT', 'Copilot', 'Gemini'];
    const foundKeywords = keywords.filter(kw => original_script.includes(kw));
    if (foundKeywords.length > 0) {
      suggestions.push(`🎯 检测到关键词：${foundKeywords.join('、')}，将自动高亮显示`);
    }

    return {
      success: true,
      optimized_script: optimized,
      suggestions,
    };
  } catch (error) {
    return {
      success: false,
      optimized_script: '',
      suggestions: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Complete pipeline: script to video
 */
export async function complete_pipeline(
  script: string,
  options: {
    voice?: string;
    speed?: number;
    output_name?: string;
  } = {}
): Promise<{ success: boolean; video_path?: string; error?: string; steps: string[] }> {
  const steps: string[] = [];
  const { voice = 'nova', speed = 1.15, output_name = 'generated' } = options;

  try {
    // Step 1: Optimize script
    steps.push('🔍 Step 1/5: Analyzing script...');
    const optimizeResult = await optimize_script({ original_script: script });
    if (!optimizeResult.success) throw new Error(optimizeResult.error);
    steps.push(...optimizeResult.suggestions);

    // Step 2: Generate TTS
    steps.push('🎤 Step 2/5: Generating speech...');
    const ttsResult = await generate_tts({
      text: script,
      voice,
      speed,
      output_file: `${output_name}.mp3`,
    });
    if (!ttsResult.success) throw new Error(ttsResult.error);
    steps.push(`✅ Audio generated: ${ttsResult.audio_path}`);

    // Step 3: Extract timestamps
    steps.push('⏱️  Step 3/5: Extracting timestamps...');
    const whisperResult = await extract_timestamps({
      audio_file: ttsResult.audio_path,
    });
    if (!whisperResult.success) throw new Error(whisperResult.error);
    steps.push(`✅ Timestamps extracted: ${whisperResult.timestamps_path}`);

    // Step 4: Generate scenes
    steps.push('🎬 Step 4/5: Creating scenes...');
    const scenesResult = await generate_scenes({
      timestamps_file: whisperResult.timestamps_path,
    });
    if (!scenesResult.success) throw new Error(scenesResult.error);
    steps.push(`✅ Scenes created: ${scenesResult.scenes_path}`);

    // Step 5: Render video
    steps.push('🎨 Step 5/5: Rendering video...');
    const renderResult = await render_video({
      output_file: `${output_name}.mp4`,
      audio_file: ttsResult.audio_path,
    });
    if (!renderResult.success) throw new Error(renderResult.error);
    steps.push(`✅ Video rendered: ${renderResult.video_path}`);

    return {
      success: true,
      video_path: renderResult.video_path,
      steps,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      steps,
    };
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'test') {
    // Test the complete pipeline
    const testScript = '三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。OpenAI说GPT5能替代大部分程序员。Google说Gemini2.0改变游戏规则。但真相是什么？AI不会取代开发者，而是让优秀开发者效率提升十倍。关注我学习AI工具。';

    console.log('🚀 Testing video generation pipeline...\n');

    complete_pipeline(testScript, { output_name: 'test-agent' })
      .then((result) => {
        if (result.success) {
          console.log('\n✅ Pipeline completed successfully!');
          console.log(`\n📹 Video: ${result.video_path}`);
          console.log('\nSteps:');
          result.steps.forEach(step => console.log(`  ${step}`));
        } else {
          console.error('\n❌ Pipeline failed:', result.error);
          console.log('\nCompleted steps:');
          result.steps.forEach(step => console.log(`  ${step}`));
        }
      })
      .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage: node tools.ts test');
  }
}
