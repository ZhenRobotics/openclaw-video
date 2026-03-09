#!/usr/bin/env bash
# Tencent TTS Provider

set -euo pipefail

# Input: text, output_file, voice, speed
text="${1:-}"
output="${2:-}"
voice="${3:-${TENCENT_TTS_VOICE:-101001}}"
speed="${4:-1.0}"

if [[ -z "$text" || -z "$output" ]]; then
  echo "Usage: tencent.sh <text> <output_file> [voice] [speed]" >&2
  exit 1
fi

if [[ -z "${TENCENT_SECRET_ID:-}" || -z "${TENCENT_SECRET_KEY:-}" || -z "${TENCENT_APP_ID:-}" ]]; then
  echo "Error: TENCENT_SECRET_ID, TENCENT_SECRET_KEY, or TENCENT_APP_ID not set" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# TODO: 实现腾讯云 TTS API 调用
# 需要：
# 1. 计算 TC3-HMAC-SHA256 签名
# 2. 构造请求参数
# 3. 调用 TTS API (tts.tencentcloudapi.com)
# 4. 处理响应（Base64 解码音频）

echo "⚠️  Tencent TTS: Not implemented yet" >&2
echo "   Please configure OpenAI or Azure as alternative" >&2
exit 1

# 参考文档: https://cloud.tencent.com/document/product/1073/37995
