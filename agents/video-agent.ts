#!/usr/bin/env node
/**
 * Video Generation Agent for OpenClaw
 *
 * This agent receives natural language requests and generates videos automatically.
 */

import { complete_pipeline, optimize_script } from './tools';

interface AgentRequest {
  type: 'generate_video' | 'optimize_script' | 'help';
  script?: string;
  voice?: string;
  speed?: number;
  output_name?: string;
  target_duration?: number;
  style?: string;
}

interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Main agent handler
 */
export async function handleRequest(request: AgentRequest): Promise<AgentResponse> {
  try {
    switch (request.type) {
      case 'generate_video':
        return await handleGenerateVideo(request);

      case 'optimize_script':
        return await handleOptimizeScript(request);

      case 'help':
        return handleHelp();

      default:
        return {
          success: false,
          message: '未知的请求类型',
          error: `Invalid request type: ${(request as any).type}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      message: '处理请求时发生错误',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handle video generation request
 */
async function handleGenerateVideo(request: AgentRequest): Promise<AgentResponse> {
  const { script, voice, speed, output_name } = request;

  if (!script) {
    return {
      success: false,
      message: '缺少脚本内容',
      error: 'Script is required',
    };
  }

  console.log('🎬 墨影开始工作：生成视频\n');

  const result = await complete_pipeline(script, {
    voice,
    speed,
    output_name,
  });

  if (result.success) {
    return {
      success: true,
      message: `✅ 视频生成完成！\n\n📹 视频路径：${result.video_path}\n\n执行步骤：\n${result.steps.join('\n')}`,
      data: {
        video_path: result.video_path,
        steps: result.steps,
      },
    };
  } else {
    return {
      success: false,
      message: `❌ 视频生成失败\n\n已完成步骤：\n${result.steps.join('\n')}`,
      error: result.error,
      data: {
        steps: result.steps,
      },
    };
  }
}

/**
 * Handle script optimization request
 */
async function handleOptimizeScript(request: AgentRequest): Promise<AgentResponse> {
  const { script, target_duration, style } = request;

  if (!script) {
    return {
      success: false,
      message: '缺少脚本内容',
      error: 'Script is required',
    };
  }

  const result = await optimize_script({
    original_script: script,
    target_duration,
    style,
  });

  if (result.success) {
    return {
      success: true,
      message: `📝 脚本分析完成\n\n${result.suggestions.join('\n')}\n\n优化后的脚本：\n${result.optimized_script}`,
      data: {
        optimized_script: result.optimized_script,
        suggestions: result.suggestions,
      },
    };
  } else {
    return {
      success: false,
      message: '脚本优化失败',
      error: result.error,
    };
  }
}

/**
 * Handle help request
 */
function handleHelp(): AgentResponse {
  return {
    success: true,
    message: `
🎬 墨影 - 视频生成助手

我可以帮你：
1. 📹 自动生成短视频（从文本到视频的完整流程）
2. 📝 优化视频脚本（分析长度、风格、关键词）
3. 🎨 提供视频制作建议

使用示例：

**生成视频：**
"帮我生成一个关于 AI 工具的视频"
"这是我的脚本：[你的脚本内容]"

**优化脚本：**
"帮我分析一下这个脚本"
"这个脚本适合做视频吗？"

**配置选项：**
- 声音：alloy / echo / nova(推荐) / shimmer
- 语速：0.25 - 4.0 (推荐 1.15)
- 风格：快节奏 / 教程 / 讲解 / 营销

视频规格：
- 分辨率：1080 x 1920 (竖屏)
- 帧率：30 fps
- 风格：赛博线框，霓虹色彩
- 时长：自动根据脚本计算
    `.trim(),
  };
}

/**
 * Parse natural language input into AgentRequest
 */
export function parseInput(input: string): AgentRequest {
  const lowerInput = input.toLowerCase();

  // Detect request type
  if (lowerInput.includes('帮助') || lowerInput.includes('help') || lowerInput === '?') {
    return { type: 'help' };
  }

  if (lowerInput.includes('分析') || lowerInput.includes('优化') || lowerInput.includes('检查脚本')) {
    // Extract script content
    const script = extractScript(input);
    return {
      type: 'optimize_script',
      script,
    };
  }

  // Default: generate video
  const script = extractScript(input);
  const voice = extractVoice(input);
  const speed = extractSpeed(input);

  return {
    type: 'generate_video',
    script,
    voice,
    speed,
  };
}

/**
 * Extract script content from input
 */
function extractScript(input: string): string {
  // Remove common prefixes
  let script = input
    .replace(/^(帮我|请|麻烦)?(生成|制作|做|创建|分析|优化|检查)?(一下)?(一个|个)?(关于|有关)?/i, '')
    .replace(/^(这是|我的|这个)?脚本[：:]/i, '')
    .trim();

  // If script starts with quotes, extract content
  const quoteMatch = script.match(/^["'](.*?)["']$/);
  if (quoteMatch) {
    script = quoteMatch[1];
  }

  return script;
}

/**
 * Extract voice preference from input
 */
function extractVoice(input: string): string | undefined {
  const voiceMatch = input.match(/声音[:：]?\s*(alloy|echo|fable|onyx|nova|shimmer)/i);
  if (voiceMatch) {
    return voiceMatch[1].toLowerCase();
  }
  return undefined;
}

/**
 * Extract speed preference from input
 */
function extractSpeed(input: string): number | undefined {
  const speedMatch = input.match(/语速[:：]?\s*([\d.]+)/i);
  if (speedMatch) {
    return parseFloat(speedMatch[1]);
  }
  return undefined;
}

/**
 * CLI interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node video-agent.ts "<your request>"');
    console.log('\nExamples:');
    console.log('  node video-agent.ts "帮我生成一个关于 AI 工具的视频"');
    console.log('  node video-agent.ts "脚本：三家巨头同一天说了一件事..."');
    console.log('  node video-agent.ts "帮助"');
    process.exit(0);
  }

  const input = args.join(' ');
  const request = parseInput(input);

  console.log('📥 收到请求:', input);
  console.log('🔍 解析结果:', JSON.stringify(request, null, 2));
  console.log('');

  handleRequest(request)
    .then((response) => {
      console.log(response.message);

      if (response.data) {
        console.log('\n📊 详细数据:');
        console.log(JSON.stringify(response.data, null, 2));
      }

      if (!response.success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
