import { Constants } from '../Global/Constants';
import { EventName } from '../Global/EventName';
import { FighterTypeEnum } from '../Global/FighterTypeEnum';
import HttpClient from '../Net/HttpClient';
import { UserData } from '../Net/NetApi';
import { EventManager } from './EventManager';
import { LogManager } from './LogManager';
import { FighterManager } from './FighterManager';
import StorageManager from './StorageManager';

// 玩家数据类
export class PlayerData {
  private static _instance: PlayerData | null = null;

  public static getInstance(): PlayerData {
    if (!PlayerData._instance) {
      PlayerData._instance = new PlayerData();
    }
    return PlayerData._instance;
  }

  private _userData: UserData;
  public get UserData(): UserData {
    return this._userData;
  }

  constructor() {}

  saveDate = null;

  initData(userData: UserData) {
    this._userData = userData;
    localStorage.setItem(Constants.STORAGE_KEY.USER_DATA, JSON.stringify(userData));
  }

  // 更新金币
  public async updateGold(amount: number) {
    this._userData.gold += amount;
    this._userData.gold = Math.floor(this._userData.gold);
    await this.savePlayerInfo();
    EventManager.emit(EventName.GOLD_UPDATE);
  }

  // 增加关卡
  public increaseLevel(): void {
    this._userData.currentLevel += 1;
    this.savePlayerInfo();
  }

  // 购买一个角色
  public buyFighter(fighterId: number): boolean {
    const _gold = this.getBuyFighterPrice();
    if (this._userData.gold >= _gold) {
      // 假设购买一个角色需要 50 金币
      this.updateGold(-_gold);
      this._userData.buyTimes += 1;
      const _formation = this._userData.formation.find(o => o.fighterId === undefined);
      _formation.fighterId = fighterId;
      LogManager.info(`${fighterId} 购买成功`);
      FighterManager.getInstance().addFighter(_formation, FighterTypeEnum.Self);
      this.savePlayerInfo();
      return true;
    } else {
      LogManager.info('金币不足，无法购买角色');
      return false;
    }
  }

  /**
   * 获得购买角色的价格
   */
  public getBuyFighterPrice() {
    let factor = 1.07;
    let sep = 13;

    if (this._userData.buyTimes < sep) {
      return 30 + 10 * this._userData.buyTimes;
    } else {
      return 30 + 10 * sep + Math.round(30 * Math.pow(factor, this._userData.buyTimes - sep));
    }
  }

  /**
   * 获得购买格子的价格
   */
  public getBuyCellPrice() {
    return Math.floor(100 * Math.pow(1.2, this._userData.buyCellTimes));
  }

  // 购买格子
  public buyCell(): boolean {
    const _gold = this.getBuyCellPrice();
    if (this._userData.gold >= _gold) {
      // 假设购买一个格子需要 100 金币
      this.updateGold(-_gold);
      this._userData.buyCellTimes += 1;
      const formation = {
        id: this._userData.formation.length + 1,
      };
      this._userData.formation.push(formation);
      FighterManager.getInstance().addCell(FighterTypeEnum.Self);
      this.savePlayerInfo();
      LogManager.info('购买格子成功');
      return true;
    } else {
      LogManager.info('金币不足，无法购买格子');
      return false;
    }
  }

  // 更新在线奖励
  public updateOnlineReward(times: number): void {
    this._userData.onlineReward += (Constants.ONLINE.PROFIT_PER_SECOND * this.getBuyFighterPrice() * times) / 1000;
    this._userData.onlineReward = Number(this._userData.onlineReward.toFixed(2));
    // LogManager.info(`在线奖励更新: ${this._userData.onlineReward}`);
    EventManager.emit(EventName.ONLINE_REWARD_UPDATE, { rewardAmount: this._userData.onlineReward });
    // 设置为1分钟保存一次
    if ((Date.now() - this.saveDate) / 1000 > 60) {
      this.savePlayerInfo();
    }
  }

  public getOnlineReward(): number {
    return this._userData.onlineReward;
  }

  /**
   * 更新领取后的在线奖励的奖励值
   */
  public reduceOnlineReward() {
    this._userData.onlineReward = 0;
    this.savePlayerInfo();
  }

  // 完成某个引导步骤
  public completeGuide(guideId: string): void {
    if (!this._userData.finishGuides.includes(guideId)) {
      this._userData.finishGuides.push(guideId);
      LogManager.info(`引导步骤 ${guideId} 完成`);
    } else {
      LogManager.info(`引导步骤 ${guideId} 已完成`);
    }
  }

  // 使用火球技能
  public useFireBall(): void {
    if (!this._userData.hasUsedFireBall) {
      this._userData.hasUsedFireBall = true;
      LogManager.info('火球技能已使用');
    } else {
      LogManager.info('你已经使用过火球技能');
    }
  }

  public async savePlayerInfo(): Promise<void> {
    try {
      const response = await HttpClient.getInstance().updateUser(this.UserData.id, this.UserData);
      // 同时保存一份到本地
      StorageManager.getInstance().saveData(Constants.STORAGE_KEY.USER_DATA, this.UserData);
      this.saveDate = Date.now();
      LogManager.info('保存玩家信息成功', response);
    } catch (error) {
      console.error('保存玩家信息失败', error);
    }
  }
}
