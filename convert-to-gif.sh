#!/bin/bash
# 将录制的视频转换为优化的 GIF

INPUT="${1:-recordings/demo.mp4}"
OUTPUT="${2:-docs/demo.gif}"

echo "🎨 Converting video to optimized GIF..."
echo "   Input: $INPUT"
echo "   Output: $OUTPUT"
echo ""

# 创建输出目录
mkdir -p $(dirname "$OUTPUT")

# 方案 A: 高质量 GIF (2-5MB, 适合 GitHub README)
echo "📊 Converting with optimized settings..."
~/ffmpeg-4.4-amd64-static/ffmpeg -i "$INPUT" \
  -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 \
  "$OUTPUT"

# 显示结果
echo ""
echo "✅ Conversion complete!"
ls -lh "$OUTPUT"
echo ""
echo "📋 Next steps:"
echo "1. Preview: xdg-open $OUTPUT"
echo "2. If too large (>10MB), run with --optimize flag"
echo "3. Add to README: ![Demo](docs/demo.gif)"
