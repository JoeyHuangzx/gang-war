import {
  _decorator,
  Component,
  director,
  EventKeyboard,
  input,
  Input,
  instantiate,
  KeyCode,
  Node,
  Prefab,
  Vec3,
} from 'cc';
import { ResourceManager } from '../Core/ResourceManager';
import { FighterModel } from '../Logic/Fighters/FighterModel';
import { FighterTypeEnum } from '../Global/FighterTypeEnum';
import { PoolManager } from '../Logic/Pools/PoolManager';
import { Profiler } from '../Common/Profile/Profile';
const { ccclass, property } = _decorator;

@ccclass('ModelTest')
export class ModelTest extends Component {
  async start() {
    this.testModel();
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  async testModel() {
    const mgr = ResourceManager.getInstance();
    Profiler.start('init_pool');
    const prefabs = await Promise.all([
      mgr.load(`prefabs/model/man/axe`, Prefab),
      mgr.load(`prefabs/model/man/altman01`, Prefab),
      mgr.load(`prefabs/fight/fighter`, Prefab),
    ]);
    // const modelPrefab = await ResourceManager.getInstance().load(`prefabs/model/man/axe`, Prefab);
    for (let i = 0; i < prefabs.length; i++) {
      PoolManager.getInstance().initPool(prefabs[i].name, prefabs[i], 3, 10);
    }
    Profiler.end('init_pool');
    return;
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        break;
    }
  }

  async createMode(name: string, pos: Vec3) {
    const modelPrefab = await ResourceManager.getInstance().load(`prefabs/model/man/axe`, Prefab);
    const _node = instantiate(modelPrefab);
    _node.name = name;
    director.getScene().addChild(_node);
    _node.setWorldPosition(pos);
    return _node.getComponent(FighterModel);
  }

  update(deltaTime: number) {}
}
