# OpenClaw 视频生成 Agent 集成指南

本文档介绍如何将视频生成 Agent 集成到 OpenClaw 系统。

## 集成方式

有两种方式可以使用视频生成 Agent：

### 方式 1: 独立命令行工具 (推荐用于测试)

直接使用 Node.js 运行 Agent：

```bash
# 1. 安装依赖
cd /home/justin/openclaw-video
pnpm install

# 2. 运行 Agent
node -r ts-node/register agents/video-agent.ts "帮我生成一个关于 AI 工具的视频"

# 3. 或者使用工具直接测试
node -r ts-node/register agents/tools.ts test
```

### 方式 2: OpenClaw Message 集成 (推荐用于生产)

通过 OpenClaw 的消息系统调用 Agent：

```bash
# 使用 openclaw message send 发送请求
openclaw message send \
  --agent video-generator \
  "帮我生成一个关于 AI 工具的短视频"
```

## 设置 OpenClaw Agent

### 1. 创建 Agent 配置

在 OpenClaw 配置目录创建 Agent 配置：

```bash
mkdir -p ~/.openclaw/agents
cp /home/justin/openclaw-video/agents/video-generator.json \
   ~/.openclaw/agents/video-generator.json
```

### 2. 配置 Agent 工具路径

编辑 `~/.openclaw/agents/video-generator.json`，确保路径正确：

```json
{
  "config": {
    "workDir": "/home/justin/openclaw-video",
    "toolsScript": "/home/justin/openclaw-video/agents/tools.ts"
  }
}
```

### 3. 创建工具包装脚本

OpenClaw Agent 需要一个可执行的工具包装脚本：

```bash
cat > ~/.openclaw/agents/video-tools.sh <<'EOF'
#!/usr/bin/env bash
# OpenClaw Video Tools Wrapper
set -euo pipefail

cd /home/justin/openclaw-video
node -r ts-node/register agents/tools.ts "$@"
EOF

chmod +x ~/.openclaw/agents/video-tools.sh
```

## 使用示例

### 通过 OpenClaw CLI

```bash
# 生成视频
openclaw message send \
  --agent video-generator \
  "脚本：三家巨头同一天说了一件事。微软说Copilot已经能写掉90%的代码。"

# 优化脚本
openclaw message send \
  --agent video-generator \
  "帮我分析一下这个脚本：[你的脚本内容]"

# 获取帮助
openclaw message send \
  --agent video-generator \
  "帮助"
```

### 通过 OpenClaw Gateway

如果 OpenClaw Gateway 正在运行，可以通过 WebSocket 或 HTTP 发送请求：

```bash
# 使用 curl 发送 HTTP 请求
curl -X POST http://localhost:18789/api/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "video-generator",
    "message": "帮我生成一个关于 AI 工具的视频"
  }'
```

## Agent 工作流程

```
用户输入
    ↓
自然语言解析 (parseInput)
    ↓
识别请求类型 (generate_video / optimize_script / help)
    ↓
调用相应的工具函数
    ↓
执行完整流水线
    ↓
返回结果给用户
```

## 工具函数说明

### 1. optimize_script

分析和优化视频脚本。

**输入：**
```json
{
  "original_script": "你的脚本内容",
  "target_duration": 15,
  "style": "快节奏"
}
```

**输出：**
```json
{
  "success": true,
  "optimized_script": "优化后的脚本",
  "suggestions": ["建议1", "建议2"]
}
```

### 2. generate_tts

使用 OpenAI TTS 生成语音。

**输入：**
```json
{
  "text": "要转换的文本",
  "voice": "nova",
  "speed": 1.15,
  "output_file": "audio.mp3"
}
```

**输出：**
```json
{
  "success": true,
  "audio_path": "/path/to/audio.mp3"
}
```

### 3. extract_timestamps

使用 Whisper 提取时间戳。

**输入：**
```json
{
  "audio_file": "/path/to/audio.mp3"
}
```

**输出：**
```json
{
  "success": true,
  "timestamps_path": "/path/to/timestamps.json"
}
```

### 4. generate_scenes

转换为 Remotion 场景。

**输入：**
```json
{
  "timestamps_file": "/path/to/timestamps.json"
}
```

**输出：**
```json
{
  "success": true,
  "scenes_path": "/path/to/scenes-data.ts"
}
```

### 5. render_video

渲染最终视频。

**输入：**
```json
{
  "output_file": "video.mp4",
  "audio_file": "/path/to/audio.mp3"
}
```

**输出：**
```json
{
  "success": true,
  "video_path": "/path/to/video.mp4"
}
```

### 6. complete_pipeline

完整流水线（自动调用以上所有步骤）。

**输入：**
```json
{
  "script": "你的脚本",
  "voice": "nova",
  "speed": 1.15,
  "output_name": "my-video"
}
```

**输出：**
```json
{
  "success": true,
  "video_path": "/path/to/my-video.mp4",
  "steps": ["步骤1", "步骤2", ...]
}
```

## 自然语言理解

Agent 可以理解以下格式的自然语言输入：

### 生成视频请求

- "帮我生成一个关于 AI 工具的视频"
- "做个视频：[脚本内容]"
- "脚本：[脚本内容]"
- "[直接输入脚本内容]"

### 优化脚本请求

- "帮我分析一下这个脚本"
- "检查脚本：[脚本内容]"
- "优化这个脚本：[脚本内容]"

### 帮助请求

- "帮助"
- "help"
- "?"

### 配置选项

可以在自然语言中指定配置：

- "声音：nova"
- "语速：1.2"
- "用 alloy 声音生成视频"

## 测试

运行完整测试套件：

```bash
cd /home/justin/openclaw-video
./agents/test-agent.sh
```

测试内容：
1. 帮助信息显示
2. 脚本优化功能
3. 完整视频生成流程

## 故障排查

### 问题：TypeScript 编译错误

```bash
# 安装依赖
cd /home/justin/openclaw-video
pnpm install
```

### 问题：找不到 ts-node

```bash
# 确保已安装 ts-node
pnpm add -D ts-node @types/node
```

### 问题：OpenAI API 错误

```bash
# 确保设置了 API Key
export OPENAI_API_KEY="sk-..."
```

### 问题：Remotion 渲染失败

```bash
# 检查 Remotion 依赖
pnpm install

# 测试 Remotion
pnpm dev
```

## 高级配置

### 自定义 Agent 系统提示词

编辑 `agents/video-generator.json` 中的 `systemPrompt` 字段：

```json
{
  "systemPrompt": "你是墨影，专业的视频生成助手..."
}
```

### 添加新工具

在 `agents/tools.ts` 中添加新的工具函数：

```typescript
export async function my_new_tool(params: MyParams): Promise<MyResult> {
  // 实现你的工具逻辑
}
```

然后在 `agents/video-generator.json` 中注册工具：

```json
{
  "tools": [
    {
      "name": "my_new_tool",
      "description": "工具描述",
      "parameters": { ... }
    }
  ]
}
```

## 相关文档

- [PIPELINE.md](../docs/PIPELINE.md) - 完整流水线文档
- [TTS.md](../docs/TTS.md) - TTS 文档
- [WHISPER.md](../docs/WHISPER.md) - Whisper 文档
- OpenClaw Agent 文档: https://docs.openclaw.ai/agents
