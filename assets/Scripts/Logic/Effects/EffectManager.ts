import { director, instantiate, Prefab } from 'cc';
import { ResourceManager } from '../../Core/ResourceManager';
import { Effect } from './Effect';
import { LogManager } from '../../Core/LogManager';

// 单例模式下的EffectManager特效管理类
export class EffectManager {
  private static _instance: EffectManager = null;
  private _effectMap: Map<string, Effect> = new Map<string, Effect>();

  private constructor() {}

  public static getInstance(): EffectManager {
    if (EffectManager._instance === null) {
      EffectManager._instance = new EffectManager();
    }
    return EffectManager._instance;
  }

  public playFireBall() {
    ResourceManager.getInstance()
      .load('prefabs/effect/fireBall01', Prefab)
      .then((prefab: Prefab) => {
        const effect = instantiate(prefab);
        effect.setPosition(0, 0, 0);
        director.getScene().addChild(effect);
        effect.getComponent(Effect).setCallback(() => this.playBoom());
      })
      .catch(error => {
        LogManager.error('加载火球特效失败', error);
      });
  }

  public playBoom() {
    ResourceManager.getInstance()
      .load('prefabs/effect/hitBoom01', Prefab)
      .then((prefab: Prefab) => {
        const effect = instantiate(prefab);
        effect.setPosition(0, 0, 0);
        director.getScene().addChild(effect);
      })
      .catch(error => {
        LogManager.error('加载爆炸特效失败', error);
      });
  }

  public addEffect(effect: Effect): void {
    this._effectMap.set(effect.name, effect);
  }

  public getEffect(name: string): Effect {
    return this._effectMap.get(name);
  }
}
