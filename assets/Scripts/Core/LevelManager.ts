import { FighterData, LevelData } from '../Datas/CsvConfig';
import { Formation } from '../Net/NetApi';
import { CSVManager } from './CSVManager';
import { LogManager } from './LogManager';
import { PlayerData } from './PlayerData';

export class LevelManager {
  private static _instance: LevelManager;

  private constructor() {}

  public static getInstance(): LevelManager {
    if (!this._instance) {
      this._instance = new LevelManager();
    }
    return this._instance;
  }

  public levelMap: Map<number, LevelData> = new Map();
  public fighterMap: Map<number, FighterData> = new Map();
  public enemyFormation: Formation[] = [];

  public async loadData() {
    const mgr = CSVManager.getInstance();
    const promises = [mgr.loadCSV<FighterData>('fighter'), mgr.loadCSV<LevelData>('level')];
    const datas = await Promise.all(promises);
    this.loadFighterData(datas[0]);
    this.loadLevelData(datas[1]);
  }

  public async init() {
    this.parseEnemyFormation();
  }

  private async loadFighterData(data) {
    data.forEach(item => {
      this.fighterMap.set(Number(item.ID), item);
    });
    LogManager.debug('兵种数据加载完成', this.fighterMap);
  }

  private async loadLevelData(data) {
    // const data = await CSVManager.getInstance().loadCSV<LevelData>('level');
    data.forEach(item => {
      this.levelMap.set(Number(item.ID), item);
    });
    LogManager.debug('关卡数据加载完成', this.levelMap);
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
    const id = this.levelMap.get(level).unlock;
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

  public getCurrLevelData(): LevelData {
    return this.levelMap.get(PlayerData.getInstance().UserData.currentLevel);
  }

  /** 根据当前阵容计算战力 */
  public calculatePower() {
    const currentFormation = PlayerData.getInstance().UserData.formation.filter(o => o.fighterId !== undefined);

    const power = currentFormation.reduce((acc, curr) => {
      if (curr.fighterId === null) {
        return acc;
      }
      return acc + this.getFighterData(curr.fighterId).fight;
    }, 0);
    return power;
  }

  parseEnemyFormation(): Formation[] {
    const levelData = this.getCurrLevelData();
    const enemyFormation = [];
    const tempArr = levelData.formation.split('_');
    for (let i = 0; i < tempArr.length; i++) {
      const itemArr = tempArr[i].split('#');
      const _formation: Formation = { id: Number(itemArr[1]), fighterId: Number(itemArr[0]) };
      enemyFormation.push(_formation);
    }
    this.enemyFormation = enemyFormation;
    return enemyFormation;
  }

  /** 计算敌方战力 */
  public calculateEnemyPower() {
    // const enemyFormation = this.parseEnemyFormation();

    const power = this.enemyFormation.reduce((acc, curr) => {
      return acc + this.getFighterData(curr.fighterId).fight;
    }, 0);
    return power;
  }
}
