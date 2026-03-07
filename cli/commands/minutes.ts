#!/usr/bin/env node
import { CompanySecretary } from '../../dist/company-secretary.js';
import * as path from 'path';
import * as fs from 'fs';

const args = process.argv.slice(2);
const dataPath = path.join(process.cwd(), 'data');
const secretary = new CompanySecretary({ dataPath });

function usage() {
  console.log(`
会议纪要生成命令

用法:
  company-secretary minutes <action> [options]

Actions:
  generate      生成会议纪要
  show          查看纪要
  export        导出纪要

生成纪要:
  --meeting-id <id>     会议ID
  --template <type>     模板类型 (standard/annual/special/audit)

查看纪要:
  --meeting-id <id>     会议ID

导出纪要:
  --meeting-id <id>     会议ID
  --output <file>       输出文件路径

示例:
  # 生成标准纪要
  company-secretary minutes generate \\
    --meeting-id "2026-Q1-01" \\
    --template standard

  # 查看纪要
  company-secretary minutes show --meeting-id "2026-Q1-01"

  # 导出纪要
  company-secretary minutes export \\
    --meeting-id "2026-Q1-01" \\
    --output "董事会纪要.md"
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

async function main() {
  if (args.length === 0 || args[0] === '--help') {
    usage();
    process.exit(0);
  }

  const action = args[0];
  const params = parseArgs();

  try {
    switch (action) {
      case 'generate':
        await generateMinutes(params);
        break;
      case 'show':
        await showMinutes(params);
        break;
      case 'export':
        await exportMinutes(params);
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

async function generateMinutes(params: any) {
  if (!params['meeting-id']) {
    console.error('Missing required parameter: --meeting-id');
    process.exit(1);
  }

  console.log('\n⏳ 正在生成会议纪要...\n');

  const template = params.template || 'standard';
  const minutes = await secretary.generateMinutes(params['meeting-id'], template);

  console.log('✅ 会议纪要生成成功!\n');
  console.log(`会议ID: ${minutes.meetingId}`);
  console.log(`标题: ${minutes.title}`);
  console.log(`模板: ${template}`);
  console.log(`章节数: ${minutes.sections.length}`);
  console.log(`\n保存位置: data/minutes/${minutes.meetingId}.md`);
  console.log('');
}

async function showMinutes(params: any) {
  if (!params['meeting-id']) {
    console.error('Missing required parameter: --meeting-id');
    process.exit(1);
  }

  const minutesPath = path.join(dataPath, 'minutes', `${params['meeting-id']}.md`);

  if (!fs.existsSync(minutesPath)) {
    console.error(`Minutes not found for meeting: ${params['meeting-id']}`);
    console.log('\n提示: 请先运行 generate 命令生成纪要');
    process.exit(1);
  }

  const content = fs.readFileSync(minutesPath, 'utf-8');
  console.log('\n' + content + '\n');
}

async function exportMinutes(params: any) {
  if (!params['meeting-id'] || !params.output) {
    console.error('Missing required parameters: --meeting-id and --output');
    process.exit(1);
  }

  const minutesPath = path.join(dataPath, 'minutes', `${params['meeting-id']}.md`);

  if (!fs.existsSync(minutesPath)) {
    console.error(`Minutes not found for meeting: ${params['meeting-id']}`);
    process.exit(1);
  }

  const content = fs.readFileSync(minutesPath, 'utf-8');
  fs.writeFileSync(params.output, content);

  console.log(`\n✅ 纪要已导出到: ${params.output}\n`);
}

main().catch(console.error);
