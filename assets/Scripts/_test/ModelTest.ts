import { _decorator, Component, director, EventKeyboard, input, Input, instantiate, KeyCode, Node, Prefab, Vec3 } from 'cc';
import { ResourceManager } from '../Core/ResourceManager';
import { FighterModel } from '../Logic/Fighters/FighterModel';
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
      const solider: FighterModel = await this.createMode(
        'fighter',
        new Vec3(i < 3 ? -10 : 10, 0, -1.5 + 1.5 * (i % 3)),
      );
      if (i < 3) {
        solider.formation = FormationEnum.Self;
      } else {
        solider.formation = FormationEnum.Enemy;
      }
    }
    const soliders = director.getScene().children.filter(node => node.name == 'fighter');
    for (let i = 0; i < soliders.length; i++) {
      const solider: FighterModel = soliders[i].getComponent(FighterModel);
      if (solider.formation === FormationEnum.Enemy) {
        solider.enemies = soliders.filter(node => node.getComponent(FighterModel).formation === FormationEnum.Self);
      } else {
        solider.enemies = soliders.filter(node => node.getComponent(FighterModel).formation === FormationEnum.Enemy);
      }
      // solider.findClosestEnemy();
    }
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        const soliders = director.getScene().children.filter(node => node.name == 'fighter');
        soliders.forEach(solider => {
          solider.getComponent(FighterModel).findClosestEnemy();
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
    return _node.getComponent(FighterModel);
  }

  update(deltaTime: number) {}
}
