import {
  Meeting,
  Minutes,
  MinutesTemplate,
  MinutesSection,
  SectionType,
} from '../secretary-types.js';
import { getCurrentTimestamp } from '../utils/helpers.js';

/**
 * 纪要生成器
 * 负责根据会议信息生成标准化的会议纪要
 */
export class MinutesGenerator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 生成会议纪要
   */
  async generateMinutes(
    meeting: Meeting,
    template: MinutesTemplate = 'standard'
  ): Promise<Minutes> {
    const sections = this.buildSections(meeting, template);

    // 如果有会议转录，使用 AI 优化内容
    if (meeting.transcript) {
      await this.enhanceSectionsWithAI(sections, meeting);
    }

    const minutes: Minutes = {
      meetingId: meeting.id,
      title: `${meeting.title} - 会议纪要`,
      date: meeting.date,
      template,
      sections,
      generatedAt: getCurrentTimestamp(),
    };

    return minutes;
  }

  /**
   * 构建纪要章节
   */
  private buildSections(meeting: Meeting, template: MinutesTemplate): MinutesSection[] {
    const sections: MinutesSection[] = [];

    // 1. 会议头信息
    sections.push({
      type: 'header',
      title: '会议基本信息',
      content: this.formatHeader(meeting),
      order: 1,
    });

    // 2. 参会人员
    sections.push({
      type: 'attendees',
      title: '参会人员',
      content: this.formatAttendees(meeting),
      order: 2,
    });

    // 3. 议程
    sections.push({
      type: 'agenda',
      title: '会议议程',
      content: this.formatAgenda(meeting),
      order: 3,
    });

    // 4. 讨论内容
    if (meeting.transcript) {
      sections.push({
        type: 'discussion',
        title: '会议讨论',
        content: meeting.transcript,
        order: 4,
      });
    }

    // 5. 决议事项
    if (meeting.resolutions.length > 0) {
      sections.push({
        type: 'resolution',
        title: '会议决议',
        content: this.formatResolutions(meeting),
        order: 5,
      });
    }

    // 6. 行动项
    if (meeting.actionItems.length > 0) {
      sections.push({
        type: 'action-items',
        title: '行动项',
        content: this.formatActionItems(meeting),
        order: 6,
      });
    }

    // 7. 结束语
    sections.push({
      type: 'closing',
      title: '会议结束',
      content: this.formatClosing(meeting),
      order: 7,
    });

    return sections;
  }

  /**
   * 格式化会议头信息
   */
  private formatHeader(meeting: Meeting): string {
    return `
**会议名称**：${meeting.title}
**会议类型**：${this.getMeetingTypeName(meeting.type)}
**会议时间**：${meeting.date}
**会议地点**：${meeting.location}
**会议状态**：${this.getMeetingStatusName(meeting.status)}
    `.trim();
  }

  /**
   * 格式化参会人员
   */
  private formatAttendees(meeting: Meeting): string {
    const groups = new Map<string, string[]>();

    meeting.attendees.forEach(attendee => {
      const roleName = this.getAttendeeRoleName(attendee.role);
      if (!groups.has(roleName)) {
        groups.set(roleName, []);
      }

      const status = attendee.present ? '✓' : '✗';
      const proxy = attendee.proxy ? ` (代理人：${attendee.proxy})` : '';
      groups.get(roleName)!.push(`${status} ${attendee.name}${proxy}`);
    });

    const lines: string[] = [];
    groups.forEach((names, role) => {
      lines.push(`\n**${role}**：`);
      names.forEach(name => lines.push(`- ${name}`));
    });

    // 统计出席情况
    const total = meeting.attendees.length;
    const present = meeting.attendees.filter(a => a.present).length;
    lines.push(`\n**出席情况**：应到 ${total} 人，实到 ${present} 人`);

    return lines.join('\n');
  }

  /**
   * 格式化议程
   */
  private formatAgenda(meeting: Meeting): string {
    const items = meeting.agenda
      .sort((a, b) => a.order - b.order)
      .map(item => {
        const status = item.completed ? '✓' : '○';
        const duration = item.duration ? ` (${item.duration}分钟)` : '';
        return `${status} **议题${item.order}**：${item.topic} (汇报人：${item.presenter})${duration}`;
      });

    return items.join('\n');
  }

  /**
   * 格式化决议
   */
  private formatResolutions(meeting: Meeting): string {
    const items = meeting.resolutions.map((res, index) => {
      const voting = `赞成 ${res.voting.for} 票，反对 ${res.voting.against} 票，弃权 ${res.voting.abstain} 票`;
      const result = res.voting.passed ? '**通过**' : '**未通过**';

      return `
### 决议 ${index + 1}：${res.title}

**内容**：${res.content}

**表决结果**：${voting}，${result}

**执行期限**：${res.deadline || '无'}
      `.trim();
    });

    return items.join('\n\n---\n\n');
  }

  /**
   * 格式化行动项
   */
  private formatActionItems(meeting: Meeting): string {
    const items = meeting.actionItems.map((action, index) => {
      const priority = action.priority === 'high' ? '🔴 高' : action.priority === 'medium' ? '🟡 中' : '🟢 低';
      return `${index + 1}. **${action.task}**\n   - 负责人：${action.assignee}\n   - 截止日期：${action.deadline}\n   - 优先级：${priority}`;
    });

    return items.join('\n\n');
  }

  /**
   * 格式化结束语
   */
  private formatClosing(meeting: Meeting): string {
    return `
会议于 ${meeting.date} 结束。

本纪要由董事会秘书整理，经董事长审核通过。
    `.trim();
  }

  /**
   * 使用 AI 增强章节内容
   */
  private async enhanceSectionsWithAI(
    sections: MinutesSection[],
    meeting: Meeting
  ): Promise<void> {
    // 找到讨论内容章节
    const discussionSection = sections.find(s => s.type === 'discussion');
    if (!discussionSection || !meeting.transcript) {
      return;
    }

    try {
      // 调用 OpenAI API 优化讨论内容
      const enhanced = await this.callOpenAI(meeting.transcript);
      discussionSection.content = enhanced;
    } catch (error) {
      console.error('Failed to enhance with AI:', error);
      // 失败时保留原始内容
    }
  }

  /**
   * 调用 OpenAI API
   */
  private async callOpenAI(transcript: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `你是一位专业的董事会秘书，负责整理会议纪要。请将以下会议讨论内容整理成结构化、专业的会议纪要格式。

要求：
1. 保留关键信息和决策点
2. 使用专业、正式的语言
3. 按议题组织内容
4. 突出重要结论和决议
5. 保持客观中立`,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 将纪要导出为 Markdown
   */
  exportToMarkdown(minutes: Minutes): string {
    const lines: string[] = [];

    lines.push(`# ${minutes.title}\n`);
    lines.push(`生成时间：${minutes.generatedAt}\n`);

    minutes.sections.forEach(section => {
      lines.push(`\n## ${section.title}\n`);
      lines.push(section.content);
    });

    if (minutes.approvedBy) {
      lines.push(`\n---\n`);
      lines.push(`\n**审核人**：${minutes.approvedBy}`);
      lines.push(`**审核时间**：${minutes.approvedAt}`);
    }

    return lines.join('\n');
  }

  /**
   * 辅助方法：获取会议类型名称
   */
  private getMeetingTypeName(type: string): string {
    const names: Record<string, string> = {
      regular: '定期董事会',
      special: '特别董事会',
      annual: '年度股东大会',
      audit: '审计委员会',
      remuneration: '薪酬委员会',
      nomination: '提名委员会',
      strategy: '战略委员会',
    };
    return names[type] || type;
  }

  /**
   * 辅助方法：获取会议状态名称
   */
  private getMeetingStatusName(status: string): string {
    const names: Record<string, string> = {
      scheduled: '已安排',
      'in-progress': '进行中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return names[status] || status;
  }

  /**
   * 辅助方法：获取参会人员角色名称
   */
  private getAttendeeRoleName(role: string): string {
    const names: Record<string, string> = {
      chairman: '董事长',
      director: '董事',
      independent: '独立董事',
      supervisor: '监事',
      executive: '高管（列席）',
      secretary: '董事会秘书',
      observer: '观察员',
    };
    return names[role] || role;
  }
}
