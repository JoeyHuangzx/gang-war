import { Asset, assetManager, resources, SpriteFrame, Texture2D } from 'cc';
import { LogManager } from './LogManager';
import { Profiler } from '../Common/Profile/Profile';

// 使用示例
/* const resourceManager = ResourceManager.instance;

// 加载本地预制体
const prefab = await resourceManager.load("prefabs/Character");

// 加载远程图片（自动转换为SpriteFrame）
const remoteTexture = await resourceManager.load(
  "https://example.com/image.png",
  SpriteFrame
);

// 批量加载
const [audioClip, texture] = await resourceManager.loadAll([
  "audios/bgm",
  "textures/icon"
]);

// 释放单个资源
resourceManager.release("prefabs/Character");

// 批量释放
resourceManager.releaseAll(["audios/bgm", "textures/icon"]);

// 清空所有缓存
resourceManager.clear(); */

export class ResourceManager {
  private static _instance: ResourceManager;
  private cache: Map<string, { refCount: number; asset: any }> = new Map();

  public static getInstance(): ResourceManager {
    if (!this._instance) {
      this._instance = new ResourceManager();
    }
    return this._instance;
  }

  /**
   * 加载资源（支持本地/远程）
   * @param path 资源路径或URL
   * @param type 指定资源类型（仅远程资源有效）
   */
  public async load<T extends typeof Asset>(path: string, type?: T): Promise<InstanceType<T>> {
    Profiler.start('ResourceManager.load_' + path);
    if (this.cache.has(path)) {
      const entry = this.cache.get(path)!;
      entry.refCount++;
      Profiler.end('ResourceManager.load_' + path);
      return entry.asset as InstanceType<T>;
    }

    try {
      const asset = await (this.isRemotePath(path) ? this.loadRemote(path, type) : this.loadLocal(path));

      this.cache.set(path, { refCount: 1, asset });
      Profiler.end('ResourceManager.load_' + path);
      LogManager.info(`Resource loaded success: ${path}`);
      return asset as InstanceType<T>;
    } catch (error) {
      LogManager.error(`Failed to load resource: ${path}`, error);
      Profiler.end('ResourceManager.load_' + path);
      throw error;
    }
  }

  /**
   * 批量加载资源
   * @param paths 资源路径数组
   */
  public async loadAll(paths: string[]): Promise<any[]> {
    return Promise.all(paths.map(p => this.load(p)));
  }

  /**
   * 释放资源
   * @param path 资源路径或URL
   */
  public release(path: string): void {
    if (!this.cache.has(path)) {
      LogManager.warn(`Resource not loaded: ${path}`);
      return;
    }

    const entry = this.cache.get(path)!;
    if (--entry.refCount <= 0) {
      assetManager.releaseAsset(entry.asset);
      this.cache.delete(path);
      LogManager.info(`Resource released: ${path}`);
    }
  }

  /**
   * 批量释放资源
   * @param paths 资源路径数组
   */
  public releaseAll(paths: string[]): void {
    paths.forEach(p => this.release(p));
  }

  /**
   * 清空所有缓存资源
   */
  public clear(): void {
    this.cache.forEach((value, key) => {
      assetManager.releaseAsset(value.asset);
    });
    this.cache.clear();
    LogManager.info('All resources cleared');
  }

  private isRemotePath(path: string): boolean {
    return path.startsWith('http://') || path.startsWith('https://');
  }

  private loadLocal<T extends typeof Asset>(path: string): Promise<InstanceType<T>> {
    return new Promise((resolve, reject) => {
      resources.load(path, (err: Error, asset: InstanceType<T>) => {
        err ? reject(err) : resolve(asset);
      });
    });
  }

  private loadRemote<T extends typeof Asset>(url: string, type?: T): Promise<InstanceType<T>> {
    return new Promise((resolve, reject) => {
      assetManager.loadRemote(url, { type: type?.name }, (err, asset) => {
        if (err) return reject(err);

        // 处理图片资源自动转换为Texture2D
        if (asset instanceof Texture2D) {
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = asset;
          spriteFrame.addRef();
          resolve(spriteFrame as InstanceType<T>);
        } else {
          resolve(asset as InstanceType<T>);
        }
      });
    });
  }
}
