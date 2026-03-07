// Company Secretary - Main Entry Point
export { CompanySecretary, default } from './company-secretary.js';

// Export core managers
export { MeetingManager } from './core/meeting-manager.js';
export { MinutesGenerator } from './core/minutes-generator.js';
export { ResolutionTracker } from './core/resolution-tracker.js';
export { ActionTracker } from './core/action-tracker.js';

// Export all types
export * from './secretary-types.js';

// Export utilities
export * from './utils/helpers.js';

// Video功能 - 保留用于汇报视频生成
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root.js';

// 只在需要视频功能时注册
if (typeof window !== 'undefined') {
  registerRoot(RemotionRoot);
}
