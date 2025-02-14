import { _decorator, instantiate, Node, Prefab, SpriteFrame, Texture2D } from 'cc';
import { ResourceManager } from './ResourceManager';
import { GridManager } from '../Logic/Map/GridManager';
import { Soldier } from '../Logic/Soldiers/Soldier';
import { GameManager } from './GameManager';
import { Cell } from '../Logic/Map/Cell';
import { PlayerData } from './PlayerData';
import { Formation, UserData } from '../Net/NetApi';
import { DataManager } from './DataManager';
import { FormationEnum } from '../Global/FormationEnum';
import { LogManager } from './LogManager';

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
  gridManager: GridManager = null;

  public initData() {
    // this.loadSoldier();
    this.gridManager = GameManager.getInstance().gridManager;
    this.userData = PlayerData.getInstance().UserData;
    this.initFormation(this.userData.formation, FormationEnum.Self);
    this.initFormation(DataManager.getInstance().enemyFormation,FormationEnum.Enemy);
  }

  initFormation(_formation: Formation[],_formationType:FormationEnum){
    this.gridManager.generateGrids(_formation.length, _formationType);
    _formation.forEach(item => {
      let _soldierPrefabName = '';
      if (item.soldierId) {
        _soldierPrefabName = DataManager.getInstance().getFighterData(item.soldierId).prefabName;
      }
      this.loadSoldier(item.id, _soldierPrefabName, _formationType);
    });
  }

  /**
   * 新增阵容（格子）
   */
  public addCell(_formationType: FormationEnum) {
    GameManager.getInstance().gridManager.generateGrids(1,_formationType);
  }

  public addSoldier(formation: Formation, _formationType: FormationEnum) {
    const _soldierPrefabName = DataManager.getInstance().getFighterData(formation.soldierId).prefabName;
    this.loadSoldier(formation.id, _soldierPrefabName, _formationType);
  }

  // 加载士兵
  public async loadSoldier(pos: number, soldierPrefabName: string, _formationType: FormationEnum) {
    // 士兵底座
    const basePrefab = await ResourceManager.getInstance().load('prefabs/fight/fighter', Prefab);
    const grids = _formationType === FormationEnum.Self ? this.gridManager.gridMap : this.gridManager.enemyGridMap;
    if(!grids.has(pos)) {
      LogManager.error(`找不到格子:${pos},format:${_formationType}`);
      return;
    }
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
