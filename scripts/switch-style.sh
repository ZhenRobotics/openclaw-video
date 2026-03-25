#!/usr/bin/env bash
# 切换字幕样式：纯文字阴影 vs 带背景框

set -e

cd "$(dirname "$0")/.."

STYLE="${1:-}"

usage() {
  cat <<EOF
切换字幕显示样式

用法:
  ./scripts/switch-style.sh <样式>

可用样式:
  text-shadow     纯文字阴影（简洁优雅，商务感强）
  background-box  半透明背景框（可读性最强，类似字幕条）

示例:
  ./scripts/switch-style.sh text-shadow
  ./scripts/switch-style.sh background-box

当前样式文件:
  - src/premium-scenes-text-shadow.tsx    (方案A: 纯文字阴影)
  - src/premium-scenes.tsx                (方案B: 带背景框)

EOF
  exit 1
}

if [[ -z "$STYLE" ]]; then
  usage
fi

case "$STYLE" in
  text-shadow)
    echo "✅ 切换到：纯文字阴影样式"
    cp src/premium-scenes-text-shadow.tsx src/premium-scenes.tsx
    echo "   - 简洁优雅"
    echo "   - 商务感强"
    echo "   - 不遮挡背景视频"
    ;;
  background-box|bg|box)
    echo "✅ 切换到：半透明背景框样式"
    # 当前 src/premium-scenes.tsx 就是背景框版本
    # 如果之前切换过，需要恢复
    if grep -q "backgroundColor: 'rgba(0, 0, 0, 0.6)'" src/premium-scenes.tsx; then
      echo "   - 已经是背景框样式"
    else
      echo "   ⚠️  需要手动恢复背景框版本"
      echo "   提示：重新运行 npm run build 会使用当前版本"
    fi
    echo "   - 可读性最强"
    echo "   - 100%清晰"
    echo "   - 会遮挡部分背景"
    ;;
  *)
    echo "❌ 未知样式: $STYLE"
    usage
    ;;
esac

echo ""
echo "💡 提示："
echo "   1. 运行 npm run build 重新生成视频"
echo "   2. 比较 out/Main.mp4 的效果"
echo ""
