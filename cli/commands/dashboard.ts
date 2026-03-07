#!/usr/bin/env node
import { CompanySecretary } from '../../dist/company-secretary.js';
import * as path from 'path';

/**
 * Dashboard 命令 - 显示工作台概览
 */

const dataPath = path.join(process.cwd(), 'data');
const secretary = new CompanySecretary({ dataPath });

function displayDashboard() {
  const dashboard = secretary.getDashboard();

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          Company Secretary - 工作台                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // 即将到来的会议
  console.log('📅 即将到来的会议');
  console.log('━'.repeat(60));
  if (dashboard.upcomingMeetings.length === 0) {
    console.log('   暂无安排');
  } else {
    dashboard.upcomingMeetings.forEach((meeting, index) => {
      console.log(`${index + 1}. ${meeting.title}`);
      console.log(`   时间: ${meeting.date} | 状态: ${getStatusBadge(meeting.status)}`);
    });
  }

  // 待执行决议
  console.log('\n\n📋 待执行决议');
  console.log('━'.repeat(60));
  if (dashboard.pendingResolutions.length === 0) {
    console.log('   无待执行决议');
  } else {
    dashboard.pendingResolutions.forEach((res, index) => {
      console.log(`${index + 1}. ${res.title}`);
      console.log(`   会议: ${res.meetingId} | 截止: ${res.deadline || '无'}`);
    });
  }

  // 逾期项目
  const totalOverdue = dashboard.overdueResolutions.length + dashboard.overdueActions.length;
  if (totalOverdue > 0) {
    console.log('\n\n⚠️  逾期提醒');
    console.log('━'.repeat(60));

    if (dashboard.overdueResolutions.length > 0) {
      console.log(`🔴 ${dashboard.overdueResolutions.length} 个决议已逾期`);
      dashboard.overdueResolutions.slice(0, 3).forEach(res => {
        console.log(`   • ${res.title} (截止: ${res.deadline})`);
      });
    }

    if (dashboard.overdueActions.length > 0) {
      console.log(`🔴 ${dashboard.overdueActions.length} 个行动项已逾期`);
      dashboard.overdueActions.slice(0, 3).forEach(action => {
        console.log(`   • ${action.task} - ${action.assignee} (截止: ${action.deadline})`);
      });
    }
  }

  // 统计信息
  console.log('\n\n📊 统计信息');
  console.log('━'.repeat(60));

  const actionStats = dashboard.statistics.actions;
  const resolutionStats = dashboard.statistics.resolutions;

  console.log(`行动项: 总数 ${actionStats.total} | ` +
    `待处理 ${actionStats.pending} | ` +
    `进行中 ${actionStats.inProgress} | ` +
    `已完成 ${actionStats.completed}`);

  console.log(`决议: 总数 ${resolutionStats.total} | ` +
    `待执行 ${resolutionStats.pending} | ` +
    `进行中 ${resolutionStats.inProgress} | ` +
    `已完成 ${resolutionStats.completed}`);

  console.log(`\n完成率: 行动项 ${(actionStats.completionRate * 100).toFixed(1)}% | ` +
    `决议通过率 ${(resolutionStats.passRate * 100).toFixed(1)}%`);

  console.log('\n');
}

function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    'scheduled': '⏰ 已安排',
    'in-progress': '🔄 进行中',
    'completed': '✅ 已完成',
    'cancelled': '❌ 已取消',
  };
  return badges[status] || status;
}

// 执行
displayDashboard();
