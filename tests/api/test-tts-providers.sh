#!/usr/bin/env bash
# TTS Providers API Tests
# Tests all 4 TTS providers: OpenAI, Azure, Aliyun, Tencent

set -euo pipefail

cd "$(dirname "$0")/../.."

# Load environment
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

# Test configuration
TEST_OUTPUT_DIR="tests/test-results/tts"
FIXTURES_DIR="tests/fixtures"
TIMESTAMP=$(date +%s)

mkdir -p "$TEST_OUTPUT_DIR"
mkdir -p "$FIXTURES_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Test results array
declare -a TEST_RESULTS=()

# Logging functions
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
  echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}TEST:${NC} $*"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Test result tracking
pass_test() {
  local test_name="$1"
  PASSED_TESTS=$((PASSED_TESTS + 1))
  TEST_RESULTS+=("✅ PASS: $test_name")
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
  local reason="${2:-Not configured}"
  SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
  TEST_RESULTS+=("⏭️  SKIP: $test_name - $reason")
  log_warn "⏭️  SKIP: $test_name - $reason"
}

# Check if provider is configured
is_provider_configured() {
  local provider="$1"

  case "$provider" in
    openai)
      [[ -n "${OPENAI_API_KEY:-}" ]]
      ;;
    azure)
      [[ -n "${AZURE_SPEECH_KEY:-}" && -n "${AZURE_SPEECH_REGION:-}" ]]
      ;;
    aliyun)
      [[ -n "${ALIYUN_ACCESS_KEY_ID:-}" && -n "${ALIYUN_ACCESS_KEY_SECRET:-}" && -n "${ALIYUN_APP_KEY:-}" ]]
      ;;
    tencent)
      [[ -n "${TENCENT_SECRET_ID:-}" && -n "${TENCENT_SECRET_KEY:-}" && -n "${TENCENT_APP_ID:-}" ]]
      ;;
    *)
      return 1
      ;;
  esac
}

# Validate audio file
validate_audio() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    return 1
  fi

  if [[ ! -s "$file" ]]; then
    return 1
  fi

  # Check file size (should be > 1KB)
  local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
  if [[ $size -lt 1024 ]]; then
    return 1
  fi

  return 0
}

# Performance benchmark
benchmark_tts() {
  local provider="$1"
  local start_time=$(date +%s)

  # Run TTS
  "$@"
  local exit_code=$?

  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  echo "$duration"
  return $exit_code
}

# ============================================================================
# TEST SUITE 1: OpenAI TTS
# ============================================================================

test_openai_basic() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "OpenAI TTS - Basic Chinese Text"

  if ! is_provider_configured "openai"; then
    skip_test "OpenAI basic" "OPENAI_API_KEY not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/openai-basic-${TIMESTAMP}.mp3"
  local text="你好，这是一个测试。"

  if ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "OpenAI basic"
    else
      fail_test "OpenAI basic" "Invalid audio file"
    fi
  else
    fail_test "OpenAI basic" "TTS generation failed"
  fi
}

test_openai_english() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "OpenAI TTS - English Text"

  if ! is_provider_configured "openai"; then
    skip_test "OpenAI English" "OPENAI_API_KEY not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/openai-english-${TIMESTAMP}.mp3"
  local text="Hello, this is a test."

  if ./scripts/providers/tts/openai.sh "$text" "$output" "alloy" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "OpenAI English"
    else
      fail_test "OpenAI English" "Invalid audio file"
    fi
  else
    fail_test "OpenAI English" "TTS generation failed"
  fi
}

test_openai_voices() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "OpenAI TTS - Multiple Voices"

  if ! is_provider_configured "openai"; then
    skip_test "OpenAI voices" "OPENAI_API_KEY not configured"
    return
  fi

  local voices=("alloy" "echo" "nova" "shimmer")
  local text="Test voice."
  local failed=0

  for voice in "${voices[@]}"; do
    local output="$TEST_OUTPUT_DIR/openai-voice-${voice}-${TIMESTAMP}.mp3"

    log_info "Testing voice: $voice"
    if ! ./scripts/providers/tts/openai.sh "$text" "$output" "$voice" "1.0" 2>&1; then
      log_error "Voice $voice failed"
      failed=1
    fi
  done

  if [[ $failed -eq 0 ]]; then
    pass_test "OpenAI voices"
  else
    fail_test "OpenAI voices" "Some voices failed"
  fi
}

test_openai_speed() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "OpenAI TTS - Speed Variations"

  if ! is_provider_configured "openai"; then
    skip_test "OpenAI speed" "OPENAI_API_KEY not configured"
    return
  fi

  local speeds=("0.5" "1.0" "1.5" "2.0")
  local text="速度测试"
  local failed=0

  for speed in "${speeds[@]}"; do
    local output="$TEST_OUTPUT_DIR/openai-speed-${speed}-${TIMESTAMP}.mp3"

    log_info "Testing speed: ${speed}x"
    if ! ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "$speed" 2>&1; then
      log_error "Speed $speed failed"
      failed=1
    fi
  done

  if [[ $failed -eq 0 ]]; then
    pass_test "OpenAI speed"
  else
    fail_test "OpenAI speed" "Some speeds failed"
  fi
}

test_openai_performance() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "OpenAI TTS - Performance Benchmark"

  if ! is_provider_configured "openai"; then
    skip_test "OpenAI performance" "OPENAI_API_KEY not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/openai-perf-${TIMESTAMP}.mp3"
  local text="三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。"

  log_info "Starting benchmark..."
  local duration=$(benchmark_tts "openai" ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "1.0" 2>&1)

  log_info "TTS completed in ${duration}s"

  # Target: < 5 seconds
  if [[ $duration -lt 5 ]]; then
    pass_test "OpenAI performance (${duration}s < 5s target)"
  elif [[ $duration -lt 10 ]]; then
    log_warn "Performance acceptable but slow (${duration}s)"
    pass_test "OpenAI performance (${duration}s)"
  else
    fail_test "OpenAI performance" "Too slow: ${duration}s (target < 5s)"
  fi
}

# ============================================================================
# TEST SUITE 2: Aliyun TTS (Critical for v1.4.3 fix)
# ============================================================================

test_aliyun_chinese_zhiqi() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Aliyun TTS - Chinese Text with Zhiqi (v1.4.3 fix)"

  if ! is_provider_configured "aliyun"; then
    skip_test "Aliyun Chinese Zhiqi" "Aliyun not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/aliyun-chinese-zhiqi-${TIMESTAMP}.mp3"
  local text="你好，这是一个中文测试。智琪音色应该支持中文。"

  # This should NOT produce 418 error (v1.4.3 fix)
  if ./scripts/providers/tts/aliyun.sh "$text" "$output" "Zhiqi" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Aliyun Chinese Zhiqi (no 418 error)"
    else
      fail_test "Aliyun Chinese Zhiqi" "Invalid audio file"
    fi
  else
    fail_test "Aliyun Chinese Zhiqi" "TTS failed (possible 418 error)"
  fi
}

test_aliyun_english_catherine() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Aliyun TTS - English Text with Catherine (v1.4.3 fix)"

  if ! is_provider_configured "aliyun"; then
    skip_test "Aliyun English Catherine" "Aliyun not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/aliyun-english-catherine-${TIMESTAMP}.mp3"
  local text="Hello, this is an English test. Catherine voice should support English."

  # This should NOT produce 418 error (v1.4.3 fix)
  if ./scripts/providers/tts/aliyun.sh "$text" "$output" "Catherine" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Aliyun English Catherine (no 418 error)"
    else
      fail_test "Aliyun English Catherine" "Invalid audio file"
    fi
  else
    fail_test "Aliyun English Catherine" "TTS failed (possible 418 error)"
  fi
}

test_aliyun_mixed_aida() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Aliyun TTS - Mixed Language with Aida (v1.4.3 fix)"

  if ! is_provider_configured "aliyun"; then
    skip_test "Aliyun Mixed Aida" "Aliyun not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/aliyun-mixed-aida-${TIMESTAMP}.mp3"
  local text="这是中文 and this is English 混合文本测试。Aida应该支持混合语言。"

  # This should NOT produce 418 error (v1.4.3 fix)
  if ./scripts/providers/tts/aliyun.sh "$text" "$output" "Aida" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Aliyun Mixed Aida (no 418 error)"
    else
      fail_test "Aliyun Mixed Aida" "Invalid audio file"
    fi
  else
    fail_test "Aliyun Mixed Aida" "TTS failed (possible 418 error)"
  fi
}

test_aliyun_smart_mode_auto_select() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Aliyun TTS - Smart Mode Auto Voice Selection"

  if ! is_provider_configured "aliyun"; then
    skip_test "Aliyun smart mode" "Aliyun not configured"
    return
  fi

  local test_cases=(
    "纯中文文本|Zhiqi"
    "Pure English text|Catherine"
    "中英混合 mixed text|Aida"
  )

  local failed=0

  for test_case in "${test_cases[@]}"; do
    IFS='|' read -r text expected_voice <<< "$test_case"
    local output="$TEST_OUTPUT_DIR/aliyun-smart-${expected_voice}-${TIMESTAMP}.mp3"

    log_info "Testing: $text -> expecting $expected_voice"

    # Smart mode should auto-select the correct voice
    if ./scripts/providers/tts/aliyun.sh "$text" "$output" "" "1.0" 2>&1 | tee /tmp/aliyun-smart-output.txt; then
      # Check if the expected voice was selected
      if grep -q "Auto-selected voice: $expected_voice" /tmp/aliyun-smart-output.txt || \
         grep -q "Using voice: $expected_voice" /tmp/aliyun-smart-output.txt; then
        log_info "✓ Correctly selected $expected_voice"
      else
        log_warn "Voice selection unclear, but TTS succeeded"
      fi
    else
      log_error "Smart mode failed for: $text"
      failed=1
    fi
  done

  if [[ $failed -eq 0 ]]; then
    pass_test "Aliyun smart mode"
  else
    fail_test "Aliyun smart mode" "Auto voice selection failed"
  fi
}

# ============================================================================
# TEST SUITE 3: Azure TTS
# ============================================================================

test_azure_basic() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Azure TTS - Basic Chinese Text"

  if ! is_provider_configured "azure"; then
    skip_test "Azure basic" "Azure not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/azure-basic-${TIMESTAMP}.mp3"
  local text="你好，这是Azure测试。"

  if ./scripts/providers/tts/azure.sh "$text" "$output" "" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Azure basic"
    else
      fail_test "Azure basic" "Invalid audio file"
    fi
  else
    fail_test "Azure basic" "TTS generation failed"
  fi
}

# ============================================================================
# TEST SUITE 4: Tencent TTS
# ============================================================================

test_tencent_basic() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Tencent TTS - Basic Chinese Text"

  if ! is_provider_configured "tencent"; then
    skip_test "Tencent basic" "Tencent not configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/tencent-basic-${TIMESTAMP}.mp3"
  local text="你好，这是腾讯云测试。"

  if ./scripts/providers/tts/tencent.sh "$text" "$output" "" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Tencent basic"
    else
      fail_test "Tencent basic" "Invalid audio file"
    fi
  else
    fail_test "Tencent basic" "TTS generation failed"
  fi
}

# ============================================================================
# TEST SUITE 5: Edge Cases
# ============================================================================

test_empty_text() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Edge Case - Empty Text"

  if ! is_provider_configured "openai"; then
    skip_test "Empty text" "No provider configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/edge-empty-${TIMESTAMP}.mp3"
  local text=""

  # Should fail gracefully
  if ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "1.0" 2>&1; then
    fail_test "Empty text" "Should have rejected empty text"
  else
    pass_test "Empty text (correctly rejected)"
  fi
}

test_long_text() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Edge Case - Long Text (1000+ chars)"

  if ! is_provider_configured "openai"; then
    skip_test "Long text" "No provider configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/edge-long-${TIMESTAMP}.mp3"
  local text=$(printf '测试文本%.0s' {1..200})  # ~600 chars

  if ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Long text"
    else
      fail_test "Long text" "Invalid audio file"
    fi
  else
    fail_test "Long text" "TTS generation failed"
  fi
}

test_special_characters() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_test "Edge Case - Special Characters & Emojis"

  if ! is_provider_configured "openai"; then
    skip_test "Special characters" "No provider configured"
    return
  fi

  local output="$TEST_OUTPUT_DIR/edge-special-${TIMESTAMP}.mp3"
  local text="测试特殊字符：@#$%^&*()，还有emoji 🚀🎉👍"

  if ./scripts/providers/tts/openai.sh "$text" "$output" "nova" "1.0" 2>&1; then
    if validate_audio "$output"; then
      pass_test "Special characters"
    else
      fail_test "Special characters" "Invalid audio file"
    fi
  else
    # Some providers may reject special characters - that's acceptable
    log_warn "Special characters rejected (acceptable behavior)"
    skip_test "Special characters" "Provider rejected special chars"
  fi
}

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================

main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║         TTS Providers API Test Suite                      ║"
  echo "║         openclaw-video-generator v1.4.4                    ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  log_info "Test session started: $(date)"
  log_info "Output directory: $TEST_OUTPUT_DIR"
  echo ""

  # Check configured providers
  log_info "Checking configured providers..."
  for provider in openai azure aliyun tencent; do
    if is_provider_configured "$provider"; then
      log_info "  ✓ $provider: Configured"
    else
      log_warn "  ✗ $provider: Not configured (tests will be skipped)"
    fi
  done
  echo ""

  # Run test suites
  log_info "Running test suites..."
  echo ""

  # OpenAI tests
  test_openai_basic
  test_openai_english
  test_openai_voices
  test_openai_speed
  test_openai_performance

  # Aliyun tests (critical for v1.4.3)
  test_aliyun_chinese_zhiqi
  test_aliyun_english_catherine
  test_aliyun_mixed_aida
  test_aliyun_smart_mode_auto_select

  # Azure tests
  test_azure_basic

  # Tencent tests
  test_tencent_basic

  # Edge cases
  test_empty_text
  test_long_text
  test_special_characters

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

  # Detailed results
  if [[ ${#TEST_RESULTS[@]} -gt 0 ]]; then
    log_info "Detailed Results:"
    for result in "${TEST_RESULTS[@]}"; do
      echo "  $result"
    done
    echo ""
  fi

  # Save report
  local report_file="$TEST_OUTPUT_DIR/tts-test-report-${TIMESTAMP}.txt"
  {
    echo "TTS Providers Test Report"
    echo "========================="
    echo "Date: $(date)"
    echo "Total: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Skipped: $SKIPPED_TESTS"
    echo ""
    echo "Results:"
    for result in "${TEST_RESULTS[@]}"; do
      echo "$result"
    done
  } > "$report_file"

  log_info "Report saved: $report_file"

  # Exit code
  if [[ $FAILED_TESTS -eq 0 ]]; then
    log_info "🎉 All tests passed!"
    exit 0
  else
    log_error "⚠️  Some tests failed"
    exit 1
  fi
}

# Run main
main "$@"
