# Poster Generator - 海报生成器

使用 HTML + Chrome Headless 生成高质量项目海报图片。

## 快速使用

```bash
# 使用默认模板生成海报
npm run poster

# 使用指定模板
npm run poster default my-poster

# 使用 research-analyst 模板
npm run poster:research
```

## 可用模板

- **default.html** - OpenClaw Video Generator 标准海报
- **research-analyst.html** - Research Analyst 项目海报

## 自定义模板

### 创建新模板

1. 在 `scripts/poster-templates/` 目录下创建新的 HTML 文件
2. 设计海报尺寸为 1200x1600 像素
3. 使用完整的 HTML + CSS（不依赖外部资源）

### 模板示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>项目海报</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
        }
        .poster {
            width: 1200px;
            height: 1600px;
            /* 你的海报样式 */
        }
    </style>
</head>
<body>
    <div class="poster">
        <!-- 海报内容 -->
    </div>
</body>
</html>
```

### 使用自定义模板

```bash
# 假设你创建了 my-template.html
npm run poster my-template output-name
```

## 技术原理

1. **HTML/CSS 设计** - 使用纯前端技术设计海报布局
2. **Chrome Headless** - 无头浏览器渲染 HTML 为高质量截图
3. **FFmpeg 优化** - 将 PNG 转换为压缩的 JPG 格式

## 输出格式

每次生成会产生两个文件：

- **{name}.png** - 高清无损 PNG（约 800KB，适合打印）
- **{name}.jpg** - 压缩优化 JPG（约 350KB，适合网络分享）

## 依赖要求

- **Chrome/Chromium** - 必需（用于渲染 HTML）
  ```bash
  # Ubuntu/Debian
  sudo apt install google-chrome-stable
  # 或
  sudo apt install chromium-browser
  ```

- **FFmpeg** - 可选（用于 JPG 转换）
  ```bash
  # Ubuntu/Debian
  sudo apt install ffmpeg
  ```

## 故障排除

### Chrome not found

如果遇到 "Chrome/Chromium not found" 错误：

```bash
# 检查是否已安装
which google-chrome
which chromium
which chromium-browser

# 如果未安装，安装其中之一
sudo apt install google-chrome-stable
```

### FFmpeg not found

FFmpeg 是可选的，如果未安装会跳过 JPG 生成：

```bash
# 安装 FFmpeg
sudo apt install ffmpeg
```

## 集成到 CLI

海报生成器也可以集成到 `openclaw-video-generator` CLI 中：

```bash
# 通过 CLI 生成海报
openclaw-video-generator poster [template] [output]
```

## 高级用法

### 批量生成

```bash
# 生成所有模板
for template in default research-analyst; do
  npm run poster $template $template-poster
done
```

### 自动化工作流

```bash
#!/bin/bash
# 发布前自动生成海报
npm run poster:default
npm run poster:research
git add *.png *.jpg
git commit -m "Update project posters"
```

## 最佳实践

1. **模板设计**
   - 使用 1200x1600 像素（3:4 比例）
   - 内嵌所有 CSS（不依赖外部文件）
   - 避免使用网络图片（使用 base64 或 SVG）

2. **性能优化**
   - PNG 适合需要透明背景的场景
   - JPG 适合社交媒体分享（文件更小）

3. **版本管理**
   - 将生成的 PNG/JPG 加入 .gitignore
   - 或仅在发布时生成海报

## 示例输出

生成后的海报可用于：

- 📱 社交媒体（Twitter, LinkedIn, 微信朋友圈）
- 📄 项目文档（README, GitHub Profile）
- 🎨 演示文稿（PPT, Keynote）
- 🖼️ 项目展示（官网, 产品页面）
