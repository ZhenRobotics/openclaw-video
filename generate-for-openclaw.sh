#!/bin/bash
# OpenClaw 视频生成包装脚本
# 用法: ./generate-for-openclaw.sh "你的脚本内容"

set -e

cd /home/justin/openclaw-video

# 设置 API Key（使用 OpenAI 官方 API）
export OPENAI_API_KEY="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"
export OPENAI_API_BASE=""  # 使用默认的 OpenAI API

# 检查参数
if [ -z "$1" ]; then
    echo "错误：请提供脚本内容"
    echo "用法: $0 \"你的脚本内容\""
    exit 1
fi

# 运行视频生成
echo "🎬 开始生成视频..."
echo "📝 脚本: $1"
echo ""

./agents/video-cli.sh generate "$1"

# 显示结果
if [ -f out/generated.mp4 ]; then
    echo ""
    echo "✅ 视频生成成功！"
    echo "📹 文件位置: /home/justin/openclaw-video/out/generated.mp4"
    echo "📊 文件大小: $(du -h out/generated.mp4 | cut -f1)"
    echo ""
    echo "查看视频: mpv /home/justin/openclaw-video/out/generated.mp4"
else
    echo ""
    echo "❌ 视频生成失败，请检查错误信息"
    exit 1
fi
