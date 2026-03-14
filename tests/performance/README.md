# Performance Benchmark Suite

Comprehensive performance testing framework for OpenClaw Video Generator.

## Overview

This benchmark suite provides:

- **TTS Provider Benchmarks** - Compare OpenAI, Aliyun, Azure, Tencent TTS performance
- **ASR Provider Benchmarks** - Compare OpenAI Whisper, Aliyun, Azure, Tencent ASR performance
- **End-to-End Pipeline Benchmarks** - Measure complete video generation pipeline (10s, 20s, 30s videos)
- **Background Video Benchmarks** - Test background video loading with various file sizes (10MB, 50MB, 100MB)
- **Automated Analysis** - Statistical analysis and bottleneck identification
- **Performance Reports** - Markdown reports with recommendations

## Quick Start

### Run All Benchmarks

```bash
cd /home/justin/openclaw-video-generator
bash tests/performance/scripts/run-all-benchmarks.sh
```

This will:
1. Run TTS provider benchmarks (all configured providers)
2. Run ASR provider benchmarks (all configured providers)
3. Run end-to-end pipeline benchmarks (10s, 20s, 30s videos)
4. Generate comprehensive performance report
5. Provide optimization recommendations

**Duration:** ~10-15 minutes (depending on number of providers configured)

### Run Individual Benchmarks

```bash
# TTS Provider Benchmark (2-3 minutes)
bash tests/performance/scripts/benchmark-tts-providers.sh

# ASR Provider Benchmark (2-3 minutes)
bash tests/performance/scripts/benchmark-asr-providers.sh

# End-to-End Pipeline Benchmark (5-8 minutes)
bash tests/performance/scripts/benchmark-end-to-end.sh

# Background Video Loading Benchmark (3-5 minutes)
bash tests/performance/scripts/benchmark-background-video.sh
```

### Analyze Results

```bash
# Analyze specific benchmark result
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/tts-benchmark-*.json
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/asr-benchmark-*.json
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-*.json
```

## Benchmark Details

### TTS Provider Benchmark

**Purpose:** Compare TTS provider response times and success rates

**Test Cases:**
- `short_zh` - Short Chinese text (~10 chars)
- `medium_zh` - Medium Chinese text (~50 chars)
- `short_en` - Short English text (~10 words)
- `medium_en` - Medium English text (~50 words)
- `mixed` - Mixed Chinese/English text

**Metrics Collected:**
- Response time (ms)
- Success rate (%)
- Retry count
- File size (bytes)
- Text length

**Providers Tested:**
- OpenAI TTS (voices: nova, alloy, echo, shimmer)
- Aliyun TTS (smart voice selection - v1.4.3)
- Azure TTS (if configured)
- Tencent TTS (if configured)

### ASR Provider Benchmark

**Purpose:** Compare ASR provider transcription speed and accuracy

**Test Audio Files:**
- Uses existing audio files from `tests/audio/`
- Various durations (10s-30s)
- Chinese language content

**Metrics Collected:**
- Processing time (ms)
- Segment count
- Word count
- Success rate (%)
- Audio file size

**Providers Tested:**
- OpenAI Whisper (highest accuracy baseline)
- Aliyun ASR
- Azure Speech-to-Text (if configured)
- Tencent ASR (if configured)

### End-to-End Pipeline Benchmark

**Purpose:** Measure complete video generation pipeline performance and identify bottlenecks

**Test Cases:**
- `10s` - ~10 second video
- `20s` - ~20 second video
- `30s` - ~30 second video

**Pipeline Stages Measured:**
1. **TTS Generation** - Text → Audio
2. **ASR Timestamps** - Audio → Timestamps
3. **Scene Generation** - Timestamps → Remotion scenes
4. **Remotion Rendering** - Scenes → Video

**Metrics Collected:**
- Per-stage duration (ms)
- Total pipeline duration (ms)
- Audio file size (bytes)
- Video file size (bytes)
- Video duration (ms)
- Bottleneck analysis (% of total time per stage)

### Background Video Benchmark

**Purpose:** Validate v1.4.2 timeout fix and measure background video loading performance

**Test Cases:**
- `small` - ~10MB video
- `medium` - ~50MB video
- `large` - ~100MB video

**Metrics Collected:**
- Loading time (ms)
- Within 60s timeout? (true/false)
- File size (bytes)
- Success rate

**Configuration Tested:**
- Remotion timeout: 60000ms (60s)
- Background opacity: 0.7

## Performance Targets

Based on project requirements (from v1.4.4):

| Metric | Target | Status |
|--------|--------|--------|
| TTS API Response | < 5s for typical script | ✅ v1.4.3 smart voice |
| ASR Processing | Reasonable for 20s audio | ✅ Optimized |
| End-to-End 20s Video | ~2 minutes total | ✅ Target met |
| Background Video Timeout | 60s for 100MB files | ✅ v1.4.2 fix |
| Remotion Concurrency | 6x | ✅ Configured |

## Results Structure

All benchmark results are saved in JSON format:

```
tests/performance/results/
├── tts-benchmark-<timestamp>.json
├── asr-benchmark-<timestamp>.json
├── e2e-benchmark-<timestamp>.json
└── bg-video-benchmark-<timestamp>.json
```

Reports are generated in Markdown format:

```
tests/performance/reports/
└── performance-report-<timestamp>.md
```

## Result Format

### TTS Benchmark Result
```json
{
  "timestamp": 1710401234,
  "date": "2026-03-14 10:20:34",
  "results": [
    {
      "provider": "openai",
      "test_case": "short_zh",
      "text_length": 15,
      "success": true,
      "duration_ms": 1234,
      "file_size_bytes": 45678,
      "retry_count": 0
    }
  ]
}
```

### ASR Benchmark Result
```json
{
  "timestamp": 1710401234,
  "date": "2026-03-14 10:20:34",
  "results": [
    {
      "provider": "openai",
      "audio_file": "test.mp3",
      "audio_size_bytes": 123456,
      "success": true,
      "duration_ms": 5678,
      "segment_count": 10,
      "word_count": 45
    }
  ]
}
```

### E2E Benchmark Result
```json
{
  "timestamp": 1710401234,
  "date": "2026-03-14 10:20:34",
  "remotion_config": {
    "concurrency": 6,
    "timeout_ms": 60000
  },
  "results": [
    {
      "test_case": "20s",
      "text_length": 120,
      "success": true,
      "tts_duration_ms": 2000,
      "asr_duration_ms": 3000,
      "scene_duration_ms": 100,
      "render_duration_ms": 45000,
      "total_duration_ms": 50100,
      "video_duration_ms": 20000
    }
  ]
}
```

## Analysis Output

The analysis script provides:

### TTS Analysis
- Provider comparison (success rate, avg/median response time)
- Best provider by average speed
- Best provider by median speed
- Best provider by success rate
- Total tests/success/failed counts

### ASR Analysis
- Provider comparison (success rate, avg/median processing time)
- Best provider by speed
- Best provider by success rate
- Per-audio file breakdown

### E2E Analysis
- Per-test-case results (all stage timings)
- Bottleneck analysis (% of total time per stage)
- Performance target validation
- Optimization recommendations

## Performance Monitoring

### Continuous Monitoring

Run benchmarks regularly to track performance over time:

```bash
# Weekly performance check
0 0 * * 0 cd /home/justin/openclaw-video-generator && bash tests/performance/scripts/run-all-benchmarks.sh
```

### Performance Regression Detection

Compare current results with baseline:

```bash
# Save baseline
cp tests/performance/results/e2e-benchmark-latest.json tests/performance/baseline-e2e.json

# Compare with baseline (manual comparison)
python3 tests/performance/scripts/analyze-performance.py tests/performance/baseline-e2e.json
python3 tests/performance/scripts/analyze-performance.py tests/performance/results/e2e-benchmark-latest.json
```

### Key Metrics to Track

1. **TTS Response Time** - Should stay < 5s
2. **ASR Processing Time** - Monitor for degradation
3. **Rendering Time** - Largest bottleneck, track carefully
4. **Total E2E Time** - Overall user experience metric
5. **Success Rates** - Provider reliability

## Optimization Recommendations

Based on benchmark results, consider:

### 1. Provider Selection
- **Fastest TTS:** Use benchmark results to choose fastest provider
- **Fastest ASR:** Use benchmark results to choose fastest provider
- **Trade-offs:** Balance speed vs accuracy vs cost

### 2. Caching Strategy
- Cache TTS audio for repeated scripts (reduces API calls)
- Cache ASR timestamps for reused audio files
- Pre-generate common background videos

### 3. Parallel Processing
- TTS and background video can load in parallel (future optimization)
- Multiple video renders can run concurrently (batch processing)

### 4. Resource Optimization

**Remotion Configuration:**
```typescript
// remotion.config.ts
Config.setConcurrency(8);  // Increase if CPU allows (currently 6)
Config.setDelayRenderTimeoutInMilliseconds(60000);  // 60s (v1.4.2 fix)
```

**Background Video:**
```bash
# Optimize large background videos
bash scripts/optimize-background.sh input.mp4 output.mp4

# Target: < 50MB for optimal performance
```

### 5. Cost vs Performance

| Provider | Speed | Cost | Accuracy | Recommendation |
|----------|-------|------|----------|----------------|
| OpenAI | Medium | High | Highest | Best for quality |
| Aliyun | Fast | Low | Good | Best for cost/performance (v1.4.3 smart mode) |
| Azure | Fast | Medium | Good | Regional availability |
| Tencent | Fast | Low | Good | China region |

## Troubleshooting

### Benchmark Fails

**Issue:** TTS/ASR benchmark fails immediately

**Solution:**
- Check `.env` file has required API keys
- Verify provider configuration using `source scripts/providers/utils.sh && is_provider_configured openai tts`
- Check network connectivity

**Issue:** Timeout errors

**Solution:**
- Increase timeout in benchmark scripts (default: 30s for TTS, 60s for ASR)
- Check API rate limits
- Try again during off-peak hours

### Missing Test Files

**Issue:** ASR benchmark can't find audio files

**Solution:**
- Generate test audio first: `bash scripts/tts-generate.sh "测试文本" --out tests/audio/test.mp3`
- Or use existing audio from `audio/` directory

**Issue:** Background video benchmark fails

**Solution:**
- Ensure FFmpeg is installed: `ffmpeg -version`
- Check disk space for test videos
- Reduce test video sizes if needed

## Contributing

To add new benchmarks:

1. Create script in `tests/performance/scripts/`
2. Save results to `tests/performance/results/`
3. Follow JSON format convention
4. Add analysis support in `analyze-performance.py`
5. Update `run-all-benchmarks.sh` to include new benchmark

## References

- [Remotion Performance](https://www.remotion.dev/docs/performance)
- [OpenAI API Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Aliyun TTS Documentation](https://help.aliyun.com/product/30413.html)
- [v1.4.2 Release Notes](../../RELEASE_NOTES_v1.4.2.md) - Background video timeout fix
- [v1.4.3 Release Notes](../../RELEASE_NOTES_v1.4.3.md) - Smart TTS voice selection

---

**Last Updated:** 2026-03-14
**Version:** 1.4.4
