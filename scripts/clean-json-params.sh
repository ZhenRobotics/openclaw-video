#!/usr/bin/env bash
# Clean JSON parameters from OpenClaw executor pollution
# 清理 OpenClaw 执行器污染的 JSON 参数

# Usage: clean_json_params <json_string>
# Returns: Cleaned JSON string

clean_json_params() {
    local input="$1"

    # Remove trailing metadata patterns like ",timeout:1200}", ",maxTokens:500}" etc.
    # Pattern: ,<key>:<value>} at the end
    local cleaned
    cleaned=$(echo "$input" | sed -E 's/,\s*(timeout|maxTokens|temperature|metadata)[:\s]*[^}]*}?\s*$//')

    # Remove trailing commas and braces
    cleaned=$(echo "$cleaned" | sed -E 's/[,}]\s*$//')

    # If no closing brace, add one
    if [[ ! "$cleaned" =~ }$ ]]; then
        cleaned="${cleaned}}"
    fi

    echo "$cleaned"
}

# If called directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -eq 0 ]]; then
        echo "Usage: clean-json-params.sh <json_string>"
        echo ""
        echo "Examples:"
        echo "  clean-json-params.sh '{\"key\":\"value\"},timeout:1200}'"
        echo "  # Output: {\"key\":\"value\"}"
        exit 1
    fi

    clean_json_params "$1"
fi
