#!/usr/bin/env node
import { CompanySecretary } from '../../dist/company-secretary.js';
import * as path from 'path';

const args = process.argv.slice(2);
const dataPath = path.join(process.cwd(), 'data');
const secretary = new CompanySecretary({ dataPath });

function usage() {
  console.log(`
行动项管理命令

用法:
  company-secretary action <action> [options]

Actions:
  create        创建行动项
  list          列出行动项
  show          查看行动项详情
  update        更新进度
  complete      完成行动项

创建行动项:
  --meeting-id <id>     会议ID
  --task <task>         任务描述
  --assignee <name>     负责人
  --deadline <date>     截止日期
  --priority <level>    优先级 (high/medium/low)

列出行动项:
  --assignee <name>     按负责人过滤
  --status <status>     按状态过滤 (pending/in-progress/completed)
  --priority <level>    按优先级过滤

更新进度:
  --id <id>             行动项ID
  --progress <number>   进度 (0-100)

示例:
  # 创建行动项
  company-secretary action create \\
    --meeting-id "2026-Q1-01" \\
    --task "准备融资材料" \\
    --assignee "CFO" \\
    --deadline "2026-04-30" \\
    --priority high

  # 查看我的待办事项
  company-secretary action list --assignee "CEO" --status pending

  # 更新进度
  company-secretary action update --id "ACT-2026-001" --progress 50
  `);
}

function parseArgs() {
  const params: any = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      params[key] = value;
      i++;
    }
  }
  return params;
}

function main() {
  if (args.length === 0 || args[0] === '--help') {
    usage();
    process.exit(0);
  }

  const action = args[0];
  const params = parseArgs();

  try {
    switch (action) {
      case 'create':
        createAction(params);
        break;
      case 'list':
        listActions(params);
        break;
      case 'show':
        showAction(params);
        break;
      case 'update':
        updateAction(params);
        break;
      case 'complete':
        completeAction(params);
        break;
      default:
        console.error(`Unknown action: ${action}`);
        usage();
        process.exit(1);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function createAction(params: any) {
  if (!params['meeting-id'] || !params.task || !params.assignee || !params.deadline) {
    console.error('Missing required parameters: --meeting-id, --task, --assignee, --deadline');
    process.exit(1);
  }

  const action = secretary.actions.createAction({
    meetingId: params['meeting-id'],
    task: params.task,
    assignee: params.assignee,
    deadline: params.deadline,
    priority: params.priority || 'medium',
  });

  secretary.saveData();

  console.log('\n✅ 行动项创建成功!\n');
  console.log(`行动项ID: ${action.id}`);
  console.log(`任务: ${action.task}`);
  console.log(`负责人: ${action.assignee}`);
  console.log(`截止日期: ${action.deadline}`);
  console.log(`优先级: ${getPriorityBadge(action.priority)}`);
  console.log('');
}

function listActions(params: any) {
  const actions = secretary.actions.listActions({
    assignee: params.assignee,
    status: params.status,
    priority: params.priority,
  });

  console.log(`\n找到 ${actions.length} 个行动项:\n`);

  if (actions.length === 0) {
    console.log('暂无行动项');
    return;
  }

  actions.forEach((action, index) => {
    const priority = getPriorityBadge(action.priority);
    const status = getStatusBadge(action.status);
    const progress = action.progress || 0;

    console.log(`${index + 1}. ${action.id} - ${action.task}`);
    console.log(`   负责人: ${action.assignee} | 截止: ${action.deadline}`);
    console.log(`   优先级: ${priority} | 状态: ${status} | 进度: ${progress}%`);
    console.log('');
  });
}

function showAction(params: any) {
  if (!params.id) {
    console.error('Missing required parameter: --id');
    process.exit(1);
  }

  const action = secretary.actions.getAction(params.id);
  if (!action) {
    console.error(`Action not found: ${params.id}`);
    process.exit(1);
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          行动项详情                    ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`行动项ID: ${action.id}`);
  console.log(`任务: ${action.task}`);
  console.log(`负责人: ${action.assignee}`);
  console.log(`截止日期: ${action.deadline}`);
  console.log(`优先级: ${getPriorityBadge(action.priority)}`);
  console.log(`状态: ${getStatusBadge(action.status)}`);
  console.log(`进度: ${action.progress || 0}%`);

  if (action.notes) {
    console.log(`\n备注:\n${action.notes}`);
  }

  console.log('');
}

function updateAction(params: any) {
  if (!params.id || !params.progress) {
    console.error('Missing required parameters: --id and --progress');
    process.exit(1);
  }

  const progress = parseInt(params.progress);
  secretary.actions.updateProgress(params.id, progress);
  secretary.saveData();

  console.log(`\n✅ 行动项 ${params.id} 进度已更新为: ${progress}%\n`);
}

function completeAction(params: any) {
  if (!params.id) {
    console.error('Missing required parameter: --id');
    process.exit(1);
  }

  secretary.actions.completeAction(params.id);
  secretary.saveData();

  console.log(`\n✅ 行动项 ${params.id} 已完成!\n`);
}

function getPriorityBadge(priority: string): string {
  const badges: Record<string, string> = {
    'high': '🔴 高',
    'medium': '🟡 中',
    'low': '🟢 低',
  };
  return badges[priority] || priority;
}

function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    'pending': '⏰ 待执行',
    'in-progress': '🔄 进行中',
    'completed': '✅ 已完成',
    'overdue': '🔴 已逾期',
    'cancelled': '❌ 已取消',
  };
  return badges[status] || status;
}

main();
