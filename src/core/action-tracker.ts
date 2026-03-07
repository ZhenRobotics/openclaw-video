import { ActionItem, Priority, ActionStatus } from '../secretary-types.js';
import { generateId, getCurrentTimestamp } from '../utils/helpers.js';

/**
 * 行动项跟踪器
 * 负责创建、更新、跟踪行动项完成情况
 */
export class ActionTracker {
  private actionItems: Map<string, ActionItem> = new Map();

  /**
   * 创建行动项
   */
  createAction(params: {
    meetingId: string;
    resolutionId?: string;
    task: string;
    assignee: string;
    deadline: string;
    priority?: Priority;
    notes?: string;
  }): ActionItem {
    const id = generateId('ACT');

    const action: ActionItem = {
      id,
      meetingId: params.meetingId,
      resolutionId: params.resolutionId,
      task: params.task,
      assignee: params.assignee,
      deadline: params.deadline,
      priority: params.priority || 'medium',
      status: 'pending',
      progress: 0,
      notes: params.notes,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    this.actionItems.set(id, action);
    return action;
  }

  /**
   * 更新行动项进度
   */
  updateProgress(actionId: string, progress: number): void {
    const action = this.getAction(actionId);
    if (!action) {
      throw new Error(`Action item not found: ${actionId}`);
    }

    action.progress = Math.max(0, Math.min(100, progress));

    // 自动更新状态
    if (progress === 0) {
      action.status = 'pending';
    } else if (progress === 100) {
      action.status = 'completed';
      action.completedAt = getCurrentTimestamp();
    } else {
      action.status = 'in-progress';
    }

    action.updatedAt = getCurrentTimestamp();
    this.actionItems.set(actionId, action);
  }

  /**
   * 更新行动项状态
   */
  updateStatus(actionId: string, status: ActionStatus, notes?: string): void {
    const action = this.getAction(actionId);
    if (!action) {
      throw new Error(`Action item not found: ${actionId}`);
    }

    action.status = status;

    if (status === 'completed') {
      action.progress = 100;
      action.completedAt = getCurrentTimestamp();
    }

    if (notes) {
      action.notes = notes;
    }

    action.updatedAt = getCurrentTimestamp();
    this.actionItems.set(actionId, action);
  }

  /**
   * 完成行动项
   */
  completeAction(actionId: string, notes?: string): void {
    this.updateStatus(actionId, 'completed', notes);
  }

  /**
   * 取消行动项
   */
  cancelAction(actionId: string, reason?: string): void {
    this.updateStatus(actionId, 'cancelled', reason);
  }

  /**
   * 更新行动项
   */
  updateAction(
    actionId: string,
    updates: Partial<Omit<ActionItem, 'id' | 'createdAt'>>
  ): void {
    const action = this.getAction(actionId);
    if (!action) {
      throw new Error(`Action item not found: ${actionId}`);
    }

    Object.assign(action, updates, {
      updatedAt: getCurrentTimestamp(),
    });

    this.actionItems.set(actionId, action);
  }

  /**
   * 获取行动项
   */
  getAction(actionId: string): ActionItem | undefined {
    return this.actionItems.get(actionId);
  }

  /**
   * 列出行动项
   */
  listActions(filters?: {
    meetingId?: string;
    resolutionId?: string;
    assignee?: string;
    status?: ActionStatus;
    priority?: Priority;
    overdue?: boolean;
  }): ActionItem[] {
    let actions = Array.from(this.actionItems.values());

    if (filters?.meetingId) {
      actions = actions.filter(a => a.meetingId === filters.meetingId);
    }

    if (filters?.resolutionId) {
      actions = actions.filter(a => a.resolutionId === filters.resolutionId);
    }

    if (filters?.assignee) {
      actions = actions.filter(a => a.assignee === filters.assignee);
    }

    if (filters?.status) {
      actions = actions.filter(a => a.status === filters.status);
    }

    if (filters?.priority) {
      actions = actions.filter(a => a.priority === filters.priority);
    }

    if (filters?.overdue) {
      const now = new Date().toISOString();
      actions = actions.filter(
        a => a.deadline < now && a.status !== 'completed' && a.status !== 'cancelled'
      );
    }

    // 按优先级和截止日期排序
    return actions.sort((a, b) => {
      // 先按优先级
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 再按截止日期
      return a.deadline.localeCompare(b.deadline);
    });
  }

  /**
   * 获取我的行动项
   */
  getMyActions(assignee: string, includeCompleted: boolean = false): ActionItem[] {
    const filters: any = { assignee };
    if (!includeCompleted) {
      // 排除已完成和已取消
      return this.listActions(filters).filter(
        a => a.status !== 'completed' && a.status !== 'cancelled'
      );
    }
    return this.listActions(filters);
  }

  /**
   * 检查逾期行动项
   */
  checkOverdueActions(): ActionItem[] {
    const now = new Date().toISOString();

    const overdueActions = Array.from(this.actionItems.values()).filter(
      a =>
        a.deadline < now &&
        (a.status === 'pending' || a.status === 'in-progress')
    );

    // 自动更新状态为 overdue
    overdueActions.forEach(a => {
      a.status = 'overdue';
      a.updatedAt = getCurrentTimestamp();
      this.actionItems.set(a.id, a);
    });

    return overdueActions;
  }

  /**
   * 获取统计信息
   */
  getStatistics(filters?: {
    assignee?: string;
    meetingId?: string;
  }): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    cancelled: number;
    completionRate: number;
    avgProgress: number;
  } {
    let actions = Array.from(this.actionItems.values());

    if (filters?.assignee) {
      actions = actions.filter(a => a.assignee === filters.assignee);
    }

    if (filters?.meetingId) {
      actions = actions.filter(a => a.meetingId === filters.meetingId);
    }

    const total = actions.length;
    const pending = actions.filter(a => a.status === 'pending').length;
    const inProgress = actions.filter(a => a.status === 'in-progress').length;
    const completed = actions.filter(a => a.status === 'completed').length;
    const overdue = actions.filter(a => a.status === 'overdue').length;
    const cancelled = actions.filter(a => a.status === 'cancelled').length;

    const completionRate = total > 0 ? completed / total : 0;

    const totalProgress = actions.reduce((sum, a) => sum + (a.progress || 0), 0);
    const avgProgress = total > 0 ? totalProgress / total : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      cancelled,
      completionRate,
      avgProgress,
    };
  }

  /**
   * 获取即将到期的行动项（未来N天内）
   */
  getUpcomingActions(days: number = 7): ActionItem[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const futureISO = futureDate.toISOString();

    return Array.from(this.actionItems.values()).filter(
      a =>
        a.deadline <= futureISO &&
        a.deadline >= now.toISOString() &&
        (a.status === 'pending' || a.status === 'in-progress')
    );
  }

  /**
   * 按负责人分组
   */
  groupByAssignee(): Map<string, ActionItem[]> {
    const groups = new Map<string, ActionItem[]>();

    this.actionItems.forEach(action => {
      const assignee = action.assignee;
      if (!groups.has(assignee)) {
        groups.set(assignee, []);
      }
      groups.get(assignee)!.push(action);
    });

    return groups;
  }

  /**
   * 按会议分组
   */
  groupByMeeting(): Map<string, ActionItem[]> {
    const groups = new Map<string, ActionItem[]>();

    this.actionItems.forEach(action => {
      const meetingId = action.meetingId;
      if (!groups.has(meetingId)) {
        groups.set(meetingId, []);
      }
      groups.get(meetingId)!.push(action);
    });

    return groups;
  }

  /**
   * 导出数据
   */
  export(): Map<string, ActionItem> {
    return this.actionItems;
  }

  /**
   * 导入数据
   */
  import(actionItems: Map<string, ActionItem>): void {
    this.actionItems = actionItems;
  }
}
