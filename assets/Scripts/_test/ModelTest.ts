import { _decorator, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ResourceManager } from '../Core/ResourceManager';
import { SoldierModel } from '../Logic/Soldiers/SoldierModel';
const { ccclass, property } = _decorator;

@ccclass('ModelTest')
export class ModelTest extends Component {
  async start() {
    const solider:SoldierModel=await this.createMode('soldier',new Vec3(-10,0,1.5));
    const solider2:SoldierModel=await this.createMode('soldier',new Vec3(-10,0,-1.5));
    const enemy:SoldierModel=await this.createMode('enemy',new Vec3(10,0,1.5));
    const enemy2:SoldierModel=await this.createMode('enemy',new Vec3(10,0,-1.5));
    solider.enemies.push(enemy.node,enemy2.node);
    solider2.enemies.push(enemy.node,enemy2.node);
    enemy.enemies.push(solider.node,solider2.node);
    enemy2.enemies.push(solider.node,solider2.node);
    solider.findClosestEnemy();
    solider2.findClosestEnemy();
    enemy.findClosestEnemy();
    enemy2.findClosestEnemy();
  }

  async createMode(name:string,pos:Vec3) {
    const modelPrefab = await ResourceManager.getInstance().load(`prefabs/model/man/axe`, Prefab);
    const _node = instantiate(modelPrefab);
    _node.name = name;
    director.getScene().addChild(_node);
    _node.setWorldPosition(pos);
    return _node.getComponent(SoldierModel);
  }

  update(deltaTime: number) {}
}
