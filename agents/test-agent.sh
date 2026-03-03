#!/usr/bin/env bash
# Test video generation agent
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== 测试视频生成 Agent ==="
echo ""

# Compile TypeScript files first
echo "📦 Compiling TypeScript..."
pnpm exec tsc agents/tools.ts --outDir agents/dist --esModuleInterop --skipLibCheck --module commonjs || true
pnpm exec tsc agents/video-agent.ts --outDir agents/dist --esModuleInterop --skipLibCheck --module commonjs || true

echo ""
echo "=== Test 1: Help Request ==="
echo ""
pnpm exec tsx agents/video-agent.ts "帮助"

echo ""
echo ""
echo "=== Test 2: Optimize Script ==="
echo ""
test_script="三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。OpenAI说GPT5能替代大部分程序员。"
pnpm exec tsx agents/video-agent.ts "帮我分析一下这个脚本：$test_script"

echo ""
echo ""
echo "=== Test 3: Generate Video (Using Tools Directly) ==="
echo ""
pnpm exec tsx agents/tools.ts test

echo ""
echo ""
echo "✅ All tests completed!"
echo ""
echo "生成的文件："
ls -lh audio/test-agent* 2>/dev/null || echo "  (音频文件未生成)"
ls -lh out/test-agent* 2>/dev/null || echo "  (视频文件未生成)"
