# OpenClaw 参数污染问题与解决方案

## 问题概述

**现象**：OpenClaw 外层自动化执行器在调用命令时，会将内部超时参数串联到命令行参数后面，形成类似 `",timeout:1200}"` 的尾巴。

**影响**：这段尾巴被下游 CLI 当作实参解析，导致解析失败或路径异常。

---

## 受影响的层级

### 1. ✅ TTS 文本层（v1.4.1 已修复）

**位置**：`agents/tools.ts` → `generate_tts()`

**问题**：
```typescript
// 污染前
text = "你好，世界"

// 被污染
text = "你好，世界,timeout:30000}"
```

**修复**（v1.4.1）：
```typescript
// 清理文本：移除 JSON 元数据
let cleanText = text.trim()
  .replace(/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$/gi, '')
  .replace(/[,}\s]+$/, '').trim();
```

**状态**：✅ 已修复并发布

---

### 2. ⚠️ Remotion Props 层（v1.4.4 修复中）

**位置**：`scripts/script-to-video.sh:143`

**问题**：
```bash
# 正常 JSON
--props "{\"audioPath\": \"user-script.mp3\"}"

# 被污染的 JSON
--props "{\"audioPath\": \"user-script.mp3\"},timeout:1200}"
                                           ^^^^^^^^^^^^^^^^
                                           导致 JSON.parse() 失败
```

**错误信息**：
```
Error: Failed to parse props JSON
SyntaxError: Unexpected token ',' at position 34
```

**修复方案**：

#### 方案 A：参数清理（推荐）

```bash
# 在 scripts/script-to-video.sh 中添加清理逻辑
audio_filename=$(basename "$audio_file")

# 清理可能的污染
audio_filename_clean=$(echo "$audio_filename" | sed -E 's/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$//')

# 构建干净的 JSON
props_json="{\"audioPath\": \"${audio_filename_clean}\"}"

# 二次验证：移除尾部逗号
props_json=$(echo "$props_json" | sed -E 's/,\s*}$/}/')

pnpm exec remotion render Main "$output_video" --props "$props_json"
```

#### 方案 B：使用配置文件（备选）

```bash
# 不使用 --props，而是依赖 src/scenes-data.ts 中的 videoConfig
pnpm exec remotion render Main "$output_video"
```

---

### 3. ⚠️ 其他潜在风险点

#### 3.1 Whisper Timestamps

**位置**：`agents/tools.ts` → `extract_timestamps()`

**风险**：文件路径可能被污染

```typescript
// 可能的污染
audio_file = "/path/to/audio.mp3,timeout:30000}"
```

**建议**：添加路径清理

```typescript
// 清理文件路径
const cleanAudioFile = audio_file.replace(/,\s*(timeout|maxTokens)[:\s]*[^}]*}?\s*$/, '');
```

#### 3.2 Scene Generation

**位置**：`agents/tools.ts` → `generate_scenes()`

**风险**：timestamps 文件路径污染

**建议**：类似清理逻辑

---

## 通用解决方案

### 1. Shell 脚本清理函数

**文件**：`scripts/clean-json-params.sh`

```bash
#!/usr/bin/env bash
# 清理 JSON 参数污染

clean_json_params() {
    local input="$1"

    # 移除尾部元数据模式
    local cleaned
    cleaned=$(echo "$input" | sed -E 's/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$//')

    # 移除尾部逗号和括号
    cleaned=$(echo "$cleaned" | sed -E 's/[,}]\s*$//')

    # 如果没有闭合括号，添加
    if [[ ! "$cleaned" =~ }$ ]]; then
        cleaned="${cleaned}}"
    fi

    echo "$cleaned"
}
```

**使用**：
```bash
# 在脚本中使用
source scripts/clean-json-params.sh
clean_params=$(clean_json_params "$dirty_params")
```

### 2. TypeScript/JavaScript 清理函数

```typescript
/**
 * 清理 OpenClaw 执行器污染的参数
 */
function cleanOpenClawParams(input: string): string {
  // 移除 JSON 元数据模式
  let cleaned = input
    .trim()
    .replace(/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$/gi, '');

  // 移除尾部逗号
  cleaned = cleaned.replace(/[,}\s]+$/, '').trim();

  return cleaned;
}
```

**使用**：
```typescript
// 清理文本参数
const cleanText = cleanOpenClawParams(text);

// 清理文件路径
const cleanPath = cleanOpenClawParams(filePath);
```

---

## 诊断工具

### 检测参数污染

```bash
#!/usr/bin/env bash
# 检测参数是否被污染

detect_pollution() {
    local param="$1"

    if echo "$param" | grep -qE ',\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$'; then
        echo "⚠️  Pollution detected in: $param"
        return 0
    else
        echo "✅ Clean parameter: $param"
        return 1
    fi
}

# 使用示例
detect_pollution "$audio_filename"
```

### 测试清理效果

```bash
#!/usr/bin/env bash
# 测试清理函数

test_cases=(
    "normal.mp3"
    "test.mp3,timeout:30000}"
    "{\"key\":\"value\"},maxTokens:1000}"
    "path/to/file.json,timeout:1200}"
)

for test_case in "${test_cases[@]}"; do
    echo "Input:  $test_case"
    cleaned=$(clean_json_params "$test_case")
    echo "Output: $cleaned"
    echo ""
done
```

---

## 修复清单

### 已修复 ✅

- [x] `agents/tools.ts` - TTS 文本参数 (v1.4.1)
  - 清理逻辑：移除 JSON 元数据
  - 使用临时文件传递参数
  - 测试验证：5/5 通过

### 进行中 🔄

- [ ] `scripts/script-to-video.sh` - Remotion props (v1.4.4)
  - 添加参数清理逻辑
  - 验证 JSON 格式
  - 调试输出

### 待处理 📋

- [ ] `agents/tools.ts` - 文件路径参数
  - `extract_timestamps()` - audio_file 路径
  - `generate_scenes()` - timestamps_file 路径

- [ ] 通用工具函数
  - 创建 `cleanOpenClawParams()` 通用函数
  - 在所有外部调用点使用

---

## 测试验证

### 测试 1: Remotion Props 清理

```bash
# 测试污染的 props
test_props='{"audioPath": "test.mp3"},timeout:1200}'

# 清理
cleaned_props=$(echo "$test_props" | sed -E 's/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$//')

# 验证 JSON 有效性
echo "$cleaned_props" | jq . > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Valid JSON: $cleaned_props"
else
    echo "❌ Invalid JSON: $cleaned_props"
fi
```

### 测试 2: 端到端测试

```bash
#!/usr/bin/env bash
# 模拟 OpenClaw 污染场景

# 模拟污染
export OPENCLAW_TEST_MODE=true
export CONTAMINATED_PARAMS=",timeout:30000}"

# 运行生成流程
./scripts/script-to-video.sh test.txt

# 检查输出
if [ -f out/test.mp4 ]; then
    echo "✅ Video generated successfully despite contamination"
else
    echo "❌ Video generation failed"
fi
```

---

## 最佳实践

### 1. 防御性编程

**原则**：假设所有外部参数都可能被污染

```bash
# ❌ 不安全
audio_file="$1"
ffmpeg -i "$audio_file" output.mp3

# ✅ 安全
audio_file=$(echo "$1" | sed -E 's/,\s*(timeout|maxTokens)[:\s]*[^}]*}?\s*$//')
ffmpeg -i "$audio_file" output.mp3
```

### 2. 早期验证

**原则**：在使用参数前先验证和清理

```typescript
function processAudio(audioPath: string) {
  // 早期清理
  const cleanPath = cleanOpenClawParams(audioPath);

  // 验证路径存在
  if (!fs.existsSync(cleanPath)) {
    throw new Error(`File not found: ${cleanPath}`);
  }

  // 继续处理...
}
```

### 3. 调试输出

**原则**：在关键点输出清理前后的值

```bash
echo "[Debug] Raw parameter: $raw_param" >&2
echo "[Debug] Cleaned parameter: $cleaned_param" >&2
```

### 4. JSON 专用清理

**原则**：对 JSON 参数使用额外验证

```bash
# 清理
props_json=$(clean_json_params "$raw_json")

# 验证
if ! echo "$props_json" | jq . > /dev/null 2>&1; then
    echo "❌ Invalid JSON after cleaning: $props_json" >&2
    exit 1
fi
```

---

## 相关问题

### 与 418 错误的关系

| 问题类型 | 原因 | 解决方案 |
|---------|------|---------|
| **参数污染** | OpenClaw 执行器添加元数据 | 清理参数 (v1.4.1, v1.4.4) |
| **418 错误** | Aliyun 音色语言不匹配 | 智能音色选择 (v1.4.3) |

**区别**：
- 参数污染：**外部因素**，需要清理输入
- 418 错误：**内部逻辑**，需要智能选择

---

## 版本历史

### v1.4.1 - TTS 文本污染修复
- ✅ 修复 `agents/tools.ts` 中的 TTS 文本污染
- ✅ 添加文本清理逻辑
- ✅ 使用临时文件传递参数

### v1.4.3 - Aliyun 418 错误修复
- ✅ 智能音色选择
- ✅ 自动语言检测
- ⚠️ **不是参数污染问题**

### v1.4.4 - Remotion Props 污染修复（计划）
- 🔄 修复 `scripts/script-to-video.sh`
- 🔄 添加 props 清理逻辑
- 🔄 验证 JSON 格式
- 🔄 添加调试输出

---

## 总结

### 问题根源
OpenClaw 执行器在命令行末尾添加 `",timeout:XXX}"` 等元数据

### 影响范围
- TTS 文本参数 ✅ 已修复
- Remotion JSON props 🔄 修复中
- 文件路径参数 📋 待处理

### 解决策略
1. **清理输入**：移除已知的元数据模式
2. **防御验证**：在使用前验证参数
3. **调试输出**：关键点记录清理过程
4. **测试覆盖**：确保所有场景通过

---

**相关文档**：
- [OPENCLAW_AGENT_FIX.md](../OPENCLAW_AGENT_FIX.md) - v1.4.1 TTS 修复
- [ALIYUN_TTS_418_ERROR.md](ALIYUN_TTS_418_ERROR.md) - v1.4.3 音色问题
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - 通用故障排除

**相关 Issues**：
- #TBD - Remotion props污染问题
- #TBD - 文件路径污染问题
