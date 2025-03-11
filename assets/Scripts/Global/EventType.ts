// types.ts

import { SettleUIData } from '../UI/Views/SettleUI';
import { EventName } from './EventName';

// 从 EventName 提取事件名类型
export type EventKeys = keyof typeof EventName;

export type FighterPowerUpdateData = {
  selfPower: number;
  enemyPower: number;
};

export interface IEventMap {
  /** 攻击加成 */
  [EventName.GAME_START]: { attackAddition: number };
  [EventName.GAME_RESET]: void;
  [EventName.GAME_INIT]: void;
  [EventName.GAME_OVER]: SettleUIData; // 例如，失败或胜利
  [EventName.GOLD_UPDATE]: void;
  [EventName.FIGHT_POWER_UPDATE]: FighterPowerUpdateData;
  [EventName.ONLINE_REWARD_UPDATE]: { rewardAmount: number };
  [EventName.FIGHT_GOLD_UPDATE]: { gold: number };
}
