#!/usr/bin/env bash
# Azure TTS Provider

set -euo pipefail

# Input: text, output_file, voice, speed
text="${1:-}"
output="${2:-}"
voice="${3:-${AZURE_TTS_VOICE:-zh-CN-XiaoxiaoNeural}}"
speed="${4:-1.0}"

if [[ -z "$text" || -z "$output" ]]; then
  echo "Usage: azure.sh <text> <output_file> [voice] [speed]" >&2
  exit 1
fi

if [[ -z "${AZURE_SPEECH_KEY:-}" || -z "${AZURE_SPEECH_REGION:-}" ]]; then
  echo "Error: AZURE_SPEECH_KEY or AZURE_SPEECH_REGION not set" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# Convert speed to Azure rate (1.0 = +0%, 1.15 = +15%)
speed_percent=$(awk -v s="$speed" 'BEGIN {printf "%+d%%", (s - 1) * 100}')

# Construct SSML
ssml="<speak version='1.0' xml:lang='zh-CN'>
  <voice name='${voice}'>
    <prosody rate='${speed_percent}'>
      ${text}
    </prosody>
  </voice>
</speak>"

# Call Azure TTS API
max_retries=3
for i in $(seq 1 $max_retries); do
  if curl -sS "https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1" \
    -H "Ocp-Apim-Subscription-Key: ${AZURE_SPEECH_KEY}" \
    -H "Content-Type: application/ssml+xml" \
    -H "X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3" \
    -H "User-Agent: openclaw-video-generator" \
    -d "$ssml" \
    --output "$output" 2>&1; then

    if [[ -f "$output" && -s "$output" ]]; then
      echo "✅ Azure TTS: Generated $output" >&2
      exit 0
    fi
  fi

  if [[ $i -lt $max_retries ]]; then
    echo "⚠️  Azure TTS: Attempt $i failed, retrying..." >&2
    sleep 2
  fi
done

echo "❌ Azure TTS: Failed after $max_retries attempts" >&2
exit 1
