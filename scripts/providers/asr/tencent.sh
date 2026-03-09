#!/usr/bin/env bash
# Tencent ASR Provider

set -euo pipefail

# Input: audio_file, output_json
audio="${1:-}"
output="${2:-}"
language="${3:-zh}"

if [[ -z "$audio" || -z "$output" ]]; then
  echo "Usage: tencent.sh <audio_file> <output_json> [language]" >&2
  exit 1
fi

if [[ ! -f "$audio" ]]; then
  echo "Error: Audio file not found: $audio" >&2
  exit 1
fi

if [[ -z "${TENCENT_SECRET_ID:-}" || -z "${TENCENT_SECRET_KEY:-}" ]]; then
  echo "Error: TENCENT_SECRET_ID or TENCENT_SECRET_KEY not set" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# TODO: 实现腾讯云语音识别 API 调用
# 需要：
# 1. 使用实时语音识别 API
# 2. 获取详细的时间戳信息
# 3. 转换为统一的 JSON 格式

echo "⚠️  Tencent ASR: Not implemented yet" >&2
echo "   Please configure OpenAI Whisper as alternative" >&2
exit 1

# 参考文档: https://cloud.tencent.com/document/product/1093/37823
