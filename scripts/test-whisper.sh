#!/usr/bin/env bash
# Test Whisper timestamp extraction
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Testing Whisper Timestamp Extraction ==="

# Step 1: Generate test audio using OpenAI TTS
echo "Step 1: Generating test audio..."
test_text="三家巨头同一天说了一件事。微软说Copilot已经能写掉百分之九十的代码。OpenAI说GPT5能替代大部分程序员。Google说Gemini2.0改变游戏规则。但真相是什么？AI不会取代开发者，而是让优秀开发者效率提升十倍。"

curl -sS https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"tts-1\",
    \"input\": \"$test_text\",
    \"voice\": \"nova\",
    \"speed\": 1.15
  }" \
  --output audio/test-audio.mp3

echo "✅ Test audio generated: audio/test-audio.mp3"

# Step 2: Extract timestamps using Whisper
echo ""
echo "Step 2: Extracting timestamps with Whisper..."
./scripts/whisper-timestamps.sh audio/test-audio.mp3

echo ""
echo "✅ Timestamp extraction complete!"
echo "📄 Output: audio/test-audio-timestamps.json"
echo ""
echo "Preview:"
cat audio/test-audio-timestamps.json | python3 -m json.tool 2>/dev/null || cat audio/test-audio-timestamps.json
