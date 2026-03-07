# 项目转型说明

## 从视频生成器到董事会秘书

本项目已从 **OpenClaw Video Generator** 全面转型为 **Company Secretary (董事会秘书助手)**。

---

## 转型概览

### 核心定位变化

| 维度 | 转型前 | 转型后 |
|------|--------|--------|
| **主要功能** | 自动化短视频生成 | 董事会会议管理系统 |
| **核心价值** | TTS + Remotion 视频流水线 | 会议、决议、纪要、行动项全流程管理 |
| **目标用户** | 内容创作者、短视频制作者 | 董事会秘书、公司治理人员 |
| **使用场景** | 抖音/视频号短视频批量生成 | 初创公司、成长期公司、上市公司治理 |
| **视频功能** | 核心功能 | 保留作为汇报工具 |

---

## 新增核心模块

### 1. 会议管理系统 (`src/core/meeting-manager.ts`)

**功能**：
- 创建和管理董事会会议
- 参会人员管理和签到
- 议程制定和跟踪
- 会议流程控制（开始/进行/结束）
- 法定人数检查

**使用示例**：
```typescript
const secretary = new CompanySecretary();
const meeting = secretary.meetings.createMeeting({
  date: '2026-03-15',
  type: 'regular',
  title: '第一季度董事会'
});
```

### 2. 纪要生成器 (`src/core/minutes-generator.ts`)

**功能**：
- 自动生成结构化会议纪要
- 支持多种模板（标准、年度、审计等）
- AI 驱动内容优化（集成 GPT-4）
- 导出为 Markdown/PDF

**使用示例**：
```typescript
const minutes = await secretary.generateMinutes(meeting.id);
const markdown = await secretary.exportMinutesToMarkdown(meeting.id);
```

### 3. 决议跟踪器 (`src/core/resolution-tracker.ts`)

**功能**：
- 创建和管理董事会决议
- 表决结果记录
- 决议执行状态跟踪
- 逾期提醒
- 按类型/状态统计

**使用示例**：
```typescript
const resolution = secretary.resolutions.createResolution({
  title: '批准融资方案',
  voting: { for: 8, against: 0, abstain: 0 },
  deadline: '2026-06-30'
});
```

### 4. 行动项跟踪器 (`src/core/action-tracker.ts`)

**功能**：
- 创建和分配行动项
- 进度跟踪（0-100%）
- 优先级管理
- 逾期检查
- 按负责人/会议分组

**使用示例**：
```typescript
const action = secretary.actions.createAction({
  task: '准备融资材料',
  assignee: 'CFO',
  deadline: '2026-04-30',
  priority: 'high'
});
```

---

## CLI 工具

全新的命令行界面：

```bash
# 主命令
company-secretary <command> [options]

# 子命令
meeting      # 会议管理
minutes      # 纪要生成
resolution   # 决议管理
action       # 行动项管理
video        # 视频汇报（保留）
dashboard    # 工作台
```

### 示例命令

```bash
# 创建会议
company-secretary meeting create --date "2026-03-15" --title "Q1董事会"

# 生成纪要
company-secretary minutes generate --meeting-id "2026-Q1-01"

# 查看工作台
company-secretary dashboard

# 生成汇报视频（保留功能）
company-secretary video generate --script "业绩汇报..."
```

---

## 保留的视频功能

视频生成能力完全保留，但作为**辅助工具**用于董事会汇报：

### 新的视频使用场景

1. **决议公告视频** - 对外发布重大决议
2. **投资者汇报** - 定期业绩汇报
3. **内部沟通** - 董事会精神传达
4. **合规披露** - 信息披露要求

### 视频相关代码位置

- 核心引擎：`src/video/` (原 `src/CyberWireframe.tsx` 等)
- TTS/Whisper：`scripts/` (保留原有脚本)
- Remotion 配置：`remotion.config.ts`

---

## 数据结构

### 新增类型定义 (`src/secretary-types.ts`)

```typescript
// 核心数据类型
- Meeting           // 会议
- Minutes           // 纪要
- Resolution        // 决议
- ActionItem        // 行动项
- Attendee          // 参会人员
- AgendaItem        // 议程
- VotingResult      // 表决结果
```

### 数据存储

```
data/
├── database.json              # 主数据库
├── meetings/                  # 会议数据
├── resolutions/               # 决议数据
├── actions/                   # 行动项数据
└── minutes/                   # 会议纪要
    ├── 2026-Q1-01.json       # JSON 格式
    └── 2026-Q1-01.md         # Markdown 格式
```

---

## 项目结构变化

### 新增目录

```
cli/                           # CLI 工具（新增）
├── secretary-cli.sh           # 主入口
└── commands/                  # 子命令
    ├── meeting.ts
    ├── minutes.ts
    ├── resolution.ts
    ├── action.ts
    ├── video.ts
    └── dashboard.ts

src/core/                      # 核心模块（新增）
├── meeting-manager.ts
├── minutes-generator.ts
├── resolution-tracker.ts
└── action-tracker.ts

src/utils/                     # 工具函数（新增）
└── helpers.ts

examples/                      # 使用示例（新增）
└── basic-usage.ts
```

### 保留目录

```
scripts/                       # 保留（用于视频生成）
├── tts-generate.sh
├── whisper-timestamps.sh
└── script-to-video.sh

src/                          # 保留（Remotion 视频组件）
├── CyberWireframe.tsx
├── SceneRenderer.tsx
└── Root.tsx
```

---

## 包信息变化

### package.json

```json
{
  "name": "openclaw-company-secretary",  // 改名
  "version": "2.0.0",                     // 大版本升级
  "description": "AI-powered Company Secretary...",  // 新描述

  "bin": {
    "company-secretary": "./cli/secretary-cli.sh",  // 新命令
    "board-secretary": "./cli/secretary-cli.sh"
  },

  "keywords": [
    "company-secretary",        // 新关键词
    "board-meeting",
    "meeting-minutes",
    "corporate-governance",
    ...
  ]
}
```

### npm 脚本

```json
{
  "scripts": {
    "secretary": "./cli/secretary-cli.sh",      // 新增
    "dashboard": "./cli/secretary-cli.sh dashboard",  // 新增
    "dev": "remotion studio",                   // 保留（视频）
    "render": "remotion render Main out/video.mp4"    // 保留（视频）
  }
}
```

---

## 使用方式对比

### 转型前（视频生成）

```bash
# 生成视频
./scripts/script-to-video.sh scripts/my-script.txt

# 输出
out/my-script.mp4
```

### 转型后（董事会秘书 + 视频汇报）

```bash
# 1. 会议管理
company-secretary meeting create --date "2026-03-15"

# 2. 生成纪要
company-secretary minutes generate --meeting-id "2026-Q1-01"

# 3. 生成汇报视频（保留功能）
company-secretary video generate \
  --type "investor-update" \
  --script "Q1业绩超预期..."

# 输出
data/minutes/2026-Q1-01.md    # 会议纪要
out/investor-update.mp4        # 汇报视频
```

---

## API 使用对比

### 转型前

```typescript
// 只有视频生成
import { generateVideo } from 'openclaw-video';
await generateVideo(script);
```

### 转型后

```typescript
import { CompanySecretary } from 'openclaw-company-secretary';

const secretary = new CompanySecretary();

// 核心功能：会议管理
const meeting = secretary.meetings.createMeeting({...});
const minutes = await secretary.generateMinutes(meeting.id);
const dashboard = secretary.getDashboard();

// 保留功能：视频汇报
// (通过 CLI 或底层 Remotion 调用)
```

---

## 迁移指南

### 如果你之前使用视频生成功能

视频生成能力完全保留，继续使用：

```bash
# 方式 1: 通过新 CLI
company-secretary video generate --script "..."

# 方式 2: 直接使用原有脚本（完全兼容）
./scripts/script-to-video.sh scripts/my-script.txt
```

### 如果你想使用新的董秘功能

```bash
# 安装
npm install openclaw-company-secretary

# 快速开始
company-secretary --help
company-secretary dashboard

# 查看示例
node -r ts-node/register examples/basic-usage.ts
```

---

## 后续开发计划

- [ ] Web UI 界面
- [ ] 移动端 App
- [ ] 与企业微信/钉钉集成
- [ ] 多语言支持
- [ ] 电子签名集成
- [ ] 视频汇报模板扩展
  - 决议公告模板
  - 投资者汇报模板
  - 企业风格主题

---

## 技术栈

### 新增

- TypeScript 类型系统
- OpenAI GPT-4 (纪要生成)
- 文件系统存储 (JSON)

### 保留

- Remotion (视频渲染)
- OpenAI TTS (语音)
- OpenAI Whisper (转录)
- React + TypeScript

---

## 贡献

欢迎贡献代码和建议！

- 新功能需求：[GitHub Issues](https://github.com/ZhenRobotics/openclaw-company-secretary/issues)
- 代码贡献：[Pull Requests](https://github.com/ZhenRobotics/openclaw-company-secretary/pulls)

---

**转型完成！现在是一个专业的董事会秘书助手。** 🎉
