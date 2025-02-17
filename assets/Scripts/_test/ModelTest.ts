import { _decorator, Component, director, EventKeyboard, input, Input, instantiate, KeyCode, Node, Prefab, Vec3 } from 'cc';
import { ResourceManager } from '../Core/ResourceManager';
import { SoldierModel } from '../Logic/Soldiers/SoldierModel';
import { FormationEnum } from '../Global/FormationEnum';
const { ccclass, property } = _decorator;

@ccclass('ModelTest')
export class ModelTest extends Component {
  async start() {
    this.testModel();
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  async testModel() {
    for (let i = 0; i < 6; i++) {
      const solider: SoldierModel = await this.createMode(
        'soldier',
        new Vec3(i < 3 ? -10 : 10, 0, -1.5 + 1.5 * (i % 3)),
      );
      if (i < 3) {
        solider.formation = FormationEnum.Self;
      } else {
        solider.formation = FormationEnum.Enemy;
      }
    }
    const soliders = director.getScene().children.filter(node => node.name == 'soldier');
    for (let i = 0; i < soliders.length; i++) {
      const solider: SoldierModel = soliders[i].getComponent(SoldierModel);
      if (solider.formation === FormationEnum.Enemy) {
        solider.enemies = soliders.filter(node => node.getComponent(SoldierModel).formation === FormationEnum.Self);
      } else {
        solider.enemies = soliders.filter(node => node.getComponent(SoldierModel).formation === FormationEnum.Enemy);
      }
      // solider.findClosestEnemy();
    }
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        const soliders = director.getScene().children.filter(node => node.name == 'soldier');
        soliders.forEach(solider => {
          solider.getComponent(SoldierModel).findClosestEnemy();
        });
        break;
    }
  }

  async createMode(name: string, pos: Vec3) {
    const modelPrefab = await ResourceManager.getInstance().load(`prefabs/model/man/axe`, Prefab);
    const _node = instantiate(modelPrefab);
    _node.name = name;
    director.getScene().addChild(_node);
    _node.setWorldPosition(pos);
    return _node.getComponent(SoldierModel);
  }

  update(deltaTime: number) {}
}
