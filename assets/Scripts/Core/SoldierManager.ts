import { _decorator, instantiate, Node, Prefab, SpriteFrame, Texture2D } from 'cc';
import { ResourceManager } from './ResourceManager';
import { GridManager } from '../Logic/Map/GridManager';
import { Soldier } from '../Logic/Soldiers/Soldier';
import { GameManager } from './GameManager';
import { Cell } from '../Logic/Map/Cell';
import { PlayerData } from './PlayerData';
import { UserData } from '../Net/NetApi';
import { DataManager } from './DataManager';

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

  userData: UserData = null;

  public initData() {
    // this.loadSoldier();
    this.userData = PlayerData.getInstance().UserData;
    GameManager.getInstance().gridManager.generateGrids(this.userData.formation.length);
    this.userData.formation.forEach(item => {
      let _soldierPrefabName = '';
      if (item.soldierId) {
        _soldierPrefabName = DataManager.getInstance().getFighterData(item.soldierId).prefabName;
      }
      this.loadSoldier(item.id, _soldierPrefabName);
    });
  }

  // 加载士兵
  public async loadSoldier(pos: number, soldierPrefabName: string) {
    // 士兵底座
    const basePrefab = await ResourceManager.getInstance().load('prefabs/fight/fighter', Prefab);
    const grids = GameManager.getInstance().gridManager.gridMap;
    const gridNode = grids.get(pos);
    const baseNode = instantiate(basePrefab);
    GameManager.getInstance().gameNode.addChild(baseNode);
    baseNode.setPosition(gridNode.position);
    if (soldierPrefabName !== '') {
      const modelPrefab = await ResourceManager.getInstance().load(`prefabs/model/man/${soldierPrefabName}`, Prefab);
      baseNode.getComponent(Soldier).initData(modelPrefab);
      gridNode.getComponent(Cell).showEffect();
    }
  }
}
