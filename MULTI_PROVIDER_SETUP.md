# 多厂商支持配置指南

OpenClaw Video Generator 现在支持多个 TTS 和 ASR 服务商，提供自动降级和故障转移功能。

## 📋 支持的厂商

### TTS（文字转语音）
- ✅ **OpenAI** - 高质量，自然音色
- ✅ **Azure** - 企业级稳定性，丰富的神经语音
- ⏳ **阿里云** - 国内优选，中文效果好（待实现）
- ⏳ **腾讯云** - 性价比高，方言支持（待实现）

### ASR（语音识别）
- ✅ **OpenAI Whisper** - 准确度高，时间戳精确
- ⏳ **Azure Speech** - 企业级（待实现）
- ⏳ **阿里云** - 中文识别（待实现）
- ⏳ **腾讯云** - 性价比（待实现）

## 🚀 快速开始

### 1. 复制配置文件模板

```bash
cp .env.example .env
```

### 2. 配置你的 API 密钥

编辑 `.env` 文件，填入至少一个厂商的密钥：

```bash
# OpenAI（推荐海外用户）
OPENAI_API_KEY="sk-proj-..."
OPENAI_API_BASE="https://api.openai.com/v1"

# Azure（推荐企业用户）
AZURE_SPEECH_KEY="your-azure-key"
AZURE_SPEECH_REGION="eastasia"
```

### 3. 设置自动降级顺序

```bash
# 国内用户建议
TTS_PROVIDERS="aliyun,tencent,azure,openai"
ASR_PROVIDERS="aliyun,tencent,azure,openai"

# 海外用户建议
TTS_PROVIDERS="openai,azure,aliyun,tencent"
ASR_PROVIDERS="openai,azure,aliyun,tencent"
```

## 📖 使用方式

### 自动降级（推荐）

脚本会按照 `TTS_PROVIDERS` 和 `ASR_PROVIDERS` 的顺序自动尝试：

```bash
./scripts/script-to-video.sh my-script.txt
```

如果 OpenAI 失败，会自动尝试 Azure，以此类推。

### 手动指定厂商

```bash
# 强制使用 Azure
./scripts/tts-generate.sh "你好世界" \
  --out hello.mp3 \
  --provider azure

# 强制使用 OpenAI Whisper
./scripts/whisper-timestamps.sh audio.mp3 \
  --provider openai
```

### 环境变量覆盖

```bash
# 临时使用 Azure
TTS_PROVIDER=azure ASR_PROVIDER=azure \
  ./scripts/script-to-video.sh my-script.txt
```

## 🔧 详细配置

### OpenAI

```bash
OPENAI_API_KEY="sk-proj-..."
OPENAI_API_BASE="https://api.openai.com/v1"
OPENAI_TTS_VOICE="nova"          # alloy, echo, fable, onyx, nova, shimmer
OPENAI_TTS_MODEL="tts-1"
OPENAI_ASR_MODEL="whisper-1"
```

**语音选项**:
- `alloy` - 中性
- `echo` - 男声
- `nova` - 女声，活力（推荐）
- `shimmer` - 女声，柔和

### Azure

```bash
AZURE_SPEECH_KEY="your-key"
AZURE_SPEECH_REGION="eastasia"   # 或 chinaeast2（中国区）
AZURE_TTS_VOICE="zh-CN-XiaoxiaoNeural"
AZURE_TTS_STYLE="general"        # cheerful, sad, angry, etc.
```

**中文神经语音**:
- `zh-CN-XiaoxiaoNeural` - 女声，通用（推荐）
- `zh-CN-YunxiNeural` - 男声，温暖
- `zh-CN-XiaoyiNeural` - 女声，甜美
- `zh-CN-XiaohanNeural` - 女声，亲切
- `zh-CN-YunyangNeural` - 男声，专业

### 阿里云（待实现）

```bash
ALIYUN_ACCESS_KEY_ID="LTAI..."
ALIYUN_ACCESS_KEY_SECRET="..."
ALIYUN_APP_KEY="..."
ALIYUN_TTS_VOICE="Aibao"         # Aibao, Xiaoyun, Zhiqi, Aixia
```

### 腾讯云（待实现）

```bash
TENCENT_SECRET_ID="AKI..."
TENCENT_SECRET_KEY="..."
TENCENT_APP_ID="..."
TENCENT_TTS_VOICE="101001"       # 101001-101004
```

## 🔍 故障排查

### 检查厂商配置

```bash
# 查看当前配置的厂商
grep "PROVIDERS" .env

# 测试 TTS
./scripts/tts-generate.sh "测试文本" --out test.mp3

# 测试 ASR
./scripts/whisper-timestamps.sh test.mp3
```

### 查看日志

脚本会输出详细的降级日志：

```
🔄 Trying provider: openai
❌ Provider 'openai' failed, trying next...
🔄 Trying provider: azure
✅ Success with provider: azure
```

### 常见问题

**Q: 所有厂商都失败了怎么办？**
A: 检查：
1. 网络连接
2. API 密钥是否正确
3. API 余额是否充足
4. 查看 `.env` 配置

**Q: 如何只使用一个厂商？**
A: 设置 `TTS_PROVIDERS="openai"` 或使用 `--provider` 参数

**Q: 厂商优先级如何确定？**
A: 按照 `TTS_PROVIDERS` 和 `ASR_PROVIDERS` 从左到右的顺序

## 📚 API 文档链接

- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)
- [Azure TTS](https://learn.microsoft.com/azure/cognitive-services/speech-service/text-to-speech)
- [Azure STT](https://learn.microsoft.com/azure/cognitive-services/speech-service/speech-to-text)
- [阿里云 TTS](https://help.aliyun.com/document_detail/84435.html)
- [阿里云 ASR](https://help.aliyun.com/document_detail/84428.html)
- [腾讯云 TTS](https://cloud.tencent.com/document/product/1073/37995)
- [腾讯云 ASR](https://cloud.tencent.com/document/product/1093/37823)

## 🤝 贡献

欢迎提交 PR 实现阿里云和腾讯云的适配器！

适配器位置：
- TTS: `scripts/providers/tts/{provider}.sh`
- ASR: `scripts/providers/asr/{provider}.sh`

参考 `openai.sh` 和 `azure.sh` 的实现。
