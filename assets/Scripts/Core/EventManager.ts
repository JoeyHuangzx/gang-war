export class EventManager {
    private static events: Map<string, Set<Function>> = new Map();
  
    /**
     * 注册事件监听
     * @param event - 事件名
     * @param callback - 事件触发时的回调函数
     */
    public static on(event: string, callback: Function): void {
      if (!this.events.has(event)) {
        this.events.set(event, new Set());
      }
      this.events.get(event).add(callback);
    }
  
    /**
     * 注销事件监听
     * @param event - 事件名
     * @param callback - 要移除的回调函数
     */
    public static off(event: string, callback: Function): void {
      const listeners = this.events.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.events.delete(event);
        }
      }
    }
  
    /**
     * 触发事件
     * @param event - 事件名
     * @param args - 事件回调函数的参数
     */
    public static emit(event: string, ...args: any[]): void {
      const listeners = this.events.get(event);
      if (listeners) {
        listeners.forEach(callback => callback(...args));
      }
    }
  
    /**
     * 清除所有监听器
     */
    public static clear(): void {
      this.events.clear();
    }
  }
  