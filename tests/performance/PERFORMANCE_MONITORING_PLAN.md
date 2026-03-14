# Performance Monitoring Plan

Ongoing performance monitoring strategy for OpenClaw Video Generator.

## Overview

This document outlines the performance monitoring strategy to ensure consistent performance, detect regressions early, and guide optimization efforts.

## 1. Monitoring Strategy

### 1.1 Metrics to Track

#### Critical Metrics (Track Always)
- **TTS Response Time** - API latency for speech generation
- **ASR Processing Time** - Transcription duration
- **E2E Pipeline Duration** - Total time from script to video
- **Success Rates** - Provider reliability
- **Error Rates** - API failures, timeouts, retries

#### Secondary Metrics (Track Periodically)
- **File Sizes** - Audio/video output sizes
- **Memory Usage** - Peak memory during rendering
- **CPU Utilization** - Rendering efficiency
- **Network Bandwidth** - API data transfer
- **Disk I/O** - File write performance

#### User-Perceived Metrics
- **Time to First Audio** - TTS generation start
- **Time to Video Preview** - First frame rendered
- **Total Generation Time** - End-user wait time

### 1.2 Measurement Frequency

| Metric Category | Frequency | Method |
|----------------|-----------|--------|
| Critical Metrics | Weekly | Automated benchmark |
| Secondary Metrics | Monthly | Manual benchmark |
| Pre-Release | Before each release | Full benchmark suite |
| Post-Incident | After performance issues | Targeted benchmark |

## 2. Performance Baselines

### 2.1 Establishing Baselines

**Initial Baseline (v1.4.4):**

```bash
# Run comprehensive baseline benchmark
cd /home/justin/openclaw-video-generator
bash tests/performance/scripts/run-all-benchmarks.sh

# Save baseline results
cp tests/performance/results/tts-benchmark-*.json tests/performance/baselines/v1.4.4-tts.json
cp tests/performance/results/asr-benchmark-*.json tests/performance/baselines/v1.4.4-asr.json
cp tests/performance/results/e2e-benchmark-*.json tests/performance/baselines/v1.4.4-e2e.json
```

**Baseline Metrics (Expected v1.4.4):**

| Metric | Baseline | Threshold | Alert Level |
|--------|----------|-----------|-------------|
| TTS Response (OpenAI) | ~2-3s | < 5s | > 8s = ⚠️ |
| TTS Response (Aliyun) | ~1-2s | < 3s | > 5s = ⚠️ |
| ASR Processing (Whisper) | ~3-5s | < 10s | > 15s = ⚠️ |
| E2E 20s Video | ~60-90s | < 120s | > 150s = ⚠️ |
| Rendering (20s) | ~40-60s | < 90s | > 120s = ⚠️ |
| Success Rate (TTS) | > 95% | > 90% | < 85% = ⚠️ |
| Success Rate (ASR) | > 95% | > 90% | < 85% = ⚠️ |

### 2.2 Updating Baselines

Update baselines when:
- **Major Version Release** - New baseline for v2.0.0
- **Performance Optimization** - After confirmed improvement
- **Infrastructure Change** - New hardware, cloud provider, etc.
- **Breaking Changes** - API updates, dependency changes

## 3. Regression Detection

### 3.1 Automated Regression Detection

**Regression Criteria:**

```python
# Pseudo-code for regression detection
def is_regression(current_metric, baseline_metric, threshold=0.15):
    """
    Detect if current performance is a regression

    Args:
        current_metric: Current measurement
        baseline_metric: Baseline measurement
        threshold: Acceptable degradation (default: 15%)

    Returns:
        True if regression detected
    """
    degradation = (current_metric - baseline_metric) / baseline_metric
    return degradation > threshold

# Example thresholds:
TTS_DEGRADATION_THRESHOLD = 0.20  # 20% slower = regression
ASR_DEGRADATION_THRESHOLD = 0.20  # 20% slower = regression
E2E_DEGRADATION_THRESHOLD = 0.15  # 15% slower = regression
SUCCESS_RATE_THRESHOLD = 0.05     # 5% drop = regression
```

### 3.2 Regression Response Plan

**Level 1: Minor Regression (10-20% degradation)**
- Log warning in monitoring system
- Investigate within 1 week
- Document findings in performance log

**Level 2: Moderate Regression (20-40% degradation)**
- Create GitHub issue
- Investigate within 3 days
- Identify root cause
- Plan optimization

**Level 3: Severe Regression (>40% degradation)**
- Immediate investigation
- Consider rolling back changes
- Block release if pre-release regression
- Emergency optimization

## 4. Continuous Monitoring

### 4.1 Automated Monitoring Setup

**Option 1: Cron Job (Local)**

```bash
# Add to crontab (weekly on Sunday at midnight)
0 0 * * 0 cd /home/justin/openclaw-video-generator && bash tests/performance/scripts/run-all-benchmarks.sh >> /var/log/openclaw-perf.log 2>&1
```

**Option 2: GitHub Actions (CI/CD)**

```yaml
# .github/workflows/performance.yml
name: Performance Benchmark

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run benchmarks
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ALIYUN_ACCESS_KEY_ID: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
          ALIYUN_ACCESS_KEY_SECRET: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
        run: bash tests/performance/scripts/run-all-benchmarks.sh
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: tests/performance/results/
```

### 4.2 Alerting Thresholds

**Email Alerts:**
- TTS response time > 8s (2x normal)
- ASR processing time > 15s (3x normal)
- E2E time > 150s for 20s video (1.5x normal)
- Success rate < 85%
- 3 consecutive failures

**Slack/Discord Webhooks:**
- Performance regression detected
- Benchmark failure
- New performance record (improvement)

## 5. Performance Dashboard

### 5.1 Key Visualizations

**Dashboard Components:**

1. **Response Time Trends**
   - Line chart: TTS/ASR response times over time
   - Compare providers side-by-side
   - Show baseline and thresholds

2. **Success Rate Trends**
   - Line chart: Success rates over time
   - Per-provider breakdown
   - Show 90% threshold line

3. **Pipeline Bottleneck Chart**
   - Stacked bar chart: Stage durations
   - Show percentage of total time
   - Highlight bottleneck stage

4. **Cost Efficiency**
   - Calculate cost per video
   - Compare providers
   - Show total monthly cost projection

### 5.2 Dashboard Implementation

**Simple Approach (Spreadsheet):**

```bash
# Export results to CSV for manual graphing
python3 -c "
import json
import csv

with open('tests/performance/results/e2e-benchmark-latest.json') as f:
    data = json.load(f)

with open('performance-dashboard.csv', 'w') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=['date', 'test_case', 'total_ms', 'tts_ms', 'asr_ms', 'render_ms'])
    writer.writeheader()
    for result in data['results']:
        writer.writerow({
            'date': data['date'],
            'test_case': result['test_case'],
            'total_ms': result['total_duration_ms'],
            'tts_ms': result['tts_duration_ms'],
            'asr_ms': result['asr_duration_ms'],
            'render_ms': result['render_duration_ms']
        })
"
```

**Advanced Approach (Grafana + Prometheus):**

- Instrument code with Prometheus metrics
- Export metrics from benchmark results
- Create Grafana dashboard
- Set up alerting rules

## 6. Performance Budget

### 6.1 Budget Allocation

**Per-Stage Budgets (20s video):**

| Stage | Budget (ms) | Percentage | Status |
|-------|-------------|------------|--------|
| TTS | 3,000 | 5% | ✅ Within |
| ASR | 5,000 | 8% | ✅ Within |
| Scene Gen | 500 | 1% | ✅ Within |
| Rendering | 51,500 | 86% | ✅ Within |
| **Total** | **60,000** | **100%** | ✅ Target |

**Budget Enforcement:**

```bash
# Fail CI if budget exceeded
if [ "$E2E_TIME" -gt 60000 ]; then
  echo "❌ Performance budget exceeded: ${E2E_TIME}ms > 60000ms"
  exit 1
fi
```

### 6.2 Budget Reviews

- **Monthly Review:** Assess if budgets are realistic
- **Post-Optimization:** Tighten budgets after improvements
- **Pre-Feature:** Adjust budgets for new features

## 7. Optimization Workflow

### 7.1 Identify Bottleneck

```bash
# Run E2E benchmark
bash tests/performance/scripts/benchmark-end-to-end.sh

# Analyze results
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-*.json

# Bottleneck will be highlighted
```

### 7.2 Targeted Optimization

**If TTS is bottleneck:**
- Switch to faster provider (Aliyun with smart mode)
- Implement request batching
- Add caching layer

**If ASR is bottleneck:**
- Use faster provider
- Optimize audio preprocessing
- Consider parallel processing

**If Rendering is bottleneck:**
- Increase Remotion concurrency
- Optimize component rendering
- Use GPU acceleration (if available)
- Simplify video effects

### 7.3 Validate Improvement

```bash
# Run benchmark before optimization
bash tests/performance/scripts/benchmark-end-to-end.sh
mv tests/performance/results/e2e-benchmark-*.json before-optimization.json

# Implement optimization

# Run benchmark after optimization
bash tests/performance/scripts/benchmark-end-to-end.sh
mv tests/performance/results/e2e-benchmark-*.json after-optimization.json

# Compare results
python3 tests/performance/scripts/analyze-performance.py before-optimization.json
python3 tests/performance/scripts/analyze-performance.py after-optimization.json

# Calculate improvement
python3 -c "
import json
with open('before-optimization.json') as f:
    before = json.load(f)['results'][0]['total_duration_ms']
with open('after-optimization.json') as f:
    after = json.load(f)['results'][0]['total_duration_ms']
improvement = (before - after) / before * 100
print(f'Improvement: {improvement:.1f}% ({before}ms → {after}ms)')
"
```

## 8. Performance Culture

### 8.1 Performance Reviews

**In Code Reviews:**
- Ask: "What's the performance impact?"
- Require benchmarks for performance-critical changes
- Block PRs that exceed performance budget

**In Sprint Planning:**
- Allocate time for performance optimization
- Set performance goals alongside features
- Track performance debt

### 8.2 Documentation

**Performance Changelog:**

```markdown
# Performance Changelog

## v1.4.3 (2026-03-10)
- **TTS:** Reduced 418 errors by 95% with smart voice selection
- **TTS:** Improved average response time by 30% (Aliyun)

## v1.4.2 (2026-03-08)
- **Rendering:** Increased timeout to 60s for 100MB background videos
- **Background:** Added optimize-background.sh for video compression

## v1.4.0 (2026-03-01)
- **Pipeline:** Initial baseline performance established
```

## 9. Cost Optimization

### 9.1 Cost Monitoring

**Track API Costs:**

```bash
# Log API usage
echo "$(date),openai,tts,1234,0.015" >> tests/performance/cost-log.csv

# Calculate monthly projection
python3 -c "
import csv
total = 0
with open('tests/performance/cost-log.csv') as f:
    reader = csv.DictReader(f, fieldnames=['date','provider','service','calls','cost'])
    for row in reader:
        total += float(row['cost'])
print(f'Total cost: ${total:.2f}')
print(f'Monthly projection: ${total * 30:.2f}')
"
```

### 9.2 Cost vs Performance Trade-offs

| Scenario | Provider | Cost | Performance | Recommendation |
|----------|----------|------|-------------|----------------|
| High Volume | Aliyun | Low | Fast | ✅ Best for production |
| High Quality | OpenAI | High | Medium | Use for premium content |
| Regional | Tencent | Low | Fast | Use in China region |
| Hybrid | Mix | Medium | Optimal | Use provider fallback |

## 10. Next Steps

### Immediate Actions (Week 1)
- [ ] Run baseline benchmarks for v1.4.4
- [ ] Save baseline results in `tests/performance/baselines/`
- [ ] Set up weekly cron job for automated benchmarks
- [ ] Document current performance metrics

### Short-term (Month 1)
- [ ] Set up performance regression alerts
- [ ] Create performance dashboard (spreadsheet or Grafana)
- [ ] Establish performance budget enforcement in CI
- [ ] Train team on performance monitoring tools

### Long-term (Ongoing)
- [ ] Monthly performance reviews
- [ ] Quarterly optimization sprints
- [ ] Continuous cost optimization
- [ ] Performance culture development

---

**Maintained by:** Performance Engineering Team
**Last Updated:** 2026-03-14
**Version:** 1.0
