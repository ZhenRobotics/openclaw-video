# Company Secretary - AI 董事会秘书助手

基于 OpenClaw + OpenAI 的智能董事会秘书系统。自动化会议管理、决议跟踪、纪要生成和视频汇报，让公司治理更高效、更规范。

## 核心功能

- 📋 **会议管理** - 议程制定、会议记录、参会人员管理
- 📝 **智能纪要生成** - 自动生成规范的会议纪要和决议文档
- ✅ **决议跟踪** - 跟踪董事会决议执行情况
- 🎯 **行动项管理** - 管理会议产生的行动项（Action Items）
- 🎥 **视频汇报** - 自动生成董事会汇报视频、决议公告视频
- 📊 **合规报告** - 生成符合监管要求的治理报告

## 适用场景

| 场景 | 功能 |
|------|------|
| **初创公司** | 轻量级会议管理，快速记录决议和行动项 |
| **成长期公司** | 规范化治理流程，建立完整的会议档案 |
| **上市公司** | 严格合规管理，信息披露，监管报告 |
| **AI Agent 集成** | 作为工具被其他 Agent 调用，自动化董秘工作 |

## 快速开始

### 前置要求

- Node.js >= 18
- OpenAI API Key（用于智能纪要生成和视频汇报）

### 安装

```bash
# 克隆项目
git clone https://github.com/ZhenRobotics/openclaw-company-secretary.git
cd openclaw-company-secretary

# 安装依赖
npm install

# 设置 API Key
export OPENAI_API_KEY="sk-..."
```

### 基础使用

#### 1. 创建董事会会议

```bash
# 创建新会议
./cli/secretary-cli.sh meeting create \
  --date "2026-03-15" \
  --type "regular" \
  --title "2026年第一季度董事会"

# 添加议程
./cli/secretary-cli.sh agenda add \
  --meeting-id "2026-Q1-01" \
  --topic "审议2025年度财务报告" \
  --presenter "CFO" \
  --duration 30
```

#### 2. 会议记录与纪要生成

```bash
# 录入会议讨论内容
./cli/secretary-cli.sh meeting record \
  --meeting-id "2026-Q1-01" \
  --transcript "meeting-transcript.txt"

# 生成会议纪要
./cli/secretary-cli.sh minutes generate \
  --meeting-id "2026-Q1-01" \
  --template "standard"

# 输出：meetings/2026-Q1-01/minutes.md
```

#### 3. 决议管理

```bash
# 记录决议
./cli/secretary-cli.sh resolution create \
  --meeting-id "2026-Q1-01" \
  --title "批准2025年度财务报告" \
  --type "financial" \
  --voting "8票赞成，0票反对，0票弃权"

# 查看所有待执行决议
./cli/secretary-cli.sh resolution list --status pending

# 更新决议状态
./cli/secretary-cli.sh resolution update \
  --id "RES-2026-001" \
  --status "completed"
```

#### 4. 行动项跟踪

```bash
# 创建行动项
./cli/secretary-cli.sh action create \
  --meeting-id "2026-Q1-01" \
  --task "准备Q1经营数据分析报告" \
  --assignee "CEO" \
  --deadline "2026-03-30"

# 查看我的行动项
./cli/secretary-cli.sh action list --assignee "CEO" --status pending

# 完成行动项
./cli/secretary-cli.sh action complete --id "ACT-2026-001"
```

#### 5. 生成汇报视频

```bash
# 生成董事会决议公告视频
./cli/secretary-cli.sh video generate \
  --type "resolution-announcement" \
  --meeting-id "2026-Q1-01" \
  --resolution-id "RES-2026-001"

# 生成投资者汇报视频
./cli/secretary-cli.sh video generate \
  --type "investor-update" \
  --script "Q1业绩超预期。营收增长45%。净利润增长60%。关注我们获取更多信息。" \
  --voice nova \
  --speed 1.15
```

## 会议管理流程

```
会前准备
    ↓
  创建会议 → 制定议程 → 发送通知
    ↓
会议进行
    ↓
  签到记录 → 议程讨论 → 决议表决 → 行动项分配
    ↓
会后管理
    ↓
  生成纪要 → 决议归档 → 跟踪执行 → 生成报告
```

## 文档模板

系统内置多种文档模板：

| 模板类型 | 说明 | 适用场景 |
|---------|------|----------|
| **standard** | 标准会议纪要 | 常规董事会 |
| **annual** | 年度股东大会纪要 | 年度大会 |
| **special** | 特别董事会纪要 | 重大事项决策 |
| **audit** | 审计委员会纪要 | 审计相关会议 |
| **remuneration** | 薪酬委员会纪要 | 薪酬相关会议 |

## 数据结构

### 会议信息
```typescript
interface Meeting {
  id: string;                    // 会议ID，如 "2026-Q1-01"
  date: string;                  // 会议日期
  type: MeetingType;             // 会议类型
  title: string;                 // 会议标题
  location: string;              // 会议地点
  attendees: Attendee[];         // 参会人员
  agenda: AgendaItem[];          // 议程列表
  resolutions: Resolution[];     // 决议列表
  actionItems: ActionItem[];     // 行动项列表
  status: MeetingStatus;         // 会议状态
}

type MeetingType =
  | 'regular'           // 定期董事会
  | 'special'           // 特别董事会
  | 'annual'            // 年度股东大会
  | 'audit'             // 审计委员会
  | 'remuneration';     // 薪酬委员会

type MeetingStatus =
  | 'scheduled'         // 已安排
  | 'in-progress'       // 进行中
  | 'completed'         // 已完成
  | 'cancelled';        // 已取消
```

### 决议信息
```typescript
interface Resolution {
  id: string;                    // 决议ID，如 "RES-2026-001"
  meetingId: string;             // 所属会议ID
  title: string;                 // 决议标题
  content: string;               // 决议内容
  type: ResolutionType;          // 决议类型
  voting: VotingResult;          // 表决结果
  status: ResolutionStatus;      // 执行状态
  deadline?: string;             // 执行期限
}

type ResolutionType =
  | 'financial'         // 财务决议
  | 'strategic'         // 战略决议
  | 'personnel'         // 人事决议
  | 'governance'        // 治理决议
  | 'investment'        // 投资决议
  | 'compliance';       // 合规决议

type ResolutionStatus =
  | 'pending'           // 待执行
  | 'in-progress'       // 执行中
  | 'completed'         // 已完成
  | 'cancelled';        // 已取消
```

### 行动项
```typescript
interface ActionItem {
  id: string;                    // 行动项ID
  meetingId: string;             // 来源会议
  task: string;                  // 任务描述
  assignee: string;              // 负责人
  deadline: string;              // 截止日期
  priority: Priority;            // 优先级
  status: ActionStatus;          // 状态
  notes?: string;                // 备注
}

type Priority = 'high' | 'medium' | 'low';
type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
```

## 视频汇报功能

保留了完整的视频生成能力，专门用于董事会相关的视频汇报：

### 使用场景

1. **决议公告视频** - 对外发布重大决议
2. **投资者汇报** - 定期业绩汇报视频
3. **内部沟通** - 董事会精神传达
4. **合规披露** - 信息披露要求的视频内容

### 视频生成

```bash
# 基于决议生成公告视频
./cli/secretary-cli.sh video from-resolution \
  --resolution-id "RES-2026-001" \
  --template "announcement"

# 基于纪要生成汇报视频
./cli/secretary-cli.sh video from-minutes \
  --meeting-id "2026-Q1-01" \
  --highlights "营收增长,新产品发布,战略调整"

# 自定义脚本生成
./cli/secretary-cli.sh video custom \
  --script "董事会批准新一轮融资。估值提升50%。投资用于产品研发和市场拓展。" \
  --voice nova \
  --bg-video corporate-bg.mp4
```

## 项目结构

```
openclaw-company-secretary/
├── cli/                         # CLI 工具
│   ├── secretary-cli.sh         # 主命令行工具
│   └── commands/                # 子命令实现
│       ├── meeting.ts           # 会议管理
│       ├── minutes.ts           # 纪要生成
│       ├── resolution.ts        # 决议管理
│       ├── action.ts            # 行动项管理
│       └── video.ts             # 视频生成
├── src/
│   ├── core/                    # 核心模块
│   │   ├── meeting-manager.ts  # 会议管理器
│   │   ├── minutes-generator.ts # 纪要生成器
│   │   ├── resolution-tracker.ts # 决议跟踪器
│   │   └── action-tracker.ts    # 行动项跟踪器
│   ├── templates/               # 文档模板
│   │   ├── standard-minutes.ts
│   │   ├── resolution-doc.ts
│   │   └── report-template.ts
│   ├── video/                   # 视频生成（保留原功能）
│   │   ├── video-generator.ts
│   │   ├── CyberWireframe.tsx
│   │   └── SceneRenderer.tsx
│   └── types.ts                 # 类型定义
├── data/                        # 数据存储
│   ├── meetings/                # 会议数据
│   ├── resolutions/             # 决议数据
│   └── actions/                 # 行动项数据
├── scripts/                     # 工具脚本
│   └── video/                   # 视频相关脚本（保留）
└── docs/
    ├── MEETING-GUIDE.md         # 会议管理指南
    ├── MINUTES-GUIDE.md         # 纪要撰写指南
    ├── COMPLIANCE.md            # 合规指南
    └── VIDEO-GUIDE.md           # 视频生成指南
```

## 智能特性

### 1. AI 驱动的纪要生成

系统使用 OpenAI GPT 自动分析会议讨论内容，生成结构化纪要：

- 自动提取关键决策点
- 识别行动项和责任人
- 格式化表决结果
- 生成执行摘要

### 2. 决议智能跟踪

- 自动识别决议类型
- 设置执行提醒
- 跟踪完成进度
- 生成执行报告

### 3. 合规检查

- 检查会议流程合规性
- 验证表决有效性
- 提醒信息披露要求
- 生成监管报告

## 使用示例

### 完整会议流程示例

```bash
# 1. 会前准备
./cli/secretary-cli.sh meeting create \
  --date "2026-03-15" \
  --type "regular" \
  --title "2026年第一季度董事会"

./cli/secretary-cli.sh agenda add \
  --meeting-id "2026-Q1-01" \
  --topic "审议2025年度财务报告" \
  --presenter "CFO"

./cli/secretary-cli.sh agenda add \
  --meeting-id "2026-Q1-01" \
  --topic "讨论新一轮融资方案" \
  --presenter "CEO"

# 2. 会议进行
./cli/secretary-cli.sh meeting start --meeting-id "2026-Q1-01"

# 记录讨论内容（支持实时记录或上传录音转录）
./cli/secretary-cli.sh meeting record \
  --meeting-id "2026-Q1-01" \
  --transcript "discussion.txt"

# 记录决议
./cli/secretary-cli.sh resolution create \
  --meeting-id "2026-Q1-01" \
  --title "批准2025年度财务报告" \
  --voting "8:0:0"

# 分配行动项
./cli/secretary-cli.sh action create \
  --meeting-id "2026-Q1-01" \
  --task "准备融资材料" \
  --assignee "CFO" \
  --deadline "2026-03-30"

# 3. 会后处理
./cli/secretary-cli.sh meeting close --meeting-id "2026-Q1-01"

# 生成纪要
./cli/secretary-cli.sh minutes generate \
  --meeting-id "2026-Q1-01" \
  --output "meetings/2026-Q1-01/minutes.pdf"

# 生成汇报视频
./cli/secretary-cli.sh video from-minutes \
  --meeting-id "2026-Q1-01"

# 发送纪要
./cli/secretary-cli.sh minutes send \
  --meeting-id "2026-Q1-01" \
  --recipients "董事会成员"
```

## API 集成

可作为 API 服务供其他系统调用：

```typescript
import { CompanySecretary } from 'openclaw-company-secretary';

const secretary = new CompanySecretary({
  apiKey: process.env.OPENAI_API_KEY
});

// 创建会议
const meeting = await secretary.createMeeting({
  date: '2026-03-15',
  type: 'regular',
  title: '第一季度董事会'
});

// 生成纪要
const minutes = await secretary.generateMinutes({
  meetingId: meeting.id,
  transcript: '会议讨论内容...'
});

// 跟踪决议
await secretary.trackResolution({
  title: '批准融资方案',
  deadline: '2026-06-30'
});
```

## Agent 集成

作为 OpenClaw skill 被其他 Agent 调用：

```bash
# 安装 skill
clawhub install company-secretary

# Agent 使用
"请帮我准备明天的董事会会议材料"
"生成上次董事会的纪要"
"检查待执行的决议"
```

## 成本估算

| 功能 | 成本 |
|------|------|
| 会议纪要生成（GPT-4） | ~$0.05/次 |
| 决议公告视频（TTS + Whisper） | ~$0.003/个 |
| 合规报告生成 | ~$0.02/份 |

**典型月度成本**（10次董事会）：< $1

## 合规与安全

- 📁 **本地数据存储** - 所有会议数据存储在本地
- 🔒 **数据加密** - 敏感信息加密存储
- 📝 **审计日志** - 完整的操作记录
- ✅ **合规检查** - 自动检查治理合规性

## 开发计划

- [ ] Web UI 界面
- [ ] 移动端 App
- [ ] 与企业微信/钉钉集成
- [ ] 多语言支持
- [ ] 电子签名集成
- [ ] 区块链存证

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

---

**让董事会治理更智能、更高效！**
