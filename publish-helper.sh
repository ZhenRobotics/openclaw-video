#!/bin/bash

# ClawHub 发布助手
# 由于 CLI 存在 bug，此脚本帮助准备网页上传

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 ClawHub Skill 发布助手 v1.0.2                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件路径
SKILL_FILE="/home/justin/openclaw-video/openclaw-skill/SKILL.md"

# 检查文件
echo "📋 检查 SKILL.md 文件..."
if [ ! -f "$SKILL_FILE" ]; then
    echo -e "${RED}❌ 文件不存在: $SKILL_FILE${NC}"
    exit 1
fi

FILE_SIZE=$(wc -c < "$SKILL_FILE")
FILE_LINES=$(wc -l < "$SKILL_FILE")
echo -e "${GREEN}✅ 文件就绪${NC}"
echo "   📊 大小: $FILE_SIZE bytes"
echo "   📝 行数: $FILE_LINES lines"
echo ""

# 显示发布信息
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 发布信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Slug:${NC}"
echo "video-generator"
echo ""
echo -e "${BLUE}Display name:${NC}"
echo "Video Generator - AI-Powered Video Creation"
echo ""
echo -e "${BLUE}Version:${NC}"
echo "1.0.2"
echo ""
echo -e "${BLUE}Changelog:${NC}"
echo "Switch to full English for international reach - professional documentation, better structure, optimized for global audience"
echo ""
echo -e "${BLUE}Tags:${NC}"
echo "video-generation, remotion, openai, tts, whisper, automation, ai-video, short-video, text-to-video"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 提供选项
echo "选择操作："
echo ""
echo "  1) 📋 复制发布信息到剪贴板"
echo "  2) 📄 复制 SKILL.md 内容到剪贴板"
echo "  3) 🌐 打开 ClawHub 上传页面"
echo "  4) 📚 查看完整上传指南"
echo "  5) ✅ 全部执行（推荐）"
echo "  6) ❌ 退出"
echo ""
read -p "请选择 [1-6]: " choice

case $choice in
    1)
        echo ""
        echo "📋 复制发布信息..."
        cat > /tmp/clawhub-info.txt << 'EOF'
Slug: video-generator
Display name: Video Generator - AI-Powered Video Creation
Version: 1.0.2
Changelog: Switch to full English for international reach - professional documentation, better structure, optimized for global audience
Tags: video-generation, remotion, openai, tts, whisper, automation, ai-video, short-video, text-to-video
EOF
        if command -v xclip &> /dev/null; then
            cat /tmp/clawhub-info.txt | xclip -selection clipboard
            echo -e "${GREEN}✅ 已复制到剪贴板！${NC}"
        else
            echo "发布信息已保存到: /tmp/clawhub-info.txt"
            cat /tmp/clawhub-info.txt
        fi
        ;;
    2)
        echo ""
        echo "📄 复制 SKILL.md 内容..."
        if command -v xclip &> /dev/null; then
            cat "$SKILL_FILE" | xclip -selection clipboard
            echo -e "${GREEN}✅ SKILL.md 已复制到剪贴板！${NC}"
        else
            echo "SKILL.md 位置: $SKILL_FILE"
            echo "请手动复制此文件内容"
        fi
        ;;
    3)
        echo ""
        echo "🌐 打开 ClawHub 上传页面..."
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://clawhub.ai/upload"
        elif command -v open &> /dev/null; then
            open "https://clawhub.ai/upload"
        else
            echo "请手动访问: https://clawhub.ai/upload"
        fi
        echo -e "${GREEN}✅ 浏览器已打开${NC}"
        ;;
    4)
        echo ""
        cat /home/justin/openclaw-video/CLAWHUB-UPLOAD-GUIDE.md
        ;;
    5)
        echo ""
        echo "🚀 执行全部步骤..."
        echo ""

        # 1. 复制发布信息
        echo "1️⃣  复制发布信息..."
        cat > /tmp/clawhub-info.txt << 'EOF'
Slug: video-generator
Display name: Video Generator - AI-Powered Video Creation
Version: 1.0.2
Changelog: Switch to full English for international reach - professional documentation, better structure, optimized for global audience
Tags: video-generation, remotion, openai, tts, whisper, automation, ai-video, short-video, text-to-video
EOF
        if command -v xclip &> /dev/null; then
            cat /tmp/clawhub-info.txt | xclip -selection clipboard
            echo -e "   ${GREEN}✅ 发布信息已复制${NC}"
        else
            echo "   ℹ️  发布信息保存在: /tmp/clawhub-info.txt"
        fi
        echo ""

        # 2. 显示文件位置
        echo "2️⃣  SKILL.md 文件位置:"
        echo "   📁 $SKILL_FILE"
        echo ""

        # 3. 打开浏览器
        echo "3️⃣  打开上传页面..."
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://clawhub.ai/upload"
            echo -e "   ${GREEN}✅ 浏览器已打开${NC}"
        else
            echo "   🌐 请访问: https://clawhub.ai/upload"
        fi
        echo ""

        # 4. 显示下一步
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📝 下一步操作："
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. 在打开的浏览器中登录 ClawHub（如需要）"
        echo "2. 上传文件: $SKILL_FILE"
        echo "3. 粘贴发布信息（已在剪贴板）"
        echo "4. 点击 Publish 按钮"
        echo ""
        echo -e "${GREEN}✨ 预计时间: 3-5 分钟${NC}"
        echo ""
        ;;
    6)
        echo ""
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 更多帮助"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "完整指南: cat /home/justin/openclaw-video/CLAWHUB-UPLOAD-GUIDE.md"
echo "测试报告: cat /home/justin/openclaw-video/TEST-REPORT.md"
echo ""
echo "🔗 ClawHub: https://clawhub.ai/ZhenStaff/video-generator"
echo "🔗 GitHub: https://github.com/ZhenRobotics/openclaw-video"
echo ""
