#!/usr/bin/env bash
# Generate speech from text using multi-provider support
set -euo pipefail

cd "$(dirname "$0")/.."

# Load provider utils
source scripts/providers/utils.sh
load_env

usage() {
  cat >&2 <<'EOF'
Usage:
  tts-generate.sh <text> [--out audio.mp3] [--voice nova] [--speed 1.0] [--provider openai]

Options:
  --out <file>         Output file path (default: audio/output.mp3)
  --voice <name>       Voice name (provider-specific)
  --speed <number>     Speech speed (0.25-4.0, default: 1.0)
  --provider <name>    Force specific provider (openai, azure, aliyun, tencent)
                       If not specified, will try providers in order from TTS_PROVIDERS

Examples:
  tts-generate.sh "你好，世界" --out hello.mp3
  tts-generate.sh "测试文本" --voice alloy --speed 1.15
  tts-generate.sh "强制使用阿里云" --provider aliyun

Available Providers:
  openai  - Voices: alloy, echo, fable, onyx, nova, shimmer
  azure   - Voices: zh-CN-XiaoxiaoNeural, zh-CN-YunxiNeural, etc.
  aliyun  - Voices: Aibao, Xiaoyun, Zhiqi, Aixia, etc.
  tencent - Voices: 101001, 101002, 101003, etc.
EOF
  exit 2
}

if [[ "${1:-}" == "" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

text="${1:-}"
shift || true

out="audio/output.mp3"
voice=""
speed="1.0"
provider=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      out="${2:-}"
      shift 2
      ;;
    --voice)
      voice="${2:-}"
      shift 2
      ;;
    --speed)
      speed="${2:-}"
      shift 2
      ;;
    --provider)
      provider="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

mkdir -p "$(dirname "$out")"

echo "Generating speech..." >&2
echo "  Text: $text" >&2
echo "  Output: $out" >&2
echo "  Speed: ${speed}x" >&2

# If provider is specified, use it directly
if [[ -n "$provider" ]]; then
  echo "  Provider: $provider (forced)" >&2

  provider_script="scripts/providers/tts/${provider}.sh"
  if [[ ! -f "$provider_script" ]]; then
    echo "Error: Provider script not found: $provider_script" >&2
    exit 1
  fi

  if ! is_provider_configured "$provider" "tts"; then
    echo "Error: Provider '$provider' is not configured" >&2
    echo "Please check your .env file" >&2
    exit 1
  fi

  if bash "$provider_script" "$text" "$out" "$voice" "$speed"; then
    size=$(du -h "$out" | cut -f1)
    echo "✅ Speech generated: $out ($size)" >&2
    echo "$out"
    exit 0
  else
    echo "❌ Failed to generate speech with provider: $provider" >&2
    exit 1
  fi
fi

# Otherwise, try providers in order with automatic fallback
providers=$(get_providers "tts")
echo "  Providers: $providers (auto-fallback)" >&2

IFS=',' read -ra PROVIDER_ARRAY <<< "$providers"

for p in "${PROVIDER_ARRAY[@]}"; do
  p=$(echo "$p" | xargs)  # trim whitespace

  if ! is_provider_configured "$p" "tts"; then
    echo "⚠️  Provider '$p' not configured, skipping..." >&2
    continue
  fi

  echo "🔄 Trying provider: $p" >&2

  provider_script="scripts/providers/tts/${p}.sh"
  if [[ -f "$provider_script" ]]; then
    if bash "$provider_script" "$text" "$out" "$voice" "$speed"; then
      size=$(du -h "$out" | cut -f1)
      echo "✅ Speech generated: $out ($size)" >&2
      echo "✅ Used provider: $p" >&2
      echo "$out"
      exit 0
    else
      echo "❌ Provider '$p' failed, trying next..." >&2
    fi
  else
    echo "⚠️  Provider script not found: $provider_script" >&2
  fi
done

echo "❌ All TTS providers failed" >&2
exit 1
