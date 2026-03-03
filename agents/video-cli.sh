#!/usr/bin/env bash
# Simple CLI wrapper for video generation agent
set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'EOF'
视频生成 Agent CLI

用法:
  video-cli.sh <命令> [参数]

命令:
  generate <脚本>              生成视频
  optimize <脚本>              优化脚本
  help                         显示帮助

示例:
  video-cli.sh generate "三家巨头同一天说了一件事..."
  video-cli.sh optimize "这是我的脚本内容"
  video-cli.sh help

选项:
  --voice <voice>              TTS 声音 (alloy/nova/echo等)
  --speed <speed>              TTS 语速 (0.25-4.0)
  --output <name>              输出文件名

完整示例:
  video-cli.sh generate "AI改变世界" --voice nova --speed 1.2 --output my-video

EOF
  exit 0
}

if [[ $# -eq 0 ]] || [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
  usage
fi

command="$1"
shift

case "$command" in
  generate)
    if [[ $# -eq 0 ]]; then
      echo "错误：缺少脚本内容" >&2
      usage
    fi
    script="$1"
    shift
    pnpm exec tsx agents/video-agent.ts "生成视频：$script" "$@"
    ;;

  optimize)
    if [[ $# -eq 0 ]]; then
      echo "错误：缺少脚本内容" >&2
      usage
    fi
    script="$1"
    shift
    pnpm exec tsx agents/video-agent.ts "优化脚本：$script" "$@"
    ;;

  help)
    pnpm exec tsx agents/video-agent.ts "帮助"
    ;;

  *)
    echo "错误：未知命令 '$command'" >&2
    usage
    ;;
esac
