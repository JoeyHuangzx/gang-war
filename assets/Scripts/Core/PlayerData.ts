import { Constants } from '../Global/Constants';
import HttpClient from '../Net/HttpClient';
import { UserData } from '../Net/NetApi';

// 玩家数据类
export class PlayerData {
  private static _instance: PlayerData | null = null;

  public static getInstance(): PlayerData {
    if (!PlayerData._instance) {
      PlayerData._instance = new PlayerData();
    }
    return PlayerData._instance;
  }

  userData: UserData;

  constructor() {
  }

  initData(userData: UserData) {
    this.userData = userData;
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // 更新金币
  public updateGold(amount: number): void {
    this.userData.gold += amount;
  }

  // 增加关卡
  public increaseLevel(): void {
    this.userData.currentLevel += 1;
  }

  // 购买一个角色
  public buyFighter(fighterId: number): boolean {
    if (this.userData.gold >= 50) {
      // 假设购买一个角色需要 50 金币
      this.userData.gold -= 50;
      this.userData.buyTimes += 1;
      this.userData.unlockSoldier.push(fighterId);
      console.log(`${fighterId} 购买成功`);
      return true;
    } else {
      console.log('金币不足，无法购买角色');
      return false;
    }
  }

  /**
   * 获得购买角色的价格
   */
  public getBuyFighterPrice() {
    let factor = 1.07;
    let sep = 13;

    if (this.userData.buyTimes < sep) {
      return 30 + 10 * this.userData.buyTimes;
    } else {
      return 30 + 10 * sep + Math.round(30 * Math.pow(factor, this.userData.buyTimes - sep));
    }
  }

  /**
   * 获得购买格子的价格
   */
  public getBuyCellPrice() {
    return Math.floor(100 * Math.pow(1.2, this.userData.buyCellTimes));
  }

  // 购买格子
  public buyCell(): boolean {
    if (this.userData.gold >= 100) {
      // 假设购买一个格子需要 100 金币
      this.userData.gold -= 100;
      this.userData.buyCellTimes += 1;
      console.log('购买格子成功');
      return true;
    } else {
      console.log('金币不足，无法购买格子');
      return false;
    }
  }

  // 更新在线奖励
  public updateOnlineReward(times: number): void {
    this.userData.onlineReward += Constants.ONLINE.PROFIT_PER_SECOND * this.getBuyFighterPrice() * times / 1000;
    this.userData.onlineReward=Number(this.userData.onlineReward.toFixed(2));
    
  }

  public getOnlineReward(): number {
    return this.userData.onlineReward;
  }

  // 完成某个引导步骤
  public completeGuide(guideId: string): void {
    if (!this.userData.finishGuides.includes(guideId)) {
      this.userData.finishGuides.push(guideId);
      console.log(`引导步骤 ${guideId} 完成`);
    } else {
      console.log(`引导步骤 ${guideId} 已完成`);
    }
  }

  // 使用火球技能
  public useFireBall(): void {
    if (!this.userData.hasUsedFireBall) {
      this.userData.hasUsedFireBall = true;
      console.log('火球技能已使用');
    } else {
      console.log('你已经使用过火球技能');
    }
  }

  // 获取玩家信息
  public getPlayerInfo(): UserData {
    return this.userData;
  }

  public async savePlayerInfo(): Promise<void> {
    try {
      const playerInfo = this.getPlayerInfo();
      const response = await HttpClient.getInstance().updateUser(playerInfo.id, playerInfo);
      // 同时保存一份到本地
      
      console.log('保存玩家信息成功', response);
    } catch (error) {
      console.error('保存玩家信息失败', error);
    }
  }
}
