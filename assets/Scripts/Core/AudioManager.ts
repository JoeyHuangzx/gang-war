import { _decorator, Component, Node, Vec3, Tween, Prefab, AudioSource, game, AudioClip } from 'cc';
import { ResourceManager } from './ResourceManager';

// 敌我双方士兵脚本
const { ccclass, property } = _decorator;

//TODO 还没验证
/**
 * 音效管理类（独立于组件）
 * 
 */ 
class AudioManager {
  private static _instance: AudioManager;
  private _bgMusic: AudioSource | null = null;
  private _effectPool: Map<string, AudioSource[]> = new Map();
  private _volume: number = 1.0;

  // 私有构造函数
  private constructor() {}
  // 初始化资源池和音量
  private _init() {
    this._volume = 1.0;
    this._prepareEffectPools();
  }

  // 获取单例
  public static getInstance(): AudioManager {
    if (!this._instance) {
      this._instance = new AudioManager();
      this._instance._init();
    }
    return this._instance;
  }

  // 预加载音效资源池
  private _prepareEffectPools() {
    // 示例：预先加载所有音效类型
    const effectTypes = ['explosion', 'hit', 'footstep'];
    effectTypes.forEach(type => {
      this._loadEffectResources(type, 5); // 每个类型预留5个实例
    });
  }

  // 加载指定类型的音效资源（动态扩展）
  private async _loadEffectResources(type: string, maxInstances: number) {
    const url = `audio/effects/${type}.mp3`; // 根据实际路径调整
    try {
      const _audio = await ResourceManager.getInstance().load(url, AudioClip);
      if (!this._effectPool.has(type)) {
        this._effectPool.set(type, []);
      }
      while (this._effectPool[type].length < maxInstances) {
        //TODO 是否需要创建Node？
        const source = new AudioSource();
        source.clip = _audio;
        source.volume = this._volume;
        this._effectPool[type].push(source);
      }
    } catch (error) {}
  }

  // 播放背景音乐
  public async playBGM(url: string, loop: boolean = true, volume: number = 1.0) {
    if (this._bgMusic) {
      this._bgMusic.stop();
    }
    try {
      const _bgMusic = await ResourceManager.getInstance().load(url, AudioClip);
      this._bgMusic = new AudioSource();
      this._bgMusic.clip = _bgMusic;
      this._bgMusic.volume = volume;
      this._bgMusic.loop = loop;
      this._bgMusic.play();
    } catch (error) {}
  }

  // 停止背景音乐
  public stopBGM() {
    if (this._bgMusic) {
      this._bgMusic.stop();
      this._bgMusic = null;
    }
  }

  // 播放音效（带3D空间定位）
  public async playEffect(
    url: string,
    position: Vec3 = new Vec3(),
    volume: number = 1.0,
    loop: boolean = false,
  ): Promise<AudioSource> {
    try {
      const _source = await ResourceManager.getInstance().load(url, AudioClip);
      // 从池中获取实例
      let sources = this._effectPool.get(url) || [];
      if (sources.length === 0) {
        // 动态创建新实例（紧急情况）
        sources = [new AudioSource()];
        this._effectPool.set(url, sources);
      }
      const source = sources.pop();

      // 配置参数
      source.clip = _source;
      source.volume = volume;
      source.node.setPosition(position); // 3D空间定位
      source.loop = loop;
      source.play();

      // 监听完成事件以回收资源
      source.node.once('finish', () => {
        this.releaseEffect(source, url);
      });

      return source;
    } catch (error) {
      return null;
    }
  }

  // 手动回收音效实例（可选）
  public releaseEffect(source: AudioSource, url: string) {
    if (source && this._effectPool.get(url)) {
      this._effectPool.get(url).push(source);
    }
  }

  // 设置全局音量
  public setGlobalVolume(volume: number) {
    this._volume = volume;
    if (this._bgMusic) this._bgMusic.volume = volume;
    // 需要更新所有活动的音效实例音量（性能敏感，建议仅在必要时调用）
    // this._updateAllActiveEffects(volume);
  }

  // 私有方法：更新所有活动音效音量（可根据需求选择性启用）
  private _updateAllActiveEffects(volume: number) {
    // 遍历所有池中的实例并设置音量（非常耗时，建议仅用于调试）
    this._effectPool.forEach((sources, url) => {
      sources.forEach(src => {
        if (src.playing) src.volume = volume;
      });
    });
  }

  // 销毁单例（游戏结束时调用）
  public destroy() {
    if (this._bgMusic) {
      this._bgMusic.stop();
      this._bgMusic = null;
    }
    // 清空资源池
    this._effectPool.forEach(sources => {
      sources.forEach(src => {
        src.destroy();
      });
      sources=[];
    });
    this._effectPool.clear();
  }
}

// 使用示例
/* const audioMgr = AudioManager.getInstance();

// 播放背景音乐
audioMgr.playBGM('bgm_level1.mp3', true);

// 播放爆炸音效（在指定位置）
const explosionEffect = audioMgr.playEffect('explosion.mp3', new Vec3(10, 0, 5));

// 手动回收音效（非必须，由自动监听回收）
audioMgr.releaseEffect(explosionEffect, 'explosion.mp3');

// 设置全局音量
audioMgr.setGlobalVolume(0.5);

// 游戏结束销毁
audioMgr.destroy(); */
