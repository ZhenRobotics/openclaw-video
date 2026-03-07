# npm 发布指南 - v1.2.0

## 📦 准备工作

### ✅ 已完成
- 版本号更新: 1.1.0 → 1.2.0
- package.json 仓库 URL 已更新
- .npmignore 已配置

### 📊 包大小信息

当前包大小: **820.2 KB** (解压后 1.2 MB)

**包含的测试文件:**
- `public/example-script.mp3` (377.8 KB)
- `public/generated.mp3` (380.6 KB)
- `public/test-background.mp4` (279.3 KB)

**建议**: 这些是示例文件，可以保留作为用户参考，或删除以减小包大小到约 ~60 KB。

---

## 🚀 发布步骤

### 步骤 1: 登录 npm

```bash
npm login
```

系统会提示输入：
- **Username:** （你的 npm 用户名）
- **Password:** （你的 npm 密码）
- **Email:** （你的邮箱，必须是已验证的）
- **OTP:** （如果启用了两步验证）

### 步骤 2: 验证登录状态

```bash
npm whoami
```

应该显示你的 npm 用户名。

### 步骤 3: 最终检查

```bash
# 查看将要发布的文件
npm pack --dry-run

# 查看包信息
npm view openclaw-video-generator version  # 查看当前发布的版本
```

### 步骤 4: 发布

```bash
# 发布到 npm
npm publish

# 如果包名已被占用，可以使用 scope
# npm publish --access public
```

### 步骤 5: 验证发布

```bash
# 查看最新版本
npm view openclaw-video-generator version

# 查看完整信息
npm info openclaw-video-generator

# 测试安装
npm install -g openclaw-video-generator@1.2.0
```

---

## 🔧 可选：减小包大小

如果你想减小包大小，可以在发布前删除测试文件：

```bash
# 删除测试文件（可选）
rm -f public/example-script.mp3
rm -f public/generated.mp3
rm -f public/test-background.mp4
rm -f scripts/tmp-script.txt
rm -f scripts/pseudo-timestamps.js

# 然后再次检查
npm pack --dry-run

# 发布
npm publish
```

**注意**: 删除后需要 git 处理这些更改（可以添加到 .gitignore）。

---

## 📝 发布后检查清单

- [ ] npm 发布成功
- [ ] 版本号正确: `npm view openclaw-video-generator version` 显示 1.2.0
- [ ] npm 包页面更新: https://www.npmjs.com/package/openclaw-video-generator
- [ ] README 在 npm 页面正确显示
- [ ] 关键词和描述正确
- [ ] 安装测试: `npm install -g openclaw-video-generator@1.2.0`
- [ ] CLI 工具可用: `openclaw-video-generator help`

---

## 🐛 常见问题

### 问题 1: 401 Unauthorized

**解决方案:**
```bash
npm logout
npm login
```

### 问题 2: 包名已存在

**解决方案:**
- 如果你是包的所有者，直接发布会更新版本
- 如果不是，需要使用不同的包名或添加 scope: `@your-scope/openclaw-video-generator`

### 问题 3: 版本号冲突

**解决方案:**
```bash
# 查看已发布的版本
npm view openclaw-video-generator versions

# 如果 1.2.0 已存在，需要递增版本号
npm version patch  # 1.2.0 → 1.2.1
# 或
npm version minor  # 1.2.0 → 1.3.0
```

### 问题 4: 邮箱未验证

**解决方案:**
1. 访问 https://www.npmjs.com/settings/profile
2. 验证邮箱
3. 重新尝试发布

---

## 📊 发布信息

**包名:** openclaw-video-generator
**版本:** 1.2.0
**仓库:** https://github.com/ZhenRobotics/openclaw-video-generator-generator
**npm 页面:** https://www.npmjs.com/package/openclaw-video-generator

---

## 🔗 相关命令

```bash
# 查看当前版本
npm version

# 更新版本号
npm version patch   # 1.2.0 → 1.2.1
npm version minor   # 1.2.0 → 1.3.0
npm version major   # 1.2.0 → 2.0.0

# 取消发布（24小时内）
npm unpublish openclaw-video-generator@1.2.0

# 废弃某个版本
npm deprecate openclaw-video-generator@1.2.0 "message"

# 查看下载统计
npm view openclaw-video-generator
```

---

## 📦 package.json 重要字段

当前配置:
- **name**: openclaw-video-generator
- **version**: 1.2.0
- **description**: Automated video generation pipeline...
- **main**: src/index.ts
- **bin**: ./agents/video-cli.sh
- **keywords**: video-generation, remotion, openai, tts, whisper, automation...
- **license**: MIT
- **repository**: https://github.com/ZhenRobotics/openclaw-video-generator-generator.git

---

## ✅ 成功发布后

发布成功后，用户可以通过以下方式安装:

```bash
# 全局安装
npm install -g openclaw-video-generator

# 项目中安装
npm install openclaw-video-generator

# 使用特定版本
npm install openclaw-video-generator@1.2.0
```

**验证安装:**
```bash
openclaw-video-generator help
```

---

**准备就绪，随时可以发布！** 🚀

如需帮助，访问: https://docs.npmjs.com/cli/publish
