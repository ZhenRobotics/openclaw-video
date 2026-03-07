import {
  Meeting,
  MeetingType,
  MeetingStatus,
  Attendee,
  AgendaItem,
  Resolution,
  ActionItem,
} from '../secretary-types.js';
import { generateId, getCurrentTimestamp } from '../utils/helpers.js';

/**
 * 会议管理器
 * 负责创建、更新、查询会议信息
 */
export class MeetingManager {
  private meetings: Map<string, Meeting> = new Map();

  /**
   * 创建新会议
   */
  createMeeting(params: {
    date: string;
    type: MeetingType;
    title: string;
    location?: string;
  }): Meeting {
    const id = this.generateMeetingId(params.date, params.type);

    const meeting: Meeting = {
      id,
      date: params.date,
      type: params.type,
      title: params.title,
      location: params.location || '待定',
      attendees: [],
      agenda: [],
      resolutions: [],
      actionItems: [],
      status: 'scheduled',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    this.meetings.set(id, meeting);
    return meeting;
  }

  /**
   * 添加参会人员
   */
  addAttendee(meetingId: string, attendee: Omit<Attendee, 'present'>): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    meeting.attendees.push({
      ...attendee,
      present: false, // 默认未签到
    });

    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 签到
   */
  markAttendance(meetingId: string, attendeeName: string, present: boolean): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    const attendee = meeting.attendees.find(a => a.name === attendeeName);
    if (!attendee) {
      throw new Error(`Attendee not found: ${attendeeName}`);
    }

    attendee.present = present;
    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 添加议程
   */
  addAgendaItem(meetingId: string, agenda: Omit<AgendaItem, 'id' | 'completed'>): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    const agendaItem: AgendaItem = {
      ...agenda,
      id: generateId('AGD'),
      completed: false,
    };

    meeting.agenda.push(agendaItem);
    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 更新议程状态
   */
  updateAgendaItem(
    meetingId: string,
    agendaId: string,
    updates: Partial<AgendaItem>
  ): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    const agenda = meeting.agenda.find(a => a.id === agendaId);
    if (!agenda) {
      throw new Error(`Agenda item not found: ${agendaId}`);
    }

    Object.assign(agenda, updates);
    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 记录会议内容
   */
  recordTranscript(meetingId: string, transcript: string): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    meeting.transcript = transcript;
    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 开始会议
   */
  startMeeting(meetingId: string): void {
    this.updateMeetingStatus(meetingId, 'in-progress');
  }

  /**
   * 结束会议
   */
  closeMeeting(meetingId: string): void {
    this.updateMeetingStatus(meetingId, 'completed');
  }

  /**
   * 取消会议
   */
  cancelMeeting(meetingId: string): void {
    this.updateMeetingStatus(meetingId, 'cancelled');
  }

  /**
   * 更新会议状态
   */
  private updateMeetingStatus(meetingId: string, status: MeetingStatus): void {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    meeting.status = status;
    this.updateMeeting(meetingId, meeting);
  }

  /**
   * 获取会议
   */
  getMeeting(meetingId: string): Meeting | undefined {
    return this.meetings.get(meetingId);
  }

  /**
   * 列出所有会议
   */
  listMeetings(filters?: {
    type?: MeetingType;
    status?: MeetingStatus;
    dateFrom?: string;
    dateTo?: string;
  }): Meeting[] {
    let meetings = Array.from(this.meetings.values());

    if (filters?.type) {
      meetings = meetings.filter(m => m.type === filters.type);
    }

    if (filters?.status) {
      meetings = meetings.filter(m => m.status === filters.status);
    }

    if (filters?.dateFrom) {
      meetings = meetings.filter(m => m.date >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      meetings = meetings.filter(m => m.date <= filters.dateTo!);
    }

    // 按日期倒序
    return meetings.sort((a, b) => b.date.localeCompare(a.date));
  }

  /**
   * 更新会议
   */
  private updateMeeting(meetingId: string, meeting: Meeting): void {
    meeting.updatedAt = getCurrentTimestamp();
    this.meetings.set(meetingId, meeting);
  }

  /**
   * 生成会议ID
   * 格式：YYYY-QN-NN 或 YYYY-MN-NN
   */
  private generateMeetingId(date: string, type: MeetingType): string {
    const year = new Date(date).getFullYear();
    const quarter = Math.ceil((new Date(date).getMonth() + 1) / 3);

    // 获取该季度已有会议数
    const prefix = `${year}-Q${quarter}`;
    const existingCount = Array.from(this.meetings.keys())
      .filter(id => id.startsWith(prefix))
      .length;

    const sequence = String(existingCount + 1).padStart(2, '0');
    return `${prefix}-${sequence}`;
  }

  /**
   * 检查法定人数
   */
  checkQuorum(meetingId: string, requiredRatio: number = 0.5): {
    hasQuorum: boolean;
    present: number;
    total: number;
    ratio: number;
  } {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found: ${meetingId}`);
    }

    // 只统计董事和独立董事
    const directors = meeting.attendees.filter(
      a => a.role === 'director' || a.role === 'independent'
    );

    const total = directors.length;
    const present = directors.filter(a => a.present).length;
    const ratio = total > 0 ? present / total : 0;

    return {
      hasQuorum: ratio >= requiredRatio,
      present,
      total,
      ratio,
    };
  }

  /**
   * 导出会议数据
   */
  export(): Map<string, Meeting> {
    return this.meetings;
  }

  /**
   * 导入会议数据
   */
  import(meetings: Map<string, Meeting>): void {
    this.meetings = meetings;
  }
}
