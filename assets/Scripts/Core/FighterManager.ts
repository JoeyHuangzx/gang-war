import { _decorator, instantiate, Node, Prefab, SpriteFrame, Texture2D, Vec3 } from 'cc';
import { GridManager } from '../Logic/Map/GridManager';
import { Fighter } from '../Logic/Fighters/Fighter';
import { GameManager } from './GameManager';
import { Cell } from '../Logic/Map/Cell';
import { PlayerData } from './PlayerData';
import { Formation, UserData } from '../Net/NetApi';
import { FighterTypeEnum } from '../Global/FighterTypeEnum';
import { LogManager } from './LogManager';
import { LevelManager } from './LevelManager';
import { Constants } from '../Global/Constants';
import { PoolManager } from '../Logic/Pools/PoolManager';
import { FighterData } from '../Datas/CsvConfig';
import { EventManager } from './EventManager';
import { EventName } from '../Global/EventName';

const { ccclass, property } = _decorator;

/**
 * 士兵管理类
 * //TODO  主界面战士拖动/升级逻辑
 */
export class FighterManager {
  private static _instance: FighterManager;

  private _currGold = 0;
  private _selfPower = 0;
  private _enemyPower = 0;
  attackAddition = 1;

  private constructor() {}

  public static getInstance(): FighterManager {
    if (!this._instance) {
      this._instance = new FighterManager();
    }
    return this._instance;
  }

  userData: UserData = null;
  gridManager: GridManager = null;
  fighterMap: Map<FighterTypeEnum, Fighter[]> = new Map();
  private _isGameOver = false;

  public initData() {
    // this.loadSoldier();
    this.gridManager = GameManager.getInstance().gridManager;
    this.userData = PlayerData.getInstance().UserData;
    this.initFormation(this.userData.formation, FighterTypeEnum.Self);
    this.initFormation(LevelManager.getInstance().enemyFormation, FighterTypeEnum.Enemy);
    EventManager.on(EventName.GAME_START, this.gameStart, this);
    EventManager.on(EventName.GAME_RESET, this.gameReset, this);
    EventManager.on(EventName.GAME_INIT, this.gameInit, this);
    this._selfPower = LevelManager.getInstance().calculatePower();
    this._enemyPower = LevelManager.getInstance().calculateEnemyPower();
  }

  initFormation(_formation: Formation[], _formationType: FighterTypeEnum) {
    if (!this.gridManager.hasGrid(_formationType)) this.gridManager.generateGrids(_formation.length, _formationType);
    // LogManager.debug(`formation:`, _formation);
    _formation.forEach(item => {
      if (item.fighterId) {
        this.loadSoldier(item, LevelManager.getInstance().getFighterData(item.fighterId), _formationType);
      } else {
        this.loadSoldier(item, null, _formationType);
      }
    });
  }

  /**
   * 新增阵容（格子）
   */
  public addCell(_formationType: FighterTypeEnum) {
    GameManager.getInstance().gridManager.generateGrids(1, _formationType);
  }

  public addFighter(formation: Formation, _formationType: FighterTypeEnum) {
    this.loadSoldier(formation, LevelManager.getInstance().getFighterData(formation.fighterId), _formationType);
  }

  // 加载士兵
  public async loadSoldier(formation: Formation, fighterData: FighterData, _formationType: FighterTypeEnum) {
    // 士兵底座
    const grids = _formationType === FighterTypeEnum.Self ? this.gridManager.gridMap : this.gridManager.enemyGridMap;
    if (!grids.has(formation.id)) {
      LogManager.error(`找不到格子:${formation.id},format:${_formationType}`);
      return;
    }
    const gridNode = grids.get(formation.id);
    const baseNode = PoolManager.getInstance().get(Constants.PREFAB_NAME.FIGHTER); //instantiate(basePrefab);
    GameManager.getInstance().gameNode.addChild(baseNode);
    baseNode.setPosition(gridNode.position);
    if (formation.fighterId) {
      // const modelName = Constants.FIGHTER_MODEL_TYPE_MAP[fighterData.type];
      const fighter = baseNode.getComponent(Fighter).initData(fighterData, _formationType, formation.id);
      gridNode.getComponent(Cell).showEffect();
      if (this.fighterMap.has(_formationType)) {
        this.fighterMap.get(_formationType).push(fighter);
      } else {
        this.fighterMap.set(_formationType, [fighter]);
      }
    }
  }

  gameStart(data: { attackAddition: number }) {
    this.attackAddition = data.attackAddition;
    this.fighterMap.forEach(item => {
      item.forEach(fighter => {
        fighter.gameStart();
      });
    });
  }

  /** 计算最近的敌人 */
  public findClosestEnemy(fighter: Fighter): Fighter {
    let closestEnemy: Node | null = null;
    let minDistance = Infinity;
    const enemys =
      fighter.fighterType === FighterTypeEnum.Self
        ? this.fighterMap.get(FighterTypeEnum.Enemy)
        : this.fighterMap.get(FighterTypeEnum.Self);
    for (const enemy of enemys) {
      const distance = Vec3.distance(fighter.node.position, enemy.node.position);
      // LogManager.debug(`mid:${distance}`);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy.node;
      }
    }
    // LogManager.debug(`找到新敌人：`, closestEnemy);
    return closestEnemy ? closestEnemy.getComponent(Fighter) : null;
  }

  /**
   * 本局获得金币
   * @param amount
   */
  public addGold(amount: number) {
    amount = LevelManager.getInstance().getCurrLevelData().coefficient * amount;
    this._currGold += amount;
    EventManager.emit(EventName.FIGHT_GOLD_UPDATE, { gold: this._currGold });
  }

  removeFighter(fighter: Fighter) {
    const arr = this.fighterMap.get(fighter.fighterType);
    arr.splice(arr.indexOf(fighter), 1);
    if (fighter.fighterType === FighterTypeEnum.Self) {
      this._selfPower -= fighter.fighterData.fight;
    } else {
      this._enemyPower -= fighter.fighterData.fight;
    }
    EventManager.emit(EventName.FIGHT_POWER_UPDATE, { selfPower: this._selfPower, enemyPower: this._enemyPower });
  }

  /**
   * 检测那个阵营胜利，判断每个阵营的士兵是否都死亡
   */
  checkGameResult() {
    if (this._isGameOver) return;
    let isWin = false;
    if (this.fighterMap.get(FighterTypeEnum.Self).length === 0) {
      isWin = false;
      this._isGameOver = true;
    }
    if (this.fighterMap.get(FighterTypeEnum.Enemy).length === 0) {
      isWin = true;
      this._isGameOver = true;
    }
    if (this._isGameOver) {
      setTimeout(() => {
        EventManager.emit(EventName.GAME_OVER, {
          result: isWin,
          currentLevel: this.userData.currentLevel,
          gold: this._currGold,
        });
      }, 1000);
    }
  }

  gameInit() {
    PlayerData.getInstance().updateGold(this._currGold);
    this.gameReset();
  }

  gameReset() {
    this._selfPower = LevelManager.getInstance().calculatePower();
    this._enemyPower = LevelManager.getInstance().calculateEnemyPower();
    this._currGold = 0;
    this._isGameOver = false;
    this.fighterMap.forEach(item => {
      item.forEach(fighter => {
        fighter.resetData();
        fighter.recycle();
      });
    });
    this.fighterMap.clear();
    this.initFormation(this.userData.formation, FighterTypeEnum.Self);
    this.initFormation(LevelManager.getInstance().enemyFormation, FighterTypeEnum.Enemy);
  }
}
