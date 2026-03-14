#!/usr/bin/env bash
# ASR Provider Performance Benchmark
# Compares processing time, accuracy, word count for all configured ASR providers

set -euo pipefail

cd "$(dirname "$0")/../../.."

# Load environment
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

source scripts/providers/utils.sh
load_env

RESULTS_DIR="tests/performance/results"
mkdir -p "$RESULTS_DIR"

TIMESTAMP=$(date +%s)
RESULTS_FILE="${RESULTS_DIR}/asr-benchmark-${TIMESTAMP}.json"

echo "=== ASR Provider Performance Benchmark ==="
echo "Timestamp: $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test audio files (use existing test files if available)
AUDIO_DIR="tests/audio"
mkdir -p "$AUDIO_DIR"

# ASR providers to test
PROVIDERS=("openai" "aliyun" "azure" "tencent")

# Use existing audio files from tests/audio/ or generate new ones
AUDIO_FILES=(
  "aliyun-new-defaults-test.mp3"
  "test-v1.3.0-full.mp3"
  "visual-test.mp3"
)

# Initialize results array
echo "{" > "$RESULTS_FILE"
echo "  \"timestamp\": $TIMESTAMP," >> "$RESULTS_FILE"
echo "  \"date\": \"$(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')\"," >> "$RESULTS_FILE"
echo "  \"results\": [" >> "$RESULTS_FILE"

first_result=true

# Test each provider with each audio file
for provider in "${PROVIDERS[@]}"; do
  # Check if provider is configured
  if ! is_provider_configured "$provider" "asr"; then
    echo "⚠️  Provider '$provider' not configured, skipping..."
    continue
  fi

  echo ""
  echo "Testing provider: $provider"
  echo "─────────────────────────────────────"

  for audio_file in "${AUDIO_FILES[@]}"; do
    audio_path="${AUDIO_DIR}/${audio_file}"

    # Skip if audio file doesn't exist
    if [[ ! -f "$audio_path" ]]; then
      echo "  ${audio_file}: ⚠️  File not found, skipping..."
      continue
    fi

    output_file="${RESULTS_DIR}/tmp_${provider}_${audio_file%.mp3}-timestamps.json"

    echo -n "  ${audio_file}: "

    # Get audio file info
    audio_size=$(stat -f%z "$audio_path" 2>/dev/null || stat -c%s "$audio_path" 2>/dev/null)

    # Measure execution time
    start_time=$(date +%s%3N)

    # Run ASR transcription
    if timeout 60s bash scripts/providers/asr/${provider}.sh "$audio_path" "$output_file" "zh" >/dev/null 2>&1; then
      end_time=$(date +%s%3N)
      duration=$((end_time - start_time))

      # Check if file was generated
      if [[ -f "$output_file" && -s "$output_file" ]]; then
        # Count segments and words
        segment_count=$(jq 'length' "$output_file" 2>/dev/null || echo "0")
        word_count=$(jq '[.[].text] | join(" ") | split(" ") | length' "$output_file" 2>/dev/null || echo "0")

        echo "✅ ${duration}ms (${segment_count} segments, ~${word_count} words)"

        # Append result to JSON
        if [[ "$first_result" == "false" ]]; then
          echo "," >> "$RESULTS_FILE"
        fi
        first_result=false

        cat >> "$RESULTS_FILE" <<EOF
    {
      "provider": "$provider",
      "audio_file": "$audio_file",
      "audio_size_bytes": $audio_size,
      "success": true,
      "duration_ms": $duration,
      "segment_count": $segment_count,
      "word_count": $word_count
    }
EOF

        # Clean up
        rm -f "$output_file"
      else
        echo "❌ File not generated"

        if [[ "$first_result" == "false" ]]; then
          echo "," >> "$RESULTS_FILE"
        fi
        first_result=false

        cat >> "$RESULTS_FILE" <<EOF
    {
      "provider": "$provider",
      "audio_file": "$audio_file",
      "audio_size_bytes": $audio_size,
      "success": false,
      "duration_ms": 0,
      "error": "file_not_generated"
    }
EOF
      fi
    else
      end_time=$(date +%s%3N)
      duration=$((end_time - start_time))
      echo "❌ Timeout or error (${duration}ms)"

      if [[ "$first_result" == "false" ]]; then
        echo "," >> "$RESULTS_FILE"
      fi
      first_result=false

      cat >> "$RESULTS_FILE" <<EOF
    {
      "provider": "$provider",
      "audio_file": "$audio_file",
      "audio_size_bytes": $audio_size,
      "success": false,
      "duration_ms": $duration,
      "error": "timeout_or_failure"
    }
EOF

      # Clean up
      rm -f "$output_file"
    fi
  done
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
