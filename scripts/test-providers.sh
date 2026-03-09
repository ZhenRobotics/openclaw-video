#!/usr/bin/env bash
# Test multi-provider setup

set -euo pipefail

cd "$(dirname "$0")/.."

source scripts/providers/utils.sh
load_env

echo "=== Testing Multi-Provider Setup ==="
echo ""

# Test TTS providers
echo "📢 TTS Providers:"
tts_providers=$(get_providers "tts")
echo "  Priority: $tts_providers"
echo ""

IFS=',' read -ra TTS_ARRAY <<< "$tts_providers"
for provider in "${TTS_ARRAY[@]}"; do
  provider=$(echo "$provider" | xargs)
  if is_provider_configured "$provider" "tts"; then
    echo "  ✅ $provider - Configured"
  else
    echo "  ❌ $provider - Not configured"
  fi
done

echo ""

# Test ASR providers
echo "🎤 ASR Providers:"
asr_providers=$(get_providers "asr")
echo "  Priority: $asr_providers"
echo ""

IFS=',' read -ra ASR_ARRAY <<< "$asr_providers"
for provider in "${ASR_ARRAY[@]}"; do
  provider=$(echo "$provider" | xargs)
  if is_provider_configured "$provider" "asr"; then
    echo "  ✅ $provider - Configured"
  else
    echo "  ❌ $provider - Not configured"
  fi
done

echo ""
echo "=== Configuration Summary ==="
echo ""

# Show configured providers
configured_tts=()
for provider in "${TTS_ARRAY[@]}"; do
  provider=$(echo "$provider" | xargs)
  if is_provider_configured "$provider" "tts"; then
    configured_tts+=("$provider")
  fi
done

configured_asr=()
for provider in "${ASR_ARRAY[@]}"; do
  provider=$(echo "$provider" | xargs)
  if is_provider_configured "$provider" "asr"; then
    configured_asr+=("$provider")
  fi
done

if [ ${#configured_tts[@]} -eq 0 ]; then
  echo "⚠️  WARNING: No TTS provider configured!"
  echo "   Please configure at least one provider in .env"
else
  echo "✅ TTS: ${#configured_tts[@]} provider(s) configured (${configured_tts[*]})"
fi

if [ ${#configured_asr[@]} -eq 0 ]; then
  echo "⚠️  WARNING: No ASR provider configured!"
  echo "   Please configure at least one provider in .env"
else
  echo "✅ ASR: ${#configured_asr[@]} provider(s) configured (${configured_asr[*]})"
fi

echo ""

# Check for .env file
if [[ ! -f .env ]]; then
  echo "❌ ERROR: .env file not found"
  echo "   Run: cp .env.example .env"
  echo "   Then configure your API keys"
  exit 1
fi

echo "💡 Tip: Run './scripts/script-to-video.sh test.txt' to test video generation"
echo "   Or check MULTI_PROVIDER_SETUP.md for detailed configuration guide"
