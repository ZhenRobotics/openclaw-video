# 快速开始指南

5 分钟快速上手视频生成系统。

## 🚀 最快路径

### 1. 安装（2 分钟）

```bash
cd /home/justin/openclaw-video
pnpm install
export OPENAI_API_KEY="sk-..."
```

### 2. 生成第一个视频（3 分钟）

```bash
# 方式 1: 使用 Agent（推荐）
./agents/video-cli.sh generate "三家巨头同一天说了一件事。微软说Copilot已经能写掉90%的代码。"

# 方式 2: 使用脚本
./scripts/script-to-video.sh scripts/example-script.txt

# 3. 查看结果
mpv out/generated.mp4
```

**完成！** 🎉

## 📝 常见使用场景

### 场景 1: 技术教程

```bash
cat > scripts/tutorial.txt <<'EOF'
今天教大家三个AI工具。
第一个，ChatGPT帮你写代码。
第二个，Whisper帮你转写音频。
第三个，Remotion帮你生成视频。
试试看，效率提升十倍！
EOF

./agents/video-cli.sh generate "$(cat scripts/tutorial.txt)" --voice alloy --speed 1.0
```

### 场景 2: 快节奏短视频

```bash
./agents/video-cli.sh generate "AI改变世界。GPT写代码。Whisper转音频。Remotion做视频。关注学习更多。" --voice nova --speed 1.3
```

### 场景 3: 脚本优化

```bash
# 先分析脚本
./agents/video-cli.sh optimize "你的脚本内容"

# 根据建议调整后再生成
./agents/video-cli.sh generate "优化后的脚本"
```

## 🎨 自定义配置

### 选择声音

```bash
# 试听不同声音
./scripts/tts-generate.sh "测试" --out audio/test-alloy.mp3 --voice alloy
./scripts/tts-generate.sh "测试" --out audio/test-nova.mp3 --voice nova
mpv audio/test-*.mp3

# 使用喜欢的声音
./agents/video-cli.sh generate "你的脚本" --voice nova
```

### 调整语速

```bash
# 慢速（教程）
./agents/video-cli.sh generate "你的脚本" --speed 0.9

# 正常（默认）
./agents/video-cli.sh generate "你的脚本" --speed 1.0

# 稍快（推荐短视频）
./agents/video-cli.sh generate "你的脚本" --speed 1.15

# 快速（快节奏短视频）
./agents/video-cli.sh generate "你的脚本" --speed 1.3
```

### 自定义场景

```bash
# 1. 生成基础视频
./agents/video-cli.sh generate "你的脚本"

# 2. 编辑场景数据
nano src/scenes-data.ts

# 3. 重新渲染
pnpm exec remotion render Main out/custom.mp4
```

## 🧪 测试系统

```bash
# 快速测试（不需要 API Key）
./agents/video-cli.sh help
./agents/video-cli.sh optimize "测试脚本"

# 完整测试（需要 API Key）
./agents/test-agent.sh
```

## 🐛 遇到问题？

### 问题：找不到命令

```bash
# 确保在正确的目录
cd /home/justin/openclaw-video

# 确保脚本可执行
chmod +x agents/*.sh scripts/*.sh
```

### 问题：缺少依赖

```bash
# 重新安装
pnpm install

# 检查依赖
pnpm exec tsx --version
pnpm exec remotion --version
```

### 问题：API 错误

```bash
# 检查 API Key
echo $OPENAI_API_KEY | head -c 10

# 重新设置
export OPENAI_API_KEY="sk-..."
```

### 问题：渲染失败

```bash
# 测试 Remotion
pnpm dev
# 浏览器打开 http://localhost:3000

# 查看错误日志
cat /tmp/remotion-*.log
```

## 📚 深入学习

- **Agent 使用** → [docs/AGENT.md](docs/AGENT.md)
- **流水线架构** → [docs/PIPELINE.md](docs/PIPELINE.md)
- **测试指南** → [docs/TESTING.md](docs/TESTING.md)
- **完整文档** → [README.md](README.md)

## 💡 提示和技巧

### 提示 1: 批量生成

```bash
# 批量处理多个脚本
for script in scripts/*.txt; do
  ./scripts/script-to-video.sh "$script"
done
```

### 提示 2: 使用模板

```bash
# 创建脚本模板
cat > scripts/template.txt <<'EOF'
[开场] 引入话题
[第一点] 阐述要点1
[第二点] 阐述要点2
[第三点] 阐述要点3
[总结] 总结呼吁
[结尾] 关注引导
EOF
```

### 提示 3: 预览快速

```bash
# 开发模式实时预览
pnpm dev

# 浏览器自动刷新，快速迭代
```

### 提示 4: 成本控制

```bash
# 先用示例数据测试（免费）
node scripts/timestamps-to-scenes.js audio/example-timestamps.json
pnpm exec remotion render Main out/test.mp4

# 确认效果后再调用 API
```

## 🎯 最佳实践

### 1. 脚本编写

- ✅ 每句话 5-10 秒
- ✅ 使用具体数字（90%, 10倍）
- ✅ 包含关键词（AI, GPT, Copilot）
- ✅ 开头抓人，结尾引导
- ❌ 避免过长句子
- ❌ 避免复杂词汇

### 2. 声音选择

- **教程/讲解** → alloy (中性稳定)
- **短视频/营销** → nova (活力清晰)
- **深度内容** → onyx (沉稳专业)

### 3. 语速控制

- **教程视频** → 1.0 (正常)
- **短视频** → 1.15-1.2 (稍快)
- **快节奏** → 1.3-1.5 (快速)

### 4. 视频长度

- **抖音/视频号** → 15-30 秒
- **B站/YouTube** → 1-3 分钟
- **教程** → 3-5 分钟

## 🔥 进阶玩法

### 1. 集成到 OpenClaw

```bash
# 将 Agent 集成到 OpenClaw
cp agents/video-generator.json ~/.openclaw/agents/
openclaw message send --agent video-generator "生成视频：..."
```

### 2. 自定义视觉风格

```typescript
// 编辑 src/SceneRenderer.tsx
const primaryColor = '#FF00FF';  // 改为紫色
const bgColor = '#000000';       // 纯黑背景
```

### 3. 添加背景音乐

```bash
# 使用 ffmpeg 合成背景音乐
ffmpeg -i out/video.mp4 -i music.mp3 -filter_complex "[1:a]volume=0.2[a1];[0:a][a1]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" out/with-music.mp4
```

### 4. 批量处理不同风格

```bash
# 生成多个版本
for voice in alloy nova onyx; do
  ./agents/video-cli.sh generate "你的脚本" --voice $voice --output "video-$voice"
done
```

## ⚡ 性能优化

### 1. 本地缓存

```bash
# TTS 结果可复用
ls -la audio/*.mp3

# 避免重复 API 调用
```

### 2. 并行处理

```bash
# 同时处理多个视频
./agents/video-cli.sh generate "脚本1" &
./agents/video-cli.sh generate "脚本2" &
wait
```

### 3. Remotion 加速

```bash
# 增加并发
pnpm exec remotion render Main out/video.mp4 --concurrency 4

# 降低质量快速预览
pnpm exec remotion render Main out/preview.mp4 --quality 50
```

## 🎓 学习路径

1. **第 1 天**：跑通基础流程，生成第一个视频
2. **第 2 天**：尝试不同声音和语速
3. **第 3 天**：自定义脚本和场景
4. **第 4 天**：修改视觉风格
5. **第 5 天**：集成到 OpenClaw

## 🌟 成功案例

### 案例 1: AI 工具介绍

```bash
脚本: "三个AI工具改变你的工作。第一个GPT写代码。第二个Whisper转音频。第三个Remotion做视频。试试看，效率提升十倍！"
声音: nova
语速: 1.2
时长: 12 秒
效果: ⭐⭐⭐⭐⭐
```

### 案例 2: 技术教程

```bash
脚本: "今天教大家如何部署OpenClaw。第一步安装Node.js。第二步配置API。第三步启动网关。是不是很简单？关注我学更多。"
声音: alloy
语速: 1.0
时长: 15 秒
效果: ⭐⭐⭐⭐
```

## 💬 获得帮助

- 查看文档：`docs/`
- 运行测试：`./agents/test-agent.sh`
- 使用帮助：`./agents/video-cli.sh help`

---

**开始创作你的第一个 AI 视频吧！** 🚀🎬✨
