import { _decorator, instantiate, Node, Prefab, SpriteFrame, Texture2D } from 'cc';
import { ResourceManager } from './ResourceManager';
import { GridManager } from '../Logic/Map/GridManager';
import { Soldier } from '../Logic/Soldiers/Soldier';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

export class SoldierManager {
  private static _instance: SoldierManager;

  private constructor() {}

  public static getInstance(): SoldierManager {
    if (!this._instance) {
      this._instance = new SoldierManager();
    }
    return this._instance;
  }

  public initData() {
    this.loadSoldier();
  }

  // 加载士兵
  public async loadSoldier() {
    const soldierPrefab = await ResourceManager.getInstance().load('prefabs/fight/fighter', Prefab);
    const modelPrefab = await ResourceManager.getInstance().load('prefabs/model/man/axe', Prefab);
    const grids = GameManager.getInstance().gridManager.gridMap;
    for (let index = 1; index <= grids.size; index++) {
      const gridNode = grids.get(index);
      const soldier = instantiate(soldierPrefab);
      GameManager.getInstance().gameNode.addChild(soldier);
      soldier.setPosition(gridNode.position);
      soldier.getComponent(Soldier).initData(modelPrefab);
    }
  }
}
