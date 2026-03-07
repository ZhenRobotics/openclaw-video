/**
 * Company Secretary - 基础使用示例
 */

import { CompanySecretary } from '../src/company-secretary';

async function main() {
  // 初始化董事会秘书
  const secretary = new CompanySecretary({
    dataPath: './example-data',
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('=== 董事会秘书系统示例 ===\n');

  // 1. 创建会议
  console.log('1. 创建董事会会议...');
  const meeting = secretary.meetings.createMeeting({
    date: '2026-03-15',
    type: 'regular',
    title: '2026年第一季度董事会',
    location: '总部会议室A',
  });
  console.log(`✓ 会议创建成功: ${meeting.id}\n`);

  // 2. 添加参会人员
  console.log('2. 添加参会人员...');
  secretary.meetings.addAttendee(meeting.id, {
    name: '张三',
    role: 'chairman',
    title: '董事长',
  });
  secretary.meetings.addAttendee(meeting.id, {
    name: '李四',
    role: 'director',
    title: '董事',
  });
  secretary.meetings.addAttendee(meeting.id, {
    name: '王五',
    role: 'independent',
    title: '独立董事',
  });
  console.log('✓ 参会人员添加完成\n');

  // 3. 添加议程
  console.log('3. 添加会议议程...');
  secretary.meetings.addAgendaItem(meeting.id, {
    order: 1,
    topic: '审议2025年度财务报告',
    presenter: 'CFO',
    duration: 30,
  });
  secretary.meetings.addAgendaItem(meeting.id, {
    order: 2,
    topic: '讨论新一轮融资方案',
    presenter: 'CEO',
    duration: 45,
  });
  console.log('✓ 议程添加完成\n');

  // 4. 签到
  console.log('4. 参会签到...');
  secretary.meetings.markAttendance(meeting.id, '张三', true);
  secretary.meetings.markAttendance(meeting.id, '李四', true);
  secretary.meetings.markAttendance(meeting.id, '王五', true);

  // 检查法定人数
  const quorum = secretary.meetings.checkQuorum(meeting.id);
  console.log(`✓ 出席情况: ${quorum.present}/${quorum.total} (${(quorum.ratio * 100).toFixed(0)}%)`);
  console.log(`✓ 法定人数: ${quorum.hasQuorum ? '已满足' : '未满足'}\n`);

  // 5. 开始会议
  console.log('5. 开始会议...');
  secretary.meetings.startMeeting(meeting.id);
  console.log('✓ 会议已开始\n');

  // 6. 记录会议讨论
  console.log('6. 记录会议讨论...');
  const transcript = `
董事长张三主持会议，宣布会议开始。

议题一：审议2025年度财务报告
CFO汇报了2025年度财务情况：
- 营收：1.2亿元，同比增长45%
- 净利润：2000万元，同比增长60%
- 现金流：健康，账上现金5000万元

各董事审议后一致认为财务状况良好。

议题二：讨论新一轮融资方案
CEO汇报了A轮融资方案：
- 融资金额：5000万元
- 投后估值：5亿元
- 用途：产品研发40%、市场拓展40%、团队建设20%

经讨论，董事会原则同意融资方案。
  `.trim();

  secretary.meetings.recordTranscript(meeting.id, transcript);
  console.log('✓ 会议记录已保存\n');

  // 7. 创建决议
  console.log('7. 记录会议决议...');

  const resolution1 = secretary.resolutions.createResolution({
    meetingId: meeting.id,
    title: '批准2025年度财务报告',
    content: '董事会审议并批准公司2025年度财务报告，同意将财务报告提交股东大会审议。',
    type: 'financial',
    voting: {
      for: 3,
      against: 0,
      abstain: 0,
      total: 3,
      passed: true,
      method: 'show-hands',
    },
  });
  console.log(`✓ 决议1创建: ${resolution1.id}`);

  const resolution2 = secretary.resolutions.createResolution({
    meetingId: meeting.id,
    title: '批准A轮融资方案',
    content: '董事会批准公司A轮融资方案，融资金额5000万元，投后估值5亿元。授权管理层签署相关法律文件。',
    type: 'investment',
    voting: {
      for: 3,
      against: 0,
      abstain: 0,
      total: 3,
      passed: true,
    },
    deadline: '2026-06-30',
    responsible: 'CEO',
  });
  console.log(`✓ 决议2创建: ${resolution2.id}\n`);

  // 8. 创建行动项
  console.log('8. 分配行动项...');

  const action1 = secretary.actions.createAction({
    meetingId: meeting.id,
    resolutionId: resolution2.id,
    task: '完成融资法律文件签署',
    assignee: 'CEO',
    deadline: '2026-04-15',
    priority: 'high',
  });
  console.log(`✓ 行动项1: ${action1.id} - ${action1.task}`);

  const action2 = secretary.actions.createAction({
    meetingId: meeting.id,
    task: '准备股东大会材料',
    assignee: 'Secretary',
    deadline: '2026-04-30',
    priority: 'medium',
  });
  console.log(`✓ 行动项2: ${action2.id} - ${action2.task}\n`);

  // 9. 结束会议
  console.log('9. 结束会议...');
  secretary.meetings.closeMeeting(meeting.id);
  console.log('✓ 会议已结束\n');

  // 10. 生成会议纪要
  console.log('10. 生成会议纪要...');
  const minutes = await secretary.generateMinutes(meeting.id, 'standard');
  console.log(`✓ 纪要已生成: ${minutes.meetingId}\n`);

  // 导出为 Markdown
  const markdown = await secretary.exportMinutesToMarkdown(meeting.id);
  console.log('=== 会议纪要预览 ===\n');
  console.log(markdown.substring(0, 500) + '...\n');

  // 11. 查看工作台
  console.log('11. 查看工作台...');
  const dashboard = secretary.getDashboard();
  console.log(`✓ 待处理决议: ${dashboard.pendingResolutions.length} 个`);
  console.log(`✓ 待处理行动项: ${dashboard.statistics.actions.pending} 个`);
  console.log(`✓ 即将到来的会议: ${dashboard.upcomingMeetings.length} 个\n`);

  // 保存所有数据
  secretary.saveData();
  console.log('✓ 数据已保存到: ' + secretary['dataPath'] + '\n');

  console.log('=== 示例完成 ===');
  console.log('\n查看生成的文件：');
  console.log('- 数据库: example-data/database.json');
  console.log('- 会议纪要: example-data/minutes/' + meeting.id + '.md');
  console.log('\n运行 CLI 查看详情：');
  console.log(`./cli/secretary-cli.sh meeting show --meeting-id ${meeting.id}`);
}

main().catch(console.error);
