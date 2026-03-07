# 项目命名规范

## 正式名称确认

### 英文名称
**OpenClaw Company Secretary**

- **品牌定位**: OpenClaw 生态系统的重要组成部分
- **功能定位**: 董事会秘书 AI 助手
- **简称**: OpenClaw CS

### 中文名称
**OpenClaw 董事会秘书**

- **对外宣传**: OpenClaw 董事会秘书
- **产品简称**: 董秘助手
- **Slogan**: 让董事会治理更智能、更高效

---

## 各平台包名/仓库名

### 1. npm 包

```json
{
  "name": "openclaw-company-secretary",
  "displayName": "OpenClaw Company Secretary",
  "version": "2.0.0"
}
```

**安装命令**:
```bash
npm install openclaw-company-secretary
# 或
npm install -g openclaw-company-secretary
```

**命名说明**:
- ✅ 保留 `openclaw-` 前缀，强调生态归属
- ✅ 使用连字符分隔，符合 npm 命名规范
- ✅ 全小写，避免命名冲突

**检查可用性**:
```bash
npm search openclaw-company-secretary
# 当前应该是可用的
```

### 2. GitHub 仓库

**仓库地址**:
```
https://github.com/ZhenRobotics/openclaw-company-secretary
```

**仓库名称**: `openclaw-company-secretary`

**仓库描述**:
```
OpenClaw Company Secretary - AI-powered board meeting management,
minute generation, resolution tracking, and video reporting
```

**Topics 标签**:
```
openclaw
company-secretary
board-meeting
corporate-governance
ai-assistant
meeting-minutes
resolution-tracking
typescript
remotion
```

### 3. ClawHub Skill

**Skill 名称**: `company-secretary`

**Skill 完整路径**:
```
ZhenStaff/company-secretary
```

**安装命令**:
```bash
clawhub install company-secretary
# 或完整路径
clawhub install ZhenStaff/company-secretary
```

**Skill 元信息**:
```yaml
name: company-secretary
displayName: OpenClaw 董事会秘书
author: ZhenStaff
version: 2.0.0
description: AI 驱动的董事会秘书助手，支持会议管理、纪要生成、决议跟踪
tags:
  - company-secretary
  - board-meeting
  - corporate-governance
```

### 4. PyPI（如果需要 Python 版本）

**包名**: `openclaw-company-secretary`

```bash
pip install openclaw-company-secretary
```

---

## CLI 命令名称

### 主命令

```bash
company-secretary
```

**使用示例**:
```bash
company-secretary --help
company-secretary meeting create
company-secretary dashboard
```

### 别名（可选）

如需更短的命令，可以提供别名：

```bash
# 通过 shell alias（用户自定义）
alias cs='company-secretary'
alias csec='company-secretary'

# 使用
cs dashboard
csec meeting list
```

**package.json bin 配置**:
```json
{
  "bin": {
    "company-secretary": "./cli/secretary-cli.sh"
  }
}
```

---

## 各平台统一命名表

| 平台/用途 | 名称 | 说明 |
|----------|------|------|
| **项目正式名称（英文）** | OpenClaw Company Secretary | 对外宣传、文档 |
| **项目正式名称（中文）** | OpenClaw 董事会秘书 | 中文市场宣传 |
| **npm 包名** | openclaw-company-secretary | npm 安装使用 |
| **GitHub 仓库** | openclaw-company-secretary | 源码托管 |
| **ClawHub Skill** | company-secretary | Skill 安装 |
| **CLI 主命令** | company-secretary | 命令行使用 |
| **TypeScript 主类** | CompanySecretary | 代码导入 |
| **数据库/文件前缀** | cs- 或 company-secretary- | 数据标识 |

---

## 导入和使用示例

### npm 包导入

```typescript
// ESM
import { CompanySecretary } from 'openclaw-company-secretary';

// CommonJS
const { CompanySecretary } = require('openclaw-company-secretary');
```

### CLI 使用

```bash
# 全局安装后
company-secretary dashboard

# npx 使用
npx openclaw-company-secretary dashboard

# npm scripts
npm run secretary
```

### ClawHub Skill

```bash
# 安装
clawhub install company-secretary

# Agent 调用
"请使用 company-secretary 帮我创建一个董事会会议"
```

---

## 品牌素材

### Logo/图标

建议使用以下元素：
- 🏢 公司/办公楼图标
- 📋 文档/纪要图标
- 🤖 AI 机器人图标
- 🎯 董事会/会议图标

配色方案：
- 主色：专业蓝 `#0066CC`
- 辅色：商务灰 `#4A5568`
- 强调色：智能绿 `#10B981`

### Slogan

**英文**:
- "AI-Powered Board Governance"
- "Smart Secretary for Modern Boards"
- "Automate Your Board Meetings"

**中文**:
- "让董事会治理更智能"
- "AI 驱动的董秘助手"
- "从会议到纪要，一键搞定"

---

## 文档中的称呼

### README.md

```markdown
# OpenClaw Company Secretary

AI-powered Company Secretary assistant for board meeting management.

## Installation

\`\`\`bash
npm install openclaw-company-secretary
\`\`\`

## Usage

\`\`\`bash
company-secretary --help
\`\`\`
```

### 代码注释

```typescript
/**
 * OpenClaw Company Secretary
 * Main class for board meeting management
 */
export class CompanySecretary {
  // ...
}
```

### 用户文档

- 标题：使用完整名称 "OpenClaw Company Secretary"
- 正文：首次提及用完整名称，后续可简称 "Company Secretary" 或 "系统"
- 中文文档：使用 "OpenClaw 董事会秘书"

---

## URL 和域名建议

### 官网域名（建议）

- `openclaw-secretary.com`
- `company-secretary.ai`
- `boardsecretary.io`

### 文档站点

- `docs.openclaw-secretary.com`
- GitHub Pages: `zhenrobotics.github.io/openclaw-company-secretary`

### API 端点（如提供云服务）

```
https://api.openclaw-secretary.com/v2/
```

---

## 社交媒体

### Twitter/X

**用户名**: `@OpenClawCS` 或 `@CompanySecAI`

**Bio**:
```
OpenClaw Company Secretary - AI-powered board governance assistant.
Automate meetings, minutes, and resolutions. #BoardTech #AIGovernance
```

### LinkedIn

**页面名称**: OpenClaw Company Secretary

**标签**:
```
#CorporateGovernance #BoardManagement #AIAssistant
#CompanySecretary #LegalTech #GovTech
```

---

## SEO 关键词

### 英文

**主关键词**:
- company secretary software
- board meeting management
- ai board secretary
- meeting minutes generator
- resolution tracking software

**长尾关键词**:
- automated board meeting minutes
- corporate governance software
- board secretary assistant
- meeting management tool for boards

### 中文

**主关键词**:
- 董事会秘书软件
- 会议管理系统
- 董秘助手
- 会议纪要生成
- 决议跟踪

**长尾关键词**:
- AI 董事会秘书
- 自动化会议纪要
- 公司治理软件
- 董事会管理工具

---

## 版权声明

```
Copyright (c) 2026 OpenClaw / ZhenRobotics
OpenClaw Company Secretary is licensed under the MIT License.
```

---

## 命名检查清单

发布前请确认：

- [ ] npm 包名可用性检查
  ```bash
  npm search openclaw-company-secretary
  ```

- [ ] GitHub 仓库名称正确
  ```
  https://github.com/ZhenRobotics/openclaw-company-secretary
  ```

- [ ] package.json 中的 name 字段
  ```json
  "name": "openclaw-company-secretary"
  ```

- [ ] CLI 命令可执行
  ```bash
  company-secretary --help
  ```

- [ ] ClawHub skill 名称
  ```
  company-secretary
  ```

- [ ] 文档中的项目名称统一
  - [ ] README.md
  - [ ] QUICKSTART.md
  - [ ] 所有 .md 文件

- [ ] 代码中的类名和导出
  ```typescript
  export class CompanySecretary
  ```

---

## 常见问题

### Q: 为什么保留 "openclaw" 前缀？

A:
1. 强调生态归属，属于 OpenClaw 产品家族
2. 避免与其他 company-secretary 包冲突
3. 便于用户识别和品牌建设

### Q: CLI 命令为什么不用更短的名称？

A:
- `company-secretary` 清晰表达功能，自解释性强
- 避免与系统命令冲突
- 用户可以自定义 alias 获得短命令

### Q: 是否需要注册商标？

A: 建议在产品成熟后考虑注册以下内容：
- "OpenClaw Company Secretary" 文字商标
- Logo 图形商标
- 域名保护

---

## 总结

### 核心命名

```
正式名称：OpenClaw Company Secretary
npm 包名：openclaw-company-secretary
CLI 命令：company-secretary
中文名称：OpenClaw 董事会秘书
```

### 使用场景

```bash
# 安装
npm install openclaw-company-secretary

# 导入
import { CompanySecretary } from 'openclaw-company-secretary';

# 使用
company-secretary dashboard

# ClawHub
clawhub install company-secretary
```

**命名规范已确认，准备发布！** ✅
