# Performance Benchmark Suite - Verification Checklist

Use this checklist to verify the benchmark suite is working correctly.

## ✅ Installation Verification

### 1. Directory Structure
- [ ] `tests/performance/` directory exists
- [ ] `tests/performance/scripts/` contains 7 executable scripts
- [ ] `tests/performance/results/` directory exists (will be created on first run)
- [ ] `tests/performance/reports/` directory exists (will be created on first run)
- [ ] `tests/performance/baselines/` directory exists

### 2. Script Permissions
```bash
cd /home/justin/openclaw-video-generator
ls -l tests/performance/scripts/*.sh tests/performance/scripts/*.py
# All should show: -rwxrwxr-x (executable)
```

- [ ] `benchmark-tts-providers.sh` is executable
- [ ] `benchmark-asr-providers.sh` is executable
- [ ] `benchmark-end-to-end.sh` is executable
- [ ] `benchmark-background-video.sh` is executable
- [ ] `run-all-benchmarks.sh` is executable
- [ ] `analyze-performance.py` is executable
- [ ] `compare-baselines.py` is executable

### 3. Documentation Files
- [ ] `README.md` exists (~400 lines)
- [ ] `QUICK_START.md` exists (~190 lines)
- [ ] `PERFORMANCE_REPORT.md` exists (~440 lines)
- [ ] `PERFORMANCE_MONITORING_PLAN.md` exists (~430 lines)
- [ ] `INDEX.md` exists (~410 lines)
- [ ] `EXECUTIVE_SUMMARY.md` exists (~340 lines)
- [ ] `CHECKLIST.md` exists (this file)

## ✅ Environment Verification

### 4. Required Dependencies
```bash
# Check Python 3
python3 --version
# Should show: Python 3.x.x

# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check pnpm
pnpm --version
# Should show: version number

# Check jq (for JSON parsing)
jq --version
# Should show: jq-1.x

# Check FFmpeg (optional, for background video tests)
ffmpeg -version
# Should show: ffmpeg version x.x.x
```

- [ ] Python 3 installed (version 3.6+)
- [ ] Node.js installed (version 18+)
- [ ] pnpm installed
- [ ] jq installed
- [ ] FFmpeg installed (optional)

### 5. API Configuration
```bash
# Check .env file
cat .env | grep -E "OPENAI|ALIYUN|AZURE|TENCENT"
```

**Required for TTS/ASR:**
- [ ] `OPENAI_API_KEY` is set
- [ ] `ALIYUN_ACCESS_KEY_ID` is set (if using Aliyun)
- [ ] `ALIYUN_ACCESS_KEY_SECRET` is set (if using Aliyun)
- [ ] `ALIYUN_APP_KEY` is set (if using Aliyun)

**Optional:**
- [ ] `AZURE_SPEECH_KEY` is set (for Azure tests)
- [ ] `TENCENT_SECRET_ID` is set (for Tencent tests)

**Configuration:**
- [ ] `TTS_PROVIDERS` environment variable is set (or defaults to "openai")
- [ ] `ASR_PROVIDERS` environment variable is set (or defaults to "openai")
- [ ] `ALIYUN_TTS_SMART_MODE=true` (recommended for v1.4.3)

## ✅ Functional Testing

### 6. Quick Test (5 minutes)
```bash
cd /home/justin/openclaw-video-generator

# Test TTS benchmark (should complete in ~2-3 min)
bash tests/performance/scripts/benchmark-tts-providers.sh
```

- [ ] Script runs without errors
- [ ] Creates file in `tests/performance/results/tts-benchmark-*.json`
- [ ] Shows success messages (✅) for configured providers
- [ ] Shows skip messages (⚠️) for unconfigured providers

### 7. Analysis Test
```bash
# Analyze the results
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/tts-benchmark-*.json
```

- [ ] Shows provider comparison table
- [ ] Shows success rates and average times
- [ ] Identifies best provider
- [ ] No Python errors

### 8. Full Benchmark Test (Optional - 10-15 minutes)
```bash
# Run all benchmarks
bash tests/performance/scripts/run-all-benchmarks.sh
```

- [ ] TTS benchmark completes
- [ ] ASR benchmark completes
- [ ] E2E benchmark completes
- [ ] Report generated in `tests/performance/reports/`
- [ ] All results saved to `tests/performance/results/`

## ✅ Output Verification

### 9. Result Files Created
After running benchmarks, verify files exist:

```bash
ls -lh tests/performance/results/
```

- [ ] `tts-benchmark-*.json` exists
- [ ] `asr-benchmark-*.json` exists
- [ ] `e2e-benchmark-*.json` exists
- [ ] Files are valid JSON (can be opened with `jq`)

### 10. Report Generated
```bash
ls -lh tests/performance/reports/
cat tests/performance/reports/performance-report-*.md | head -50
```

- [ ] `performance-report-*.md` exists
- [ ] Report contains executive summary
- [ ] Report contains benchmark results
- [ ] Report contains recommendations

## ✅ Feature Validation

### 11. v1.4.3 Smart Voice Validation
```bash
# Check if smart mode is working
grep -r "Smart Mode" tests/performance/results/tts-benchmark-*.json
```

- [ ] Aliyun TTS uses smart mode
- [ ] Success rate is high (>95%)
- [ ] No 418 errors in logs

### 12. v1.4.2 Timeout Validation
```bash
# Check Remotion config
grep "DelayRenderTimeout" remotion.config.ts
# Should show: 60000
```

- [ ] Timeout is 60000ms (60 seconds)
- [ ] Background video tests pass

## ✅ Regression Detection

### 13. Baseline Comparison Test
```bash
# Save a baseline
cp tests/performance/results/e2e-benchmark-*.json tests/performance/baselines/test-baseline.json

# Compare with itself (should show no regression)
python3 tests/performance/scripts/compare-baselines.py \
  tests/performance/baselines/test-baseline.json \
  tests/performance/results/e2e-benchmark-*.json
```

- [ ] Comparison runs without errors
- [ ] Shows "No performance regressions detected" message
- [ ] Exit code is 0

## ✅ Automation Setup

### 14. Cron Job (Optional)
```bash
# Add to crontab
# crontab -e
# Then add:
# 0 0 * * 0 cd /home/justin/openclaw-video-generator && bash tests/performance/scripts/run-all-benchmarks.sh >> /var/log/openclaw-perf.log 2>&1
```

- [ ] Cron job added (optional)
- [ ] Log file path is writable
- [ ] First run completed successfully

### 15. CI/CD Integration (Optional)
- [ ] GitHub Actions workflow created (optional)
- [ ] Benchmark runs on PR (optional)
- [ ] Performance gates configured (optional)

## ✅ Documentation Review

### 16. Documentation Completeness
- [ ] Read `QUICK_START.md` - understand how to run benchmarks
- [ ] Read `README.md` - understand benchmark details
- [ ] Read `EXECUTIVE_SUMMARY.md` - understand key findings
- [ ] Read `INDEX.md` - know where to find everything

## 🎯 Success Criteria

All items checked? You're ready to use the performance benchmark suite!

**Minimum for basic usage:**
- ✅ Scripts are executable
- ✅ Python 3 and Node.js installed
- ✅ At least one TTS/ASR provider configured (OpenAI)
- ✅ Quick test passes
- ✅ Analysis script works

**Recommended for production:**
- ✅ All above, plus:
- ✅ Aliyun provider configured (cost optimization)
- ✅ Smart mode enabled (v1.4.3)
- ✅ Full benchmark suite passes
- ✅ Baselines saved
- ✅ Weekly cron job set up

## 🔧 Troubleshooting

### Common Issues

**Issue:** `permission denied` when running scripts
**Fix:** `chmod +x tests/performance/scripts/*.sh tests/performance/scripts/*.py`

**Issue:** `jq: command not found`
**Fix:** `sudo apt install jq` (Ubuntu) or `brew install jq` (macOS)

**Issue:** `OPENAI_API_KEY not set`
**Fix:** Create `.env` file with `OPENAI_API_KEY=sk-...`

**Issue:** Benchmark takes too long
**Fix:** Run individual benchmarks instead of full suite

**Issue:** Python errors in analysis
**Fix:** Ensure Python 3.6+ is installed: `python3 --version`

## 📞 Get Help

If you encounter issues not covered here:

1. Check `tests/performance/README.md` troubleshooting section
2. Check `tests/performance/QUICK_START.md` for common solutions
3. Review error messages carefully
4. Check GitHub issues for similar problems
5. Create new issue with:
   - Error messages
   - Environment details (`uname -a`, `node --version`, etc.)
   - Steps to reproduce

---

**Checklist Version:** 1.0
**Last Updated:** 2026-03-14
**Compatibility:** OpenClaw Video Generator v1.4.4+
