#!/usr/bin/env bash
# OpenAI ASR (Whisper) Provider

set -euo pipefail

# Input: audio_file, output_json
audio="${1:-}"
output="${2:-}"
language="${3:-zh}"

if [[ -z "$audio" || -z "$output" ]]; then
  echo "Usage: openai.sh <audio_file> <output_json> [language]" >&2
  exit 1
fi

if [[ ! -f "$audio" ]]; then
  echo "Error: Audio file not found: $audio" >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "Error: OPENAI_API_KEY not set" >&2
  exit 1
fi

api_base="${OPENAI_API_BASE:-https://api.openai.com/v1}"
model="${OPENAI_ASR_MODEL:-whisper-1}"

mkdir -p "$(dirname "$output")"

# Call OpenAI Whisper API with retry
max_retries=3
tmp_response=$(mktemp)

for i in $(seq 1 $max_retries); do
  if curl -sS "${api_base}/audio/transcriptions" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Accept: application/json" \
    -F "file=@${audio}" \
    -F "model=${model}" \
    -F "language=${language}" \
    -F "response_format=verbose_json" \
    -F "timestamp_granularities[]=segment" \
    > "$tmp_response" 2>&1; then

    if [[ -s "$tmp_response" ]]; then
      # Check if response is valid JSON
      if jq empty "$tmp_response" 2>/dev/null; then
        mv "$tmp_response" "$output"
        echo "✅ OpenAI Whisper: Transcribed $audio" >&2
        exit 0
      fi
    fi
  fi

  if [[ $i -lt $max_retries ]]; then
    echo "⚠️  OpenAI Whisper: Attempt $i failed, retrying..." >&2
    sleep 3
  fi
done

rm -f "$tmp_response"
echo "❌ OpenAI Whisper: Failed after $max_retries attempts" >&2
exit 1
