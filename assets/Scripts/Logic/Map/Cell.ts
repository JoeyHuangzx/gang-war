import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import { ResourceManager } from '../../Core/ResourceManager';
import { PoolManager } from '../Pools/PoolManager';
import { Constants } from '../../Global/Constants';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {

  private _effectNode: Node = null;

  async start() {}

  async showEffect() {
    if(this._effectNode) return;
    this._effectNode = PoolManager.getInstance().get('upLoop01');
    this.node.addChild(this._effectNode);
    this._effectNode.setPosition(0, 0);
  }

  update(deltaTime: number) {}
}
