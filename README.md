# OpenClaw Video - 自动化视频生成流水线

基于 OpenClaw + Remotion + OpenAI 的完全自动化视频生成系统。只需提供文本脚本，即可生成配音、时间戳、场景编排并最终渲染视频。

## ✨ 特性

- 🎤 **TTS 语音生成** - OpenAI TTS API，支持多种声音和语速
- ⏱️ **时间戳提取** - OpenAI Whisper API，精确分段识别
- 🎬 **场景编排** - 智能检测场景类型，自动生成 Remotion 数据
- 🎨 **赛博风格** - 线框动画、故障效果、霓虹色彩
- 🤖 **完全自动化** - 一行命令完成从文本到视频的全流程

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- pnpm (或 npm/yarn)
- OpenAI API Key

### 安装

```bash
# 1. 克隆项目
cd openclaw-video

# 2. 安装依赖
pnpm install

# 3. 设置 API Key
export OPENAI_API_KEY="sk-..."
```

### 生成第一个视频

#### 方式 1: 使用 Agent (推荐) 🤖

```bash
# 直接用自然语言生成视频
./agents/video-cli.sh generate "三家巨头同一天说了一件事。微软说Copilot已经能写掉90%的代码。"

# 或者使用完整 Agent
node -r ts-node/register agents/video-agent.ts "帮我生成一个关于 AI 工具的视频"
```

#### 方式 2: 使用脚本

```bash
# 使用示例脚本生成视频
./scripts/script-to-video.sh scripts/example-script.txt

# 查看结果
mpv out/example-script.mp4
```

**就这么简单！** 🎉

## 📖 完整流程

### 1. 准备文本脚本

创建一个文本文件，每句话自然分段：

```bash
cat > scripts/my-video.txt <<'EOF'
三家巨头同一天说了一件事。
微软说Copilot已经能写掉百分之九十的代码。
OpenAI说GPT5能替代大部分程序员。
Google说Gemini2.0改变游戏规则。
但真相是什么？
AI不会取代开发者，而是让优秀开发者效率提升十倍。
关注我学习AI工具。
EOF
```

### 2. 运行生成流水线

```bash
./scripts/script-to-video.sh scripts/my-video.txt \
  --voice nova \    # 选择声音 (alloy/echo/nova/shimmer等)
  --speed 1.15      # 语速 (0.25-4.0)
```

### 3. 输出文件

```
audio/my-video.mp3                  # TTS 生成的语音
audio/my-video-timestamps.json      # Whisper 提取的时间戳
src/scenes-data.ts                  # Remotion 场景数据
out/my-video.mp4                    # 最终视频 ✨
```

## 🎯 流水线架构

```
文本脚本 (txt)
    ↓
TTS 语音生成 (OpenAI TTS)
    ↓
时间戳提取 (OpenAI Whisper)
    ↓
场景数据转换 (智能检测)
    ↓
视频渲染 (Remotion)
    ↓
成品视频 (MP4, 1080x1920)
```

## 🎨 场景类型

流水线自动检测并生成以下 6 种场景类型：

| 类型 | 效果 | 触发条件 |
|------|------|----------|
| **title** | 故障效果 + 弹簧缩放 | 第一个片段 |
| **emphasis** | 放大弹出 | 包含百分比 (90%, 10倍) |
| **pain** | 震动 + 红色警告 | 包含"说"、"问题" |
| **content** | 平滑淡入 | 包含"真相"、"但" |
| **circle** | 旋转圆环高亮 | 手动标记 |
| **end** | 上滑淡出 | 最后一个片段 |

## 🛠️ 可用脚本

### Agent 工具 (推荐)

| 脚本 | 功能 | 用法 |
|------|------|------|
| `video-cli.sh` | Agent CLI 工具 | `./agents/video-cli.sh generate <脚本>` |
| `video-agent.ts` | 智能 Agent | `node -r ts-node/register agents/video-agent.ts <请求>` |
| `tools.ts` | 工具函数库 | `node -r ts-node/register agents/tools.ts test` |

### 核心脚本

| 脚本 | 功能 | 用法 |
|------|------|------|
| `script-to-video.sh` | 完整流水线 | `./scripts/script-to-video.sh <script.txt>` |
| `tts-generate.sh` | TTS 语音生成 | `./scripts/tts-generate.sh <文本>` |
| `whisper-timestamps.sh` | 时间戳提取 | `./scripts/whisper-timestamps.sh <audio.mp3>` |
| `timestamps-to-scenes.js` | 场景转换 | `node scripts/timestamps-to-scenes.js <timestamps.json>` |

### 测试脚本

| 脚本 | 功能 |
|------|------|
| `test-agent.sh` | 测试 Agent 功能 |
| `test-tts.sh` | 测试 TTS 生成 |
| `test-whisper.sh` | 测试 Whisper 提取 |

## 📚 文档

### 快速开始

- [QUICKSTART.md](QUICKSTART.md) - **5 分钟快速开始** ⚡
- [DELIVERY.md](DELIVERY.md) - **项目交付文档** 📦
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - **项目总结** 📊

### 使用指南

- [AGENT.md](docs/AGENT.md) - **智能 Agent 使用指南** ⭐
- [FAQ.md](docs/FAQ.md) - **常见问题解答** 🔧
- [PIPELINE.md](docs/PIPELINE.md) - 完整流水线架构和使用指南

### 技术文档

- [TTS.md](docs/TTS.md) - TTS 语音生成详解
- [WHISPER.md](docs/WHISPER.md) - Whisper 时间戳提取详解
- [TESTING.md](docs/TESTING.md) - 测试指南

### 集成和扩展

- [openclaw-integration.md](agents/openclaw-integration.md) - OpenClaw 集成指南

## 🤖 Agent 使用

### 智能视频生成

Agent 可以理解自然语言并自动生成视频：

```bash
# 示例 1: 直接生成
./agents/video-cli.sh generate "AI 改变世界"

# 示例 2: 带配置
./agents/video-cli.sh generate "三个AI工具提升效率" --voice nova --speed 1.2

# 示例 3: 使用自然语言
node -r ts-node/register agents/video-agent.ts "帮我生成一个关于 GPT 的视频"

# 示例 4: 脚本优化
./agents/video-cli.sh optimize "这是我的脚本内容"

# 示例 5: 获取帮助
./agents/video-cli.sh help
```

### Agent 特性

- 🧠 **自然语言理解** - 理解多种表达方式
- 📊 **脚本分析** - 自动分析长度、风格、关键词
- 💡 **智能建议** - 提供优化建议
- 🎬 **一键生成** - 完整流水线自动化
- 🔧 **灵活配置** - 支持自定义声音、语速等

详见 [Agent 文档](docs/AGENT.md)。

## 💡 使用示例

### 示例 1: 技术教程视频

```bash
cat > scripts/tech-tutorial.txt <<'EOF'
今天教大家如何使用AI工具。
第一步，安装必要的软件。
第二步，配置API密钥。
第三步，开始使用。
是不是很简单？
关注我学习更多技巧。
EOF

./scripts/script-to-video.sh scripts/tech-tutorial.txt \
  --voice alloy \
  --speed 1.0
```

### 示例 2: 快节奏短视频

```bash
cat > scripts/quick-tips.txt <<'EOF'
三个AI工具改变你的工作效率。
第一个，GPT帮你写代码。
第二个，Whisper帮你转写音频。
第三个，Remotion帮你生成视频。
试试看，效率提升十倍！
EOF

./scripts/script-to-video.sh scripts/quick-tips.txt \
  --voice nova \
  --speed 1.3
```

## ⚙️ 高级配置

### 自定义视频参数

编辑 `src/scenes-data.ts`:

```typescript
export const videoConfig = {
  fps: 30,              // 帧率
  width: 1080,          // 宽度
  height: 1920,         // 高度 (竖屏)
};
```

### 自定义场景检测规则

编辑 `scripts/timestamps-to-scenes.js`:

```javascript
function determineSceneType(index, total, text) {
  // 添加你的自定义规则
  if (text.includes('重要')) return 'emphasis';
  if (text.includes('注意')) return 'pain';

  // 保留默认规则
  if (index === 0) return 'title';
  if (index === total - 1) return 'end';
  return 'content';
}
```

### 自定义视觉风格

编辑 `src/SceneRenderer.tsx`:

```typescript
// 修改颜色
const primaryColor = '#00F5FF';  // 青色霓虹
const bgColor = '#0A0A0F';       // 深色背景

// 修改动画
spring({
  frame,
  fps,
  config: { damping: 10, stiffness: 100 }
})
```

## 💰 成本估算

| 组件 | 定价 | 15秒视频成本 |
|------|------|--------------|
| OpenAI TTS | $0.015/1K字符 | ~$0.001 |
| OpenAI Whisper | $0.006/分钟 | ~$0.0015 |
| Remotion 渲染 | 本地免费 | $0 |
| **总计** | | **~$0.003** |

**每个视频成本不到 1 美分！** 💰

## 🎬 视频规格

- **分辨率**: 1080 x 1920 (竖屏，适合抖音/视频号)
- **帧率**: 30 fps
- **格式**: MP4 (H.264 + AAC)
- **时长**: 根据脚本自动计算

## 🐛 故障排查

### TTS 问题

```bash
# 测试 TTS
./scripts/test-tts.sh

# 常见问题
export OPENAI_API_KEY="sk-..."  # 设置 API Key
```

### Whisper 问题

```bash
# 使用示例数据测试
node scripts/timestamps-to-scenes.js audio/example-timestamps.json

# 如果 API 超时，可以手动编辑时间戳文件
```

### Remotion 问题

```bash
# 开发模式预览
pnpm dev

# 打开浏览器访问 http://localhost:3000
```

## 📦 项目结构

```
openclaw-video/
├── audio/                      # 音频文件
│   ├── example-timestamps.json # 示例时间戳
│   └── *.mp3                   # 生成的音频
├── src/
│   ├── types.ts                # TypeScript 类型定义
│   ├── scenes-data.ts          # 场景数据 (自动生成)
│   ├── Root.tsx                # Remotion 根组件
│   ├── CyberWireframe.tsx      # 主视频组件
│   └── SceneRenderer.tsx       # 场景渲染器
├── scripts/
│   ├── script-to-video.sh      # 🎯 完整流水线
│   ├── tts-generate.sh         # TTS 生成
│   ├── whisper-timestamps.sh   # Whisper 提取
│   ├── timestamps-to-scenes.js # 场景转换
│   ├── test-tts.sh             # TTS 测试
│   ├── test-whisper.sh         # Whisper 测试
│   └── example-script.txt      # 示例脚本
├── docs/
│   ├── PIPELINE.md             # 流水线文档
│   ├── TTS.md                  # TTS 文档
│   └── WHISPER.md              # Whisper 文档
├── out/                        # 渲染输出
│   └── *.mp4                   # 生成的视频
└── package.json
```

## 🔮 未来计划

- [ ] Agent 自动化选题和脚本生成
- [ ] 支持更多视觉风格模板
- [ ] 集成背景音乐
- [ ] 自动字幕生成
- [ ] 多语言支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**用 AI 生成视频，从未如此简单！** ✨🎬🚀
