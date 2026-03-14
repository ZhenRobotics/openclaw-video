# Test Suite Quick Reference

快速参考指南 - 常用测试命令

---

## 快速开始 (Quick Start)

### 1. 配置环境

```bash
# 最小配置（仅核心测试）
echo "OPENAI_API_KEY=sk-your-key-here" >> .env

# 完整配置（推荐）
cat >> .env <<EOF
OPENAI_API_KEY=sk-...
ALIYUN_ACCESS_KEY_ID=...
ALIYUN_ACCESS_KEY_SECRET=...
ALIYUN_APP_KEY=...
EOF
```

### 2. 运行测试

```bash
# 运行所有测试（推荐）
./tests/run-all-tests.sh

# 或单独运行关键测试
./tests/api/test-parameter-pollution.sh
```

---

## 常用命令 (Common Commands)

### 运行所有测试

```bash
./tests/run-all-tests.sh
```

**时间**: ~30-45 分钟
**要求**: 至少配置一个提供商

---

### 运行单个测试套件

```bash
# TTS 提供商测试 (15 tests)
./tests/api/test-tts-providers.sh

# ASR 提供商测试 (9 tests)
./tests/api/test-asr-providers.sh

# 参数污染回归测试 (15 tests) - 关键!
./tests/api/test-parameter-pollution.sh

# 提供商降级测试 (10 tests)
./tests/api/test-provider-fallback.sh

# 性能基准测试 (9 tests)
./tests/api/test-performance.sh

# 安全验证测试 (11 tests)
./tests/api/test-security.sh
```

---

### 查看测试报告

```bash
# 最新的汇总报告
ls -t tests/test-results/summary/*.txt | head -1 | xargs cat

# 最新的参数污染测试报告
ls -t tests/test-results/pollution/*.txt | head -1 | xargs cat

# 列出所有报告
find tests/test-results -name "*.txt" -type f
```

---

## 发布前检查 (Pre-Release)

### ClawHub 发布前必测

```bash
# 1. 参数污染回归测试（必须 100% 通过）
./tests/api/test-parameter-pollution.sh

# 2. 安全测试（必须 100% 通过）
./tests/api/test-security.sh

# 3. 核心 TTS 功能
./tests/api/test-tts-providers.sh

# 4. 完整测试套件
./tests/run-all-tests.sh
```

### 手动端到端测试

```bash
# 创建测试脚本
cat > /tmp/release-test.txt <<EOF
三家巨头同一天说了一件事。
微软说Copilot已经能写掉百分之九十的代码。
OpenAI说GPT5能替代大部分程序员。
EOF

# 运行完整流程
./scripts/script-to-video.sh /tmp/release-test.txt

# 验证输出
ls -lh out/*.mp4
```

---

## 测试特定功能 (Specific Features)

### 测试 Aliyun 智能音色选择 (v1.4.3)

```bash
# 运行 Aliyun TTS 测试
./tests/api/test-tts-providers.sh | grep -A10 "Aliyun"

# 预期：无 418 错误，正确选择音色
# - 中文 → Zhiqi
# - 英文 → Catherine
# - 混合 → Aida
```

### 测试参数污染修复 (v1.4.1 + v1.4.4)

```bash
# 运行参数污染测试
./tests/api/test-parameter-pollution.sh

# 预期：100% 通过 (15/15 tests)
# - v1.4.1: TTS 文本清理
# - v1.4.4: Remotion props 清理
```

### 测试提供商降级

```bash
# 测试自动降级
./tests/api/test-provider-fallback.sh

# 测试自定义提供商顺序
TTS_PROVIDERS=aliyun,openai ./tests/api/test-tts-providers.sh
```

---

## 调试命令 (Debugging)

### 查看详细输出

```bash
# 运行测试并查看完整输出
./tests/api/test-tts-providers.sh 2>&1 | less

# 只看错误
./tests/api/test-tts-providers.sh 2>&1 | grep -E "FAIL|ERROR"

# 只看通过的测试
./tests/api/test-tts-providers.sh 2>&1 | grep "PASS"
```

### 测试单个功能

```bash
# 测试 OpenAI TTS
OPENAI_API_KEY=sk-... ./scripts/providers/tts/openai.sh "测试" /tmp/test.mp3 nova 1.0

# 测试 Aliyun TTS
ALIYUN_ACCESS_KEY_ID=... \
ALIYUN_ACCESS_KEY_SECRET=... \
ALIYUN_APP_KEY=... \
./scripts/providers/tts/aliyun.sh "测试" /tmp/test.mp3 Zhiqi 1.0

# 测试 Whisper ASR
OPENAI_API_KEY=sk-... ./scripts/providers/asr/openai.sh /tmp/test.mp3 /tmp/test.json zh
```

### 检查配置

```bash
# 检查 .env 文件
cat .env | grep -v "^#" | grep -v "^$"

# 检查哪些提供商已配置
source .env
[[ -n "$OPENAI_API_KEY" ]] && echo "✓ OpenAI configured"
[[ -n "$ALIYUN_ACCESS_KEY_ID" ]] && echo "✓ Aliyun configured"
[[ -n "$AZURE_SPEECH_KEY" ]] && echo "✓ Azure configured"
[[ -n "$TENCENT_SECRET_ID" ]] && echo "✓ Tencent configured"
```

---

## 性能测试 (Performance)

### 快速性能检查

```bash
# 测试 TTS 性能
time ./scripts/tts-generate.sh "测试文本" --out /tmp/perf-test.mp3

# 测试 ASR 性能
time ./scripts/whisper-timestamps.sh /tmp/perf-test.mp3 --out /tmp/perf-test.json
```

### 完整性能基准

```bash
./tests/api/test-performance.sh
```

**性能目标**:
- TTS 短文本: < 5 秒
- TTS 中等文本: < 10 秒
- ASR 短音频: < 30 秒
- 端到端: < 120 秒（不含渲染）

---

## 清理测试文件 (Cleanup)

```bash
# 清理测试结果
rm -rf tests/test-results/*

# 清理测试生成的音频
rm -f audio/test-*.mp3 audio/*-test-*.mp3

# 清理所有临时文件
find . -name "*-test-*" -type f -delete
find /tmp -name "*openclaw*" -type f -delete 2>/dev/null
```

---

## 故障排除 (Troubleshooting)

### 测试被跳过 (Tests Skipped)

**问题**: 大量测试显示 "SKIP"

**原因**: 提供商未配置

**解决**:
```bash
# 检查 .env
cat .env

# 添加缺失的配置
echo "OPENAI_API_KEY=sk-..." >> .env
```

---

### 测试失败 (Tests Failed)

**问题**: 测试显示 "FAIL"

**检查清单**:
1. API 密钥是否有效？
2. 网络连接是否正常？
3. API 配额是否用尽？
4. 是否存在真实 bug？

**调试**:
```bash
# 查看详细错误
./tests/api/test-tts-providers.sh 2>&1 | grep -A5 "FAIL"

# 查看测试报告
cat tests/test-results/tts/tts-test-report-*.txt
```

---

### 性能测试慢 (Performance Slow)

**问题**: 性能测试超时或很慢

**原因**: 网络延迟、API 负载

**解决**:
- 测试允许 2倍目标时间
- 非高峰时段重试
- 检查网络连接

---

## 文档参考 (Documentation)

```bash
# 完整测试文档
cat tests/README.md

# 测试计划
cat tests/TEST_PLAN.md

# ClawHub 发布清单
cat tests/CLAWHUB_PRE_RELEASE_CHECKLIST.md

# 初始测试报告
cat tests/INITIAL_TEST_REPORT.md
```

---

## 版本验证 (Version Check)

```bash
# 检查版本号一致性
grep version package.json openclaw-skill/SKILL.md

# 检查 Git 标签
git tag | grep v1.4

# 检查最新提交
git log --oneline -5
```

---

## CI/CD 集成 (CI/CD)

### GitHub Actions 示例

```yaml
# .github/workflows/test.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: ./tests/run-all-tests.sh
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## 联系方式 (Contact)

- **GitHub Issues**: https://github.com/ZhenRobotics/openclaw-video-generator/issues
- **ClawHub**: https://clawhub.ai/ZhenStaff/video-generator
- **Documentation**: See `tests/README.md`, `tests/TEST_PLAN.md`

---

## 快速备忘 (Quick Cheat Sheet)

```bash
# 所有测试
./tests/run-all-tests.sh

# 关键测试（发布前必须）
./tests/api/test-parameter-pollution.sh
./tests/api/test-security.sh

# 查看最新报告
ls -t tests/test-results/summary/*.txt | head -1 | xargs cat

# 清理
rm -rf tests/test-results/*

# 检查配置
cat .env | grep -E "OPENAI|ALIYUN|AZURE|TENCENT"
```

---

**最后更新**: 2026-03-14
**版本**: v1.4.4
