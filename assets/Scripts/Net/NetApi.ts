
export interface UserData {
  /** 玩家ID */
    id: number;
    /** 玩家名 */
    name:string;
    /** 金币数量 */
    gold: number;
    /** 当前关卡 */
    level: number;
    /** 创建时间 */
    createDate: Date;
    /** 购买次数 */
    buyTimes: number;
    /** 购买格子的次数 */
    buyCellTimes: number;
    /** 已解锁士兵列表 */
    unlockSoldier: number[];
    /** 在线奖励数值 */
    onlineReward: number;
    /** 完成的引导步骤 */
    finishGuides: string[];
    /** 是否使用过火球 */
    hasUsedFireBall: boolean;
  }