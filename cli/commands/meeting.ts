#!/usr/bin/env node
import { CompanySecretary } from '../../dist/company-secretary.js';
import * as path from 'path';

/**
 * Meeting 命令 - 会议管理
 */

const args = process.argv.slice(2);
const dataPath = path.join(process.cwd(), 'data');
const secretary = new CompanySecretary({ dataPath });

function usage() {
  console.log(`
会议管理命令

用法:
  company-secretary meeting <action> [options]

Actions:
  create        创建新会议
  list          列出会议
  show          查看会议详情
  start         开始会议
  close         结束会议
  record        记录会议内容

创建会议:
  --date <date>         会议日期 (YYYY-MM-DD)
  --type <type>         会议类型 (regular/special/annual)
  --title <title>       会议标题
  --location <loc>      会议地点

列出会议:
  --status <status>     按状态过滤 (scheduled/in-progress/completed)
  --type <type>         按类型过滤

查看会议:
  --meeting-id <id>     会议ID

记录内容:
  --meeting-id <id>     会议ID
  --transcript <file>   会议记录文件

示例:
  # 创建会议
  company-secretary meeting create \\
    --date "2026-03-15" \\
    --type "regular" \\
    --title "第一季度董事会"

  # 列出所有已安排的会议
  company-secretary meeting list --status scheduled

  # 查看会议详情
  company-secretary meeting show --meeting-id "2026-Q1-01"
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
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    usage();
    process.exit(0);
  }

  const action = args[0];
  const params = parseArgs();

  try {
    switch (action) {
      case 'create':
        createMeeting(params);
        break;
      case 'list':
        listMeetings(params);
        break;
      case 'show':
        showMeeting(params);
        break;
      case 'start':
        startMeeting(params);
        break;
      case 'close':
        closeMeeting(params);
        break;
      case 'record':
        recordMeeting(params);
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

function createMeeting(params: any) {
  if (!params.date || !params.title) {
    console.error('Missing required parameters: --date and --title');
    process.exit(1);
  }

  const meeting = secretary.meetings.createMeeting({
    date: params.date,
    type: params.type || 'regular',
    title: params.title,
    location: params.location,
  });

  secretary.saveData();

  console.log('\n✅ 会议创建成功!\n');
  console.log(`会议ID: ${meeting.id}`);
  console.log(`标题: ${meeting.title}`);
  console.log(`时间: ${meeting.date}`);
  console.log(`类型: ${meeting.type}`);
  console.log(`状态: ${meeting.status}`);
  console.log('');
}

function listMeetings(params: any) {
  const meetings = secretary.meetings.listMeetings({
    status: params.status,
    type: params.type,
  });

  console.log(`\n找到 ${meetings.length} 个会议:\n`);

  if (meetings.length === 0) {
    console.log('暂无会议');
    return;
  }

  meetings.forEach((meeting, index) => {
    console.log(`${index + 1}. ${meeting.id} - ${meeting.title}`);
    console.log(`   时间: ${meeting.date} | 类型: ${meeting.type} | 状态: ${meeting.status}`);
    console.log(`   议程数: ${meeting.agenda.length} | 决议数: ${meeting.resolutions.length}`);
    console.log('');
  });
}

function showMeeting(params: any) {
  if (!params['meeting-id']) {
    console.error('Missing required parameter: --meeting-id');
    process.exit(1);
  }

  const meeting = secretary.meetings.getMeeting(params['meeting-id']);
  if (!meeting) {
    console.error(`Meeting not found: ${params['meeting-id']}`);
    process.exit(1);
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          会议详情                      ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log(`会议ID: ${meeting.id}`);
  console.log(`标题: ${meeting.title}`);
  console.log(`时间: ${meeting.date}`);
  console.log(`地点: ${meeting.location}`);
  console.log(`类型: ${meeting.type}`);
  console.log(`状态: ${meeting.status}`);
  console.log('');

  if (meeting.attendees.length > 0) {
    console.log('参会人员:');
    meeting.attendees.forEach(a => {
      const status = a.present ? '✓' : '○';
      console.log(`  ${status} ${a.name} (${a.role})`);
    });
    console.log('');
  }

  if (meeting.agenda.length > 0) {
    console.log('会议议程:');
    meeting.agenda.forEach(a => {
      const status = a.completed ? '✓' : '○';
      console.log(`  ${status} ${a.order}. ${a.topic} (汇报人: ${a.presenter})`);
    });
    console.log('');
  }

  if (meeting.resolutions.length > 0) {
    console.log(`决议: ${meeting.resolutions.length} 个`);
  }

  if (meeting.actionItems.length > 0) {
    console.log(`行动项: ${meeting.actionItems.length} 个`);
  }

  console.log('');
}

function startMeeting(params: any) {
  if (!params['meeting-id']) {
    console.error('Missing required parameter: --meeting-id');
    process.exit(1);
  }

  secretary.meetings.startMeeting(params['meeting-id']);
  secretary.saveData();

  console.log(`\n✅ 会议 ${params['meeting-id']} 已开始\n`);
}

function closeMeeting(params: any) {
  if (!params['meeting-id']) {
    console.error('Missing required parameter: --meeting-id');
    process.exit(1);
  }

  secretary.meetings.closeMeeting(params['meeting-id']);
  secretary.saveData();

  console.log(`\n✅ 会议 ${params['meeting-id']} 已结束\n`);
}

function recordMeeting(params: any) {
  if (!params['meeting-id'] || !params.transcript) {
    console.error('Missing required parameters: --meeting-id and --transcript');
    process.exit(1);
  }

  const fs = require('fs');
  const transcript = fs.readFileSync(params.transcript, 'utf-8');

  secretary.meetings.recordTranscript(params['meeting-id'], transcript);
  secretary.saveData();

  console.log(`\n✅ 会议记录已保存\n`);
}

main();
