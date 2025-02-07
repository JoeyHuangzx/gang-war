import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseUI')
export class BaseUI<T = unknown> extends Component {
  /** 初始化UI（可传入数据） */
  public init(data?: T): void {}

  /** 显示UI */
  public show(): void {
    this.node.active = true;
  }

  /** 隐藏UI */
  public hide(): void {
    this.node.active = false;
  }

  /** 销毁UI */
  public dispose(): void {
    this.node.destroy();
  }
}
