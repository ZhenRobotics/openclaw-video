#!/usr/bin/env bash
# Extract timestamps from audio using multi-provider ASR
set -euo pipefail

cd "$(dirname "$0")/.."

# Load provider utils
source scripts/providers/utils.sh
load_env

usage() {
  cat >&2 <<'EOF'
Usage:
  whisper-timestamps.sh <audio.mp3> [--out timestamps.json] [--lang zh] [--provider openai]

Options:
  --out <file>         Output JSON file (default: <audio>-timestamps.json)
  --lang <code>        Language code (zh, en, etc., default: zh)
  --provider <name>    Force specific provider (openai, azure, aliyun, tencent)
                       If not specified, will try providers in order from ASR_PROVIDERS

Examples:
  whisper-timestamps.sh audio/speech.mp3
  whisper-timestamps.sh audio/speech.mp3 --out custom.json --lang en
  whisper-timestamps.sh audio/speech.mp3 --provider azure

Available Providers:
  openai  - Whisper API (highest accuracy)
  azure   - Azure Speech-to-Text
  aliyun  - Aliyun ASR
  tencent - Tencent ASR
EOF
  exit 2
}

if [[ "${1:-}" == "" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

in="${1:-}"
shift || true

if [[ ! -f "$in" ]]; then
  echo "Error: Audio file not found: $in" >&2
  exit 1
fi

# Default output: replace .mp3 with -timestamps.json
out="${in%.mp3}-timestamps.json"
language="zh"
provider=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      out="${2:-}"
      shift 2
      ;;
    --lang)
      language="${2:-}"
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

echo "Transcribing with timestamps ($language)..." >&2

# If provider is specified, use it directly
if [[ -n "$provider" ]]; then
  echo "  Provider: $provider (forced)" >&2

  provider_script="scripts/providers/asr/${provider}.sh"
  if [[ ! -f "$provider_script" ]]; then
    echo "Error: Provider script not found: $provider_script" >&2
    exit 1
  fi

  if ! is_provider_configured "$provider" "asr"; then
    echo "Error: Provider '$provider' is not configured" >&2
    echo "Please check your .env file" >&2
    exit 1
  fi

  if bash "$provider_script" "$in" "$out" "$language"; then
    echo "Timestamps saved to: $out" >&2
    echo "$out"
    exit 0
  else
    echo "❌ Failed to transcribe with provider: $provider" >&2
    exit 1
  fi
fi

# Otherwise, try providers in order with automatic fallback
providers=$(get_providers "asr")
echo "  Providers: $providers (auto-fallback)" >&2

IFS=',' read -ra PROVIDER_ARRAY <<< "$providers"

for p in "${PROVIDER_ARRAY[@]}"; do
  p=$(echo "$p" | xargs)  # trim whitespace

  if ! is_provider_configured "$p" "asr"; then
    echo "⚠️  Provider '$p' not configured, skipping..." >&2
    continue
  fi

  echo "🔄 Trying provider: $p" >&2

  provider_script="scripts/providers/asr/${p}.sh"
  if [[ -f "$provider_script" ]]; then
    if bash "$provider_script" "$in" "$out" "$language"; then
      echo "Timestamps saved to: $out" >&2
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

echo "❌ All ASR providers failed" >&2
exit 1
