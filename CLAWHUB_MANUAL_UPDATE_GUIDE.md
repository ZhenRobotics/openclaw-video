# ClawHub 手动更新指南 - v1.6.2

**更新时间**: 2026-03-25
**版本**: v1.6.2
**验证 commit**: 6279034

---

## 🎯 更新步骤

### 1. 访问 ClawHub 平台
```
https://clawhub.ai/ZhenStaff/video-generator
```

### 2. 点击"更新 Skill"或"编辑"按钮

### 3. 上传文件
**上传文件**: `openclaw-skill/SKILL.md`

**重要检查项**:
- ✅ version: ">=1.6.2"
- ✅ verified_commit: "6279034"
- ✅ 新增 v1.6.2 版本历史

### 4. 版本更新说明（复制到 ClawHub）

```markdown
## v1.6.2 新功能

### 核心更新
1. **中文 TTS 集成**
   - 完整支持阿里云 TTS（63.4秒完整音频）
   - 智能分段处理长文本
   - 自动合并音频片段

2. **背景视频可见性修复**
   - 透明背景 + 半透明遮罩
   - 背景视频完全可见
   - 保持文字可读性

3. **两种字幕样式**
   - 方案A：纯文字阴影（简洁高级，适合商务）
   - 方案B：半透明背景框（可读性最强，适合教学）
   - 提供快速切换脚本

### 技术改进
- 增强双层文字阴影系统
- 优化 Authority premium 样式
- 完整的安全审计通过

### 使用示例
生成带中文配音的医疗科普视频：
```bash
# 使用脑卒中康复案例
./scripts/script-to-video.sh scripts/stroke-recovery-full.txt

# 切换字幕样式
./scripts/switch-style.sh text-shadow    # 纯文字阴影
./scripts/switch-style.sh background-box # 背景框
npm run build
```

### 兼容性
- ✅ 向后兼容 v1.6.0/v1.6.1
- ✅ 所有旧功能正常工作
- ✅ 新功能可选使用
```

---

## 📋 验证清单

上传前确认：
- [ ] SKILL.md 文件已更新到最新版本
- [ ] verified_commit 为 6279034
- [ ] version 为 ">=1.6.2"
- [ ] 版本历史包含 v1.6.2 记录
- [ ] 安全审计状态：PASSED

上传后确认：
- [ ] ClawHub 显示版本为 v1.6.2
- [ ] verified_commit 显示正确
- [ ] 新功能说明已添加
- [ ] 示例代码可正常运行

---

## 🔗 相关链接

- **GitHub**: https://github.com/ZhenRobotics/openclaw-video-generator
- **npm**: https://www.npmjs.com/package/openclaw-video-generator
- **GitHub Release**: https://github.com/ZhenRobotics/openclaw-video-generator/releases/tag/v1.6.2
- **ClawHub**: https://clawhub.ai/ZhenStaff/video-generator

---

## 📊 发布状态

- [x] Git commit & tag: **6279034** / v1.6.2
- [x] npm publish: **openclaw-video-generator@1.6.2**
- [x] GitHub Release: **v1.6.2**
- [ ] ClawHub update: **待手动完成**

---

## 🎉 完成后

更新完成后，用户可以通过以下方式安装：

```bash
# 方式 1: npm 全局安装
npm install -g openclaw-video-generator@1.6.2

# 方式 2: ClawHub 技能安装
clawhub install ZhenStaff/video-generator
```

---

**注意事项**:
- ClawHub 平台需要手动上传 SKILL.md
- 确保 verified_commit 与实际代码一致
- 建议在更新说明中包含使用示例
- 上传后测试安装命令是否正常工作
