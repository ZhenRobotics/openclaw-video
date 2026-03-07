# 手动 npm 发布步骤 - v1.2.0

由于 npm 登录需要交互式操作，请按以下步骤手动执行：

---

## 📦 简单 3 步完成发布

### 步骤 1: 打开终端，进入项目目录

```bash
cd ~/openclaw-video-generator-generator
```

### 步骤 2: 登录 npm

```bash
npm login
```

**现代 npm 会打开浏览器登录：**
- 浏览器会自动打开一个登录页面
- 在浏览器中输入你的 npm 用户名和密码
- 如果有两步验证，输入验证码
- 点击授权按钮
- 看到"Success"后关闭浏览器
- 返回终端，应该显示"Logged in as [你的用户名]"

**或者使用旧版本命令行登录：**
- 输入 Username (用户名)
- 输入 Password (密码)
- 输入 Email (邮箱)
- 如果启用了 2FA，输入 OTP (验证码)

### 步骤 3: 发布到 npm

```bash
npm publish
```

等待发布完成，应该看到类似这样的输出：
```
npm notice
npm notice 📦  openclaw-video-generator@1.2.0
npm notice === Tarball Details ===
npm notice name:          openclaw-video-generator
npm notice version:       1.2.0
npm notice filename:      openclaw-video-generator-1.2.0.tgz
npm notice package size:  820.2 kB
npm notice unpacked size: 1.2 MB
npm notice total files:   40
npm notice
+ openclaw-video-generator@1.2.0
```

---

## ✅ 验证发布成功

### 方法 1: 使用命令行

```bash
# 查看版本
npm view openclaw-video-generator version

# 应该显示: 1.2.0

# 查看详细信息
npm info openclaw-video-generator
```

### 方法 2: 访问网页

打开浏览器访问：
```
https://www.npmjs.com/package/openclaw-video-generator
```

应该看到版本号显示为 **1.2.0**

---

## 🧪 测试安装

```bash
# 全局安装
npm install -g openclaw-video-generator@1.2.0

# 测试 CLI
openclaw-video-generator help

# 应该显示帮助信息
```

---

## ⚠️ 如果遇到问题

### 问题 1: 登录失败 - "401 Unauthorized"

**解决方案:**
```bash
npm logout
npm login
```

### 问题 2: 邮箱未验证

**解决方案:**
1. 访问: https://www.npmjs.com/settings/profile
2. 验证你的邮箱地址
3. 重新尝试发布

### 问题 3: 权限错误 - "403 Forbidden"

**原因:** 你不是包的所有者

**解决方案:**
- 确认你是包 `openclaw-video-generator` 的所有者
- 或者使用不同的包名

### 问题 4: 版本已存在

**错误信息:** "Cannot publish over existing version"

**解决方案:**
```bash
# 递增版本号
npm version patch  # 1.2.0 → 1.2.1

# 重新发布
npm publish
```

---

## 📊 发布后的检查清单

完成发布后，确认：

- [ ] npm view openclaw-video-generator version 显示 1.2.0
- [ ] https://www.npmjs.com/package/openclaw-video-generator 更新
- [ ] npm install -g openclaw-video-generator@1.2.0 可以安装
- [ ] openclaw-video-generator help 正常工作

---

## 🎯 下一步

npm 发布成功后，继续完成：

### 1. GitHub Release

访问: https://github.com/ZhenRobotics/openclaw-video-generator-generator/releases/new?tag=v1.2.0

参考文档: `GITHUB_RELEASE_GUIDE.md`

### 2. ClawHub 更新

访问: https://clawhub.ai/ZhenStaff/video-generator

上传文件: `openclaw-skill/SKILL.md`

参考文档: `CLAWHUB_UPDATE_v1.2.0.md`

---

## 💡 提示

**一次性执行:**

如果你确认一切正常，可以一次性执行：

```bash
cd ~/openclaw-video-generator-generator
npm login && npm publish && npm view openclaw-video-generator version
```

这会：
1. 登录 npm
2. 发布包
3. 验证版本

---

**准备好了吗？现在就在终端执行：**

```bash
cd ~/openclaw-video-generator-generator
npm login
npm publish
```

祝发布顺利！🚀✨
