import { MeetingManager } from './core/meeting-manager.js';
import { MinutesGenerator } from './core/minutes-generator.js';
import { ResolutionTracker } from './core/resolution-tracker.js';
import { ActionTracker } from './core/action-tracker.js';
import {
  Meeting,
  Minutes,
  Resolution,
  ActionItem,
  SecretaryConfig,
  Database,
} from './secretary-types.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Company Secretary - 董事会秘书主类
 * 整合所有核心功能模块
 */
export class CompanySecretary {
  private config: SecretaryConfig;
  private meetingManager: MeetingManager;
  private minutesGenerator: MinutesGenerator;
  private resolutionTracker: ResolutionTracker;
  private actionTracker: ActionTracker;
  private dataPath: string;

  constructor(config: SecretaryConfig = {}) {
    this.config = {
      dataPath: config.dataPath || './data',
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      ...config,
    };

    if (!this.config.apiKey) {
      console.warn('Warning: OpenAI API Key not set. AI features will be unavailable.');
    }

    this.dataPath = this.config.dataPath!;
    this.ensureDataDirectory();

    this.meetingManager = new MeetingManager();
    this.minutesGenerator = new MinutesGenerator(this.config.apiKey || '');
    this.resolutionTracker = new ResolutionTracker();
    this.actionTracker = new ActionTracker();

    this.loadData();
  }

  // ==================== Meeting Management ====================

  get meetings() {
    return this.meetingManager;
  }

  // ==================== Minutes Generation ====================

  async generateMinutes(meetingId: string, template?: any): Promise<Minutes> {
    const meeting = this.meetingManager.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    const minutes = await this.minutesGenerator.generateMinutes(meeting, template);

    // 保存纪要
    await this.saveMinutes(minutes);

    // 更新会议标记
    meeting.minutesGenerated = true;
    this.saveData();

    return minutes;
  }

  async exportMinutesToMarkdown(meetingId: string): Promise<string> {
    const minutes = await this.loadMinutes(meetingId);
    if (!minutes) {
      throw new Error(`Minutes not found for meeting: ${meetingId}`);
    }

    return this.minutesGenerator.exportToMarkdown(minutes);
  }

  // ==================== Resolution Tracking ====================

  get resolutions() {
    return this.resolutionTracker;
  }

  checkOverdueResolutions(): Resolution[] {
    return this.resolutionTracker.checkOverdueResolutions();
  }

  // ==================== Action Item Tracking ====================

  get actions() {
    return this.actionTracker;
  }

  checkOverdueActions(): ActionItem[] {
    return this.actionTracker.checkOverdueActions();
  }

  getMyActions(assignee: string): ActionItem[] {
    return this.actionTracker.getMyActions(assignee);
  }

  // ==================== Dashboard ====================

  getDashboard() {
    const meetings = this.meetingManager.listMeetings({ status: 'scheduled' });
    const upcomingMeetings = meetings.slice(0, 5);

    const pendingResolutions = this.resolutionTracker.listResolutions({
      status: 'pending',
    });

    const overdueResolutions = this.resolutionTracker.checkOverdueResolutions();
    const overdueActions = this.actionTracker.checkOverdueActions();

    const actionStats = this.actionTracker.getStatistics();
    const resolutionStats = this.resolutionTracker.getStatistics();

    return {
      upcomingMeetings,
      pendingResolutions: pendingResolutions.slice(0, 10),
      overdueResolutions,
      overdueActions,
      statistics: {
        actions: actionStats,
        resolutions: resolutionStats,
      },
    };
  }

  // ==================== Data Persistence ====================

  private ensureDataDirectory(): void {
    const dirs = [
      this.dataPath,
      path.join(this.dataPath, 'meetings'),
      path.join(this.dataPath, 'resolutions'),
      path.join(this.dataPath, 'actions'),
      path.join(this.dataPath, 'minutes'),
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  saveData(): void {
    const database: Database = {
      meetings: this.meetingManager.export(),
      resolutions: this.resolutionTracker.export(),
      actionItems: this.actionTracker.export(),
      minutes: new Map(), // 纪要单独保存
      videoReports: new Map(),
    };

    const dbPath = path.join(this.dataPath, 'database.json');
    const data = {
      meetings: Array.from(database.meetings.entries()),
      resolutions: Array.from(database.resolutions.entries()),
      actionItems: Array.from(database.actionItems.entries()),
    };

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }

  loadData(): void {
    const dbPath = path.join(this.dataPath, 'database.json');

    if (!fs.existsSync(dbPath)) {
      return;
    }

    try {
      const content = fs.readFileSync(dbPath, 'utf-8');
      const data = JSON.parse(content);

      if (data.meetings) {
        this.meetingManager.import(new Map(data.meetings));
      }

      if (data.resolutions) {
        this.resolutionTracker.import(new Map(data.resolutions));
      }

      if (data.actionItems) {
        this.actionTracker.import(new Map(data.actionItems));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  private async saveMinutes(minutes: Minutes): Promise<void> {
    const minutesPath = path.join(
      this.dataPath,
      'minutes',
      `${minutes.meetingId}.json`
    );

    fs.writeFileSync(minutesPath, JSON.stringify(minutes, null, 2));

    // 同时保存 Markdown 版本
    const markdown = this.minutesGenerator.exportToMarkdown(minutes);
    const markdownPath = path.join(
      this.dataPath,
      'minutes',
      `${minutes.meetingId}.md`
    );

    fs.writeFileSync(markdownPath, markdown);
  }

  private async loadMinutes(meetingId: string): Promise<Minutes | null> {
    const minutesPath = path.join(this.dataPath, 'minutes', `${meetingId}.json`);

    if (!fs.existsSync(minutesPath)) {
      return null;
    }

    const content = fs.readFileSync(minutesPath, 'utf-8');
    return JSON.parse(content);
  }

  // ==================== Utilities ====================

  /**
   * 完整的会议流程示例
   */
  async createCompleteMeeting(params: {
    date: string;
    title: string;
    attendees: any[];
    agenda: any[];
  }) {
    // 1. 创建会议
    const meeting = this.meetingManager.createMeeting({
      date: params.date,
      type: 'regular',
      title: params.title,
    });

    // 2. 添加参会人员
    params.attendees.forEach(attendee => {
      this.meetingManager.addAttendee(meeting.id, attendee);
    });

    // 3. 添加议程
    params.agenda.forEach(agenda => {
      this.meetingManager.addAgendaItem(meeting.id, agenda);
    });

    this.saveData();
    return meeting;
  }

  /**
   * 导出所有数据（用于备份）
   */
  exportAll(): string {
    return JSON.stringify(
      {
        meetings: Array.from(this.meetingManager.export().entries()),
        resolutions: Array.from(this.resolutionTracker.export().entries()),
        actionItems: Array.from(this.actionTracker.export().entries()),
      },
      null,
      2
    );
  }

  /**
   * 导入所有数据（用于恢复）
   */
  importAll(jsonData: string): void {
    const data = JSON.parse(jsonData);

    if (data.meetings) {
      this.meetingManager.import(new Map(data.meetings));
    }

    if (data.resolutions) {
      this.resolutionTracker.import(new Map(data.resolutions));
    }

    if (data.actionItems) {
      this.actionTracker.import(new Map(data.actionItems));
    }

    this.saveData();
  }
}

// 默认导出
export default CompanySecretary;

// 同时导出所有类型
export * from './secretary-types.js';
export { MeetingManager } from './core/meeting-manager.js';
export { MinutesGenerator } from './core/minutes-generator.js';
export { ResolutionTracker } from './core/resolution-tracker.js';
export { ActionTracker } from './core/action-tracker.js';
