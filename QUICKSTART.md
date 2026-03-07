# 快速开始指南

5 分钟快速上手董事会秘书助手。

## 安装

```bash
# 克隆项目
cd /home/justin/openclaw-company-secretary

# 安装依赖
npm install

# 设置 OpenAI API Key (可选，用于 AI 功能)
export OPENAI_API_KEY="sk-..."

# 添加可执行权限
chmod +x cli/secretary-cli.sh
```

## 快速体验

### 1. 创建第一个董事会会议

```bash
./cli/secretary-cli.sh meeting create \
  --date "2026-03-15" \
  --type "regular" \
  --title "2026年第一季度董事会" \
  --location "总部会议室"
```

输出：
```
✅ 会议创建成功!

会议ID: 2026-Q1-01
标题: 2026年第一季度董事会
时间: 2026-03-15
类型: regular
状态: scheduled
```

### 2. 记录决议

```bash
./cli/secretary-cli.sh resolution create \
  --meeting-id "2026-Q1-01" \
  --title "批准2025年度财务报告" \
  --content "董事会审议并批准公司2025年度财务报告" \
  --voting "8:0:0"
```

### 3. 创建行动项

```bash
./cli/secretary-cli.sh action create \
  --meeting-id "2026-Q1-01" \
  --task "准备Q1经营分析报告" \
  --assignee "CEO" \
  --deadline "2026-03-30" \
  --priority high
```

### 4. 生成会议纪要

```bash
./cli/secretary-cli.sh minutes generate \
  --meeting-id "2026-Q1-01" \
  --template standard
```

纪要将保存到：`data/minutes/2026-Q1-01.md`

### 5. 查看工作台

```bash
./cli/secretary-cli.sh dashboard
```

输出示例：
```
╔════════════════════════════════════════════════════════════╗
║          Company Secretary - 工作台                       ║
╚════════════════════════════════════════════════════════════╝

📅 即将到来的会议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 2026年第一季度董事会
   时间: 2026-03-15 | 状态: ⏰ 已安排

📋 待执行决议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 批准2025年度财务报告
   会议: 2026-Q1-01 | 截止: 2026-04-15

📊 统计信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
行动项: 总数 1 | 待处理 1 | 进行中 0 | 已完成 0
决议: 总数 1 | 待执行 1 | 进行中 0 | 已完成 0

完成率: 行动项 0.0% | 决议通过率 100.0%
```

## 常见使用场景

### 场景 1: 完整的会议流程

```bash
# 1. 创建会议
./cli/secretary-cli.sh meeting create \
  --date "2026-03-15" \
  --type "regular" \
  --title "第一季度董事会"

# 2. 开始会议
./cli/secretary-cli.sh meeting start --meeting-id "2026-Q1-01"

# 3. 记录讨论（准备 discussion.txt 文件）
./cli/secretary-cli.sh meeting record \
  --meeting-id "2026-Q1-01" \
  --transcript discussion.txt

# 4. 创建决议
./cli/secretary-cli.sh resolution create \
  --meeting-id "2026-Q1-01" \
  --title "批准融资方案" \
  --content "董事会批准A轮融资方案" \
  --voting "7:1:0"

# 5. 创建行动项
./cli/secretary-cli.sh action create \
  --meeting-id "2026-Q1-01" \
  --task "完成融资文件签署" \
  --assignee "CFO" \
  --deadline "2026-04-01"

# 6. 结束会议
./cli/secretary-cli.sh meeting close --meeting-id "2026-Q1-01"

# 7. 生成纪要
./cli/secretary-cli.sh minutes generate \
  --meeting-id "2026-Q1-01"
```

### 场景 2: 查看我的待办事项

```bash
# 查看所有待处理的行动项
./cli/secretary-cli.sh action list --status pending

# 查看我的行动项
./cli/secretary-cli.sh action list --assignee "CEO" --status pending

# 更新行动项进度
./cli/secretary-cli.sh action update \
  --id "ACT-2026-001" \
  --progress 50

# 完成行动项
./cli/secretary-cli.sh action complete --id "ACT-2026-001"
```

### 场景 3: 生成汇报视频（保留的视频功能）

```bash
# 基于决议生成公告视频
./cli/secretary-cli.sh video generate \
  --type "resolution-announcement" \
  --script "董事会批准新一轮融资。估值提升50%。" \
  --voice nova

# 生成投资者汇报视频
./cli/secretary-cli.sh video generate \
  --type "investor-update" \
  --script "Q1营收增长45%。净利润增长60%。新产品上线。" \
  --voice nova \
  --speed 1.15
```

### 场景 4: 决议跟踪

```bash
# 列出所有待执行决议
./cli/secretary-cli.sh resolution list --status pending

# 更新决议状态
./cli/secretary-cli.sh resolution update \
  --id "RES-2026-001" \
  --status "in-progress"

# 完成决议
./cli/secretary-cli.sh resolution update \
  --id "RES-2026-001" \
  --status "completed"

# 检查逾期决议
./cli/secretary-cli.sh resolution check-overdue
```

## 数据存储

所有数据存储在 `data/` 目录：

```
data/
├── database.json           # 主数据库
├── meetings/               # 会议数据
├── resolutions/            # 决议数据
├── actions/                # 行动项数据
└── minutes/                # 会议纪要
    ├── 2026-Q1-01.json    # JSON 格式
    └── 2026-Q1-01.md      # Markdown 格式
```

## 作为 npm 包使用

```typescript
import { CompanySecretary } from 'openclaw-company-secretary';

const secretary = new CompanySecretary({
  apiKey: process.env.OPENAI_API_KEY,
  dataPath: './data'
});

// 创建会议
const meeting = secretary.meetings.createMeeting({
  date: '2026-03-15',
  type: 'regular',
  title: '第一季度董事会'
});

// 生成纪要
const minutes = await secretary.generateMinutes(meeting.id);

// 查看工作台
const dashboard = secretary.getDashboard();
console.log(dashboard);
```

## 集成到 OpenClaw

作为 ClawHub skill 使用：

```bash
# 安装 skill
clawhub install company-secretary

# Agent 使用
"请帮我准备明天的董事会会议"
"生成上次董事会的会议纪要"
"检查我的待办行动项"
```

## 下一步

- 阅读 [完整文档](README.md)
- 查看 [会议管理指南](docs/MEETING-GUIDE.md)
- 了解 [纪要撰写规范](docs/MINUTES-GUIDE.md)
- 探索 [视频汇报功能](docs/VIDEO-GUIDE.md)

---

**5 分钟上手，让董事会治理更专业！**
