#!/usr/bin/env bash
# Run all API test suites

set -euo pipefail

cd "$(dirname "$0")/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TIMESTAMP=$(date +%s)
REPORT_DIR="tests/test-results/summary"
mkdir -p "$REPORT_DIR"

TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0

declare -a SUITE_RESULTS=()

log_info() {
  echo -e "${GREEN}[INFO]${NC} $*"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*"
}

log_suite() {
  echo -e "\n${BLUE}═════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  $*${NC}"
  echo -e "${BLUE}═════════════════════════════════════════════════════${NC}\n"
}

run_suite() {
  local suite_name="$1"
  local suite_script="$2"

  TOTAL_SUITES=$((TOTAL_SUITES + 1))
  log_suite "Running: $suite_name"

  if [[ ! -f "$suite_script" ]]; then
    log_error "Suite script not found: $suite_script"
    FAILED_SUITES=$((FAILED_SUITES + 1))
    SUITE_RESULTS+=("❌ FAIL: $suite_name (script not found)")
    return 1
  fi

  if bash "$suite_script"; then
    PASSED_SUITES=$((PASSED_SUITES + 1))
    SUITE_RESULTS+=("✅ PASS: $suite_name")
    log_info "✅ $suite_name: PASSED"
    return 0
  else
    FAILED_SUITES=$((FAILED_SUITES + 1))
    SUITE_RESULTS+=("❌ FAIL: $suite_name")
    log_error "❌ $suite_name: FAILED"
    return 1
  fi
}

main() {
  echo ""
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║                                                           ║"
  echo "║      OpenClaw Video Generator - Test Suite Runner        ║"
  echo "║                    v1.4.4                                 ║"
  echo "║                                                           ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""

  log_info "Test session started: $(date)"
  echo ""

  # Check if .env exists
  if [[ ! -f .env ]]; then
    log_error "No .env file found!"
    log_error "Please create .env with your API credentials"
    log_error "See .env.example or README.md for configuration"
    exit 1
  fi

  log_info "Configuration:"
  log_info "  .env file: found"

  # Check configured providers
  source .env 2>/dev/null || true

  local provider_count=0
  [[ -n "${OPENAI_API_KEY:-}" ]] && provider_count=$((provider_count + 1)) && log_info "  OpenAI: configured"
  [[ -n "${ALIYUN_ACCESS_KEY_ID:-}" ]] && provider_count=$((provider_count + 1)) && log_info "  Aliyun: configured"
  [[ -n "${AZURE_SPEECH_KEY:-}" ]] && provider_count=$((provider_count + 1)) && log_info "  Azure: configured"
  [[ -n "${TENCENT_SECRET_ID:-}" ]] && provider_count=$((provider_count + 1)) && log_info "  Tencent: configured"

  if [[ $provider_count -eq 0 ]]; then
    log_error "No providers configured!"
    log_error "Most tests will be skipped"
    echo ""
  else
    log_info "  Total providers: $provider_count"
    echo ""
  fi

  # Run test suites
  log_info "Running test suites..."
  echo ""

  # Critical tests first
  run_suite "Parameter Pollution Regression" "tests/api/test-parameter-pollution.sh"

  # Core functionality
  run_suite "TTS Providers" "tests/api/test-tts-providers.sh"
  run_suite "ASR Providers" "tests/api/test-asr-providers.sh"

  # Advanced features
  run_suite "Provider Fallback" "tests/api/test-provider-fallback.sh"
  run_suite "Performance Benchmarks" "tests/api/test-performance.sh"

  # Security
  run_suite "Security Validation" "tests/api/test-security.sh"

  # Print summary
  echo ""
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║                   TEST SUITE SUMMARY                      ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""

  log_info "Total Suites:  $TOTAL_SUITES"
  echo -e "${GREEN}Passed:        $PASSED_SUITES${NC}"
  echo -e "${RED}Failed:        $FAILED_SUITES${NC}"
  echo ""

  # Detailed results
  log_info "Suite Results:"
  for result in "${SUITE_RESULTS[@]}"; do
    echo "  $result"
  done
  echo ""

  # Save summary report
  local summary_report="$REPORT_DIR/test-summary-${TIMESTAMP}.txt"
  {
    echo "OpenClaw Video Generator Test Summary"
    echo "====================================="
    echo "Date: $(date)"
    echo "Version: v1.4.4"
    echo ""
    echo "Configuration:"
    echo "  Providers configured: $provider_count"
    echo ""
    echo "Results:"
    echo "  Total Suites: $TOTAL_SUITES"
    echo "  Passed: $PASSED_SUITES"
    echo "  Failed: $FAILED_SUITES"
    echo ""
    echo "Suite Results:"
    for result in "${SUITE_RESULTS[@]}"; do
      echo "  $result"
    done
    echo ""
    echo "Detailed reports in: tests/test-results/"
  } > "$summary_report"

  log_info "Summary report saved: $summary_report"

  # Final status
  echo ""
  if [[ $FAILED_SUITES -eq 0 ]]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║                  🎉  ALL TESTS PASSED!  🎉                ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_info "✅ All test suites completed successfully"
    log_info "✅ v1.4.1 and v1.4.4 bug fixes verified"
    log_info "✅ Multi-provider API functionality validated"
    log_info "✅ Security tests passed"
    echo ""
    exit 0
  else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}║                 ⚠️   TESTS FAILED!  ⚠️                    ║${NC}"
    echo -e "${RED}║                                                           ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$FAILED_SUITES test suite(s) failed"
    log_error "Review failed tests and fix issues before release"
    echo ""
    exit 1
  fi
}

# Run main
main "$@"
