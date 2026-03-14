# Performance Benchmarks - Quick Start Guide

Fast guide to running and understanding performance benchmarks.

## 🚀 Run All Benchmarks (One Command)

```bash
cd /home/justin/openclaw-video-generator
bash tests/performance/scripts/run-all-benchmarks.sh
```

**Duration:** ~10-15 minutes
**Output:** `tests/performance/reports/performance-report-<timestamp>.md`

## 📊 Individual Benchmarks

### TTS Provider Comparison
```bash
bash tests/performance/scripts/benchmark-tts-providers.sh
```
**Tests:** OpenAI, Aliyun, Azure, Tencent (configured providers only)
**Duration:** ~2-3 minutes

### ASR Provider Comparison
```bash
bash tests/performance/scripts/benchmark-asr-providers.sh
```
**Tests:** OpenAI Whisper, Aliyun, Azure, Tencent
**Duration:** ~2-3 minutes

### Full Pipeline Performance
```bash
bash tests/performance/scripts/benchmark-end-to-end.sh
```
**Tests:** 10s, 20s, 30s video generation
**Duration:** ~5-8 minutes

### Background Video Loading
```bash
bash tests/performance/scripts/benchmark-background-video.sh
```
**Tests:** 10MB, 50MB, 100MB videos
**Duration:** ~3-5 minutes

## 🔍 Analyze Results

```bash
# Auto-find latest result
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-*.json

# Or specify exact file
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-1710401234.json
```

## 📈 Read Report

```bash
# View latest report
cat tests/performance/reports/performance-report-*.md | less

# Or open in editor
code tests/performance/reports/performance-report-*.md
```

## 🎯 What to Look For

### In TTS Results
- **Best Average Speed:** Which provider is fastest on average?
- **Success Rate:** Are any providers failing frequently?
- **Recommendation:** Use the fastest + most reliable provider

### In ASR Results
- **Processing Time:** How long does transcription take?
- **Best Provider:** Which is fastest for your audio length?

### In E2E Results
- **Bottleneck:** Which stage takes the most time?
  - **TTS** (5%): Usually 2-3s
  - **ASR** (8%): Usually 3-5s
  - **Rendering** (86%): Usually 40-60s for 20s video
- **Total Time:** Is 20s video under 2 minutes?

### In Background Video Results
- **Loading Time:** Are 100MB videos loading within 60s?
- **Recommendation:** Keep backgrounds < 50MB for best performance

## ⚡ Quick Fixes

### If TTS is Slow
```bash
# Use Aliyun with smart mode (v1.4.3)
export ALIYUN_TTS_SMART_MODE=true
export TTS_PROVIDERS="aliyun,openai"
```

### If Rendering is Slow
```typescript
// remotion.config.ts
Config.setConcurrency(8);  // Increase from 6 (if CPU allows)
```

### If Background Videos Timeout
```bash
# Optimize large videos
bash scripts/optimize-background.sh input.mp4 output.mp4
```

## 📋 Performance Checklist

**Before Release:**
- [ ] Run full benchmark suite
- [ ] Check all success rates > 90%
- [ ] Verify 20s video < 2 minutes
- [ ] Review bottleneck analysis
- [ ] Update baselines if improved

**Monthly Monitoring:**
- [ ] Run benchmarks on 1st of month
- [ ] Compare with previous month
- [ ] Look for regressions (>15% slower)
- [ ] Document any changes

**After Optimization:**
- [ ] Run benchmark before changes
- [ ] Run benchmark after changes
- [ ] Calculate improvement %
- [ ] Update documentation

## 🏆 Performance Targets

| Metric | Target | Good | Warning |
|--------|--------|------|---------|
| TTS Response | < 3s | < 5s | > 8s ⚠️ |
| ASR Processing | < 5s | < 10s | > 15s ⚠️ |
| E2E 20s Video | < 90s | < 120s | > 150s ⚠️ |
| Success Rate | > 95% | > 90% | < 85% ⚠️ |
| Background Load | < 30s | < 60s | Timeout ⚠️ |

## 🔧 Troubleshooting

**Benchmark won't run:**
```bash
# Check environment
cat .env | grep -E "OPENAI|ALIYUN|AZURE|TENCENT"

# Test provider configuration
source scripts/providers/utils.sh
is_provider_configured openai tts && echo "✅ OpenAI configured"
is_provider_configured aliyun tts && echo "✅ Aliyun configured"
```

**No test audio files:**
```bash
# Generate test audio
bash scripts/tts-generate.sh "这是测试文本" --out tests/audio/test.mp3
```

**Background benchmark fails:**
```bash
# Check FFmpeg
ffmpeg -version

# Or skip background benchmark
bash tests/performance/scripts/benchmark-end-to-end.sh  # Runs without backgrounds
```

## 📚 More Information

- Full documentation: `tests/performance/README.md`
- Monitoring plan: `tests/performance/PERFORMANCE_MONITORING_PLAN.md`
- Analysis script: `tests/performance/scripts/analyze-performance.py`

## 💡 Pro Tips

1. **Run benchmarks off-peak** - API performance varies by time of day
2. **Run 3x and average** - Reduces variance in results
3. **Save baselines** - Compare against previous versions
4. **Track costs** - Monitor API usage alongside performance
5. **Automate monitoring** - Set up weekly cron job

---

**Quick Help:**
```bash
# Show this guide
cat tests/performance/QUICK_START.md

# Run all benchmarks
bash tests/performance/scripts/run-all-benchmarks.sh

# Analyze results
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-*.json
```
