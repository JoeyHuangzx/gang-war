export class EventManager {
  private static events: Map<string, Array<{ callback: Function; target?: any }>> = new Map();

  /**
   * 监听事件
   * @param eventName 事件名称
   * @param callback 监听回调
   * @param target 绑定的 `this` 作用域
   */
  public static on<T>(eventName: string, callback: (event?: any) => void, target?: T): void {
      if (!this.events.has(eventName)) {
          this.events.set(eventName, []);
      }

      const listeners = this.events.get(eventName)!;

      // 防止重复绑定
      if (listeners.some(listener => listener.callback === callback && listener.target === target)) {
          console.warn(`[EventManager] 事件 '${eventName}' 的监听器已存在`);
          return;
      }

      listeners.push({ callback, target });
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param data 事件参数
   */
  public static emit(eventName: string, data?: any): void {
      const listeners = this.events.get(eventName);
      if (!listeners) return;

      listeners.forEach(({ callback, target }) => {
          if (target) {
              callback.call(target, data); // 绑定 `this`
          } else {
              callback(data);
          }
      });
  }

  /**
   * 解绑事件
   * @param eventName 事件名称
   * @param callback 监听回调
   */
  public static off(eventName: string, callback: Function): void {
      const listeners = this.events.get(eventName);
      if (!listeners) return;

      this.events.set(
          eventName,
          listeners.filter(listener => listener.callback !== callback)
      );

      if (this.events.get(eventName)!.length === 0) {
          this.events.delete(eventName);
      }
  }

  /**
   * 解绑某个对象上的所有事件
   * @param target 需要解绑的对象
   */
  public static offTarget(target: any): void {
      this.events.forEach((listeners, eventName) => {
          this.events.set(
              eventName,
              listeners.filter(listener => listener.target !== target)
          );

          if (this.events.get(eventName)!.length === 0) {
              this.events.delete(eventName);
          }
      });
  }

  /**
   * 解绑所有事件
   */
  public static offAll(): void {
      this.events.clear();
  }
}
