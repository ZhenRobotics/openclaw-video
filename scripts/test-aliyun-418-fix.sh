#!/usr/bin/env bash
# Test Aliyun TTS 418 Error Fix
# 测试阿里云 TTS 418 错误修复

set -euo pipefail

cd "$(dirname "$0")/.."

echo "🧪 Testing Aliyun TTS 418 Error Fix"
echo "====================================="
echo ""

# 检查环境变量
if [[ -z "${ALIYUN_ACCESS_KEY_ID:-}" ]] || [[ -z "${ALIYUN_ACCESS_KEY_SECRET:-}" ]] || [[ -z "${ALIYUN_APP_KEY:-}" ]]; then
    echo "❌ Error: Aliyun credentials not set"
    echo ""
    echo "Please set:"
    echo "  export ALIYUN_ACCESS_KEY_ID='your-id'"
    echo "  export ALIYUN_ACCESS_KEY_SECRET='your-secret'"
    echo "  export ALIYUN_APP_KEY='your-app-key'"
    exit 1
fi

echo "✅ Credentials found"
echo ""

# 创建测试目录
TEST_DIR="test-results/aliyun-418"
mkdir -p "$TEST_DIR"

# 测试用例
declare -a tests=(
    "zh:Aibao:你好，这是中文测试。"
    "zh:Zhiqi:中文测试，使用智琪音色。"
    "en:Aibao:Hello, this is an English test."
    "en:Catherine:Hello, this is an English test with Catherine voice."
    "mixed:Aibao:这是中文 This is English 混合测试"
    "mixed:Aida:这是中文 This is English 混合测试，使用艾达音色"
)

test_count=0
pass_count=0
fail_count=0

# 运行测试
for test_case in "${tests[@]}"; do
    IFS=':' read -r language voice text <<< "$test_case"

    test_count=$((test_count + 1))
    echo "Test $test_count: $language text with $voice voice"
    echo "----------------------------------------"
    echo "Text: $text"
    echo ""

    output_file="$TEST_DIR/test-${language}-${voice}.mp3"

    # 使用智能模式测试
    echo "🔄 Testing with smart mode..."
    if python3 scripts/providers/tts/aliyun_tts_smart.py "$text" "$output_file" "$voice" 1.0; then
        if [[ -f "$output_file" ]] && [[ -s "$output_file" ]]; then
            file_size=$(du -h "$output_file" | cut -f1)
            echo "✅ SUCCESS - Generated: $output_file ($file_size)"
            pass_count=$((pass_count + 1))
        else
            echo "❌ FAIL - File not generated or empty"
            fail_count=$((fail_count + 1))
        fi
    else
        echo "❌ FAIL - TTS call failed"
        fail_count=$((fail_count + 1))
    fi

    echo ""
    echo ""
done

# 总结
echo "====================================="
echo "Test Summary"
echo "====================================="
echo "Total tests: $test_count"
echo "Passed: $pass_count"
echo "Failed: $fail_count"
echo ""

if [[ $fail_count -eq 0 ]]; then
    echo "🎉 All tests passed!"
    echo ""
    echo "Generated files in: $TEST_DIR/"
    ls -lh "$TEST_DIR/"
    exit 0
else
    echo "⚠️  Some tests failed"
    echo ""
    echo "Check the error messages above for details"
    exit 1
fi
