#!/usr/bin/env bash
# Company Secretary CLI
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

usage() {
  cat <<'EOF'
Company Secretary - AI 董事会秘书助手

用法:
  company-secretary <command> [options]

核心命令:
  meeting      会议管理
  minutes      纪要生成
  resolution   决议管理
  action       行动项管理
  video        视频汇报生成
  dashboard    查看工作台

示例:
  # 创建会议
  company-secretary meeting create \
    --date "2026-03-15" \
    --type "regular" \
    --title "第一季度董事会"

  # 生成纪要
  company-secretary minutes generate \
    --meeting-id "2026-Q1-01"

  # 创建决议
  company-secretary resolution create \
    --meeting-id "2026-Q1-01" \
    --title "批准财务报告" \
    --voting "8:0:0"

  # 查看我的行动项
  company-secretary action list \
    --assignee "CEO" \
    --status pending

  # 生成汇报视频
  company-secretary video generate \
    --type investor-update \
    --script "Q1业绩超预期..."

获取帮助:
  company-secretary <command> --help

EOF
  exit 0
}

# 检查依赖
check_dependencies() {
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required but not installed.${NC}"
    exit 1
  fi

  if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$PROJECT_ROOT" && npm install
  fi
}

# 主逻辑
main() {
  if [ $# -eq 0 ] || [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    usage
  fi

  check_dependencies

  local command="$1"
  shift

  case "$command" in
    meeting)
      node -r ts-node/register "$SCRIPT_DIR/commands/meeting.ts" "$@"
      ;;
    minutes)
      node -r ts-node/register "$SCRIPT_DIR/commands/minutes.ts" "$@"
      ;;
    resolution)
      node -r ts-node/register "$SCRIPT_DIR/commands/resolution.ts" "$@"
      ;;
    action)
      node -r ts-node/register "$SCRIPT_DIR/commands/action.ts" "$@"
      ;;
    video)
      node -r ts-node/register "$SCRIPT_DIR/commands/video.ts" "$@"
      ;;
    dashboard)
      node -r ts-node/register "$SCRIPT_DIR/commands/dashboard.ts" "$@"
      ;;
    *)
      echo -e "${RED}Unknown command: $command${NC}"
      echo "Run 'company-secretary --help' for usage."
      exit 1
      ;;
  esac
}

main "$@"
