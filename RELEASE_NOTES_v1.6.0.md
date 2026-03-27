## v1.6.0 - Premium Styles System

### 🎨 重大新功能

新增 **5 种高端场景风格**，为视频生成提供专业级视觉选择，替代原有"廉价炫酷"的赛博风格：

#### 1️⃣ Elegance（优雅展示）
- Apple 风格的极简美学
- 慢速淡入动画，玻璃态卡片设计
- 适用于产品发布、品牌展示

#### 2️⃣ Authority（权威叙事）
- 数据驱动的权威感呈现
- 大号数字展示 + 精确间距
- 适用于行业报告、专业分析

#### 3️⃣ Luxury（奢华质感）
- 高端黑金配色，极致克制
- 细腻光晕效果，层次丰富
- 适用于奢侈品、高端服务

#### 4️⃣ Minimal（极简几何）
- 纯粹的几何线条艺术
- 动态方块网格，蓝色科技感
- 适用于科技产品、创新设计

#### 5️⃣ Cinematic（电影叙事）
- 电影级宽屏视觉语言
- 强烈对比度，沉浸式体验
- 适用于预告片、品牌故事

### 🛠️ 技术实现

- **新增文件**:
  - `src/premium-scenes.tsx` - 5 个完整的 React 场景组件
  - `src/premium-tokens.ts` - 统一的设计系统（颜色/字体/效果）
  - `test-premium-styles.sh` - 自动化测试脚本

- **更新文件**:
  - `src/types.ts` - 扩展 `SceneType` 和新增 `styleTheme` 参数
  - `src/SceneRenderer.tsx` - 基于 `styleTheme` 路由场景组件

- **修复问题**:
  - 解决 Remotion Easing 兼容性（`Easing.inOut`/`Easing.expo` 替换为 bezier 曲线）

### 📊 现有风格总数

**11 种场景类型**：
- 6 种赛博风格（cyber theme）
- 5 种高端风格（premium theme）

### 🚀 使用方法

```typescript
// 在 scenes-data.ts 中配置
{
  start: 0,
  end: 3,
  type: 'elegance',       // 使用新的高端场景类型
  styleTheme: 'premium',  // 指定 premium 主题
  title: 'Your Title',
  subtitle: 'Subtitle'
}
```

### 🎥 测试视频

运行测试脚本查看所有 5 种高端风格：
```bash
./test-premium-styles.sh
mpv out/premium-styles-test.mp4
```

### 🔄 向后兼容

✅ **完全兼容**原有赛博风格
- 默认 `styleTheme: 'cyber'`
- 现有项目无需修改即可继续使用

### 📦 安装

```bash
npm install -g openclaw-video-generator@1.6.0
```

### 🔗 链接

- npm: https://www.npmjs.com/package/openclaw-video-generator
- GitHub: https://github.com/ZhenRobotics/openclaw-video-generator
- ClawHub: https://clawhub.ai/ZhenStaff/video-generator
