# ClawHub Pre-Release Checklist - v1.4.4

发布前验证清单 - 确保所有功能正常工作

## 版本信息

- **版本**: v1.4.4
- **发布日期**: 2026-03-14
- **关键修复**:
  - v1.4.4: 修复 Remotion props JSON 污染
  - v1.4.3: 修复阿里云 TTS 418 错误（智能音色选择）
  - v1.4.1: 修复 OpenClaw 执行器 TTS 文本污染

## 必测项目 (Must Test)

### 1. 参数污染回归测试 ✅

**目的**: 验证 v1.4.1 和 v1.4.4 的 bug 修复

```bash
./tests/api/test-parameter-pollution.sh
```

**验证点**:
- [ ] v1.4.1: TTS 文本清理正常工作
  - 输入: `你好,timeout:30000}` → 输出: `你好`
- [ ] v1.4.4: Remotion props JSON 清理正常工作
  - 输入: `{"audioPath":"test.mp3"},timeout:1200}` → 输出: `{"audioPath":"test.mp3"}`
- [ ] 所有已知污染模式都被正确清理
- [ ] JSON 输出有效
- [ ] 无安全漏洞

**预期结果**: 全部通过 (16/16 tests)

---

### 2. 阿里云 TTS 智能音色选择 ✅

**目的**: 验证 v1.4.3 修复（避免 418 错误）

```bash
./tests/api/test-tts-providers.sh | grep -A10 "Aliyun"
```

**验证点**:
- [ ] 纯中文文本 → 自动选择 Zhiqi 音色（**不出现 418 错误**）
- [ ] 纯英文文本 → 自动选择 Catherine 音色（**不出现 418 错误**）
- [ ] 中英混合文本 → 自动选择 Aida 音色（**不出现 418 错误**）
- [ ] 智能模式正确检测语言
- [ ] 音色语言匹配

**预期结果**: 4/4 Aliyun 测试通过，无 418 错误

---

### 3. 多提供商 TTS 功能 ✅

**目的**: 验证所有 TTS 提供商基本功能

```bash
./tests/api/test-tts-providers.sh
```

**验证点**:
- [ ] OpenAI TTS: 基本中英文、多音色、语速调节
- [ ] Aliyun TTS: 智能音色选择、中英文、混合语言
- [ ] Azure TTS (如已配置): 基本功能
- [ ] Tencent TTS (如已配置): 基本功能
- [ ] 边缘情况处理: 空文本、长文本、特殊字符

**预期结果**:
- 至少 OpenAI 和 Aliyun 测试通过
- 总体通过率 > 80%

---

### 4. ASR (语音识别) 功能 ✅

**目的**: 验证时间戳提取准确性

```bash
./tests/api/test-asr-providers.sh
```

**验证点**:
- [ ] OpenAI Whisper: 中英文转写、准确性、性能
- [ ] 时间戳 JSON 格式正确
- [ ] 包含 start, end, text 字段
- [ ] 转写文本合理准确

**预期结果**: 主要 ASR 提供商测试通过

---

### 5. 提供商自动降级 ✅

**目的**: 验证多提供商环境下的自动切换

```bash
./tests/api/test-provider-fallback.sh
```

**验证点**:
- [ ] 主提供商失败时自动切换到备用
- [ ] 提供商优先级正确 (openai → azure → aliyun → tencent)
- [ ] 可通过 `TTS_PROVIDERS` 环境变量自定义顺序
- [ ] `--provider` 参数强制指定提供商
- [ ] 无效提供商返回清晰错误信息

**预期结果**: 降级机制正常工作

---

### 6. 性能基准测试 ✅

**目的**: 验证性能符合目标

```bash
./tests/api/test-performance.sh
```

**验证点**:
- [ ] TTS 短文本 (< 50字符): **< 5秒**
- [ ] TTS 中等文本 (50-200字符): **< 10秒**
- [ ] ASR 短音频 (~20秒): **< 30秒**
- [ ] 端到端流程 (~20秒视频): **< 120秒** (不含渲染)

**预期结果**:
- 大部分测试达到性能目标
- 允许因网络波动有 2倍时间的容差

---

### 7. 安全验证 ✅

**目的**: 确保无安全漏洞

```bash
./tests/api/test-security.sh
```

**验证点**:
- [ ] API 密钥不在日志中暴露
- [ ] API 密钥不在错误信息中暴露
- [ ] API 密钥不在生成文件中暴露
- [ ] 命令注入攻击被阻止
- [ ] 路径遍历攻击被阻止
- [ ] 文件权限安全（非全局可写）
- [ ] .env 文件在 .gitignore 中

**预期结果**: 无安全问题 (11/11 tests)

---

## 手动测试项目 (Manual Tests)

### 8. 端到端视频生成 🔧

**手动运行**:
```bash
# 创建测试脚本
cat > /tmp/test-v1.4.4.txt <<EOF
三家巨头同一天说了一件事。
微软说Copilot已经能写掉百分之九十的代码。
OpenAI说GPT5能替代大部分程序员。
Google说Gemini2.0改变游戏规则。
但真相是什么？
AI不会取代开发者，而是让优秀开发者效率提升十倍。
EOF

# 运行完整流程
./scripts/script-to-video.sh /tmp/test-v1.4.4.txt
```

**验证点**:
- [ ] TTS 音频生成成功
- [ ] Whisper 时间戳提取成功
- [ ] 场景文件 (src/scenes-data.ts) 正确更新
- [ ] Remotion 视频渲染成功
- [ ] 生成的视频可正常播放
- [ ] 字幕与音频同步
- [ ] 视觉效果正常（赛博朋克风格）

**预期结果**: 完整视频生成成功，时长约 20 秒

---

### 9. OpenClaw Agent 集成测试 🔧

**通过 OpenClaw 调用**:
```javascript
// 在 OpenClaw Agent 中测试
await tools.generate_tts({
  text: "测试 OpenClaw 集成，验证参数清理功能",
  output_file: "openclaw-test.mp3"
});
```

**验证点**:
- [ ] OpenClaw 传递的参数被正确清理
- [ ] 元数据污染 (timeout, maxTokens 等) 被移除
- [ ] TTS 正常生成音频
- [ ] 无参数相关错误

**预期结果**: OpenClaw 集成无问题

---

### 10. 背景视频功能测试 🔧

**测试背景视频**:
```bash
# 使用背景视频
./scripts/script-to-video.sh /tmp/test-v1.4.4.txt \
  --bg-video /path/to/background.mp4 \
  --bg-opacity 0.7
```

**验证点**:
- [ ] 背景视频正确加载
- [ ] 不透明度设置生效
- [ ] 背景与字幕叠加正确
- [ ] 大文件 (up to 100MB) 加载正常
- [ ] 加载超时时间合理 (< 60秒)

**预期结果**: 背景视频功能正常

---

## 运行所有自动化测试

### 完整测试套件

```bash
# 运行所有测试
./tests/run-all-tests.sh
```

**验证点**:
- [ ] 参数污染测试: ✅ 全部通过
- [ ] TTS 提供商测试: ✅ 主要通过
- [ ] ASR 提供商测试: ✅ 主要通过
- [ ] 提供商降级测试: ✅ 通过
- [ ] 性能基准测试: ✅ 达标
- [ ] 安全验证测试: ✅ 全部通过

**预期结果**:
- 总测试套件: 6/6 通过
- 总测试用例: > 70 个
- 通过率: > 85%

---

## 配置要求

### 最小配置 (测试核心功能)

```bash
# .env 文件
OPENAI_API_KEY=sk-...
```

### 推荐配置 (完整测试)

```bash
# .env 文件
# OpenAI (必需)
OPENAI_API_KEY=sk-...

# Aliyun (推荐，测试 v1.4.3 修复)
ALIYUN_ACCESS_KEY_ID=...
ALIYUN_ACCESS_KEY_SECRET=...
ALIYUN_APP_KEY=...

# Azure (可选)
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=...

# Tencent (可选)
TENCENT_SECRET_ID=...
TENCENT_SECRET_KEY=...
TENCENT_APP_ID=...
```

---

## 发布前最终检查

### 代码检查 ✅

- [ ] `package.json` 版本号: **1.4.4**
- [ ] `openclaw-skill/SKILL.md` 版本号: **1.4.4**
- [ ] Git 标签: `git tag v1.4.4`
- [ ] Git 推送: `git push && git push --tags`

### 文档检查 ✅

- [ ] README.md 更新 (如需要)
- [ ] QUICKSTART.md 更新 (如需要)
- [ ] 更新日志准备 (RELEASE_NOTES.md)
- [ ] ClawHub skill 说明更新

### 功能验证 ✅

- [ ] 所有自动化测试通过
- [ ] 手动端到端测试成功
- [ ] OpenClaw 集成测试成功
- [ ] 背景视频功能测试成功
- [ ] 无已知严重 bug

### 安全检查 ✅

- [ ] .env 文件在 .gitignore 中
- [ ] 无 API 密钥泄露
- [ ] 无注入漏洞
- [ ] 文件权限安全

---

## 测试执行记录

### 测试日期: __________

### 测试人员: __________

### 测试环境:
- 操作系统: __________
- Node.js 版本: __________
- 配置的提供商: __________

### 测试结果:

#### 自动化测试
```
./tests/run-all-tests.sh

总测试套件: __/6
通过测试: __
失败测试: __
跳过测试: __
```

#### 手动测试
- [ ] 端到端视频生成: ✅ / ❌
- [ ] OpenClaw 集成: ✅ / ❌
- [ ] 背景视频功能: ✅ / ❌

### 发现的问题:
1. _______________
2. _______________
3. _______________

### 解决方案:
1. _______________
2. _______________
3. _______________

---

## 发布决策

### 测试通过标准:
- ✅ 参数污染测试: 100% 通过
- ✅ 核心 TTS/ASR 功能: > 80% 通过
- ✅ 安全测试: 100% 通过
- ✅ 手动端到端测试: 成功
- ✅ 无严重阻塞问题

### 发布决定:
- [ ] **批准发布** - 所有测试通过
- [ ] **暂缓发布** - 需要修复以下问题: _______________
- [ ] **取消发布** - 存在严重问题: _______________

### 签字确认:
- 测试负责人: __________ 日期: __________
- 发布负责人: __________ 日期: __________

---

## 快速参考命令

```bash
# 1. 运行所有测试
./tests/run-all-tests.sh

# 2. 单独测试参数污染修复
./tests/api/test-parameter-pollution.sh

# 3. 测试 Aliyun 智能音色
./tests/api/test-tts-providers.sh | grep -A5 "Aliyun"

# 4. 手动端到端测试
./scripts/script-to-video.sh /tmp/test-v1.4.4.txt

# 5. 查看测试报告
ls -lht tests/test-results/summary/

# 6. 验证版本号
grep version package.json openclaw-skill/SKILL.md
```

---

## 联系方式

- GitHub Issues: https://github.com/ZhenRobotics/openclaw-video-generator/issues
- ClawHub: https://clawhub.ai/ZhenStaff/video-generator

---

**注意**: 本清单必须在每次发布到 ClawHub 前完成。确保所有必测项目都通过后再发布。
