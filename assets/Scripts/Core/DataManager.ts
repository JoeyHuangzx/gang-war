import { FighterData, LevelData } from '../Datas/CsvConfig';
import { Formation } from '../Net/NetApi';
import { CSVManager } from './CSVManager';
import { LogManager } from './LogManager';
import { PlayerData } from './PlayerData';

export class DataManager {
  private static _instance: DataManager;

  public levelMap: Map<number, LevelData> = new Map();
  public fighterMap: Map<number, FighterData> = new Map();

  private constructor() {}
  public static getInstance(): DataManager {
    if (!this._instance) {
      this._instance = new DataManager();
    }
    return this._instance;
  }

  public init() {
    this.loadFighterData();
    this.loadLevelData();
  }

  private loadFighterData() {
    CSVManager.getInstance()
      .loadCSV<FighterData>('fighter')
      .then(data => {
        data.forEach(item => {
          this.fighterMap.set(Number(item.ID), item);
        });
        LogManager.debug('兵种数据加载完成', this.fighterMap);
      });
  }

  
  private loadLevelData() {
    CSVManager.getInstance()
      .loadCSV<LevelData>('level')
      .then(data => {
        data.forEach(item => {
          this.levelMap.set(Number(item.ID), item);
        });
        LogManager.debug('关卡数据加载完成', this.levelMap);
      });
  }

  public nextUnlockLevel() {
    let currentLevel = PlayerData.getInstance().UserData.currentLevel;
    let unlock = -1;
    // 根据levelMap里的unlock数据，找到下一个解锁的兵种
    for (let i = currentLevel; i <= this.levelMap.size; i++) {
      let levelData = this.levelMap.get(i);
      // LogManager.debug('levelData', i, levelData);
      if (levelData && levelData?.unlock) {
        unlock = Number(levelData?.ID);
        break;
      }
    }
    return unlock;
  }

  public nextUnlockCharacter(): FighterData {
    const level = this.nextUnlockLevel();
    const id=this.levelMap.get(level).unlock;
    const nextUnlockCharacter = this.getFighterData(Number(id));
    // 需要判断空值
    if (!nextUnlockCharacter) {
      return null;
    }
    return nextUnlockCharacter;
  }

  public getFighterData(id: number): FighterData {
    return this.fighterMap.get(id);
  }

  /** 根据当前阵容计算战力 */
  public calculatePower() {
    const currentFormation = PlayerData.getInstance().UserData.formation.filter(o=>o.soldierId!==undefined);
    LogManager.debug('currentFormation', currentFormation);
    const power= currentFormation.reduce((acc, curr) => {
      if(curr.soldierId===null){
        return acc;
      }
      return acc+this.getFighterData(curr.soldierId).fight;
    },0)
    return power;
  }

  /** 计算敌方战力 */
  public calculateEnemyPower() {
    const currentLevel = PlayerData.getInstance().UserData.currentLevel;
    const levelData = this.levelMap.get(currentLevel);
    
    const enemyFormation =[]; 
    const tempArr=levelData.formation.split('_');
    for (let i = 0; i < tempArr.length; i++) {
      const itemArr = tempArr[i].split('#');
      const _formation:Formation={id:Number(itemArr[1]),soldierId:Number(itemArr[0])};
      enemyFormation.push(_formation);
    }
    const power= enemyFormation.reduce((acc, curr) => {
      return acc+this.getFighterData(curr.soldierId).fight;
    },0)
    return power;
  }
}
