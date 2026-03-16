#!/usr/bin/env bash
# Complete pipeline: Script text → TTS → Whisper timestamps → Remotion scenes
set -euo pipefail

cd "$(dirname "$0")/.."

# Load environment variables from .env
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

usage() {
  cat >&2 <<'EOF'
Usage:
  script-to-video.sh <script.txt> [options]

Options:
  --voice <name>           TTS voice (alloy/echo/nova/shimmer, default: nova)
  --speed <number>         TTS speed (0.25-4.0, default: 1.15)
  --bg-video <file>        Background video file path
  --bg-opacity <number>    Background video opacity (0-1, default: 0.7)
  --bg-overlay <color>     Background overlay color (default: rgba(10, 10, 15, 0.25))

Examples:
  script-to-video.sh scripts/example-script.txt
  script-to-video.sh scripts/example-script.txt --voice alloy --speed 1.2
  script-to-video.sh scripts/example-script.txt --bg-video /path/to/bg.mp4 --bg-opacity 0.5

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
bg_video=""
bg_opacity="0.7"
bg_overlay="rgba(10, 10, 15, 0.25)"

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
    --bg-video)
      bg_video="${2:-}"
      shift 2
      ;;
    --bg-opacity)
      bg_opacity="${2:-}"
      shift 2
      ;;
    --bg-overlay)
      bg_overlay="${2:-}"
      shift 2
      ;;
    *)
      echo "❌ Unknown argument: $1" >&2
      echo "" >&2
      echo "Valid options are:" >&2
      echo "  --voice <name>        TTS voice name" >&2
      echo "  --speed <number>      TTS speed (0.25-4.0)" >&2
      echo "  --bg-video <file>     Background video" >&2
      echo "  --bg-opacity <number> Background opacity (0-1)" >&2
      echo "  --bg-overlay <color>  Background overlay color" >&2
      echo "" >&2
      echo "Run with --help for full documentation" >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$script_file" ]]; then
  echo "❌ Script file not found: $script_file" >&2
  echo "" >&2
  echo "💡 Tip: This command requires a FILE PATH, not text content" >&2
  echo "" >&2
  echo "Examples:" >&2
  echo "  ✅ ./scripts/script-to-video.sh scripts/my-script.txt" >&2
  echo "  ❌ ./scripts/script-to-video.sh 'Hello World'" >&2
  echo "" >&2
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
if [[ -n "$bg_video" ]]; then
  echo "🎬 Background: $bg_video (opacity: $bg_opacity)"
fi
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
bg_video_args=""
if [[ -n "$bg_video" ]]; then
  bg_video_args="--bg-video \"$bg_video\" --bg-opacity $bg_opacity --bg-overlay \"$bg_overlay\""
fi
eval "node scripts/timestamps-to-scenes.js \"$timestamps_file\" $bg_video_args"
echo ""

# Step 5: Render video
echo "Step 5/5: Rendering video with Remotion..."
# Pass only the filename (audio is already copied to public/)
audio_filename=$(basename "$audio_file")

# Clean audio_filename from potential OpenClaw executor pollution
# Remove patterns like ",timeout:1200}" that may be appended
audio_filename_clean=$(echo "$audio_filename" | sed -E 's/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$//')

# Build props JSON (ensuring clean parameters)
props_json="{\"audioPath\": \"${audio_filename_clean}\"}"

# Double-check for trailing commas or invalid JSON
props_json=$(echo "$props_json" | sed -E 's/,\s*}$/}/')

echo "[Debug] Remotion props: $props_json" >&2

pnpm exec remotion render Main "$output_video" \
  --props "$props_json" \
  --concurrency=1

echo ""
echo "=== ✅ Video Generation Complete ==="
echo ""
echo "📄 Timestamps: $timestamps_file"
echo "🎬 Scenes: src/scenes-data.ts"
echo "🎥 Video: $output_video"
echo ""
echo "Preview video:"
echo "  mpv $output_video"
