#!/usr/bin/env bash
# Extract timestamps from audio using OpenAI Whisper API
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage:
  whisper-timestamps.sh <audio-file> [--out /path/to/timestamps.json]

Example:
  whisper-timestamps.sh audio.mp3
  whisper-timestamps.sh audio.mp3 --out timestamps.json

Output format:
  [
    {"start": 0.0, "end": 3.46, "text": "三家巨头同一天说了一件事"},
    {"start": 3.46, "end": 5.90, "text": "微软说Copilot已经能写掉90%的代码"},
    ...
  ]
EOF
  exit 2
}

if [[ "${1:-}" == "" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

in="${1:-}"
shift || true

out=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      out="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

if [[ ! -f "$in" ]]; then
  echo "File not found: $in" >&2
  exit 1
fi

if [[ "${OPENAI_API_KEY:-}" == "" ]]; then
  echo "Missing OPENAI_API_KEY" >&2
  exit 1
fi

if [[ "$out" == "" ]]; then
  base="${in%.*}"
  out="${base}-timestamps.json"
fi

mkdir -p "$(dirname "$out")"

# Call OpenAI Whisper API with verbose_json format to get timestamps
echo "Transcribing with timestamps..." >&2
curl -sS https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Accept: application/json" \
  -F "file=@${in}" \
  -F "model=whisper-1" \
  -F "response_format=verbose_json" \
  -F "timestamp_granularities[]=segment" \
  | jq '[.segments[] | {start: .start, end: .end, text: .text}]' \
  > "$out"

echo "Timestamps saved to: $out" >&2
echo "$out"
