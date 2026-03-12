#!/usr/bin/env bash
# Aliyun TTS Provider

set -euo pipefail

# Input: text, output_file, voice, speed
text="${1:-}"
output="${2:-}"
voice="${3:-${ALIYUN_TTS_VOICE:-Aibao}}"
speed="${4:-1.0}"

if [[ -z "$text" || -z "$output" ]]; then
  echo "Usage: aliyun.sh <text> <output_file> [voice] [speed]" >&2
  exit 1
fi

if [[ -z "${ALIYUN_ACCESS_KEY_ID:-}" || -z "${ALIYUN_ACCESS_KEY_SECRET:-}" || -z "${ALIYUN_APP_KEY:-}" ]]; then
  echo "Error: ALIYUN_ACCESS_KEY_ID, ALIYUN_ACCESS_KEY_SECRET, or ALIYUN_APP_KEY not set" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# 检查 Python 3
if ! command -v python3 &> /dev/null; then
  echo "❌ Aliyun TTS: python3 not found" >&2
  echo "   Install: apt install python3 (Ubuntu) or brew install python3 (macOS)" >&2
  exit 1
fi

# 优先使用智能模式（自动语言检测和音色选择）
smart_script="$(dirname "$0")/aliyun_tts_smart.py"
fixed_script="$(dirname "$0")/aliyun_tts_fixed.py"

# 检查环境变量，决定是否使用智能模式
use_smart_mode="${ALIYUN_TTS_SMART_MODE:-true}"

if [[ "$use_smart_mode" == "true" ]] && [[ -f "$smart_script" ]]; then
  # 智能模式：自动检测语言并选择音色
  echo "🎤 Using Aliyun TTS Smart Mode (auto voice selection)" >&2

  max_retries=2  # 智能模式只重试一次
  for i in $(seq 1 $max_retries); do
    if python3 "$smart_script" "$text" "$output" "$voice" "$speed" 2>&1; then
      if [[ -f "$output" && -s "$output" ]]; then
        exit 0
      fi
    fi

    if [[ $i -lt $max_retries ]]; then
      echo "⚠️  Smart mode: Attempt $i failed, retrying..." >&2
      sleep 1
    fi
  done

  echo "⚠️  Smart mode failed, falling back to fixed mode..." >&2
fi

# 降级到固定模式
if [[ ! -f "$fixed_script" ]]; then
  echo "❌ Aliyun TTS: Python script not found: $fixed_script" >&2
  exit 1
fi

echo "🎤 Using Aliyun TTS Fixed Mode" >&2

# 调用固定模式并重试
max_retries=3
for i in $(seq 1 $max_retries); do
  if python3 "$fixed_script" "$text" "$output" "$voice" "$speed" 2>&1; then
    if [[ -f "$output" && -s "$output" ]]; then
      exit 0
    fi
  fi

  if [[ $i -lt $max_retries ]]; then
    echo "⚠️  Aliyun TTS: Attempt $i failed, retrying..." >&2
    sleep 2
  fi
done

echo "❌ Aliyun TTS: Failed after all attempts" >&2
echo "💡 Troubleshooting:" >&2
echo "   - Check if voice '$voice' supports your text language" >&2
echo "   - For mixed language text, try: export ALIYUN_TTS_VOICE='Aida'" >&2
echo "   - For Chinese text, try: Zhiqi, Xiaoyun, or Aibao" >&2
echo "   - For English text, try: Catherine, Kenny, or Rosa" >&2
echo "   - See docs/ALIYUN_TTS_418_ERROR.md for more help" >&2
exit 1
