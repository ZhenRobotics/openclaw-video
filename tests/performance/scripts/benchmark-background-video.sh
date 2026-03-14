#!/usr/bin/env bash
# Background Video Loading Performance Benchmark
# Tests background video loading time with various file sizes

set -euo pipefail

cd "$(dirname "$0")/../../.."

RESULTS_DIR="tests/performance/results"
mkdir -p "$RESULTS_DIR"

TIMESTAMP=$(date +%s)
RESULTS_FILE="${RESULTS_DIR}/bg-video-benchmark-${TIMESTAMP}.json"

echo "=== Background Video Performance Benchmark ==="
echo "Timestamp: $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test video files (create test videos if needed)
TEST_VIDEOS_DIR="tests/performance/test-videos"
mkdir -p "$TEST_VIDEOS_DIR"

# Function to create test video of specific size
create_test_video() {
  local target_size_mb=$1
  local output_file=$2

  echo "Creating test video (~${target_size_mb}MB)..."

  # Create a test video using FFmpeg
  # Duration formula: approximate duration needed to reach target size
  # At 1080p 30fps, ~5MB per 10 seconds
  local duration=$(( target_size_mb * 2 ))

  if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg not found, cannot create test video"
    return 1
  fi

  # Generate color bars test video
  ffmpeg -f lavfi -i testsrc=duration=${duration}:size=1920x1080:rate=30 \
    -c:v libx264 -preset fast -crf 23 \
    "$output_file" -y >/dev/null 2>&1

  actual_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
  actual_size_mb=$((actual_size / 1024 / 1024))

  echo "  Created: $output_file (${actual_size_mb}MB)"
}

# Test configurations
declare -A TEST_VIDEOS=(
  ["small"]="10"
  ["medium"]="50"
  ["large"]="100"
)

# Create test videos if they don't exist
for name in "${!TEST_VIDEOS[@]}"; do
  target_size="${TEST_VIDEOS[$name]}"
  video_file="${TEST_VIDEOS_DIR}/test-${name}-${target_size}mb.mp4"

  if [[ ! -f "$video_file" ]]; then
    if ! create_test_video "$target_size" "$video_file"; then
      echo "⚠️  Skipping $name test (failed to create video)"
      unset TEST_VIDEOS[$name]
    fi
  fi
done

# Initialize results array
echo "{" > "$RESULTS_FILE"
echo "  \"timestamp\": $TIMESTAMP," >> "$RESULTS_FILE"
echo "  \"date\": \"$(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')\"," >> "$RESULTS_FILE"
echo "  \"timeout_config\": 60000," >> "$RESULTS_FILE"
echo "  \"results\": [" >> "$RESULTS_FILE"

first_result=true

# Test background video loading
for name in "${!TEST_VIDEOS[@]}"; do
  target_size="${TEST_VIDEOS[$name]}"
  video_file="${TEST_VIDEOS_DIR}/test-${name}-${target_size}mb.mp4"

  if [[ ! -f "$video_file" ]]; then
    continue
  fi

  echo ""
  echo "Testing: $name video (target ${target_size}MB)"
  echo "─────────────────────────────────────────"

  # Get actual file size
  file_size=$(stat -f%z "$video_file" 2>/dev/null || stat -c%s "$video_file" 2>/dev/null)
  file_size_mb=$((file_size / 1024 / 1024))

  echo "  File: $video_file"
  echo "  Size: ${file_size_mb}MB (${file_size} bytes)"

  # Create a test script for rendering with background
  test_script="tests/performance/test-bg-script.txt"
  echo "这是一个测试背景视频加载性能的短视频脚本。我们将测量视频加载时间。" > "$test_script"

  # Generate test video with background
  base_name="bg-test-${name}-${TIMESTAMP}"
  output_video="out/${base_name}.mp4"

  echo -n "  Loading & rendering... "

  # Measure execution time
  start_time=$(date +%s%3N)

  # Run full pipeline with background video
  if timeout 120s bash scripts/script-to-video.sh "$test_script" \
    --bg-video "$video_file" \
    --bg-opacity 0.7 >/dev/null 2>&1; then

    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))

    if [[ -f "$output_video" && -s "$output_video" ]]; then
      echo "✅ ${duration}ms"

      # Calculate if within timeout
      within_timeout=$([[ $duration -lt 60000 ]] && echo "true" || echo "false")

      # Append result to JSON
      if [[ "$first_result" == "false" ]]; then
        echo "," >> "$RESULTS_FILE"
      fi
      first_result=false

      cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$name",
      "target_size_mb": $target_size,
      "actual_size_bytes": $file_size,
      "actual_size_mb": $file_size_mb,
      "success": true,
      "duration_ms": $duration,
      "within_timeout": $within_timeout,
      "timeout_ms": 60000
    }
EOF

      # Clean up
      rm -f "$output_video"
    else
      echo "❌ Render failed"

      if [[ "$first_result" == "false" ]]; then
        echo "," >> "$RESULTS_FILE"
      fi
      first_result=false

      cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$name",
      "target_size_mb": $target_size,
      "actual_size_bytes": $file_size,
      "actual_size_mb": $file_size_mb,
      "success": false,
      "duration_ms": $duration,
      "error": "render_failed"
    }
EOF
    fi
  else
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    echo "❌ Timeout (${duration}ms)"

    if [[ "$first_result" == "false" ]]; then
      echo "," >> "$RESULTS_FILE"
    fi
    first_result=false

    cat >> "$RESULTS_FILE" <<EOF
    {
      "test_case": "$name",
      "target_size_mb": $target_size,
      "actual_size_bytes": $file_size,
      "actual_size_mb": $file_size_mb,
      "success": false,
      "duration_ms": $duration,
      "error": "timeout"
    }
EOF

    # Clean up
    rm -f "$output_video"
  fi

  # Clean up audio files
  rm -f "audio/${base_name}.mp3" "audio/${base_name}-timestamps.json"
done

# Close JSON
echo "" >> "$RESULTS_FILE"
echo "  ]" >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

echo ""
echo "=== Benchmark Complete ==="
echo "Results saved to: $RESULTS_FILE"
echo ""

# Quick analysis
echo "Quick Analysis:"
echo "─────────────────────────────────────────"

python3 -c "
import json
with open('$RESULTS_FILE') as f:
    data = json.load(f)

results = data['results']
successful = [r for r in results if r['success']]

if successful:
    print(f'Successful tests: {len(successful)}/{len(results)}')
    print()
    for r in successful:
        status = '✅' if r.get('within_timeout', False) else '⚠️'
        print(f'  {status} {r[\"test_case\"]}: {r[\"actual_size_mb\"]}MB in {r[\"duration_ms\"]}ms')

    # Check if 60s timeout is sufficient
    max_duration = max(r['duration_ms'] for r in successful)
    timeout = 60000

    print()
    if max_duration < timeout:
        margin = timeout - max_duration
        print(f'✅ 60s timeout is sufficient (max: {max_duration}ms, margin: {margin}ms)')
    else:
        print(f'⚠️  60s timeout may be insufficient (max: {max_duration}ms)')
        print(f'   Consider increasing to {int(max_duration * 1.2)}ms')
else:
    print('No successful tests')
" 2>/dev/null || echo "Analysis failed"

echo ""
echo "Recommendations:"
echo "  1. Use optimize-background.sh to compress large videos"
echo "  2. Keep background videos < 50MB for best performance"
echo "  3. If using 100MB+ videos, ensure timeout is adequate"
