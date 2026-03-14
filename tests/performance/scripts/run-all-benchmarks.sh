#!/usr/bin/env bash
# Master Performance Benchmark Runner
# Executes all performance benchmarks and generates comprehensive report

set -euo pipefail

cd "$(dirname "$0")/../../.."

RESULTS_DIR="tests/performance/results"
REPORTS_DIR="tests/performance/reports"
SCRIPTS_DIR="tests/performance/scripts"

mkdir -p "$RESULTS_DIR" "$REPORTS_DIR"

TIMESTAMP=$(date +%s)
REPORT_FILE="${REPORTS_DIR}/performance-report-${TIMESTAMP}.md"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     OpenClaw Video Generator - Performance Benchmark Suite     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Timestamp: $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')"
echo "Results Directory: $RESULTS_DIR"
echo "Reports Directory: $REPORTS_DIR"
echo ""

# Initialize report
cat > "$REPORT_FILE" <<EOF
# OpenClaw Video Generator - Performance Benchmark Report

**Generated:** $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')
**Version:** $(grep '"version"' package.json | cut -d'"' -f4)

---

## Executive Summary

This report contains comprehensive performance benchmarks for:
- TTS (Text-to-Speech) providers
- ASR (Automatic Speech Recognition) providers
- End-to-end video generation pipeline

### Test Environment

- **Platform:** $(uname -s)
- **Architecture:** $(uname -m)
- **Node Version:** $(node --version)
- **Remotion Config:**
  - Concurrency: 6
  - Timeout: 60000ms (60s)

---

EOF

# Benchmark 1: TTS Providers
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Benchmark 1/3: TTS Provider Performance                    │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

TTS_RESULT=""
if bash "${SCRIPTS_DIR}/benchmark-tts-providers.sh"; then
  TTS_RESULT=$(ls -t ${RESULTS_DIR}/tts-benchmark-*.json | head -1)
  echo "✅ TTS benchmark complete: $TTS_RESULT"

  # Analyze results
  echo ""
  echo "Analyzing TTS results..."
  python3 "${SCRIPTS_DIR}/analyze-performance.py" "$TTS_RESULT" | tee /tmp/tts-analysis.txt

  # Append to report
  cat >> "$REPORT_FILE" <<EOF
## TTS Provider Performance

EOF

  # Extract key metrics
  cat /tmp/tts-analysis.txt >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"

else
  echo "❌ TTS benchmark failed"
  cat >> "$REPORT_FILE" <<EOF
## TTS Provider Performance

**Status:** ❌ Benchmark Failed

EOF
fi

# Benchmark 2: ASR Providers
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Benchmark 2/3: ASR Provider Performance                    │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

ASR_RESULT=""
if bash "${SCRIPTS_DIR}/benchmark-asr-providers.sh"; then
  ASR_RESULT=$(ls -t ${RESULTS_DIR}/asr-benchmark-*.json | head -1)
  echo "✅ ASR benchmark complete: $ASR_RESULT"

  # Analyze results
  echo ""
  echo "Analyzing ASR results..."
  python3 "${SCRIPTS_DIR}/analyze-performance.py" "$ASR_RESULT" | tee /tmp/asr-analysis.txt

  # Append to report
  cat >> "$REPORT_FILE" <<EOF
## ASR Provider Performance

EOF

  cat /tmp/asr-analysis.txt >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"

else
  echo "❌ ASR benchmark failed"
  cat >> "$REPORT_FILE" <<EOF
## ASR Provider Performance

**Status:** ❌ Benchmark Failed

EOF
fi

# Benchmark 3: End-to-End Pipeline
echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│  Benchmark 3/3: End-to-End Pipeline Performance             │"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

E2E_RESULT=""
if bash "${SCRIPTS_DIR}/benchmark-end-to-end.sh"; then
  E2E_RESULT=$(ls -t ${RESULTS_DIR}/e2e-benchmark-*.json | head -1)
  echo "✅ End-to-end benchmark complete: $E2E_RESULT"

  # Analyze results
  echo ""
  echo "Analyzing end-to-end results..."
  python3 "${SCRIPTS_DIR}/analyze-performance.py" "$E2E_RESULT" | tee /tmp/e2e-analysis.txt

  # Append to report
  cat >> "$REPORT_FILE" <<EOF
## End-to-End Pipeline Performance

EOF

  cat /tmp/e2e-analysis.txt >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"

else
  echo "❌ End-to-end benchmark failed"
  cat >> "$REPORT_FILE" <<EOF
## End-to-End Pipeline Performance

**Status:** ❌ Benchmark Failed

EOF
fi

# Add recommendations section
cat >> "$REPORT_FILE" <<EOF

---

## Performance Recommendations

### Optimization Opportunities

Based on the benchmark results, consider the following optimizations:

#### 1. Provider Selection
EOF

if [[ -n "$TTS_RESULT" ]]; then
  BEST_TTS=$(python3 -c "
import json
with open('$TTS_RESULT') as f:
    data = json.load(f)
results = data['results']
by_provider = {}
for r in results:
    if r['success']:
        by_provider.setdefault(r['provider'], []).append(r['duration_ms'])
if by_provider:
    avg_speeds = {p: sum(d)/len(d) for p, d in by_provider.items()}
    print(min(avg_speeds.items(), key=lambda x: x[1])[0])
" 2>/dev/null || echo "unknown")

  cat >> "$REPORT_FILE" <<EOF
- **TTS Provider:** Use \`$BEST_TTS\` for fastest response time
EOF
fi

if [[ -n "$ASR_RESULT" ]]; then
  BEST_ASR=$(python3 -c "
import json
with open('$ASR_RESULT') as f:
    data = json.load(f)
results = data['results']
by_provider = {}
for r in results:
    if r['success']:
        by_provider.setdefault(r['provider'], []).append(r['duration_ms'])
if by_provider:
    avg_speeds = {p: sum(d)/len(d) for p, d in by_provider.items()}
    print(min(avg_speeds.items(), key=lambda x: x[1])[0])
" 2>/dev/null || echo "unknown")

  cat >> "$REPORT_FILE" <<EOF
- **ASR Provider:** Use \`$BEST_ASR\` for fastest transcription
EOF
fi

cat >> "$REPORT_FILE" <<EOF

#### 2. Pipeline Optimization
EOF

if [[ -n "$E2E_RESULT" ]]; then
  BOTTLENECK=$(python3 -c "
import json
with open('$E2E_RESULT') as f:
    data = json.load(f)
results = [r for r in data['results'] if r['success']]
if results:
    stages = {'tts': 0, 'asr': 0, 'scene': 0, 'render': 0}
    for r in results:
        stages['tts'] += r['tts_duration_ms']
        stages['asr'] += r['asr_duration_ms']
        stages['scene'] += r['scene_duration_ms']
        stages['render'] += r['render_duration_ms']
    print(max(stages.items(), key=lambda x: x[1])[0])
" 2>/dev/null || echo "unknown")

  cat >> "$REPORT_FILE" <<EOF
- **Bottleneck:** The \`$BOTTLENECK\` stage is the primary bottleneck
- **Recommendation:** Focus optimization efforts on the $BOTTLENECK stage
EOF
fi

cat >> "$REPORT_FILE" <<EOF

#### 3. Caching Strategy
- Cache TTS audio for repeated scripts (reduces cost and latency)
- Cache ASR timestamps for reused audio files
- Pre-generate common background videos

#### 4. Concurrency Tuning
- Current Remotion concurrency: 6
- Consider increasing to 8-12 for faster rendering (if CPU allows)
- Monitor memory usage to avoid OOM errors

#### 5. Background Video Optimization
- Use the \`scripts/optimize-background.sh\` script for large videos
- Target < 50MB for optimal loading time
- Ensure video codec is H.264 for broad compatibility

---

## Performance Targets vs Actual

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
EOF

if [[ -n "$TTS_RESULT" ]]; then
  TTS_AVG=$(python3 -c "
import json
with open('$TTS_RESULT') as f:
    data = json.load(f)
results = [r for r in data['results'] if r['success']]
if results:
    print(int(sum(r['duration_ms'] for r in results) / len(results)))
else:
    print('N/A')
" 2>/dev/null || echo "N/A")

  STATUS="✅"
  if [[ "$TTS_AVG" != "N/A" ]] && [[ $TTS_AVG -gt 5000 ]]; then
    STATUS="⚠️"
  fi

  cat >> "$REPORT_FILE" <<EOF
| TTS Response | < 5s | ${TTS_AVG}ms | $STATUS |
EOF
fi

if [[ -n "$ASR_RESULT" ]]; then
  ASR_AVG=$(python3 -c "
import json
with open('$ASR_RESULT') as f:
    data = json.load(f)
results = [r for r in data['results'] if r['success']]
if results:
    print(int(sum(r['duration_ms'] for r in results) / len(results)))
else:
    print('N/A')
" 2>/dev/null || echo "N/A")

  cat >> "$REPORT_FILE" <<EOF
| ASR Processing | Reasonable | ${ASR_AVG}ms | ✅ |
EOF
fi

if [[ -n "$E2E_RESULT" ]]; then
  E2E_20S=$(python3 -c "
import json
with open('$E2E_RESULT') as f:
    data = json.load(f)
results = [r for r in data['results'] if r['success'] and r['test_case'] == '20s']
if results:
    print(int(results[0]['total_duration_ms']))
else:
    print('N/A')
" 2>/dev/null || echo "N/A")

  STATUS="✅"
  if [[ "$E2E_20S" != "N/A" ]] && [[ $E2E_20S -gt 120000 ]]; then
    STATUS="⚠️"
  fi

  cat >> "$REPORT_FILE" <<EOF
| E2E 20s Video | ~2 min | ${E2E_20S}ms | $STATUS |
EOF
fi

cat >> "$REPORT_FILE" <<EOF

---

## Raw Data Files

- TTS Benchmark: \`$TTS_RESULT\`
- ASR Benchmark: \`$ASR_RESULT\`
- E2E Benchmark: \`$E2E_RESULT\`

---

**Report Generated by:** OpenClaw Performance Benchmarker
**Timestamp:** $(date -d @${TIMESTAMP} '+%Y-%m-%d %H:%M:%S')
EOF

# Cleanup temp files
rm -f /tmp/tts-analysis.txt /tmp/asr-analysis.txt /tmp/e2e-analysis.txt

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  Benchmark Suite Complete                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Performance Report: $REPORT_FILE"
echo ""
echo "Next steps:"
echo "  1. Review report: cat $REPORT_FILE"
echo "  2. Share with team or stakeholders"
echo "  3. Track performance over time by running benchmarks regularly"
echo ""
