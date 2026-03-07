// Company Secretary Core Types

// ==================== Meeting Types ====================

export interface Meeting {
  id: string;                    // 会议ID，如 "2026-Q1-01"
  date: string;                  // 会议日期 ISO 8601
  type: MeetingType;             // 会议类型
  title: string;                 // 会议标题
  location: string;              // 会议地点
  attendees: Attendee[];         // 参会人员
  agenda: AgendaItem[];          // 议程列表
  resolutions: Resolution[];     // 决议列表
  actionItems: ActionItem[];     // 行动项列表
  status: MeetingStatus;         // 会议状态
  transcript?: string;           // 会议记录/转录
  minutesGenerated?: boolean;    // 是否已生成纪要
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

export type MeetingType =
  | 'regular'           // 定期董事会
  | 'special'           // 特别董事会
  | 'annual'            // 年度股东大会
  | 'audit'             // 审计委员会
  | 'remuneration'      // 薪酬委员会
  | 'nomination'        // 提名委员会
  | 'strategy';         // 战略委员会

export type MeetingStatus =
  | 'scheduled'         // 已安排
  | 'in-progress'       // 进行中
  | 'completed'         // 已完成
  | 'cancelled';        // 已取消

export interface Attendee {
  name: string;                  // 姓名
  role: AttendeeRole;            // 角色
  title?: string;                // 职位
  present: boolean;              // 是否出席
  proxy?: string;                // 代理人（如未出席）
}

export type AttendeeRole =
  | 'chairman'          // 董事长
  | 'director'          // 董事
  | 'independent'       // 独立董事
  | 'supervisor'        // 监事
  | 'executive'         // 高管（列席）
  | 'secretary'         // 董秘
  | 'observer';         // 观察员

export interface AgendaItem {
  id: string;                    // 议程ID
  order: number;                 // 顺序
  topic: string;                 // 议题
  presenter: string;             // 汇报人
  duration?: number;             // 计划时长（分钟）
  attachments?: string[];        // 附件
  discussion?: string;           // 讨论记录
  completed: boolean;            // 是否完成
}

// ==================== Resolution Types ====================

export interface Resolution {
  id: string;                    // 决议ID，如 "RES-2026-001"
  meetingId: string;             // 所属会议ID
  agendaId?: string;             // 关联议程ID
  title: string;                 // 决议标题
  content: string;               // 决议内容
  type: ResolutionType;          // 决议类型
  voting: VotingResult;          // 表决结果
  status: ResolutionStatus;      // 执行状态
  deadline?: string;             // 执行期限
  responsible?: string;          // 负责人
  notes?: string;                // 备注
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

export type ResolutionType =
  | 'financial'         // 财务决议
  | 'strategic'         // 战略决议
  | 'personnel'         // 人事决议
  | 'governance'        // 治理决议
  | 'investment'        // 投资决议
  | 'compliance'        // 合规决议
  | 'operational'       // 运营决议
  | 'disclosure';       // 信息披露

export type ResolutionStatus =
  | 'pending'           // 待执行
  | 'in-progress'       // 执行中
  | 'completed'         // 已完成
  | 'overdue'           // 已逾期
  | 'cancelled';        // 已取消

export interface VotingResult {
  for: number;                   // 赞成票
  against: number;               // 反对票
  abstain: number;               // 弃权票
  total: number;                 // 总票数
  passed: boolean;               // 是否通过
  method?: VotingMethod;         // 表决方式
}

export type VotingMethod =
  | 'show-hands'        // 举手表决
  | 'secret-ballot'     // 无记名投票
  | 'roll-call'         // 记名投票
  | 'written'           // 书面表决
  | 'electronic';       // 电子表决

// ==================== Action Item Types ====================

export interface ActionItem {
  id: string;                    // 行动项ID，如 "ACT-2026-001"
  meetingId: string;             // 来源会议
  resolutionId?: string;         // 关联决议
  task: string;                  // 任务描述
  assignee: string;              // 负责人
  deadline: string;              // 截止日期
  priority: Priority;            // 优先级
  status: ActionStatus;          // 状态
  progress?: number;             // 完成进度 (0-100)
  notes?: string;                // 备注
  completedAt?: string;          // 完成时间
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
}

export type Priority = 'high' | 'medium' | 'low';

export type ActionStatus =
  | 'pending'           // 待执行
  | 'in-progress'       // 进行中
  | 'completed'         // 已完成
  | 'overdue'           // 已逾期
  | 'cancelled';        // 已取消

// ==================== Minutes Types ====================

export interface Minutes {
  meetingId: string;             // 关联会议ID
  title: string;                 // 纪要标题
  date: string;                  // 会议日期
  template: MinutesTemplate;     // 使用的模板
  sections: MinutesSection[];    // 纪要章节
  generatedAt: string;           // 生成时间
  approvedBy?: string;           // 批准人
  approvedAt?: string;           // 批准时间
  filePath?: string;             // 文件路径
}

export type MinutesTemplate =
  | 'standard'          // 标准会议纪要
  | 'annual'            // 年度股东大会纪要
  | 'special'           // 特别董事会纪要
  | 'audit'             // 审计委员会纪要
  | 'remuneration'      // 薪酬委员会纪要
  | 'brief';            // 简要纪要

export interface MinutesSection {
  type: SectionType;             // 章节类型
  title: string;                 // 章节标题
  content: string;               // 章节内容
  order: number;                 // 顺序
}

export type SectionType =
  | 'header'            // 会议头信息
  | 'attendees'         // 参会人员
  | 'agenda'            // 议程
  | 'discussion'        // 讨论内容
  | 'resolution'        // 决议事项
  | 'action-items'      // 行动项
  | 'closing';          // 结束语

// ==================== Video Report Types ====================

export interface VideoReport {
  id: string;                    // 视频ID
  type: VideoReportType;         // 视频类型
  title: string;                 // 视频标题
  script: string;                // 脚本内容
  sourceId?: string;             // 来源ID（会议/决议）
  config: VideoConfig;           // 视频配置
  status: VideoStatus;           // 生成状态
  outputPath?: string;           // 输出路径
  createdAt: string;             // 创建时间
}

export type VideoReportType =
  | 'resolution-announcement'    // 决议公告
  | 'investor-update'            // 投资者更新
  | 'internal-communication'     // 内部沟通
  | 'compliance-disclosure'      // 合规披露
  | 'board-summary';             // 董事会摘要

export interface VideoConfig {
  voice?: string;                // TTS 声音
  speed?: number;                // 语速
  bgVideo?: string;              // 背景视频
  bgOpacity?: number;            // 背景透明度
  style?: VideoStyle;            // 视觉风格
}

export type VideoStyle =
  | 'corporate'         // 企业风格
  | 'modern'            // 现代风格
  | 'cyber'             // 赛博风格（原有）
  | 'minimal';          // 极简风格

export type VideoStatus =
  | 'pending'           // 待生成
  | 'generating'        // 生成中
  | 'completed'         // 已完成
  | 'failed';           // 失败

// ==================== Compliance Types ====================

export interface ComplianceCheck {
  meetingId: string;             // 会议ID
  checks: ComplianceItem[];      // 检查项
  passed: boolean;               // 是否通过
  warnings: string[];            // 警告信息
  errors: string[];              // 错误信息
  checkedAt: string;             // 检查时间
}

export interface ComplianceItem {
  name: string;                  // 检查项名称
  category: ComplianceCategory;  // 类别
  required: boolean;             // 是否必需
  passed: boolean;               // 是否通过
  message?: string;              // 消息
}

export type ComplianceCategory =
  | 'quorum'            // 法定人数
  | 'notice'            // 通知程序
  | 'voting'            // 表决程序
  | 'documentation'     // 文档完整性
  | 'disclosure'        // 信息披露
  | 'governance';       // 公司治理

// ==================== Configuration ====================

export interface SecretaryConfig {
  apiKey?: string;               // OpenAI API Key
  dataPath?: string;             // 数据存储路径
  templates?: {
    [key in MinutesTemplate]?: string;
  };
  compliance?: {
    quorumRatio?: number;        // 法定人数比例
    votingThreshold?: number;    // 表决通过阈值
    noticeAdvanceDays?: number;  // 提前通知天数
  };
}

// ==================== Database/Storage ====================

export interface Database {
  meetings: Map<string, Meeting>;
  resolutions: Map<string, Resolution>;
  actionItems: Map<string, ActionItem>;
  minutes: Map<string, Minutes>;
  videoReports: Map<string, VideoReport>;
}
