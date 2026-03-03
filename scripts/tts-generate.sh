#!/usr/bin/env bash
# Generate speech from text using OpenAI TTS
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage:
  tts-generate.sh <text> [--out audio.mp3] [--voice nova] [--speed 1.0]

Example:
  tts-generate.sh "你好，世界" --out hello.mp3
  tts-generate.sh "这是测试文本" --voice alloy --speed 1.15

Available voices:
  - alloy (neutral)
  - echo (male)
  - fable (British male)
  - onyx (deep male)
  - nova (female, energetic) [default]
  - shimmer (soft female)

Speed range: 0.25 - 4.0 (default: 1.0)
EOF
  exit 2
}

if [[ "${1:-}" == "" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

text="${1:-}"
shift || true

out="audio/output.mp3"
voice="nova"
speed="1.0"

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
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

if [[ "${OPENAI_API_KEY:-}" == "" ]]; then
  echo "Missing OPENAI_API_KEY" >&2
  exit 1
fi

mkdir -p "$(dirname "$out")"

echo "Generating speech..." >&2
echo "  Text: $text" >&2
echo "  Voice: $voice" >&2
echo "  Speed: $speed" >&2

curl -sS https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"tts-1\",
    \"input\": \"$text\",
    \"voice\": \"$voice\",
    \"speed\": $speed
  }" \
  --output "$out"

if [[ -f "$out" ]]; then
  size=$(du -h "$out" | cut -f1)
  echo "✅ Speech generated: $out ($size)" >&2
  echo "$out"
else
  echo "❌ Failed to generate speech" >&2
  exit 1
fi
