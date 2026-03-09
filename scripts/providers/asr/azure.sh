#!/usr/bin/env bash
# Azure ASR Provider

set -euo pipefail

# Input: audio_file, output_json
audio="${1:-}"
output="${2:-}"
language="${3:-zh-CN}"

if [[ -z "$audio" || -z "$output" ]]; then
  echo "Usage: azure.sh <audio_file> <output_json> [language]" >&2
  exit 1
fi

if [[ ! -f "$audio" ]]; then
  echo "Error: Audio file not found: $audio" >&2
  exit 1
fi

if [[ -z "${AZURE_SPEECH_KEY:-}" || -z "${AZURE_SPEECH_REGION:-}" ]]; then
  echo "Error: AZURE_SPEECH_KEY or AZURE_SPEECH_REGION not set" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# TODO: 实现 Azure Speech-to-Text API 调用
# 需要：
# 1. 调用 Azure Speech API with detailed results
# 2. 获取 word-level timestamps
# 3. 转换为统一的 JSON 格式（兼容 Whisper 输出）

echo "⚠️  Azure ASR: Not implemented yet" >&2
echo "   Please configure OpenAI Whisper as alternative" >&2
exit 1

# 参考文档: https://learn.microsoft.com/azure/cognitive-services/speech-service/rest-speech-to-text
