// StorageManager.ts

import { Constants } from '../Global/Constants';

// 辅助类型：将对象类型中所有值（嵌套的也提取出来）转换为联合类型
type Flatten<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? Flatten<T[K]> : T[K] }[keyof T]
  : T;

type StorageKey = Flatten<typeof Constants.STORAGE_KEY>;

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!this.instance) {
      this.instance = new StorageManager();
    }
    return this.instance;
  }

  // 保存数据到本地存储
  public saveData<T>(key: StorageKey, data: T): void {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(key, dataString);
    } catch (error) {
      console.error(`保存数据到本地存储时出错，键: ${key}`, error);
    }
  }

  // 从本地存储获取数据，支持指定数据类型
  public getData<T>(key: StorageKey): T | null {
    try {
      const dataString = localStorage.getItem(key);
      if (dataString) {
        return JSON.parse(dataString) as T;
      }
      return null;
    } catch (error) {
      console.error(`从本地存储获取数据时出错，键: ${key}`, error);
      return null;
    }
  }

  // 删除本地存储中的数据
  public deleteData(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`删除本地存储中的数据时出错，键: ${key}`, error);
    }
  }
}

export default StorageManager;
