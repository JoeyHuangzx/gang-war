import { _decorator, Component, Node } from 'cc';
import { UIType } from '../Enum/UIEnum';
const { ccclass, property } = _decorator;

@ccclass('BaseUI')
export class BaseUI<T = unknown> extends Component {
  uiType: UIType = null;

  /** 初始化UI（可传入数据） */
  public init(data?: T): void {}

  /** 显示UI */
  public show(_uiType: UIType): void {
    this.uiType = _uiType;
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
