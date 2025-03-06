import { _decorator, instantiate, Node, resources, Prefab, Component } from 'cc';
import { UIConfig } from './Config/UIConfig';
import { UIType } from './Enum/UIEnum';
import { BaseUI } from './Views/BaseUI';
import { ResourceManager } from '../Core/ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
  @property(Node) private uiRoot: Node = null; // UI根节点
  private static instance: UIManager;
  private uiInstances: Map<UIType, BaseUI> = new Map(); // 存储已加载的UI

  onLoad() {
    UIManager.instance = this;
  }

  public static getInstance(): UIManager {
    return UIManager.instance;
  }

  /** 显示 UI */
  public async showUI<T>(uiType: UIType, data?: T): Promise<BaseUI> {
    let ui = this.uiInstances.get(uiType);

    if (!ui) {
      const prefabPath = UIConfig[uiType];
      const prefab = await ResourceManager.getInstance().load(prefabPath, Prefab); //this.loadPrefab(prefabPath);
      const uiNode = instantiate(prefab);
      uiNode.parent = this.uiRoot;

      ui = uiNode.getComponent(BaseUI) as BaseUI<T>;
      this.uiInstances.set(uiType, ui);
    }

    ui.init(data as T); // 初始化UI
    ui.show();
    return ui;
  }

  /** 隐藏 UI */
  public hideUI(uiType: UIType): void {
    const ui = this.uiInstances.get(uiType);
    if (ui) ui.hide();
  }

  /** 销毁 UI */
  public destroyUI(uiType: UIType): void {
    const ui = this.uiInstances.get(uiType);
    if (ui) {
      ui.dispose();
      this.uiInstances.delete(uiType);
    }
  }
}
