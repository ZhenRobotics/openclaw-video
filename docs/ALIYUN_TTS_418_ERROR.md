# 阿里云 TTS 418 错误分析与解决方案

## 问题现象

```
❌ TTS request failed: 418
   Response: {"status":20000001,"message":"引擎错误"}
⚠️  Aliyun TTS: Attempt 1 failed, retrying...
⚠️  Aliyun TTS: Attempt 2 failed, retrying...
⚠️  Aliyun TTS: Attempt 3 failed, retrying...
❌ Aliyun TTS: Failed after 3 attempts
🔄 Trying provider: openai
```

## 根因分析

### 418 错误的常见原因

阿里云 TTS 返回 **418 状态码**通常表示 **"引擎错误"**，具体原因包括：

#### 1. **音色语言不匹配** ⚠️ **最常见**

**问题**：使用中文音色（如 Aibao/艾宝）处理英文文本

```python
# 错误示例
voice = "Aibao"  # 中文音色
text = "Hello, this is an English sentence."  # 英文文本
# → 418 引擎错误
```

**阿里云音色语言限制**：

| 音色类型 | 音色名称 | 支持语言 | 示例 |
|---------|---------|---------|------|
| 中文标准音色 | Aibao, Xiaoyun, Zhiqi | 仅中文 | ❌ 不支持英文 |
| 中文方言音色 | Aixia (粤语), Aishuo (四川话) | 仅对应方言 | ❌ 不支持其他语言 |
| 英文音色 | Kenny, Rosa, Catherine | 仅英文 | ❌ 不支持中文 |
| 多语言音色 | Aida, Aitong (部分) | 中英文 | ✅ 支持混合 |

#### 2. **文本内容策略限制**

**问题**：文本包含敏感词或违反内容政策

```python
# 可能触发的情况
- 涉及政治敏感话题
- 包含违禁词汇
- 广告推广内容（某些音色限制）
- 过度重复的文本
```

#### 3. **文本长度超限**

**问题**：单次请求文本过长

```python
# 阿里云 TTS 限制
单次请求最大字符数: 300 字符（标准版）
                    500 字符（高级版）

# 超出限制 → 418 错误
text = "很长很长的文本..." * 100  # 超过 300 字符
```

#### 4. **音色参数配置错误**

**问题**：speech_rate、pitch_rate 等参数超出范围

```python
# 参数范围
speech_rate: -500 to 500  # 语速
pitch_rate: -500 to 500   # 音调

# 超出范围 → 418 错误
speech_rate = 1000  # ❌ 超出范围
```

## 解决方案

### 方案 1: 智能音色选择（推荐）

#### 实现语言检测和音色映射

```python
import re

def detect_language(text):
    """
    检测文本主要语言
    返回: 'zh', 'en', 'mixed'
    """
    # 统计中文字符
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    # 统计英文单词
    english_words = len(re.findall(r'[a-zA-Z]+', text))
    # 总字符数
    total_chars = len(text)

    # 判断逻辑
    chinese_ratio = chinese_chars / max(total_chars, 1)
    english_ratio = english_words / max(total_chars / 5, 1)  # 估算

    if chinese_ratio > 0.5:
        return 'zh'
    elif english_ratio > 0.5:
        return 'en'
    else:
        return 'mixed'

def select_voice_for_language(language, preferred_voice=None):
    """
    根据语言选择合适的音色
    """
    # 音色映射表
    voice_map = {
        'zh': {
            'default': 'Zhiqi',  # 智琪（女声，清晰）
            'male': 'Aibao',     # 艾宝（男声）
            'female': 'Xiaoyun', # 小云（女声）
            'child': 'Aitong',   # 艾彤（儿童）
        },
        'en': {
            'default': 'Catherine',  # 英文女声
            'male': 'Kenny',         # 英文男声
            'female': 'Rosa',        # 英文女声
        },
        'mixed': {
            'default': 'Aida',   # 艾达（支持中英混合）
            'backup': 'Zhiqi',   # 备选：智琪
        }
    }

    # 如果指定了音色，检查是否适合
    if preferred_voice:
        # 检查音色语言兼容性
        compatible_voices = {
            'zh': ['Aibao', 'Xiaoyun', 'Zhiqi', 'Aixia', 'Aishuo', 'Aitong', 'Aida'],
            'en': ['Kenny', 'Rosa', 'Catherine'],
            'mixed': ['Aida', 'Zhiqi', 'Xiaoyun'],
        }

        if preferred_voice in compatible_voices.get(language, []):
            return preferred_voice
        else:
            print(f"⚠️  Voice '{preferred_voice}' not compatible with {language} text", file=sys.stderr)
            print(f"   Switching to default voice for {language}", file=sys.stderr)

    # 返回默认音色
    return voice_map.get(language, {}).get('default', 'Zhiqi')

def synthesize_speech_smart(text, output_file, voice=None, speech_rate=0):
    """
    智能 TTS：自动检测语言并选择音色
    """
    import requests

    # 检测语言
    language = detect_language(text)
    print(f"🔍 Detected language: {language}", file=sys.stderr)

    # 选择音色
    final_voice = select_voice_for_language(language, voice)
    print(f"🎤 Selected voice: {final_voice}", file=sys.stderr)

    # 检查文本长度
    if len(text) > 300:
        print(f"⚠️  Text too long ({len(text)} chars), splitting...", file=sys.stderr)
        # TODO: 实现文本分段逻辑
        return False

    # 调用原有 TTS 函数
    return synthesize_speech(text, output_file, final_voice, speech_rate)
```

### 方案 2: 快速修复（临时方案）

#### 2.1 更换默认音色

```bash
# 修改默认音色为支持中英文的 Aida
export ALIYUN_TTS_VOICE="Aida"

# 或在调用时指定
openclaw-video-generator script.txt --voice Aida
```

#### 2.2 分离中英文处理

```python
def split_text_by_language(text):
    """
    将文本按语言分段
    """
    segments = []
    current_lang = None
    current_text = ""

    for char in text:
        if re.match(r'[\u4e00-\u9fff]', char):  # 中文
            lang = 'zh'
        elif re.match(r'[a-zA-Z]', char):  # 英文
            lang = 'en'
        else:  # 标点符号等
            current_text += char
            continue

        if lang != current_lang and current_text:
            segments.append((current_lang, current_text))
            current_text = ""

        current_lang = lang
        current_text += char

    if current_text:
        segments.append((current_lang, current_text))

    return segments

# 使用示例
segments = split_text_by_language("这是中文 This is English 继续中文")
for lang, text in segments:
    voice = 'Zhiqi' if lang == 'zh' else 'Catherine'
    synthesize_speech(text, f"output_{lang}.mp3", voice)
```

### 方案 3: 文本长度控制

```python
def split_long_text(text, max_length=300):
    """
    将长文本分段，每段不超过 max_length
    """
    if len(text) <= max_length:
        return [text]

    # 按句子分割
    sentences = re.split(r'([。！？\.!\?])', text)

    segments = []
    current_segment = ""

    for i in range(0, len(sentences), 2):
        sentence = sentences[i]
        punctuation = sentences[i+1] if i+1 < len(sentences) else ""
        full_sentence = sentence + punctuation

        if len(current_segment) + len(full_sentence) <= max_length:
            current_segment += full_sentence
        else:
            if current_segment:
                segments.append(current_segment)
            current_segment = full_sentence

    if current_segment:
        segments.append(current_segment)

    return segments
```

### 方案 4: 改进错误处理

```python
def synthesize_with_fallback(text, output_file, voice="Aibao"):
    """
    带降级策略的 TTS 调用
    """
    # 尝试顺序
    fallback_voices = [
        voice,           # 用户指定的音色
        'Aida',          # 多语言音色
        'Zhiqi',         # 标准中文音色
        'Catherine',     # 英文音色
    ]

    for attempt_voice in fallback_voices:
        try:
            success = synthesize_speech(text, output_file, attempt_voice)
            if success:
                print(f"✅ Success with voice: {attempt_voice}", file=sys.stderr)
                return True
        except Exception as e:
            print(f"⚠️  Voice {attempt_voice} failed: {str(e)}", file=sys.stderr)
            continue

    print("❌ All voice options failed", file=sys.stderr)
    return False
```

## 阿里云音色完整列表

### 中文标准音色（仅支持中文）

| 音色 | 描述 | 性别 | 适用场景 |
|------|------|------|---------|
| Aibao | 艾宝 | 男 | 通用 |
| Xiaoyun | 小云 | 女 | 亲和力 |
| Zhiqi | 智琪 | 女 | 清晰标准 ✅ 推荐 |
| Aitong | 艾彤 | 儿童 | 儿童内容 |
| Aixia | 艾霞 | 女 | 粤语 |
| Aishuo | 艾硕 | 男 | 四川话 |

### 英文音色（仅支持英文）

| 音色 | 描述 | 性别 | 适用场景 |
|------|------|------|---------|
| Catherine | 凯瑟琳 | 女 | 标准美音 ✅ 推荐 |
| Kenny | 肯尼 | 男 | 标准美音 |
| Rosa | 罗莎 | 女 | 温柔 |

### 多语言音色（支持中英混合）

| 音色 | 描述 | 性别 | 适用场景 |
|------|------|------|---------|
| Aida | 艾达 | 女 | 中英混合 ✅ 推荐 |

## 快速诊断工具

```bash
#!/bin/bash
# 阿里云 TTS 418 错误诊断脚本

diagnose_418_error() {
    local text="$1"
    local voice="${2:-Aibao}"

    echo "🔍 诊断 418 错误..."
    echo ""

    # 1. 检查文本长度
    local text_length=${#text}
    echo "📏 文本长度: $text_length 字符"
    if [ $text_length -gt 300 ]; then
        echo "   ⚠️  警告: 超过 300 字符限制"
        echo "   建议: 使用文本分段"
    else
        echo "   ✅ 长度正常"
    fi
    echo ""

    # 2. 检测语言
    local chinese_chars=$(echo "$text" | grep -o '[\u4e00-\u9fff]' | wc -l)
    local english_words=$(echo "$text" | grep -oE '[a-zA-Z]+' | wc -l)

    echo "🌐 语言检测:"
    echo "   中文字符: $chinese_chars"
    echo "   英文单词: $english_words"

    if [ $chinese_chars -gt 0 ] && [ $english_words -gt 0 ]; then
        echo "   📝 检测结果: 中英混合"
        echo "   ✅ 推荐音色: Aida"
    elif [ $chinese_chars -gt 0 ]; then
        echo "   📝 检测结果: 中文"
        echo "   ✅ 推荐音色: Zhiqi, Xiaoyun, Aibao"
    elif [ $english_words -gt 0 ]; then
        echo "   📝 检测结果: 英文"
        echo "   ✅ 推荐音色: Catherine, Kenny"
    fi
    echo ""

    # 3. 检查音色兼容性
    echo "🎤 音色兼容性:"
    echo "   当前音色: $voice"

    case "$voice" in
        Aibao|Xiaoyun|Zhiqi|Aitong|Aixia|Aishuo)
            echo "   语言支持: 仅中文"
            if [ $english_words -gt 0 ]; then
                echo "   ❌ 错误: 中文音色不支持英文"
                echo "   建议: 切换到 Aida 或 Catherine"
            else
                echo "   ✅ 兼容"
            fi
            ;;
        Catherine|Kenny|Rosa)
            echo "   语言支持: 仅英文"
            if [ $chinese_chars -gt 0 ]; then
                echo "   ❌ 错误: 英文音色不支持中文"
                echo "   建议: 切换到 Aida 或 Zhiqi"
            else
                echo "   ✅ 兼容"
            fi
            ;;
        Aida)
            echo "   语言支持: 中英混合"
            echo "   ✅ 兼容"
            ;;
        *)
            echo "   ⚠️  未知音色"
            ;;
    esac
    echo ""

    # 4. 推荐方案
    echo "💡 解决方案:"
    if [ $english_words -gt 0 ] && [ "$voice" != "Aida" ] && [ "$voice" != "Catherine" ]; then
        echo "   1. 使用多语言音色:"
        echo "      openclaw-video-generator script.txt --voice Aida"
        echo ""
        echo "   2. 或分离中英文处理"
    elif [ $text_length -gt 300 ]; then
        echo "   1. 文本分段处理"
        echo "   2. 或使用高级版 TTS（支持 500 字符）"
    else
        echo "   ✅ 配置正常，请检查其他因素："
        echo "   - API 密钥是否正确"
        echo "   - 网络连接是否正常"
        echo "   - 文本内容是否包含敏感词"
    fi
}

# 使用示例
# diagnose_418_error "你的文本内容" "Aibao"
```

## 最佳实践

### 1. 根据内容选择音色

```bash
# 纯中文内容
openclaw-video-generator chinese.txt --voice Zhiqi

# 纯英文内容
openclaw-video-generator english.txt --voice Catherine

# 中英混合内容
openclaw-video-generator mixed.txt --voice Aida
```

### 2. 配置默认多语言音色

```bash
# 在 .env 或环境变量中设置
export ALIYUN_TTS_VOICE="Aida"

# 或修改 scripts/providers/tts/aliyun.sh 默认值
voice="${3:-${ALIYUN_TTS_VOICE:-Aida}}"  # 从 Aibao 改为 Aida
```

### 3. 实现自动语言检测

在 `scripts/tts-generate.sh` 中添加语言检测：

```bash
# 检测文本语言
detect_language() {
    local text="$1"
    local chinese=$(echo "$text" | grep -o '[\u4e00-\u9fff]' | wc -l)
    local english=$(echo "$text" | grep -oE '[a-zA-Z]+' | wc -l)

    if [ $chinese -gt 0 ] && [ $english -gt 0 ]; then
        echo "mixed"
    elif [ $chinese -gt 0 ]; then
        echo "zh"
    else
        echo "en"
    fi
}

# 自动选择音色
auto_select_voice() {
    local text="$1"
    local lang=$(detect_language "$text")

    case "$lang" in
        zh) echo "Zhiqi" ;;
        en) echo "Catherine" ;;
        mixed) echo "Aida" ;;
    esac
}
```

## 总结

### 418 错误的根本原因

| 原因 | 频率 | 解决方案 |
|------|------|---------|
| 音色语言不匹配 | ⭐⭐⭐⭐⭐ 最常见 | 使用 Aida 或检测语言 |
| 文本过长 | ⭐⭐⭐ 常见 | 文本分段 |
| 内容策略限制 | ⭐⭐ 偶尔 | 修改文本内容 |
| 参数配置错误 | ⭐ 罕见 | 检查参数范围 |

### 推荐方案优先级

1. **立即修复**：使用 `Aida` 音色（支持中英混合）
2. **长期方案**：实现智能语言检测和音色选择
3. **最佳实践**：根据内容类型预先选择合适音色

---

**相关文档**:
- [阿里云 TTS 官方文档](https://help.aliyun.com/document_detail/84435.html)
- [音色列表](https://help.aliyun.com/document_detail/84435.html#section-v61-rrz-a7a)
- [错误码说明](https://help.aliyun.com/document_detail/90800.html)
