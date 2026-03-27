## v1.6.0 - Premium Styles System (2026-03-18)

### 🎨 重大新功能：高端风格系统

新增 **5 种专业级场景风格**，提供高端视觉选择：

#### 新增风格
1. **Elegance（优雅展示）** - Apple 风格极简美学，适合产品发布
2. **Authority（权威叙事）** - 数据驱动权威感，适合专业分析
3. **Luxury（奢华质感）** - 黑金配色极致克制，适合高端服务
4. **Minimal（极简几何）** - 纯粹几何艺术，适合科技产品
5. **Cinematic（电影叙事）** - 电影级视觉语言，适合品牌故事

### 🛠️ 新增参数

```typescript
// 场景配置中新增 styleTheme 参数
{
  type: 'elegance' | 'authority' | 'luxury' | 'minimal' | 'cinematic',
  styleTheme: 'premium',  // 或 'cyber'（默认）
  // ... 其他参数
}
```

### 📊 当前功能概览

- **11 种场景类型**：6 种赛博风格 + 5 种高端风格
- **多厂商支持**：OpenAI、Azure、阿里云、腾讯云
- **完整流程**：TTS → ASR → 视频渲染一键完成

### 🚀 快速使用

```bash
# 安装/更新
npm install -g openclaw-video-generator

# 使用高端风格
openclaw-video generate \
  --script "您的文案" \
  --style elegance \
  --theme premium
```

### 🔄 兼容性

✅ **向后兼容** - 现有项目无需修改
✅ **无破坏性变更** - 默认保持赛博风格
✅ **灵活切换** - 可在同一视频中混用不同风格

### 📦 更新方式

```bash
npm install -g openclaw-video-generator@1.6.0
```

### 🔗 相关链接

- 📦 npm: https://www.npmjs.com/package/openclaw-video-generator
- 💻 GitHub: https://github.com/ZhenRobotics/openclaw-video-generator
- 📖 文档: https://github.com/ZhenRobotics/openclaw-video-generator#readme

---

**版本信息**
- Version: v1.6.0
- Release Date: 2026-03-18
- Change Type: Feature Release（次版本升级）
