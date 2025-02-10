// Toast.ts
import {
  _decorator,
  Node,
  Label,
  tween,
  Vec3,
  Color,
  Graphics,
  UITransform,
  find,
  Size,
  Sprite,
  Layers,
  resources,
  instantiate,
  Prefab,
  director,
} from 'cc';
const { ccclass } = _decorator;

export class Toast {
  /**
   * 显示一个黑底白字的 Toast
   * @param message 显示的消息
   * @param duration 显示时间（秒），默认 1 秒
   */
  public static async show(message: string, duration: number = 1.0): Promise<void> {
    // 获取 Canvas 节点
    const canvas = find('Canvas');
    if (!canvas) {
      console.warn('Canvas 节点未找到，Toast 无法显示');
      return;
    }
    let toastNode = canvas.getChildByName('Toast');
    if (!toastNode) {
      // 创建一个新的节点
      const prefab = await this.loadPrefab();
      toastNode = instantiate(prefab);
      toastNode.name='Toast';
      canvas.addChild(toastNode);
      director.addPersistRootNode(toastNode);
    }
    toastNode.getComponentInChildren(Label).string = message;
    toastNode.setPosition(new Vec3(0,-100,0));
    toastNode.layer = Layers.BitMask.UI_2D;
    // 使用 Tween 实现延时后淡出效果，并自动销毁节点
    const fadeDuration = 0.5; // 淡出时间 0.5 秒
    const target = toastNode.getComponent(UITransform);
    tween(toastNode)
      .to(duration, { position: new Vec3(0, 100, 0) })
      .call(() => {
        toastNode.destroy();
      })
      .start();
  }

  static async loadPrefab():Promise<Prefab>{
    return new Promise((resolve, reject) => {
      resources.load('prefabs/common/toast',Prefab, (err, prefab) => {
        if (err) reject(err);
        else resolve(prefab);
      });
    });
  }
}
