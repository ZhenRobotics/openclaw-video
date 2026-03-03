#!/usr/bin/env bash
# Test TTS generation
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Testing TTS Generation ===\"
echo ""

# Test 1: Simple TTS generation
echo "Test 1: Generating simple test audio..."
test_text="你好，这是一个测试。AI技术正在改变世界。"

./scripts/tts-generate.sh "$test_text" \
  --out audio/test-tts.mp3 \
  --voice nova \
  --speed 1.0

echo ""
echo "✅ Test audio generated: audio/test-tts.mp3"
echo ""

# Test 2: Different voices
echo "Test 2: Testing different voices..."
voices=("alloy" "echo" "nova")

for voice in "${voices[@]}"; do
  echo "  Generating with voice: $voice"
  ./scripts/tts-generate.sh "这是${voice}声音的测试" \
    --out "audio/test-voice-${voice}.mp3" \
    --voice "$voice" \
    --speed 1.0
done

echo ""
echo "✅ Voice tests complete!"
echo ""

# Show file sizes
echo "Generated files:"
ls -lh audio/test-*.mp3 | awk '{print "  " $9 " - " $5}'
echo ""

echo "Play test audio:"
echo "  mpv audio/test-tts.mp3"
