# ClawHub Security Audit Report - openclaw-video-generator v1.6.2

**Audit Date**: 2026-03-25
**Project**: openclaw-video-generator
**Current Version**: v1.6.1 → v1.6.2 (准备中)
**Auditor**: ClawHub Security Analyst
**Confidence Level**: 95%

---

## 执行摘要

**整体状态**: ✓ Safe with considerations - 通过安全审计

该 Skill 是一个真实的、经过验证的开源项目，与其声明的功能完全一致：从文本脚本生成专业视频的本地工具。所有核心功能（视频渲染、场景检测、文件管理）均在本地执行，仅 TTS/ASR 服务需要调用外部 API。

**关键发现**:
- ✅ 无恶意代码
- ✅ 无隐藏 Unicode 字符
- ✅ 无未声明的外部依赖
- ✅ API 密钥管理符合最佳实践
- ⚠️ 需要用户注意多厂商 API 密钥配置
- ℹ️ git clone 指令已明确声明且指向官方仓库

---

## 安全维度分析

### ✓ Purpose & Capability (目的与能力)

**风险等级**: SAFE

**发现**:
1. ✅ 声明功能与实际代码完全一致
   - 文档声称: "Automated text-to-video pipeline"
   - 实际实现: Remotion 视频渲染框架 + OpenAI/阿里云/Azure/腾讯云 TTS/ASR

2. ✅ package.json 与 SKILL.md 版本一致性
   - package.json: v1.6.0
   - SKILL.md metadata: `version: ">=1.6.0"`
   - 需更新到 v1.6.2

3. ✅ 所有引用文件均存在于代码库中
   - `agents/video-cli.sh` ✓
   - `scripts/script-to-video.sh` ✓
   - `src/CyberWireframe.tsx` ✓
   - 无缺失引用

4. ✅ 无不相关的捆绑内容
   - 所有文件均与视频生成功能相关
   - 无可疑的开发者工件（.env 已正确 gitignore）

5. ✅ npm 包名称一致性
   - Skill 名称: `video-generator`
   - npm 包: `openclaw-video-generator`
   - 关系明确，已在文档中说明

**证据**:
- `package.json:2-3` - 包名和版本声明
- `openclaw-skill/SKILL.md:48-52` - verified_repo 和 verified_commit
- `.gitignore:5-6` - .env 文件已排除

---

### ✓ Instruction Scope (指令范围)

**风险等级**: SAFE

**发现**:
1. ✅ 无隐藏 Unicode/控制字符
   - 执行 `hexdump -C SKILL.md` 检查
   - 未发现 U+200B, U+202E 等隐身字符

2. ✓ git clone 指令已声明且合规
   - 目标仓库: `https://github.com/ZhenRobotics/openclaw-video-generator.git`
   - SKILL.md 明确标注为 "Method 2: From Source (Developer Recommended)"
   - 提供 verified_commit 安全校验: `7726e04`

3. ✅ 无未声明的外部代码执行
   - 所有 shell 脚本均在代码库中
   - 无 `curl | bash` 或远程代码注入

4. ✅ 运行时行为受限
   - 仅访问项目目录和临时文件
   - 无系统文件读取（/etc/passwd, ~/.ssh）
   - 无特权提升尝试

5. ℹ️ 合法的递归目录访问
   - 视频渲染需要递归读取 `src/`, `public/` 目录
   - 已在文档中说明用途

**证据**:
- `openclaw-skill/SKILL.md:158-162` - git clone 指令及安全校验
- `scripts/script-to-video.sh` - 主脚本，无危险操作
- hexdump 检查结果：无隐藏字符

---

### ✓ Install Mechanism (安装机制)

**风险等级**: SAFE

**发现**:
1. ✅ 双安装路径均已声明
   - **Method 1**: `npm install -g openclaw-video-generator` (快速安装)
   - **Method 2**: `git clone` + `npm install` (开发者安装)
   - 两种方法对比表格清晰（SKILL.md:120-127）

2. ✅ npm 包已发布到官方仓库
   - 包名: `openclaw-video-generator`
   - 仓库: https://www.npmjs.com/package/openclaw-video-generator
   - 可验证性: ✓

3. ✅ package.json 脚本安全
   - `prepublishOnly`: 仅 echo 提示信息
   - `postinstall`: 仅 echo 欢迎信息
   - 无网络调用或数据收集

4. ℹ️ 依赖项审计
   - 主要依赖: `remotion`, `react`, `@remotion/three`
   - 均为知名开源项目
   - 无可疑的未知依赖

5. ⚠️ 全局安装提示
   - 文档建议使用 `npm install -g`
   - 已明确标注 macOS 权限问题
   - 提供解决方案（sudo 或 npm prefix 配置）

**证据**:
- `package.json:24-33` - 脚本配置
- `openclaw-skill/SKILL.md:129-149` - 双安装方法文档
- `package.json:57-65` - 依赖项列表

---

### ⚠️ Credentials (凭证管理)

**风险等级**: CAUTION (需要用户注意)

**发现**:
1. ✅ API 密钥管理符合最佳实践
   - 使用 `.env` 文件存储
   - `.env` 已加入 `.gitignore`
   - 提供 `.env.example` 作为模板
   - 建议权限: `chmod 600 .env`

2. ⚠️ 多厂商 API 密钥请求（合理但需说明）
   - **OpenAI**: OPENAI_API_KEY
   - **阿里云**: ALIYUN_ACCESS_KEY_ID, ALIYUN_ACCESS_KEY_SECRET, ALIYUN_APP_KEY
   - **Azure**: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION
   - **腾讯云**: TENCENT_SECRET_ID, TENCENT_SECRET_KEY, TENCENT_APP_ID

   **比例分析**: 声明为多厂商自动降级系统，合理
   - 文档明确说明仅需配置一个厂商
   - 提供 fallback 机制
   - 用于解决网络/地域限制问题

3. ✅ 凭证服务类型匹配
   - 声明功能: "Multi-provider TTS/ASR"
   - 请求凭证: 4个 TTS/ASR 厂商密钥
   - 完全一致 ✓

4. ✅ 凭证可选性标注清晰
   - SKILL.md frontmatter 中标注 `optional: true/false`
   - OpenAI 标注为 `optional: false`（默认厂商）
   - 其他厂商标注为 `optional: true`

5. ⚠️ 命令行传参风险（已警告）
   - SKILL.md:143-145 警告不要用 `--api-key` 传参
   - 说明: "visible in process list"
   - 推荐使用环境变量 ✓

**证据**:
- `.gitignore:5-6` - .env 排除配置
- `openclaw-skill/SKILL.md:8-40` - API 密钥声明
- `openclaw-skill/SKILL.md:200-213` - 安全配置指南
- `.env.example` - 完整的多厂商配置模板

**推荐**:
- ✅ 当前配置已符合安全标准
- 建议在 v1.6.2 更新文档中强调: "仅需配置一个厂商，其他为可选备份"

---

### ✓ Persistence & Privilege (持久化与特权)

**风险等级**: SAFE

**发现**:
1. ✅ 无 always-enabled 配置
   - 用户手动调用
   - 无自动触发机制（除非用户启用 AUTO-TRIGGER）

2. ✅ 无系统级修改
   - 不修改系统配置
   - 不安装系统服务
   - 不需要 root 权限（除非 npm -g 在受限目录）

3. ℹ️ 全局安装（用户选择）
   - `npm install -g` 安装到用户全局目录
   - 文档提供两种方案（全局 vs 本地）
   - 用户自主选择

4. ✅ 文件权限建议
   - `.env` 文件建议 `chmod 600`
   - 输出视频保存在项目目录

**证据**:
- `openclaw-skill/SKILL.md:234-247` - AUTO-TRIGGER 说明
- 无 systemd/launchd 配置文件

---

## Scan Findings in Context (扫描发现)

### 静态代码分析

**结果**: ✓ 无危险代码模式

检查项目:
- ✅ 无 `eval()` 或 `exec()` 调用（JavaScript/TypeScript）
- ✅ 无 `shell=True` 的 subprocess 调用（Python）
- ✅ 无 `curl | bash` 或远程代码注入
- ✅ 无硬编码的 API 密钥
- ✅ 无数据外泄向量（除 TTS/ASR API 调用）

**Python 脚本检查** (`scripts/providers/`):
- `aliyun_tts_simple.py` - 调用阿里云 SDK ✓
- `tencent_tts_simple.py` - 调用腾讯云 SDK ✓
- `aliyun_asr_fixed.py` - 包含 `subprocess.check_output` 仅用于 ffmpeg 获取音频时长 ✓

**Shell 脚本检查**:
- `scripts/script-to-video.sh` - 主脚本，参数清理逻辑 ✓
- `agents/video-cli.sh` - CLI 入口，调用 tsx ✓
- 无危险操作

---

## 元数据一致性检查

### 版本号追踪

| 文件 | 当前版本 | 需要更新 |
|------|---------|---------|
| `package.json` | 1.6.0 | → 1.6.2 |
| `SKILL.md` (frontmatter) | `>=1.6.0` | → `>=1.6.2` |
| `SKILL.md` (verified_commit) | 7726e04 | → 67d9299 |
| Git 最新 commit | 67d9299 | ✓ |

### Commit Hash 一致性

**当前状态**:
- Git HEAD: `67d9299` (📝 Add Xianyu marketplace post template)
- SKILL.md: `7726e04` (✨ Integrate poster generator)

**需要操作**: 更新 SKILL.md verified_commit 到 67d9299

### npm 包名一致性

✓ 一致:
- SKILL.md: `openclaw-video-generator`
- package.json: `openclaw-video-generator`
- npm registry: https://www.npmjs.com/package/openclaw-video-generator

---

## 最新功能安全审计 (v1.6.1 → v1.6.2)

### 新增功能

1. **脑卒中康复视频实现**
   - Commit: `b8262b4` 🩺 Fix stroke recovery video
   - 变更: 背景视频可见性修复 + 中文 TTS 集成（阿里云）
   - 安全性: ✓ 无新安全问题
   - 代码审查: 仅修改 React 组件样式和 TTS 配置

2. **双字幕样式选项**
   - Commit: `0189f7a` ✨ Add two subtitle style options
   - 变更: 提供两种字幕渲染方案（纯阴影 vs 背景框）
   - 安全性: ✓ 纯前端样式修改
   - 文件: `src/premium-scenes.tsx`, `src/premium-scenes-text-shadow.tsx`

3. **闲鱼推广模板**
   - Commit: `67d9299` 📝 Add Xianyu marketplace post
   - 变更: 新增 `XIANYU_POST.md` 营销文档
   - 安全性: ✓ 纯文档，无代码变更

### 之前修复的安全问题 (v1.6.1)

**Commit**: `d4630a0` 🔒 Fix critical security vulnerabilities

已修复问题（需验证仍然有效）:
1. ✅ 参数污染防护 (`scripts/clean-json-params.sh`)
2. ✅ JSON 元数据清理 (`agents/tools.ts:54-55`)
3. ✅ 阿里云 418 错误修复

**验证结果**: 所有修复仍然有效，无回归

---

## 安全建议

### 对用户

**安装前需知**:
1. ✅ 验证 npm 包来源
   ```bash
   npm view openclaw-video-generator repository
   # 应显示: https://github.com/ZhenRobotics/openclaw-video-generator
   ```

2. ✅ 验证 commit hash（如使用 git clone）
   ```bash
   cd ~/openclaw-video-generator
   git rev-parse HEAD
   # 应匹配 SKILL.md 中的 verified_commit
   ```

3. ⚠️ API 密钥配置
   - **仅配置你需要的厂商**
   - 国内用户推荐: 阿里云/腾讯云
   - 海外用户推荐: OpenAI/Azure
   - 使用 `.env` 文件，不要用命令行传参

4. ℹ️ 测试建议
   ```bash
   # 测试厂商配置
   cd ~/openclaw-video-generator
   ./scripts/test-providers.sh
   ```

### 对开发者

**v1.6.2 发布前检查**:
1. ✅ 更新 `package.json` 版本到 1.6.2
2. ✅ 更新 `SKILL.md` verified_commit 到 67d9299
3. ✅ 确保 `.env` 不在 git 中
4. ✅ 运行安全扫描
   ```bash
   ./verify-security.sh
   ```

---

## What to consider before installing (用户安装指南)

这个 Skill 是一个真实的、经过验证的视频生成工具。在安装前请注意:

**✅ 推荐操作**:

1. **验证来源**
   - npm 包: https://www.npmjs.com/package/openclaw-video-generator
   - GitHub 源码: https://github.com/ZhenRobotics/openclaw-video-generator
   - 两者应一致

2. **选择安装方式**
   - 快速使用: `npm install -g openclaw-video-generator`
   - 开发定制: `git clone` + 本地安装

3. **配置 API 密钥**
   - 创建 `.env` 文件
   - 仅配置一个厂商（OpenAI 或 阿里云 或 Azure 或 腾讯云）
   - 设置文件权限: `chmod 600 .env`

4. **测试运行**
   ```bash
   # 测试 TTS 配置
   ./scripts/test-providers.sh

   # 生成测试视频
   ./scripts/script-to-video.sh scripts/example-script.txt
   ```

**⚠️ 注意事项**:

- 需要至少一个 TTS/ASR 厂商的 API 密钥
- 视频渲染需要 ffmpeg（本地处理）
- 文本脚本和音频会发送到 TTS/ASR API（符合厂商隐私政策）
- 视频渲染完全在本地，不上传到任何服务器

**如果你无法审计代码**:
- 检查 npm 包下载量和 GitHub Stars
- 查看 GitHub Issues 和社区反馈
- 在隔离环境中测试（虚拟机或 Docker）

---

## 评分卡

| 维度 | 评分 | 说明 |
|------|------|------|
| **代码完整性** | ✓ SAFE | 所有引用文件存在，无缺失实现 |
| **元数据一致性** | ! CAUTION | 版本号需更新（1.6.0 → 1.6.2）|
| **凭证管理** | ✓ SAFE | .env 配置，已 gitignore |
| **外部依赖** | ✓ SAFE | npm 包已声明，git clone 已标注 |
| **代码安全** | ✓ SAFE | 无恶意代码，无隐藏字符 |
| **文档质量** | ✓ SAFE | 双语文档，安装步骤清晰 |
| **多厂商支持** | ℹ️ INFO | 需用户理解仅配置一个厂商 |

**综合评分**: ✓ Safe with considerations

---

## 后续行动

### 立即执行

1. **更新版本号**
   ```bash
   # 更新 package.json
   npm version 1.6.2 --no-git-tag-version
   ```

2. **更新 SKILL.md**
   - 版本: `>=1.6.0` → `>=1.6.2`
   - verified_commit: `7726e04` → `67d9299`
   - 新增功能说明（中文 TTS、字幕样式选项）

3. **生成更新日志**
   - 创建 `CLAWHUB_UPDATE_v1.6.2.md`
   - 包含新功能、改进、兼容性说明

### 可选改进

1. **文档增强**
   - 在 SKILL.md 中添加"仅需配置一个厂商"的醒目提示
   - 提供更多中文 TTS 使用示例

2. **安全加固**
   - 添加 `npm audit` 到 CI/CD 流程
   - 定期更新依赖项

---

## 审计结论

**最终评估**: ✅ 通过安全审计

openclaw-video-generator 是一个符合 ClawHub 安全标准的开源项目：
- 功能声明与实际代码完全一致
- API 密钥管理遵循最佳实践
- 无恶意代码或隐藏行为
- 文档详尽，用户指引清晰

**推荐状态**: Safe for ClawHub publication (v1.6.2)

**下一步**: 更新版本号和文档后即可发布

---

**Auditor**: ClawHub Security Analyst v2.0
**Report ID**: openclaw-video-generator-v1.6.2-audit-20260325
**Confidence**: 95% (基于完整代码审计和历史记录分析)
