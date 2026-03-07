import {
  Resolution,
  ResolutionType,
  ResolutionStatus,
  VotingResult,
} from '../secretary-types.js';
import { generateId, getCurrentTimestamp } from '../utils/helpers.js';

/**
 * 决议跟踪器
 * 负责创建、更新、跟踪决议执行情况
 */
export class ResolutionTracker {
  private resolutions: Map<string, Resolution> = new Map();

  /**
   * 创建决议
   */
  createResolution(params: {
    meetingId: string;
    agendaId?: string;
    title: string;
    content: string;
    type: ResolutionType;
    voting: VotingResult;
    deadline?: string;
    responsible?: string;
  }): Resolution {
    const id = generateId('RES');

    const resolution: Resolution = {
      id,
      meetingId: params.meetingId,
      agendaId: params.agendaId,
      title: params.title,
      content: params.content,
      type: params.type,
      voting: params.voting,
      status: params.voting.passed ? 'pending' : 'cancelled',
      deadline: params.deadline,
      responsible: params.responsible,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    this.resolutions.set(id, resolution);
    return resolution;
  }

  /**
   * 快速创建决议（简化版）
   */
  createQuickResolution(params: {
    meetingId: string;
    title: string;
    content: string;
    votingString: string; // 格式: "8:0:0" 或 "赞成8票，反对0票，弃权0票"
  }): Resolution {
    const voting = this.parseVotingString(params.votingString);

    return this.createResolution({
      meetingId: params.meetingId,
      title: params.title,
      content: params.content,
      type: 'governance', // 默认类型
      voting,
    });
  }

  /**
   * 解析表决字符串
   */
  private parseVotingString(votingString: string): VotingResult {
    // 支持 "8:0:0" 格式
    const simpleMatch = votingString.match(/^(\d+):(\d+):(\d+)$/);
    if (simpleMatch) {
      const forVotes = parseInt(simpleMatch[1]);
      const against = parseInt(simpleMatch[2]);
      const abstain = parseInt(simpleMatch[3]);
      const total = forVotes + against + abstain;

      return {
        for: forVotes,
        against,
        abstain,
        total,
        passed: forVotes > against, // 简单多数通过
      };
    }

    // 支持中文格式 "赞成8票，反对0票，弃权0票"
    const chineseMatch = votingString.match(/赞成(\d+)票.*反对(\d+)票.*弃权(\d+)票/);
    if (chineseMatch) {
      const forVotes = parseInt(chineseMatch[1]);
      const against = parseInt(chineseMatch[2]);
      const abstain = parseInt(chineseMatch[3]);
      const total = forVotes + against + abstain;

      return {
        for: forVotes,
        against,
        abstain,
        total,
        passed: forVotes > against,
      };
    }

    throw new Error(`Invalid voting string format: ${votingString}`);
  }

  /**
   * 更新决议状态
   */
  updateStatus(resolutionId: string, status: ResolutionStatus, notes?: string): void {
    const resolution = this.getResolution(resolutionId);
    if (!resolution) {
      throw new Error(`Resolution not found: ${resolutionId}`);
    }

    resolution.status = status;
    if (notes) {
      resolution.notes = notes;
    }
    resolution.updatedAt = getCurrentTimestamp();

    this.resolutions.set(resolutionId, resolution);
  }

  /**
   * 更新决议信息
   */
  updateResolution(
    resolutionId: string,
    updates: Partial<Omit<Resolution, 'id' | 'createdAt'>>
  ): void {
    const resolution = this.getResolution(resolutionId);
    if (!resolution) {
      throw new Error(`Resolution not found: ${resolutionId}`);
    }

    Object.assign(resolution, updates, {
      updatedAt: getCurrentTimestamp(),
    });

    this.resolutions.set(resolutionId, resolution);
  }

  /**
   * 获取决议
   */
  getResolution(resolutionId: string): Resolution | undefined {
    return this.resolutions.get(resolutionId);
  }

  /**
   * 列出决议
   */
  listResolutions(filters?: {
    meetingId?: string;
    type?: ResolutionType;
    status?: ResolutionStatus;
    responsible?: string;
    overdue?: boolean;
  }): Resolution[] {
    let resolutions = Array.from(this.resolutions.values());

    if (filters?.meetingId) {
      resolutions = resolutions.filter(r => r.meetingId === filters.meetingId);
    }

    if (filters?.type) {
      resolutions = resolutions.filter(r => r.type === filters.type);
    }

    if (filters?.status) {
      resolutions = resolutions.filter(r => r.status === filters.status);
    }

    if (filters?.responsible) {
      resolutions = resolutions.filter(r => r.responsible === filters.responsible);
    }

    if (filters?.overdue) {
      const now = new Date().toISOString();
      resolutions = resolutions.filter(
        r => r.deadline && r.deadline < now && r.status !== 'completed'
      );
    }

    // 按创建时间倒序
    return resolutions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * 检查逾期决议
   */
  checkOverdueResolutions(): Resolution[] {
    const now = new Date().toISOString();

    const overdueResolutions = Array.from(this.resolutions.values()).filter(
      r =>
        r.deadline &&
        r.deadline < now &&
        (r.status === 'pending' || r.status === 'in-progress')
    );

    // 自动更新状态为 overdue
    overdueResolutions.forEach(r => {
      r.status = 'overdue';
      r.updatedAt = getCurrentTimestamp();
      this.resolutions.set(r.id, r);
    });

    return overdueResolutions;
  }

  /**
   * 获取决议统计
   */
  getStatistics(filters?: { meetingId?: string; type?: ResolutionType }): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    cancelled: number;
    passRate: number;
  } {
    let resolutions = Array.from(this.resolutions.values());

    if (filters?.meetingId) {
      resolutions = resolutions.filter(r => r.meetingId === filters.meetingId);
    }

    if (filters?.type) {
      resolutions = resolutions.filter(r => r.type === filters.type);
    }

    const total = resolutions.length;
    const pending = resolutions.filter(r => r.status === 'pending').length;
    const inProgress = resolutions.filter(r => r.status === 'in-progress').length;
    const completed = resolutions.filter(r => r.status === 'completed').length;
    const overdue = resolutions.filter(r => r.status === 'overdue').length;
    const cancelled = resolutions.filter(r => r.status === 'cancelled').length;

    const passed = resolutions.filter(r => r.voting.passed).length;
    const passRate = total > 0 ? passed / total : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      cancelled,
      passRate,
    };
  }

  /**
   * 按会议分组
   */
  groupByMeeting(): Map<string, Resolution[]> {
    const groups = new Map<string, Resolution[]>();

    this.resolutions.forEach(resolution => {
      const meetingId = resolution.meetingId;
      if (!groups.has(meetingId)) {
        groups.set(meetingId, []);
      }
      groups.get(meetingId)!.push(resolution);
    });

    return groups;
  }

  /**
   * 按类型分组
   */
  groupByType(): Map<ResolutionType, Resolution[]> {
    const groups = new Map<ResolutionType, Resolution[]>();

    this.resolutions.forEach(resolution => {
      const type = resolution.type;
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(resolution);
    });

    return groups;
  }

  /**
   * 导出数据
   */
  export(): Map<string, Resolution> {
    return this.resolutions;
  }

  /**
   * 导入数据
   */
  import(resolutions: Map<string, Resolution>): void {
    this.resolutions = resolutions;
  }
}
