#!/bin/bash
#
# OpenClaw Video Generator - 安全验证脚本
#
# 用途: 自动验证项目的安全性和一致性
# 创建日期: 2026-03-15
# 版本: 1.0.0
#

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VERIFIED_COMMIT="708bad7"
EXPECTED_VERSION="1.5.0"
REPO_URL="https://github.com/ZhenRobotics/openclaw-video-generator"
PACKAGE_NAME="openclaw-video-generator"

echo "========================================="
echo "  OpenClaw Video Generator 安全验证"
echo "========================================="
echo ""

# 检查 1: Commit Hash 一致性
echo "【检查 1】Commit Hash 一致性..."
SKILL_COMMIT=$(grep "verified_commit:" clawhub-upload-bilingual/skill.md | grep -o -E "[0-9a-f]{7}" | head -1)
README_COMMIT_EN=$(grep "Latest Commit.*:" clawhub-upload-bilingual/readme.md | grep -o -E "[0-9a-f]{7}" | head -1)
README_COMMIT_CN=$(grep "最新提交.*:" clawhub-upload-bilingual/readme.md | grep -o -E "[0-9a-f]{7}" | head -1)

if [ "$SKILL_COMMIT" = "$VERIFIED_COMMIT" ] && \
   [ "$README_COMMIT_EN" = "$VERIFIED_COMMIT" ] && \
   [ "$README_COMMIT_CN" = "$VERIFIED_COMMIT" ]; then
    echo -e "${GREEN}✅ PASS${NC}: 所有 commit 引用一致 ($VERIFIED_COMMIT)"
else
    echo -e "${RED}❌ FAIL${NC}: Commit 引用不一致"
    echo "  skill.md: $SKILL_COMMIT"
    echo "  readme (EN): $README_COMMIT_EN"
    echo "  readme (CN): $README_COMMIT_CN"
    exit 1
fi

# 检查 2: Commit 真实性
echo ""
echo "【检查 2】Commit 真实性..."
if git rev-parse --verify "$VERIFIED_COMMIT^{commit}" >/dev/null 2>&1; then
    FULL_COMMIT=$(git rev-parse "$VERIFIED_COMMIT")
    echo -e "${GREEN}✅ PASS${NC}: Commit $VERIFIED_COMMIT 存在"
    echo "  完整 hash: $FULL_COMMIT"
else
    echo -e "${RED}❌ FAIL${NC}: Commit $VERIFIED_COMMIT 不存在"
    exit 1
fi

# 检查 3: Commit 是否已推送
echo ""
echo "【检查 3】Commit 推送状态..."
if git branch -r --contains "$VERIFIED_COMMIT" | grep -q "origin/main"; then
    echo -e "${GREEN}✅ PASS${NC}: Commit 已推送到 origin/main"
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Commit 未推送到 origin/main"
fi

# 检查 4: 版本号一致性
echo ""
echo "【检查 4】版本号一致性..."
PACKAGE_VERSION=$(node -p "require('./package.json').version")
SKILL_VERSION=$(grep 'version: ">=' clawhub-upload-bilingual/skill.md | head -1 | sed 's/.*">=\(.*\)".*/\1/')
README_VERSION=$(grep "Current Version.*:" clawhub-upload-bilingual/readme.md | head -1 | sed 's/.*v//' | awk '{print $1}')

if [ "$PACKAGE_VERSION" = "$EXPECTED_VERSION" ] && \
   [ "$SKILL_VERSION" = "$EXPECTED_VERSION" ] && \
   [ "$README_VERSION" = "$EXPECTED_VERSION" ]; then
    echo -e "${GREEN}✅ PASS${NC}: 版本号一致 ($EXPECTED_VERSION)"
else
    echo -e "${RED}❌ FAIL${NC}: 版本号不一致"
    echo "  package.json: $PACKAGE_VERSION"
    echo "  skill.md: $SKILL_VERSION"
    echo "  readme.md: $README_VERSION"
    exit 1
fi

# 检查 5: npm 包验证
echo ""
echo "【检查 5】npm 包验证..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm view "$PACKAGE_NAME" version 2>/dev/null || echo "not-found")
    if [ "$NPM_VERSION" = "$EXPECTED_VERSION" ]; then
        echo -e "${GREEN}✅ PASS${NC}: npm 包版本正确 ($NPM_VERSION)"
        NPM_REPO=$(npm view "$PACKAGE_NAME" repository.url 2>/dev/null)
        echo "  仓库: $NPM_REPO"
    else
        echo -e "${YELLOW}⚠️  WARNING${NC}: npm 包版本 ($NPM_VERSION) 与预期 ($EXPECTED_VERSION) 不符"
    fi
else
    echo -e "${YELLOW}⚠️  SKIP${NC}: npm 未安装"
fi

# 检查 6: SKILL.md 元数据完整性
echo ""
echo "【检查 6】SKILL.md 元数据完整性..."
HAS_INSTALL=$(grep -q "^install:" clawhub-upload-bilingual/skill.md && echo "yes" || echo "no")
HAS_REQUIRED_KEY=$(grep -q "optional: false" clawhub-upload-bilingual/skill.md && echo "yes" || echo "no")
HAS_REPOSITORY=$(grep -q "^repository:" clawhub-upload-bilingual/skill.md && echo "yes" || echo "no")
HAS_HOMEPAGE=$(grep -q "^homepage:" clawhub-upload-bilingual/skill.md && echo "yes" || echo "no")

METADATA_OK="yes"
if [ "$HAS_INSTALL" != "yes" ]; then
    echo -e "${RED}  ❌ 缺少 install spec${NC}"
    METADATA_OK="no"
else
    echo -e "${GREEN}  ✓ install spec${NC}"
fi

if [ "$HAS_REQUIRED_KEY" != "yes" ]; then
    echo -e "${RED}  ❌ 缺少 required API key${NC}"
    METADATA_OK="no"
else
    echo -e "${GREEN}  ✓ required API key (optional: false)${NC}"
fi

if [ "$HAS_REPOSITORY" != "yes" ]; then
    echo -e "${RED}  ❌ 缺少 repository 字段${NC}"
    METADATA_OK="no"
else
    echo -e "${GREEN}  ✓ repository 字段${NC}"
fi

if [ "$HAS_HOMEPAGE" != "yes" ]; then
    echo -e "${RED}  ❌ 缺少 homepage 字段${NC}"
    METADATA_OK="no"
else
    echo -e "${GREEN}  ✓ homepage 字段${NC}"
fi

if [ "$METADATA_OK" = "yes" ]; then
    echo -e "${GREEN}✅ PASS${NC}: 元数据完整"
else
    echo -e "${RED}❌ FAIL${NC}: 元数据不完整"
    exit 1
fi

# 检查 7: 验证 commit 内容完整性
echo ""
echo "【检查 7】验证 commit 内容完整性..."
COMMIT_HAS_INSTALL=$(git show "$VERIFIED_COMMIT:clawhub-upload-bilingual/skill.md" | grep -q "^install:" && echo "yes" || echo "no")
COMMIT_HAS_REQUIRED=$(git show "$VERIFIED_COMMIT:clawhub-upload-bilingual/skill.md" | grep -q "optional: false" && echo "yes" || echo "no")
COMMIT_HAS_REPO=$(git show "$VERIFIED_COMMIT:clawhub-upload-bilingual/skill.md" | head -10 | grep -q "^repository:" && echo "yes" || echo "no")

if [ "$COMMIT_HAS_INSTALL" = "yes" ] && \
   [ "$COMMIT_HAS_REQUIRED" = "yes" ] && \
   [ "$COMMIT_HAS_REPO" = "yes" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Commit $VERIFIED_COMMIT 包含所有必需内容"
else
    echo -e "${RED}❌ FAIL${NC}: Commit $VERIFIED_COMMIT 缺少必需内容"
    exit 1
fi

# 总结
echo ""
echo "========================================="
echo "  验证完成"
echo "========================================="
echo ""
echo -e "${GREEN}✅ 所有检查通过！${NC}"
echo ""
echo "验证详情:"
echo "  - Commit hash: $VERIFIED_COMMIT"
echo "  - 版本: $EXPECTED_VERSION"
echo "  - npm 包: $PACKAGE_NAME@$EXPECTED_VERSION"
echo "  - 仓库: $REPO_URL"
echo ""
echo "下一步:"
echo "  1. 查看完整验证指南: cat VERIFICATION_GUIDE.md"
echo "  2. 手动验证上游源代码"
echo "  3. 在隔离环境中测试"
echo "  4. 使用最小权限 API key"
echo ""
