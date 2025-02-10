import { FighterData, LevelData } from '../Datas/CsvConfig';
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
    let currentLevel = PlayerData.getInstance().getPlayerInfo().currentLevel;
    let unlock = -1;
    // 根据levelMap里的unlock数据，找到下一个解锁的兵种
    for (let i = currentLevel; i <= this.levelMap.size; i++) {
      let levelData = this.levelMap.get(i);
      LogManager.debug('levelData', i, levelData);
      if (levelData && levelData?.unlock) {
        unlock = Number(levelData?.ID);
        break;
      }
    }
    return unlock;
  }

  public nextUnlockCharacter(): string {
    const level = this.nextUnlockLevel();
    const nextUnlockCharacter = this.fighterMap.get(Number(this.levelMap.get(level).unlock));
    // 需要判断空值
    if (!nextUnlockCharacter) {
      return null;
    }
    return nextUnlockCharacter.name;
  }
}
