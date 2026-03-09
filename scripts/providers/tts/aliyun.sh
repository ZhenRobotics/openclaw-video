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

# TODO: 实现阿里云 TTS API 调用
# 需要：
# 1. 计算签名（使用 AccessKey）
# 2. 构造请求参数
# 3. 调用 nls-gateway API
# 4. 处理响应

echo "⚠️  Aliyun TTS: Not implemented yet" >&2
echo "   Please configure OpenAI or Azure as alternative" >&2
exit 1

# 参考文档: https://help.aliyun.com/document_detail/84435.html
