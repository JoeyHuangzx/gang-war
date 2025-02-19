import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import { ResourceManager } from '../../Core/ResourceManager';
import { PoolManager } from '../Pools/PoolManager';
import { Constants } from '../../Global/Constants';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
  async start() {}

  async showEffect() {
    // const prefab =
    const node = PoolManager.getInstance().get('upLoop01');
    this.node.addChild(node);
    node.setPosition(0, 0);
  }

  update(deltaTime: number) {}
}
