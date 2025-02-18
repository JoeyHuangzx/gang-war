import { _decorator, instantiate, Node, Prefab, SpriteFrame, Texture2D } from 'cc';
import { ResourceManager } from './ResourceManager';
import { GridManager } from '../Logic/Map/GridManager';
import { FighterContainer } from '../Logic/Fighters/FighterContainer';
import { GameManager } from './GameManager';
import { Cell } from '../Logic/Map/Cell';
import { PlayerData } from './PlayerData';
import { Formation, UserData } from '../Net/NetApi';
import { FormationEnum } from '../Global/FormationEnum';
import { LogManager } from './LogManager';
import { LevelManager } from './LevelManager';

const { ccclass, property } = _decorator;

/**
 * 士兵管理类
 * //TODO  获取被击中的对方士兵和它附近的同组士兵
 * //TODO  获取距离士兵最近的对方士兵
 * //TODO  主界面战士拖动/升级逻辑
 */
export class FighterManager {
  private static _instance: FighterManager;

  private constructor() {}

  public static getInstance(): FighterManager {
    if (!this._instance) {
      this._instance = new FighterManager();
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
    this.initFormation(LevelManager.getInstance().enemyFormation,FormationEnum.Enemy);
  }

  initFormation(_formation: Formation[],_formationType:FormationEnum){
    this.gridManager.generateGrids(_formation.length, _formationType);
    _formation.forEach(item => {
      let _soldierPrefabName = '';
      if (item.fighterId) {
        _soldierPrefabName = LevelManager.getInstance().getFighterData(item.fighterId).prefabName;
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

  public addFighter(formation: Formation, _formationType: FormationEnum) {
    const _soldierPrefabName = LevelManager.getInstance().getFighterData(formation.fighterId).prefabName;
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
      baseNode.getComponent(FighterContainer).initData(modelPrefab);
      gridNode.getComponent(Cell).showEffect();
    }
  }
}
