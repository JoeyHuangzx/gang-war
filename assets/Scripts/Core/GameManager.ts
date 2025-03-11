import { find, Node, Prefab } from 'cc';
import { GridManager } from '../Logic/Map/GridManager';
import { FighterManager } from './FighterManager';
import { PlayerData } from './PlayerData';
import { LevelManager } from './LevelManager';
import { PoolManager } from '../Logic/Pools/PoolManager';
import { ResourceManager } from './ResourceManager';
import { Profiler } from '../Common/Profile/Profile';
import { Constants } from '../Global/Constants';
import { PoolConfig } from '../Datas/PoolConfig';
import { LogManager } from './LogManager';
import { EventManager } from './EventManager';
import { EventName } from '../Global/EventName';
import { UIManager } from '../UI/UIManager';
import { UIType } from '../UI/Enum/UIEnum';
import { Camera } from '../Logic/Camera';
import { GameStatusEnum } from '../Global/GameStatusEnum';

export class GameManager {
  private static _instance: GameManager;

  public gridManager: GridManager;
  public gameNode: Node = null;
  public onlineInterval = null;
  public gameState: GameStatusEnum = GameStatusEnum.Null;

  private constructor() {}

  public static getInstance(): GameManager {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  initManagers() {
    this.gameNode = find('game');
    LevelManager.getInstance().init();
    // 初始化关卡管理器
    // 初始化兵种管理器
    this.gridManager = find('newMap01')?.getComponent(GridManager);
    if (this.gridManager) {
      FighterManager.getInstance().initData();
      this.startOnlineReward();
    } else {
      LogManager.error('未找到地图');
    }
    this.gameState = GameStatusEnum.Start;
    EventManager.on(EventName.GAME_START, this.startGame, this);
    EventManager.on(EventName.GAME_RESET, this.resetGame, this);
    EventManager.on(EventName.GAME_INIT, this.resetGame, this);
    EventManager.on(EventName.GAME_OVER, this.endGame, this);
  }

  async initPool() {
    Profiler.start('init_pool');
    const mgr = ResourceManager.getInstance();
    // 并发加载所有 Prefab
    const prefabs = await Promise.all(PoolConfig.map(config => mgr.load(config.path, Prefab)));
    // 遍历配置表和 Prefab 实例，初始化对象池
    prefabs.forEach((prefab, index) => {
      const config = PoolConfig[index];
      PoolManager.getInstance().initPool(config.name, prefab, config.initial, config.max);
    });
    Profiler.end('init_pool');
  }

  startOnlineReward() {
    this.onlineInterval = setInterval(() => {
      PlayerData.getInstance().updateOnlineReward(1000);
    }, 1000);
  }

  startGame() {
    this.gameState = GameStatusEnum.Running;
    const mgr = LevelManager.getInstance();
    UIManager.getInstance().showUI(UIType.FightUI, {
      selfPower: mgr.calculatePower(),
      enemyPower: mgr.calculateEnemyPower(),
    });
    UIManager.getInstance().hideUI(UIType.GameUI);
    Camera.instance.startCameraMovement();
  }

  resetGame() {
    this.gameState = GameStatusEnum.Start;
    Camera.instance.endGame();
  }

  pauseGame() {
    // 暂停游戏逻辑
  }

  endGame(data) {
    this.gameState = GameStatusEnum.Ended;
    // 结束游戏逻辑
    UIManager.getInstance().hideUI(UIType.FightUI);
    UIManager.getInstance().showUI(UIType.SettleUI, data);
  }
}
