#!/usr/bin/env node
/**
 * Generate high-quality poster image from HTML
 * Usage: node generate-poster.js [template] [output-name]
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse arguments
const template = process.argv[2] || 'default';
const outputName = process.argv[3] || 'poster';

const TEMPLATE_DIR = path.join(__dirname, 'poster-templates');
const HTML_FILE = path.join(TEMPLATE_DIR, `${template}.html`);
const OUTPUT_DIR = path.join(__dirname, '..');
const OUTPUT_PNG = path.join(OUTPUT_DIR, `${outputName}.png`);
const OUTPUT_JPG = path.join(OUTPUT_DIR, `${outputName}.jpg`);

// Check if template exists
if (!fs.existsSync(HTML_FILE)) {
    console.error(`❌ Template not found: ${template}.html`);
    console.log('\n📋 Available templates:');
    const templates = fs.readdirSync(TEMPLATE_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => f.replace('.html', ''));
    templates.forEach(t => console.log(`   - ${t}`));
    console.log('\n💡 Usage: npm run poster [template] [output-name]');
    console.log('   Example: npm run poster default my-poster');
    process.exit(1);
}

console.log('🎨 生成项目海报...');
console.log(`📄 模板: ${template}.html`);
console.log(`📦 输出: ${outputName}.{png,jpg}\n`);

// Generate PNG with Chrome headless
console.log('📸 Step 1/2: 生成 PNG 截图...');
try {
    // Try google-chrome first, fallback to chromium
    let chromeCmd = 'google-chrome';
    try {
        execSync('which google-chrome', { stdio: 'pipe' });
    } catch {
        try {
            execSync('which chromium', { stdio: 'pipe' });
            chromeCmd = 'chromium';
        } catch {
            try {
                execSync('which chromium-browser', { stdio: 'pipe' });
                chromeCmd = 'chromium-browser';
            } catch {
                throw new Error('Chrome/Chromium not found. Please install google-chrome or chromium.');
            }
        }
    }

    execSync(
        `${chromeCmd} --headless --disable-gpu ` +
        `--screenshot="${OUTPUT_PNG}" ` +
        `--window-size=1200,1600 ` +
        `--default-background-color=0 ` +
        `"file://${HTML_FILE}"`,
        { stdio: 'inherit' }
    );

    const stats = fs.statSync(OUTPUT_PNG);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ PNG 生成成功: ${size} KB\n`);
} catch (error) {
    console.error('   ❌ PNG 生成失败:', error.message);
    process.exit(1);
}

// Convert to JPG for smaller file size
console.log('🖼️  Step 2/2: 转换为 JPG（优化文件大小）...');
try {
    execSync(
        `ffmpeg -i "${OUTPUT_PNG}" -q:v 2 "${OUTPUT_JPG}" -y`,
        { stdio: 'pipe' }
    );

    const stats = fs.statSync(OUTPUT_JPG);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ JPG 生成成功: ${size} KB\n`);
} catch (error) {
    console.log('   ⚠️  JPG 生成跳过（ffmpeg 未安装或失败）\n');
}

// Summary
console.log('━'.repeat(60));
console.log('✨ 海报生成完成！\n');
console.log('📂 生成的文件:');
console.log(`   - ${outputName}.png  (高清 PNG)`);
if (fs.existsSync(OUTPUT_JPG)) {
    console.log(`   - ${outputName}.jpg  (压缩 JPG)`);
}
console.log('\n💡 使用建议:');
console.log('   - 网页展示: 使用原始 HTML 模板');
console.log('   - 打印/设计: 使用 PNG 格式');
console.log('   - 社交媒体: 使用 JPG 格式');
console.log('\n📋 可用模板:');
const templates = fs.readdirSync(TEMPLATE_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
templates.forEach(t => console.log(`   - ${t}`));
console.log('━'.repeat(60));
