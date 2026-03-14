#!/usr/bin/env bash
# End-to-End Pipeline Performance Benchmark
# Measures complete video generation pipeline performance

set -euo pipefail

cd "$(dirname "$0")/../../.."

# Load environment
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

RESULTS_DIR="tests/performance/results"
mkdir -p "$RESULTS_DIR"

TIMESTAMP=$(date +%s)
RESULTS_FILE="${RESULTS_DIR}/e2e-benchmark-${TIMESTAMP}.json"

echo "=== End-to-End Pipeline Performance Benchmark ==="
echo "Timestamp: $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test scripts with different lengths
TEST_SCRIPTS_DIR="tests/performance/scripts"
mkdir -p "$TEST_SCRIPTS_DIR"

# Create test scripts if they don't exist
if [[ ! -f "${TEST_SCRIPTS_DIR}/test-10s.txt" ]]; then
  echo "大家好，我是AI助手。今天我们来测试视频生成的性能。这是一个10秒左右的短视频测试。" > "${TEST_SCRIPTS_DIR}/test-10s.txt"
fi

if [[ ! -f "${TEST_SCRIPTS_DIR}/test-20s.txt" ]]; then
  echo "大家好，我是AI助手。今天我们来测试视频生成的性能。这段文本大约会生成20秒的视频，用于模拟中等长度的视频生成场景。我们将测量从文本到最终视频的完整流程时间，包括语音合成、时间戳提取和视频渲染等步骤。让我们看看整个流程的表现如何。" > "${TEST_SCRIPTS_DIR}/test-20s.txt"
fi

if [[ ! -f "${TEST_SCRIPTS_DIR}/test-30s.txt" ]]; then
  echo "大家好，我是AI助手。今天我们来测试视频生成的性能。这段文本大约会生成30秒的视频，用于模拟较长视频的生成场景。我们将详细测量整个流程的各个阶段，包括TTS语音合成阶段、ASR时间戳提取阶段、场景数据生成阶段，以及最终的Remotion视频渲染阶段。通过分析每个阶段的耗时，我们可以找出性能瓶颈，并针对性地进行优化。这个测试将帮助我们更好地了解系统的性能特征和优化方向。" > "${TEST_SCRIPTS_DIR}/test-30s.txt"
fi

# Test configurations
declare -A TEST_CASES=(
  ["10s"]="test-10s.txt"
  ["20s"]="test-20s.txt"
  ["30s"]="test-30s.txt"
)

# Initialize results array
echo "{" > "$RESULTS_FILE"
echo "  \"timestamp\": $TIMESTAMP," >> "$RESULTS_FILE"
echo "  \"date\": \"$(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')\"," >> "$RESULTS_FILE"
echo "  \"remotion_config\": {" >> "$RESULTS_FILE"
echo "    \"concurrency\": 6," >> "$RESULTS_FILE"
echo "    \"timeout_ms\": 60000" >> "$RESULTS_FILE"
echo "  }," >> "$RESULTS_FILE"
echo "  \"results\": [" >> "$RESULTS_FILE"

first_result=true

# Test each configuration
for test_name in "${!TEST_CASES[@]}"; do
  script_file="${TEST_SCRIPTS_DIR}/${TEST_CASES[$test_name]}"

  if [[ ! -f "$script_file" ]]; then
    echo "⚠️  Script file not found: $script_file, skipping..."
    continue
  fi

  echo ""
  echo "Testing: ${test_name} video (${script_file})"
  echo "─────────────────────────────────────"

  # Read script
  script_text=$(<"$script_file")
  text_length=${#script_text}

  # Setup output files
  base_name="perf-test-${test_name}-${TIMESTAMP}"
  audio_file="audio/${base_name}.mp3"
  timestamps_file="audio/${base_name}-timestamps.json"
  output_video="out/${base_name}.mp4"

  # Clean up previous files
  rm -f "$audio_file" "$timestamps_file" "$output_video"

  echo "  Script length: ${text_length} characters"

  # Stage 1: TTS Generation
  echo -n "  Stage 1/5: TTS generation... "
  tts_start=$(date +%s%3N)

  if timeout 30s ./scripts/tts-generate.sh "$script_text" \
    --out "$audio_file" \
    --voice "nova" \
    --speed "1.15" >/dev/null 2>&1; then

    tts_end=$(date +%s%3N)
    tts_duration=$((tts_end - tts_start))
    echo "✅ ${tts_duration}ms"
  else
    tts_end=$(date +%s%3N)
    tts_duration=$((tts_end - tts_start))
    echo "❌ Failed (${tts_duration}ms)"

    if [[ "$first_result" == "false" ]]; then
      echo "," >> "$RESULTS_FILE"
    fi
    first_result=false

    cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$test_name",
      "text_length": $text_length,
      "success": false,
      "stage_failed": "tts",
      "tts_duration_ms": $tts_duration
    }
EOF
    continue
  fi

  # Stage 2: ASR Timestamps
  echo -n "  Stage 2/5: ASR timestamps... "
  asr_start=$(date +%s%3N)

  if timeout 60s ./scripts/whisper-timestamps.sh "$audio_file" \
    --out "$timestamps_file" >/dev/null 2>&1; then

    asr_end=$(date +%s%3N)
    asr_duration=$((asr_end - asr_start))
    echo "✅ ${asr_duration}ms"
  else
    asr_end=$(date +%s%3N)
    asr_duration=$((asr_end - asr_start))
    echo "❌ Failed (${asr_duration}ms)"

    if [[ "$first_result" == "false" ]]; then
      echo "," >> "$RESULTS_FILE"
    fi
    first_result=false

    cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$test_name",
      "text_length": $text_length,
      "success": false,
      "stage_failed": "asr",
      "tts_duration_ms": $tts_duration,
      "asr_duration_ms": $asr_duration
    }
EOF
    continue
  fi

  # Stage 3: Scene Generation
  echo -n "  Stage 3/5: Scene generation... "
  scene_start=$(date +%s%3N)

  if node scripts/timestamps-to-scenes.js "$timestamps_file" >/dev/null 2>&1; then
    scene_end=$(date +%s%3N)
    scene_duration=$((scene_end - scene_start))
    echo "✅ ${scene_duration}ms"
  else
    scene_end=$(date +%s%3N)
    scene_duration=$((scene_end - scene_start))
    echo "❌ Failed (${scene_duration}ms)"

    if [[ "$first_result" == "false" ]]; then
      echo "," >> "$RESULTS_FILE"
    fi
    first_result=false

    cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$test_name",
      "text_length": $text_length,
      "success": false,
      "stage_failed": "scene_generation",
      "tts_duration_ms": $tts_duration,
      "asr_duration_ms": $asr_duration,
      "scene_duration_ms": $scene_duration
    }
EOF
    continue
  fi

  # Stage 4: Remotion Rendering
  echo -n "  Stage 4/5: Remotion rendering... "
  render_start=$(date +%s%3N)

  audio_filename=$(basename "$audio_file")
  props_json="{\"audioPath\": \"${audio_filename}\"}"

  if timeout 180s pnpm exec remotion render Main "$output_video" \
    --props "$props_json" >/dev/null 2>&1; then

    render_end=$(date +%s%3N)
    render_duration=$((render_end - render_start))
    echo "✅ ${render_duration}ms"
  else
    render_end=$(date +%s%3N)
    render_duration=$((render_end - render_start))
    echo "❌ Failed (${render_duration}ms)"

    if [[ "$first_result" == "false" ]]; then
      echo "," >> "$RESULTS_FILE"
    fi
    first_result=false

    cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$test_name",
      "text_length": $text_length,
      "success": false,
      "stage_failed": "rendering",
      "tts_duration_ms": $tts_duration,
      "asr_duration_ms": $asr_duration,
      "scene_duration_ms": $scene_duration,
      "render_duration_ms": $render_duration
    }
EOF
    continue
  fi

  # Calculate total duration
  total_duration=$((tts_duration + asr_duration + scene_duration + render_duration))

  # Get file sizes
  audio_size=$(stat -f%z "$audio_file" 2>/dev/null || stat -c%s "$audio_file" 2>/dev/null)
  video_size=$(stat -f%z "$output_video" 2>/dev/null || stat -c%s "$output_video" 2>/dev/null)

  # Get video duration
  if command -v ffprobe &> /dev/null; then
    video_duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$output_video" 2>/dev/null || echo "0")
    video_duration_ms=$(printf "%.0f" $(echo "$video_duration * 1000" | bc -l))
  else
    video_duration_ms=0
  fi

  echo "  Stage 5/5: Verification"
  echo "    Total time: ${total_duration}ms"
  echo "    Video size: ${video_size} bytes"
  echo "    Video duration: ${video_duration_ms}ms"

  # Append result to JSON
  if [[ "$first_result" == "false" ]]; then
    echo "," >> "$RESULTS_FILE"
  fi
  first_result=false

  cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$test_name",
      "text_length": $text_length,
      "success": true,
      "tts_duration_ms": $tts_duration,
      "asr_duration_ms": $asr_duration,
      "scene_duration_ms": $scene_duration,
      "render_duration_ms": $render_duration,
      "total_duration_ms": $total_duration,
      "audio_size_bytes": $audio_size,
      "video_size_bytes": $video_size,
      "video_duration_ms": $video_duration_ms
    }
EOF

  # Clean up
  echo "    Cleaning up temporary files..."
  rm -f "$audio_file" "$timestamps_file"
done

# Close JSON
echo "" >> "$RESULTS_FILE"
echo "  ]" >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

echo ""
echo "=== Benchmark Complete ==="
echo "Results saved to: $RESULTS_FILE"
echo ""
echo "Next steps:"
echo "  1. Analyze results: python3 tests/performance/scripts/analyze-performance.py $RESULTS_FILE"
echo "  2. Generate report: python3 tests/performance/scripts/generate-report.py $RESULTS_FILE"
