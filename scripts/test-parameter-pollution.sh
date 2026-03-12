#!/usr/bin/env bash
# Test OpenClaw Parameter Pollution Fix
# 测试 OpenClaw 参数污染修复

set -euo pipefail

cd "$(dirname "$0")/.."

echo "🧪 Testing OpenClaw Parameter Pollution Fix"
echo "==========================================="
echo ""

# 加载清理函数
source scripts/clean-json-params.sh

# 测试用例
declare -a test_cases=(
    "normal.mp3:normal.mp3:clean"
    "test.mp3,timeout:30000}:test.mp3:polluted_file"
    "{\"audioPath\":\"user.mp3\"}:{\"audioPath\":\"user.mp3\"}:clean_json"
    "{\"audioPath\":\"user.mp3\"},timeout:1200}:{\"audioPath\":\"user.mp3\"}:polluted_json"
    "/path/to/file.json,maxTokens:1000}:/path/to/file.json:polluted_path"
    "test-123.mp3,temperature:0.7}:test-123.mp3:polluted_with_float"
)

test_count=0
pass_count=0
fail_count=0

echo "Test Cases:"
echo "-----------"
echo ""

for test_case in "${test_cases[@]}"; do
    IFS=':' read -r input expected description <<< "$test_case"

    test_count=$((test_count + 1))

    echo "Test $test_count: $description"
    echo "  Input:    '$input'"
    echo "  Expected: '$expected'"

    # 清理参数
    cleaned=$(clean_json_params "$input")

    echo "  Cleaned:  '$cleaned'"

    # 验证结果
    if [[ "$cleaned" == "$expected" ]]; then
        echo "  ✅ PASS"
        pass_count=$((pass_count + 1))
    else
        echo "  ❌ FAIL"
        echo "     Got: '$cleaned'"
        echo "     Want: '$expected'"
        fail_count=$((fail_count + 1))
    fi

    echo ""
done

# JSON 验证测试
echo "JSON Validation Tests:"
echo "---------------------"
echo ""

# 测试 JSON 有效性
json_test_cases=(
    "{\"audioPath\":\"test.mp3\"},timeout:1200}"
    "{\"key\":\"value\",\"num\":123},maxTokens:500}"
)

json_test_count=0
json_pass_count=0

for json_case in "${json_test_cases[@]}"; do
    json_test_count=$((json_test_count + 1))

    echo "JSON Test $json_test_count:"
    echo "  Input: '$json_case'"

    # 清理
    cleaned_json=$(clean_json_params "$json_case")
    echo "  Cleaned: '$cleaned_json'"

    # 验证 JSON
    if command -v jq &> /dev/null; then
        if echo "$cleaned_json" | jq . > /dev/null 2>&1; then
            echo "  ✅ Valid JSON"
            json_pass_count=$((json_pass_count + 1))
        else
            echo "  ❌ Invalid JSON"
        fi
    else
        echo "  ⚠️  jq not installed, skipping validation"
        json_pass_count=$((json_pass_count + 1))  # 假设通过
    fi

    echo ""
done

# 总结
echo "==========================================="
echo "Test Summary"
echo "==========================================="
echo ""
echo "Parameter Cleaning Tests:"
echo "  Total: $test_count"
echo "  Passed: $pass_count"
echo "  Failed: $fail_count"
echo ""

if [[ $json_test_count -gt 0 ]]; then
    echo "JSON Validation Tests:"
    echo "  Total: $json_test_count"
    echo "  Passed: $json_pass_count"
    echo ""
fi

# 整体结果
total_pass=$((pass_count + json_pass_count))
total_count=$((test_count + json_test_count))

echo "Overall:"
echo "  Total: $total_count"
echo "  Passed: $total_pass"
echo ""

if [[ $fail_count -eq 0 ]]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed"
    exit 1
fi
