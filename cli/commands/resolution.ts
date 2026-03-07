#!/usr/bin/env node
import { CompanySecretary } from '../../dist/company-secretary.js';
import * as path from 'path';

const args = process.argv.slice(2);
const dataPath = path.join(process.cwd(), 'data');
const secretary = new CompanySecretary({ dataPath });

function usage() {
  console.log(`
决议管理命令

用法:
  company-secretary resolution <action> [options]

Actions:
  create        创建决议
  list          列出决议
  show          查看决议详情
  update        更新决议状态

创建决议:
  --meeting-id <id>     会议ID
  --title <title>       决议标题
  --content <content>   决议内容
  --voting <string>     表决结果 (格式: "8:0:0" 或 "赞成8票，反对0票，弃权0票")
  --type <type>         决议类型 (financial/strategic/personnel/etc)
  --deadline <date>     执行期限

列出决议:
  --status <status>     按状态过滤 (pending/in-progress/completed)
  --type <type>         按类型过滤

更新状态:
  --id <id>             决议ID
  --status <status>     新状态

示例:
  # 创建决议
  company-secretary resolution create \\
    --meeting-id "2026-Q1-01" \\
    --title "批准财务报告" \\
    --voting "8:0:0"

  # 列出待执行决议
  company-secretary resolution list --status pending
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
        createResolution(params);
        break;
      case 'list':
        listResolutions(params);
        break;
      case 'show':
        showResolution(params);
        break;
      case 'update':
        updateResolution(params);
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

function createResolution(params: any) {
  if (!params['meeting-id'] || !params.title || !params.voting) {
    console.error('Missing required parameters: --meeting-id, --title, --voting');
    process.exit(1);
  }

  const resolution = secretary.resolutions.createQuickResolution({
    meetingId: params['meeting-id'],
    title: params.title,
    content: params.content || params.title,
    votingString: params.voting,
  });

  if (params.type) {
    secretary.resolutions.updateResolution(resolution.id, { type: params.type });
  }

  if (params.deadline) {
    secretary.resolutions.updateResolution(resolution.id, { deadline: params.deadline });
  }

  secretary.saveData();

  console.log('\n✅ 决议创建成功!\n');
  console.log(`决议ID: ${resolution.id}`);
  console.log(`标题: ${resolution.title}`);
  console.log(`表决结果: 赞成${resolution.voting.for}票，反对${resolution.voting.against}票，弃权${resolution.voting.abstain}票`);
  console.log(`结果: ${resolution.voting.passed ? '✓ 通过' : '✗ 未通过'}`);
  console.log('');
}

function listResolutions(params: any) {
  const resolutions = secretary.resolutions.listResolutions({
    status: params.status,
    type: params.type,
  });

  console.log(`\n找到 ${resolutions.length} 个决议:\n`);

  if (resolutions.length === 0) {
    console.log('暂无决议');
    return;
  }

  resolutions.forEach((res, index) => {
    const status = getStatusBadge(res.status);
    console.log(`${index + 1}. ${res.id} - ${res.title}`);
    console.log(`   会议: ${res.meetingId} | 状态: ${status}`);
    if (res.deadline) {
      console.log(`   截止: ${res.deadline}`);
    }
    console.log('');
  });
}

function showResolution(params: any) {
  if (!params.id) {
    console.error('Missing required parameter: --id');
    process.exit(1);
  }

  const resolution = secretary.resolutions.getResolution(params.id);
  if (!resolution) {
    console.error(`Resolution not found: ${params.id}`);
    process.exit(1);
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          决议详情                      ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`决议ID: ${resolution.id}`);
  console.log(`标题: ${resolution.title}`);
  console.log(`类型: ${resolution.type}`);
  console.log(`状态: ${getStatusBadge(resolution.status)}`);
  console.log(`\n内容:\n${resolution.content}\n`);
  console.log(`表决结果: 赞成${resolution.voting.for}票，反对${resolution.voting.against}票，弃权${resolution.voting.abstain}票`);
  console.log(`结果: ${resolution.voting.passed ? '✓ 通过' : '✗ 未通过'}`);

  if (resolution.deadline) {
    console.log(`\n截止日期: ${resolution.deadline}`);
  }
  if (resolution.responsible) {
    console.log(`负责人: ${resolution.responsible}`);
  }
  console.log('');
}

function updateResolution(params: any) {
  if (!params.id || !params.status) {
    console.error('Missing required parameters: --id and --status');
    process.exit(1);
  }

  secretary.resolutions.updateStatus(params.id, params.status);
  secretary.saveData();

  console.log(`\n✅ 决议 ${params.id} 状态已更新为: ${params.status}\n`);
}

function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    'pending': '⏰ 待执行',
    'in-progress': '🔄 执行中',
    'completed': '✅ 已完成',
    'overdue': '🔴 已逾期',
    'cancelled': '❌ 已取消',
  };
  return badges[status] || status;
}

main();
