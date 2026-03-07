# 🚀 快速发布步骤 - v1.2.0

只需 15 分钟完成 3 个平台的发布！

---

## 1️⃣ GitHub Release (5 分钟)

**打开浏览器，访问:**
```
https://github.com/ZhenRobotics/openclaw-video-generator-generator/releases/new?tag=v1.2.0
```

**填写:**
- **Title:** `v1.2.0 - Background Video Support`
- **Description:** 复制粘贴 `GITHUB_RELEASE_GUIDE.md` 中的 Description 部分
- ✅ 勾选 "Set as the latest release"
- 点击 "Publish release"

✅ **完成！**

---

## 2️⃣ npm 发布 (5 分钟)

**在终端执行:**

```bash
# 1. 登录
npm login

# 2. 检查登录
npm whoami

# 3. 验证包
npm pack --dry-run

# 4. 发布
npm publish

# 5. 验证
npm view openclaw-video-generator version
```

✅ **完成！**

---

## 3️⃣ ClawHub 更新 (5 分钟)

**步骤:**

1. **登录 ClawHub**
   ```
   https://clawhub.ai/login
   ```

2. **找到 Skill**
   - 进入你的工作台
   - 找到 `video-generator` skill
   - 点击 "编辑"

3. **上传 SKILL.md**
   - 选择文件: `openclaw-skill/SKILL.md`
   - 上传

4. **设置版本**
   - Version Tag: `v1.2.0`
   - Release Date: `2026-03-07`

5. **填写更新说明**
   - 参考 `CLAWHUB_UPDATE_v1.2.0.md` 中的 Changelog 部分
   - 复制粘贴到更新说明框

6. **发布**
   - 点击 "发布更新" 按钮

✅ **完成！**

---

## ✅ 验证清单

发布后快速验证:

**GitHub:**
- [ ] 访问 https://github.com/ZhenRobotics/openclaw-video-generator-generator/releases
- [ ] 看到 v1.2.0 标记为 "Latest release"

**npm:**
- [ ] 访问 https://www.npmjs.com/package/openclaw-video-generator
- [ ] 版本显示 1.2.0
- [ ] 或执行: `npm view openclaw-video-generator version`

**ClawHub:**
- [ ] 访问 https://clawhub.ai/ZhenStaff/video-generator
- [ ] 版本显示 v1.2.0
- [ ] 更新说明可见

---

## 🎉 全部完成！

恭喜你成功发布了 v1.2.0！

**测试新功能:**
```bash
npm install -g openclaw-video-generator@1.2.0

openclaw-video-generator help
```

**使用背景视频:**
```bash
./scripts/script-to-video.sh scripts/my-script.txt \
  --bg-video /path/to/background.mp4 \
  --bg-opacity 0.4
```

---

## 📞 遇到问题？

查看详细文档:
- GitHub: `GITHUB_RELEASE_GUIDE.md`
- npm: `NPM_PUBLISH_GUIDE.md`
- ClawHub: `CLAWHUB_UPDATE_v1.2.0.md`
- 完整清单: `RELEASE_CHECKLIST_v1.2.0.md`

---

**祝发布顺利！** 🚀✨
