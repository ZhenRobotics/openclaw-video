#!/usr/bin/env bash
# Provider Utils - Common functions for all providers

# Load environment variables
load_env() {
  if [[ -f .env ]]; then
    set -a
    source .env
    set +a
  fi
}

# Get provider list for a service (tts or asr)
# Usage: get_providers "tts" or get_providers "asr"
get_providers() {
  local service="$1"
  local var_name="${service^^}_PROVIDERS"
  local providers="${!var_name:-}"

  if [[ -z "$providers" ]]; then
    # Default fallback order
    providers="openai,azure,aliyun,tencent"
  fi

  echo "$providers"
}

# Check if provider is configured
# Usage: is_provider_configured "openai" "tts"
is_provider_configured() {
  local provider="$1"
  local service="$2"

  case "$provider" in
    openai)
      [[ -n "${OPENAI_API_KEY:-}" ]]
      ;;
    azure)
      [[ -n "${AZURE_SPEECH_KEY:-}" && -n "${AZURE_SPEECH_REGION:-}" ]]
      ;;
    aliyun)
      [[ -n "${ALIYUN_ACCESS_KEY_ID:-}" && -n "${ALIYUN_ACCESS_KEY_SECRET:-}" ]]
      ;;
    tencent)
      [[ -n "${TENCENT_SECRET_ID:-}" && -n "${TENCENT_SECRET_KEY:-}" ]]
      ;;
    *)
      return 1
      ;;
  esac
}

# Try providers in order with automatic fallback
# Usage: try_providers "tts" command args...
try_providers() {
  local service="$1"
  shift
  local providers=$(get_providers "$service")

  IFS=',' read -ra PROVIDER_ARRAY <<< "$providers"

  for provider in "${PROVIDER_ARRAY[@]}"; do
    provider=$(echo "$provider" | xargs)  # trim whitespace

    if ! is_provider_configured "$provider" "$service"; then
      echo "⚠️  Provider '$provider' not configured, skipping..." >&2
      continue
    fi

    echo "🔄 Trying provider: $provider" >&2

    local provider_script="scripts/providers/${service}/${provider}.sh"
    if [[ -f "$provider_script" ]]; then
      if bash "$provider_script" "$@"; then
        echo "✅ Success with provider: $provider" >&2
        return 0
      else
        echo "❌ Provider '$provider' failed, trying next..." >&2
      fi
    else
      echo "⚠️  Provider script not found: $provider_script" >&2
    fi
  done

  echo "❌ All providers failed for service: $service" >&2
  return 1
}

# Log with timestamp
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

# Error log
error() {
  echo "[ERROR] $*" >&2
}

# Success log
success() {
  echo "[SUCCESS] $*" >&2
}
