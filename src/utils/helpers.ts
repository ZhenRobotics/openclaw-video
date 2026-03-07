/**
 * 生成唯一ID
 * @param prefix 前缀，如 'RES', 'ACT', 'AGD'
 * @returns 格式：PREFIX-YYYY-NNN
 */
export function generateId(prefix: string): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}-${year}-${timestamp}${random}`;
}

/**
 * 获取当前时间戳（ISO 8601格式）
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 格式化日期
 * @param date ISO字符串或Date对象
 * @param format 格式：'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'Chinese'
 */
export function formatDate(
  date: string | Date,
  format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'Chinese' = 'YYYY-MM-DD'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'Chinese':
      return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * 计算天数差
 */
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 检查日期是否逾期
 */
export function isOverdue(deadline: string | Date): boolean {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  return d < new Date();
}

/**
 * 获取相对时间描述
 * @param date 日期
 * @returns '今天', '明天', '3天后', '2天前' 等
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (diffDays > 0) return `${diffDays}天后`;
  return `${Math.abs(diffDays)}天前`;
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * 生成摘要
 * @param text 原文
 * @param maxLength 最大长度
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
