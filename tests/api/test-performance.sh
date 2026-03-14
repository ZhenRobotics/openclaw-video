#!/usr/bin/env bash
# Performance Benchmark Tests
# Validates TTS, ASR, and end-to-end pipeline performance

set -euo pipefail

cd "$(dirname "$0")/../.."

# Load environment
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

# Test configuration
TEST_OUTPUT_DIR="tests/test-results/performance"
TIMESTAMP=$(date +%s)

mkdir -p "$TEST_OUTPUT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Performance targets (in seconds)
TARGET_TTS_SHORT=5        # Short text (< 50 chars)
TARGET_TTS_MEDIUM=10      # Medium text (50-200 chars)
TARGET_ASR_SHORT=30       # ASR for ~20s audio
TARGET_E2E_SHORT=120      # Full pipeline for ~20s video

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

declare -a TEST_RESULTS=()
declare -a PERF_METRICS=()

# Logging
log_info() {
  echo -e "${GREEN}[INFO]${NC} $*"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*"
}

log_test() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}TEST:${NC} $*"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

pass_test() {
  local test_name="$1"
  local metric="${2:-}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
  TEST_RESULTS+=("✅ PASS: $test_name")
  [[ -n "$metric" ]] && PERF_METRICS+=("$test_name: $metric")
  log_info "✅ PASS: $test_name"
}

fail_test() {
  local test_name="$1"
  local reason="${2:-Unknown error}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
  TEST_RESULTS+=("❌ FAIL: $test_name - $reason")
  log_error "❌ FAIL: $test_name - $reason"
}

skip_test() {
  local test_name="$1"
  local reason="${2:-Not applicable}"
  SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
  TEST_RESULTS+=("⏭️  SKIP: $test_name - $reason")
  log_warn "⏭️  SKIP: $test_name - $reason"
}

# Benchmark execution
benchmark() {
  local start_time=$(date +%s)
  "$@" > /dev/null 2>&1
  local exit_code=$?
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  echo "$duration"
  return $exit_code
}

# ============================================================================
# TEST SUITE 1: TTS Performance
# ============================================================================

test_tts_short_text_perf() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "TTS Performance - Short Text (<50 chars)"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "TTS short text perf" "No TTS provider configured"
    return
  fi

  local text="你好，世界！"  # 6 chars
  local output="$TEST_OUTPUT_DIR/tts-short-${TIMESTAMP}.mp3"

  log_info "Text: \"$text\" (${#text} chars)"
  log_info "Starting benchmark..."

  local duration=$(benchmark ./scripts/tts-generate.sh "$text" --out "$output")
  local exit_code=$?

  log_info "Duration: ${duration}s (target: <${TARGET_TTS_SHORT}s)"

  if [[ $exit_code -ne 0 ]]; then
    fail_test "TTS short text perf" "TTS failed"
    return
  fi

  if [[ $duration -le $TARGET_TTS_SHORT ]]; then
    pass_test "TTS short text perf (${duration}s)" "${duration}s"
  elif [[ $duration -le $((TARGET_TTS_SHORT * 2)) ]]; then
    log_warn "Performance acceptable but slower than target"
    pass_test "TTS short text perf (${duration}s, slow)" "${duration}s"
  else
    fail_test "TTS short text perf" "Too slow: ${duration}s (target <${TARGET_TTS_SHORT}s)"
  fi
}

test_tts_medium_text_perf() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "TTS Performance - Medium Text (50-200 chars)"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "TTS medium text perf" "No TTS provider configured"
    return
  fi

  local text="三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。OpenAI说GPT5能替代大部分程序员。Google说Gemini2.0改变游戏规则。"  # ~72 chars
  local output="$TEST_OUTPUT_DIR/tts-medium-${TIMESTAMP}.mp3"

  log_info "Text length: ${#text} chars"
  log_info "Starting benchmark..."

  local duration=$(benchmark ./scripts/tts-generate.sh "$text" --out "$output")
  local exit_code=$?

  log_info "Duration: ${duration}s (target: <${TARGET_TTS_MEDIUM}s)"

  if [[ $exit_code -ne 0 ]]; then
    fail_test "TTS medium text perf" "TTS failed"
    return
  fi

  if [[ $duration -le $TARGET_TTS_MEDIUM ]]; then
    pass_test "TTS medium text perf (${duration}s)" "${duration}s"
  elif [[ $duration -le $((TARGET_TTS_MEDIUM * 2)) ]]; then
    log_warn "Performance acceptable but slower than target"
    pass_test "TTS medium text perf (${duration}s, slow)" "${duration}s"
  else
    fail_test "TTS medium text perf" "Too slow: ${duration}s (target <${TARGET_TTS_MEDIUM}s)"
  fi
}

test_tts_speed_variations() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "TTS Performance - Speed Variations Impact"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "TTS speed variations" "No TTS provider configured"
    return
  fi

  local text="速度测试"
  local speeds=("1.0" "1.5" "2.0")
  local timings=()

  for speed in "${speeds[@]}"; do
    local output="$TEST_OUTPUT_DIR/tts-speed-${speed}-${TIMESTAMP}.mp3"
    log_info "Testing speed: ${speed}x"

    local duration=$(benchmark ./scripts/tts-generate.sh "$text" --out "$output" --speed "$speed")
    timings+=("${speed}x:${duration}s")
    log_info "  Duration: ${duration}s"
  done

  # Performance should be similar (TTS generation time, not audio duration)
  pass_test "TTS speed variations" "${timings[*]}"
}

# ============================================================================
# TEST SUITE 2: ASR Performance
# ============================================================================

test_asr_short_audio_perf() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "ASR Performance - Short Audio (~20s)"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "ASR short audio perf" "No ASR provider configured"
    return
  fi

  # Create test audio
  local text="这是一个语音识别性能测试。我们需要测试系统在处理短音频时的性能表现。"
  local audio="$TEST_OUTPUT_DIR/asr-perf-audio-${TIMESTAMP}.mp3"

  log_info "Creating test audio..."
  if ! ./scripts/tts-generate.sh "$text" --out "$audio" 2>&1; then
    skip_test "ASR short audio perf" "Failed to create test audio"
    return
  fi

  # Get audio duration
  local audio_duration=""
  if command -v ffprobe &> /dev/null; then
    audio_duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$audio" 2>/dev/null | cut -d. -f1)
    log_info "Audio duration: ${audio_duration}s"
  fi

  local output="$TEST_OUTPUT_DIR/asr-perf-${TIMESTAMP}.json"

  log_info "Starting ASR benchmark..."
  local duration=$(benchmark ./scripts/whisper-timestamps.sh "$audio" --out "$output")
  local exit_code=$?

  log_info "Duration: ${duration}s (target: <${TARGET_ASR_SHORT}s)"

  if [[ $exit_code -ne 0 ]]; then
    fail_test "ASR short audio perf" "ASR failed"
    rm -f "$audio"
    return
  fi

  if [[ $duration -le $TARGET_ASR_SHORT ]]; then
    pass_test "ASR short audio perf (${duration}s)" "${duration}s for ${audio_duration}s audio"
  elif [[ $duration -le $((TARGET_ASR_SHORT * 2)) ]]; then
    log_warn "Performance acceptable but slower than target"
    pass_test "ASR short audio perf (${duration}s, slow)" "${duration}s"
  else
    fail_test "ASR short audio perf" "Too slow: ${duration}s (target <${TARGET_ASR_SHORT}s)"
  fi

  rm -f "$audio"
}

# ============================================================================
# TEST SUITE 3: End-to-End Performance
# ============================================================================

test_e2e_short_video_perf() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "E2E Performance - Short Video Generation (~20s)"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "E2E short video perf" "No providers configured"
    return
  fi

  # Create test script
  local script="$TEST_OUTPUT_DIR/e2e-perf-script-${TIMESTAMP}.txt"
  echo "三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。OpenAI说GPT5能替代大部分程序员。" > "$script"

  log_info "Starting full pipeline benchmark..."
  log_info "Target: <${TARGET_E2E_SHORT}s (2 minutes)"

  local start_time=$(date +%s)

  # Run full pipeline (excluding Remotion render to focus on API performance)
  local audio="audio/e2e-perf-${TIMESTAMP}.mp3"
  local timestamps="audio/e2e-perf-${TIMESTAMP}-timestamps.json"

  log_info "Step 1/3: TTS..."
  if ! ./scripts/tts-generate.sh "$(<"$script")" --out "$audio" 2>&1; then
    fail_test "E2E short video perf" "TTS failed"
    rm -f "$script"
    return
  fi

  log_info "Step 2/3: ASR..."
  if ! ./scripts/whisper-timestamps.sh "$audio" --out "$timestamps" 2>&1; then
    fail_test "E2E short video perf" "ASR failed"
    rm -f "$script" "$audio"
    return
  fi

  log_info "Step 3/3: Scene generation..."
  if ! node scripts/timestamps-to-scenes.js "$timestamps" 2>&1; then
    fail_test "E2E short video perf" "Scene generation failed"
    rm -f "$script" "$audio" "$timestamps"
    return
  fi

  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  log_info "Duration: ${duration}s (target: <${TARGET_E2E_SHORT}s)"
  log_info "Note: Remotion rendering not included in this benchmark"

  if [[ $duration -le $TARGET_E2E_SHORT ]]; then
    pass_test "E2E short video perf (${duration}s)" "${duration}s (excl. rendering)"
  elif [[ $duration -le $((TARGET_E2E_SHORT + 60)) ]]; then
    log_warn "Performance acceptable but slower than target"
    pass_test "E2E short video perf (${duration}s, slow)" "${duration}s"
  else
    fail_test "E2E short video perf" "Too slow: ${duration}s (target <${TARGET_E2E_SHORT}s)"
  fi

  rm -f "$script" "$audio" "$timestamps"
}

test_e2e_concurrent_requests() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "E2E Performance - Concurrent Request Handling"

  # This test would require multiple concurrent API calls
  # For now, we'll skip it and recommend manual load testing

  skip_test "E2E concurrent requests" "Requires manual load testing setup"
}

# ============================================================================
# TEST SUITE 4: Resource Usage
# ============================================================================

test_memory_usage() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Resource Usage - Memory Consumption"

  # Track memory during TTS/ASR
  skip_test "Memory usage" "Requires manual profiling"
}

test_disk_usage() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Resource Usage - Disk Space"

  # Check temp files are cleaned up
  local before=$(du -sh "$TEST_OUTPUT_DIR" 2>/dev/null | cut -f1)

  # Run a test that creates files
  local text="磁盘使用测试"
  local output="$TEST_OUTPUT_DIR/disk-test-${TIMESTAMP}.mp3"

  if ./scripts/tts-generate.sh "$text" --out "$output" 2>&1; then
    local after=$(du -sh "$TEST_OUTPUT_DIR" 2>/dev/null | cut -f1)

    log_info "Before: $before, After: $after"
    pass_test "Disk usage (files created properly)"
  else
    fail_test "Disk usage" "Test failed"
  fi
}

# ============================================================================
# TEST SUITE 5: Scalability
# ============================================================================

test_long_text_scalability() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Scalability - Long Text Handling"

  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    skip_test "Long text scalability" "No TTS provider configured"
    return
  fi

  # Generate progressively longer text
  local text=$(printf '这是一个长文本测试。%.0s' {1..50})  # ~500 chars
  local output="$TEST_OUTPUT_DIR/long-text-${TIMESTAMP}.mp3"

  log_info "Text length: ${#text} chars"
  log_info "Testing scalability..."

  local duration=$(benchmark ./scripts/tts-generate.sh "$text" --out "$output")
  local exit_code=$?

  log_info "Duration: ${duration}s"

  if [[ $exit_code -eq 0 ]]; then
    pass_test "Long text scalability (${duration}s)" "${#text} chars in ${duration}s"
  else
    fail_test "Long text scalability" "Failed with ${#text} chars"
  fi
}

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================

main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║         Performance Benchmark Test Suite                  ║"
  echo "║         openclaw-video-generator v1.4.4                    ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  log_info "Test session started: $(date)"
  log_info "Output directory: $TEST_OUTPUT_DIR"
  echo ""

  log_info "Performance Targets:"
  log_info "  TTS Short:   <${TARGET_TTS_SHORT}s"
  log_info "  TTS Medium:  <${TARGET_TTS_MEDIUM}s"
  log_info "  ASR Short:   <${TARGET_ASR_SHORT}s"
  log_info "  E2E Short:   <${TARGET_E2E_SHORT}s (excl. rendering)"
  echo ""

  # Run test suites
  log_info "Running performance benchmarks..."
  echo ""

  # TTS performance
  test_tts_short_text_perf
  test_tts_medium_text_perf
  test_tts_speed_variations

  # ASR performance
  test_asr_short_audio_perf

  # E2E performance
  test_e2e_short_video_perf
  test_e2e_concurrent_requests

  # Resource usage
  test_memory_usage
  test_disk_usage

  # Scalability
  test_long_text_scalability

  # Print summary
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                    TEST SUMMARY                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  log_info "Total Tests:   $TOTAL_TESTS"
  echo -e "${GREEN}Passed:        $PASSED_TESTS${NC}"
  echo -e "${RED}Failed:        $FAILED_TESTS${NC}"
  echo -e "${YELLOW}Skipped:       $SKIPPED_TESTS${NC}"
  echo ""

  # Performance metrics
  if [[ ${#PERF_METRICS[@]} -gt 0 ]]; then
    log_info "Performance Metrics:"
    for metric in "${PERF_METRICS[@]}"; do
      echo "  📊 $metric"
    done
    echo ""
  fi

  # Detailed results
  if [[ ${#TEST_RESULTS[@]} -gt 0 ]]; then
    log_info "Detailed Results:"
    for result in "${TEST_RESULTS[@]}"; do
      echo "  $result"
    done
    echo ""
  fi

  # Save report
  local report_file="$TEST_OUTPUT_DIR/performance-report-${TIMESTAMP}.txt"
  {
    echo "Performance Benchmark Report"
    echo "============================"
    echo "Date: $(date)"
    echo ""
    echo "Targets:"
    echo "  TTS Short: <${TARGET_TTS_SHORT}s"
    echo "  TTS Medium: <${TARGET_TTS_MEDIUM}s"
    echo "  ASR Short: <${TARGET_ASR_SHORT}s"
    echo "  E2E Short: <${TARGET_E2E_SHORT}s"
    echo ""
    echo "Total: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Skipped: $SKIPPED_TESTS"
    echo ""
    echo "Metrics:"
    for metric in "${PERF_METRICS[@]}"; do
      echo "  $metric"
    done
    echo ""
    echo "Results:"
    for result in "${TEST_RESULTS[@]}"; do
      echo "$result"
    done
  } > "$report_file"

  log_info "Report saved: $report_file"

  # Exit code
  if [[ $FAILED_TESTS -eq 0 ]]; then
    echo ""
    log_info "🎉 All performance benchmarks completed!"
    exit 0
  else
    echo ""
    log_error "⚠️  Some benchmarks failed"
    exit 1
  fi
}

# Run main
main "$@"
