#!/usr/bin/env bash
# OpenAI TTS Provider

set -euo pipefail

# Input: text, output_file, voice, speed
text="${1:-}"
output="${2:-}"
voice="${3:-${OPENAI_TTS_VOICE:-nova}}"
speed="${4:-1.0}"

if [[ -z "$text" || -z "$output" ]]; then
  echo "Usage: openai.sh <text> <output_file> [voice] [speed]" >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "Error: OPENAI_API_KEY not set" >&2
  exit 1
fi

api_base="${OPENAI_API_BASE:-https://api.openai.com/v1}"
model="${OPENAI_TTS_MODEL:-tts-1}"

mkdir -p "$(dirname "$output")"

# Construct JSON payload
json_payload=$(jq -n \
  --arg model "$model" \
  --arg input "$text" \
  --arg voice "$voice" \
  --argjson speed "$speed" \
  '{model: $model, input: $input, voice: $voice, speed: $speed}')

# Call OpenAI TTS API with retry
max_retries=3
for i in $(seq 1 $max_retries); do
  if curl -sS "${api_base}/audio/speech" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$json_payload" \
    --output "$output" 2>&1; then

    if [[ -f "$output" && -s "$output" ]]; then
      echo "✅ OpenAI TTS: Generated $output" >&2
      exit 0
    fi
  fi

  if [[ $i -lt $max_retries ]]; then
    echo "⚠️  OpenAI TTS: Attempt $i failed, retrying..." >&2
    sleep 2
  fi
done

echo "❌ OpenAI TTS: Failed after $max_retries attempts" >&2
exit 1
