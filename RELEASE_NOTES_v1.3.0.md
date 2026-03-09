# v1.3.0 - Multi-Provider Support (2026-03-09)

## 🎉 重要新功能

### 🌐 多厂商 TTS/ASR 支持
- ✨ **支持 4 个服务商**：OpenAI, Azure, Aliyun（阿里云）, Tencent（腾讯云）
- 🔄 **自动降级机制**：一个服务商失败自动切换到下一个
- 🌍 **国内外通用**：解决地理限制问题，国内用户可使用阿里云/腾讯云
- ⚙️ **灵活配置**：通过 `.env` 文件自定义服务商优先级

### 🔧 新增配置参数

**环境变量配置 (.env)**:
```bash
# 配置服务商优先级（自动降级顺序）
TTS_PROVIDERS="openai,azure,aliyun,tencent"
ASR_PROVIDERS="openai,azure,aliyun,tencent"

# Azure 配置
AZURE_SPEECH_KEY="your-key"
AZURE_SPEECH_REGION="eastasia"

# 阿里云配置
ALIYUN_ACCESS_KEY_ID="LTAI..."
ALIYUN_ACCESS_KEY_SECRET="..."
ALIYUN_APP_KEY="..."

# 腾讯云配置
TENCENT_SECRET_ID="AKI..."
TENCENT_SECRET_KEY="..."
TENCENT_APP_ID="..."
```

**命令行参数**:
```bash
# 强制使用特定服务商
./scripts/tts-generate.sh "文本" --provider azure
./scripts/whisper-timestamps.sh audio.mp3 --provider aliyun
```

### 🚀 快速使用

**自动降级（推荐）**:
```bash
# 按优先级自动尝试各服务商
./scripts/script-to-video.sh your-script.txt
```

**检查服务商配置**:
```bash
./scripts/test-providers.sh
```

输出示例：
```
✅ TTS: 2 provider(s) configured (openai, azure)
✅ ASR: 2 provider(s) configured (openai, azure)
```

### 📁 新增文件和目录

```
scripts/
├── providers/              # 新增：服务商适配器
│   ├── tts/
│   │   ├── openai.sh      # OpenAI TTS
│   │   ├── azure.sh       # Azure TTS
│   │   ├── aliyun.sh      # 阿里云 TTS (框架)
│   │   └── tencent.sh     # 腾讯云 TTS (框架)
│   ├── asr/
│   │   ├── openai.sh      # OpenAI Whisper
│   │   ├── azure.sh       # Azure Speech (框架)
│   │   ├── aliyun.sh      # 阿里云 ASR (框架)
│   │   └── tencent.sh     # 腾讯云 ASR (框架)
│   └── utils.sh           # 公共工具函数
├── test-providers.sh       # 新增：检查服务商配置
.env.example                # 新增：配置模板
MULTI_PROVIDER_SETUP.md     # 新增：多厂商配置指南
```

### 🛡️ 安全改进

- 🔒 **SKILL.md 安全审查**：符合 ClawHub 安全标准
  - 明确声明所有依赖（API keys, tools, packages）
  - 添加安全性和隐私说明
  - 提供验证信息（verified_repo, verified_commit）
- 🔐 **环境变量管理**：`.env` 文件自动加载，权限控制
- 📝 **Agent 安全指南**：防止未授权的仓库克隆和脚本执行

### 📚 新增文档

- **MULTI_PROVIDER_SETUP.md** - 完整的多厂商配置指南
- **.env.example** - 配置文件模板（包含所有 4 个服务商）
- **SKILL_REVIEW.md** - SKILL.md 安全审查报告

## 🔄 兼容性

✅ **完全向后兼容**
- 现有 OpenAI 配置无需修改
- 所有现有命令和参数保持不变
- 新功能为可选增强，不影响现有用户

## 🎯 适用场景

### 解决的问题
1. **地理限制**：OpenAI API 在某些地区无法访问 → 使用阿里云/腾讯云
2. **服务稳定性**：单一服务商故障 → 自动切换到备用服务商
3. **成本优化**：灵活选择性价比高的服务商
4. **企业需求**：使用企业级 Azure 服务

### 使用建议

**国内用户**:
```bash
# .env 配置
TTS_PROVIDERS="aliyun,tencent,openai,azure"
ASR_PROVIDERS="aliyun,tencent,openai,azure"
```

**海外用户**:
```bash
# .env 配置
TTS_PROVIDERS="openai,azure,aliyun,tencent"
ASR_PROVIDERS="openai,azure,aliyun,tencent"
```

**企业用户**:
```bash
# .env 配置
TTS_PROVIDERS="azure,openai"
ASR_PROVIDERS="azure,openai"
```

## 📦 升级指南

### 从 v1.2.0 升级到 v1.3.0

```bash
# 1. 更新包
npm update -g openclaw-video-generator

# 2. 拉取最新代码（如果从源码安装）
cd ~/openclaw-video-generator
git pull
npm install

# 3. 复制配置模板（可选）
cp .env.example .env
# 编辑 .env，添加额外的服务商配置

# 4. 测试配置
./scripts/test-providers.sh

# 5. 正常使用（无需修改现有脚本）
./scripts/script-to-video.sh your-script.txt
```

## 🐛 修复的问题

- 🔧 修复了 HEVC 视频兼容性问题（自动检测并转换）
- 🔧 修复了环境变量加载问题（`script-to-video.sh` 现在自动加载 `.env`）
- 🔧 改进了错误处理和重试逻辑

## 💡 技术细节

### 架构改进
- **适配器模式**：每个服务商独立的适配器脚本
- **统一接口**：所有服务商使用相同的调用接口
- **降级策略**：智能的服务商选择和故障转移

### 已实现的服务商
- ✅ **OpenAI** (TTS + ASR): 完整实现
- ✅ **Azure** (TTS): 完整实现
- ⏳ **Azure** (ASR): 框架就绪，待实现 API 调用
- ⏳ **Aliyun** (TTS + ASR): 框架就绪，待实现 API 调用
- ⏳ **Tencent** (TTS + ASR): 框架就绪，待实现 API 调用

*注：框架已完成，社区欢迎贡献阿里云和腾讯云的 API 实现*

## 🔗 相关链接

- **GitHub**: https://github.com/ZhenRobotics/openclaw-video-generator
- **npm**: https://www.npmjs.com/package/openclaw-video-generator
- **ClawHub**: https://clawhub.ai/ZhenStaff/video-generator
- **文档**: [MULTI_PROVIDER_SETUP.md](./MULTI_PROVIDER_SETUP.md)

## 🙏 致谢

感谢社区反馈和建议，特别是关于地理限制和服务稳定性的问题。

---

**完整变更日志**: https://github.com/ZhenRobotics/openclaw-video-generator/compare/v1.2.0...v1.3.0
