#!/usr/bin/env bash
# Complete pipeline: Script text → TTS → Whisper timestamps → Remotion scenes
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
  cat >&2 <<'EOF'
Usage:
  script-to-video.sh <script.txt> [--voice nova] [--speed 1.15]

Example:
  script-to-video.sh scripts/example-script.txt
  script-to-video.sh scripts/example-script.txt --voice alloy --speed 1.2

Pipeline:
  1. Read script text
  2. Generate TTS audio (OpenAI TTS)
  3. Extract timestamps (OpenAI Whisper)
  4. Convert to Remotion scenes
  5. Update src/scenes-data.ts
  6. Render video with Remotion

Output:
  - audio/<name>.mp3 (TTS audio)
  - audio/<name>-timestamps.json (Whisper timestamps)
  - src/scenes-data.ts (updated scenes)
  - out/<name>.mp4 (rendered video)
EOF
  exit 2
}

if [[ "${1:-}" == "" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

script_file="${1:-}"
shift || true

voice="nova"
speed="1.15"

while [[ $# -gt 0 ]]; do
  case "$1" in
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

if [[ ! -f "$script_file" ]]; then
  echo "Script file not found: $script_file" >&2
  exit 1
fi

# Extract base name
base_name=$(basename "$script_file" .txt)
audio_file="audio/${base_name}.mp3"
timestamps_file="audio/${base_name}-timestamps.json"
output_video="out/${base_name}.mp4"

echo "=== Video Generation Pipeline ==="
echo ""
echo "📝 Script: $script_file"
echo "🎤 Voice: $voice (speed: ${speed}x)"
echo ""

# Step 1: Read script text
echo "Step 1/5: Reading script..."
script_text=$(<"$script_file")
echo "✅ Script text loaded (${#script_text} characters)"
echo ""

# Step 2: Generate TTS audio
echo "Step 2/5: Generating TTS audio..."
./scripts/tts-generate.sh "$script_text" \
  --out "$audio_file" \
  --voice "$voice" \
  --speed "$speed"
echo ""

# Step 3: Extract timestamps with Whisper
echo "Step 3/5: Extracting timestamps with Whisper..."
./scripts/whisper-timestamps.sh "$audio_file" --out "$timestamps_file"
echo ""

# Step 4: Convert to Remotion scenes
echo "Step 4/5: Converting to Remotion scenes..."
node scripts/timestamps-to-scenes.js "$timestamps_file"
echo ""

# Step 5: Render video
echo "Step 5/5: Rendering video with Remotion..."
pnpm exec remotion render Main "$output_video" \
  --props "{\"audioPath\": \"${PWD}/${audio_file}\"}"

echo ""
echo "=== ✅ Video Generation Complete ==="
echo ""
echo "📄 Timestamps: $timestamps_file"
echo "🎬 Scenes: src/scenes-data.ts"
echo "🎥 Video: $output_video"
echo ""
echo "Preview video:"
echo "  mpv $output_video"
