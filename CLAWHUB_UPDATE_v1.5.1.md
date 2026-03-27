# ClawHub 更新内容 - v1.5.1

**用于**: 手动更新 https://clawhub.ai/ZhenStaff/video-generator

---

## 📋 更新说明（复制到 ClawHub 更新框）

### 中文版本

```markdown
## v1.5.1 - 兼容性和文档改进 (2026-03-17)

### 🐛 Bug 修复
- **修复 Bash 兼容性问题** - 解决 macOS Bash 3.2 和其他 shell 的兼容性问题
- **修复文档路径错误** - 更正仓库路径为 `openclaw-video-generator`

### 📚 文档改进
- **新增安装方式对比表** - 帮助用户选择 npm 全局安装或 Git clone 本地安装
- **新增 macOS 特别说明** - 权限问题解决方案、环境变量配置指南
- **改进错误提示** - 更友好的参数错误和文件路径错误提示

### 🎯 核心改进
- ✅ 跨平台兼容（macOS、Linux、Windows WSL）
- ✅ 更清晰的错误信息
- ✅ 更全面的文档

### 📦 安装
\`\`\`bash
# npm 全局安装
npm install -g openclaw-video-generator

# 或 ClawHub
clawhub install video-generator
\`\`\`

### 🔄 升级
\`\`\`bash
npm update -g openclaw-video-generator
\`\`\`

### 🔗 链接
- **GitHub Release**: https://github.com/ZhenRobotics/openclaw-video-generator/releases/tag/v1.5.1
- **npm**: https://www.npmjs.com/package/openclaw-video-generator
- **文档**: https://github.com/ZhenRobotics/openclaw-video-generator#readme
```

---

### English Version

```markdown
## v1.5.1 - Compatibility & Documentation Improvements (2026-03-17)

### 🐛 Bug Fixes
- **Fix Bash Compatibility** - Resolve compatibility issues with macOS Bash 3.2 and other shells
- **Fix Documentation Paths** - Correct repository path to `openclaw-video-generator`

### 📚 Documentation Improvements
- **Add Installation Method Comparison** - Help users choose between npm global install and git clone
- **Add macOS Special Instructions** - Permission fixes, environment variable guides
- **Improve Error Messages** - More friendly parameter and file path error messages

### 🎯 Core Improvements
- ✅ Cross-platform compatible (macOS, Linux, Windows WSL)
- ✅ Clearer error messages
- ✅ Comprehensive documentation

### 📦 Installation
\`\`\`bash
# npm global install
npm install -g openclaw-video-generator

# or ClawHub
clawhub install video-generator
\`\`\`

### 🔄 Upgrade
\`\`\`bash
npm update -g openclaw-video-generator
\`\`\`

### 🔗 Links
- **GitHub Release**: https://github.com/ZhenRobotics/openclaw-video-generator/releases/tag/v1.5.1
- **npm**: https://www.npmjs.com/package/openclaw-video-generator
- **Documentation**: https://github.com/ZhenRobotics/openclaw-video-generator#readme
```

---

## 🎯 ClawHub 手动更新步骤

### 1. 访问 Skill 页面
```
https://clawhub.ai/ZhenStaff/video-generator
```

### 2. 点击"编辑"按钮

### 3. 上传更新的 SKILL.md
- 文件位置：`openclaw-skill/SKILL.md`
- 确认版本号：`version: ">=1.5.1"`
- 确认 commit：`verified_commit: 75df997`

### 4. 填写更新说明
- 复制上面的"中文版本"或"English Version"
- 粘贴到更新说明框

### 5. 设置版本信息
- **Version Tag**: `v1.5.1`
- **Release Date**: `2026-03-17`
- **Change Type**: `Bug Fix & Improvement`

### 6. 发布更新
- 检查预览
- 点击"发布更新"按钮

---

## ✅ 发布检查清单

- [x] GitHub 代码已推送
- [x] GitHub tag v1.5.1 已创建
- [x] npm 包已发布 (v1.5.1)
- [x] GitHub Release 已创建
- [ ] ClawHub skill 已更新 ← **需要手动操作**

---

## 📝 验证

### npm 验证
```bash
npm view openclaw-video-generator version
# 应显示: 1.5.1
```

### GitHub 验证
```bash
gh release view v1.5.1
# 应显示发布信息
```

### ClawHub 验证
访问: https://clawhub.ai/ZhenStaff/video-generator
应显示 v1.5.1 版本

---

**准备时间**: 2026-03-17
**文件**: openclaw-skill/SKILL.md
**状态**: 等待 ClawHub 手动更新
