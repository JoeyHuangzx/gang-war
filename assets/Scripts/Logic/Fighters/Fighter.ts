import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { PoolManager } from '../Pools/PoolManager';
import { Constants } from '../../Global/Constants';
const { ccclass, property } = _decorator;

/**
 * 士兵战斗的主要逻辑都在这里
 */
@ccclass('Fighter')
export class Fighter extends Component {
  @property(Node)
  shadow: Node = null;

  @property(Node)
  modelParent: Node = null;

  start() {}

  initData(fighterName: string) {
    let model = PoolManager.getInstance().get(fighterName); // instantiate(modelPrefab);
    this.modelParent.addChild(model);
    model.setPosition(0, 0, 0);
  }

  update(deltaTime: number) {}
}
