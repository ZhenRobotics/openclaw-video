# v1.3.0 - 多厂商支持 (2026-03-09)

## 🎉 重要新功能

### 🌐 多厂商 TTS/ASR 支持
支持 **OpenAI、Azure、阿里云、腾讯云** 四大服务商，解决地理限制和服务稳定性问题。

**核心特性**：
- 🔄 **自动降级**：一个服务商失败自动切换
- 🌍 **国内外通用**：国内用户可使用阿里云/腾讯云
- ⚙️ **灵活配置**：自定义服务商优先级
- 🛡️ **安全增强**：符合 ClawHub 安全标准

## 🔧 新增参数

### 环境变量配置
```bash
# 配置服务商优先级
TTS_PROVIDERS="openai,azure,aliyun,tencent"
ASR_PROVIDERS="openai,azure,aliyun,tencent"

# Azure
AZURE_SPEECH_KEY="your-key"
AZURE_SPEECH_REGION="eastasia"

# 阿里云
ALIYUN_ACCESS_KEY_ID="LTAI..."
ALIYUN_ACCESS_KEY_SECRET="..."

# 腾讯云
TENCENT_SECRET_ID="AKI..."
TENCENT_SECRET_KEY="..."
```

### 命令行参数
```bash
# 强制使用特定服务商
--provider openai|azure|aliyun|tencent
```

## 🚀 快速使用

### 自动降级（推荐）
```bash
# 配置 .env 文件
cat > .env << 'EOF'
TTS_PROVIDERS="openai,azure"
OPENAI_API_KEY="sk-..."
AZURE_SPEECH_KEY="your-key"
AZURE_SPEECH_REGION="eastasia"
EOF

# 正常使用，自动降级
./scripts/script-to-video.sh your-script.txt
```

### 检查配置
```bash
./scripts/test-providers.sh
```

输出：
```
✅ TTS: 2 provider(s) configured (openai, azure)
✅ ASR: 2 provider(s) configured (openai, azure)
```

## 📊 推荐配置

### 国内用户
```bash
TTS_PROVIDERS="aliyun,tencent,openai,azure"
```
优先使用国内服务商，避免网络限制

### 海外用户
```bash
TTS_PROVIDERS="openai,azure,aliyun,tencent"
```
优先使用国际服务商，降级到国内备用

### 企业用户
```bash
TTS_PROVIDERS="azure,openai"
```
使用企业级服务，稳定性优先

## 🔄 兼容性

✅ **100% 向后兼容**
- 现有 OpenAI 配置无需修改
- 所有命令和参数保持不变
- 新功能为可选增强

## 📦 安装/更新

### 新安装
```bash
npm install -g openclaw-video-generator
# 或
clawhub install video-generator
```

### 从 v1.2.0 升级
```bash
npm update -g openclaw-video-generator
```

## 📚 文档

- **多厂商配置指南**: [MULTI_PROVIDER_SETUP.md](https://github.com/ZhenRobotics/openclaw-video-generator/blob/main/MULTI_PROVIDER_SETUP.md)
- **完整更新日志**: [RELEASE_NOTES_v1.3.0.md](https://github.com/ZhenRobotics/openclaw-video-generator/blob/main/RELEASE_NOTES_v1.3.0.md)
- **GitHub**: https://github.com/ZhenRobotics/openclaw-video-generator
- **npm**: https://www.npmjs.com/package/openclaw-video-generator

## 🎯 解决的问题

1. ✅ OpenAI API 地理限制 → 使用阿里云/腾讯云
2. ✅ 单点故障风险 → 自动降级到备用服务商
3. ✅ 成本优化需求 → 灵活选择性价比服务商
4. ✅ 企业合规要求 → 支持企业级 Azure 服务

## 💡 使用建议

**场景 1: 解决网络限制**
```bash
# 中国大陆用户，OpenAI 无法访问
TTS_PROVIDERS="aliyun,tencent"
# 配置阿里云或腾讯云密钥即可
```

**场景 2: 提高稳定性**
```bash
# 配置多个服务商作为备份
TTS_PROVIDERS="openai,azure,aliyun"
# OpenAI 失败自动切换 Azure，再失败切换阿里云
```

**场景 3: 成本优化**
```bash
# 优先使用性价比高的服务商
TTS_PROVIDERS="tencent,aliyun,openai"
```

---

**发布时间**: 2026-03-09
**版本**: v1.3.0
**类型**: Feature Release (功能发布)
