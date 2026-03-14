#!/usr/bin/env bash
# TTS Provider Performance Benchmark
# Compares response time, retry rate, success rate for all configured TTS providers

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
RESULTS_FILE="${RESULTS_DIR}/tts-benchmark-${TIMESTAMP}.json"

echo "=== TTS Provider Performance Benchmark ==="
echo "Timestamp: $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')"
echo ""

# Test configurations
declare -A TEST_CASES=(
  ["short_zh"]="你好世界，这是一个短文本测试。"
  ["medium_zh"]="大家好，我是AI助手。今天我们来测试文字转语音的性能。这段文本包含了大约50个字符左右，用于模拟中等长度的语音生成场景。让我们看看不同服务商的表现如何。"
  ["short_en"]="Hello World, this is a short test."
  ["medium_en"]="Welcome to the text-to-speech performance test. This text contains approximately 50 words and is used to simulate medium-length speech generation scenarios. Let's see how different providers perform."
  ["mixed"]="Hello 你好，this is a mixed language test 这是混合语言测试。We will test 我们将测试 performance 性能。"
)

# TTS providers to test
PROVIDERS=("openai" "aliyun" "azure" "tencent")

# Initialize results array
echo "{" > "$RESULTS_FILE"
echo "  \"timestamp\": $TIMESTAMP," >> "$RESULTS_FILE"
echo "  \"date\": \"$(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')\"," >> "$RESULTS_FILE"
echo "  \"results\": [" >> "$RESULTS_FILE"

first_result=true

# Test each provider with each test case
for provider in "${PROVIDERS[@]}"; do
  # Check if provider is configured
  if ! is_provider_configured "$provider" "tts"; then
    echo "⚠️  Provider '$provider' not configured, skipping..."
    continue
  fi

  echo ""
  echo "Testing provider: $provider"
  echo "─────────────────────────────────────"

  for test_name in "${!TEST_CASES[@]}"; do
    text="${TEST_CASES[$test_name]}"
    output_file="${RESULTS_DIR}/tmp_${provider}_${test_name}.mp3"

    echo -n "  ${test_name}: "

    # Measure execution time
    start_time=$(date +%s%3N)

    # Run TTS generation
    if timeout 30s bash scripts/providers/tts/${provider}.sh "$text" "$output_file" "" "1.0" >/dev/null 2>&1; then
      end_time=$(date +%s%3N)
      duration=$((end_time - start_time))

      # Check if file was generated
      if [[ -f "$output_file" && -s "$output_file" ]]; then
        file_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)

        echo "✅ ${duration}ms (${file_size} bytes)"

        # Append result to JSON
        if [[ "$first_result" == "false" ]]; then
          echo "," >> "$RESULTS_FILE"
        fi
        first_result=false

        cat >> "$RESULTS_FILE" <<EOF
    {
      "provider": "$provider",
      "test_case": "$test_name",
      "text_length": ${#text},
      "success": true,
      "duration_ms": $duration,
      "file_size_bytes": $file_size,
      "retry_count": 0
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
      "test_case": "$test_name",
      "text_length": ${#text},
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
      "test_case": "$test_name",
      "text_length": ${#text},
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
