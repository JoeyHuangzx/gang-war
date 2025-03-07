// 定义统一响应结构的泛型接口
export interface ApiResponse<T> {
  data: T;
  serverTime: number;
  statusCode: number;
  message: string;
}

export interface LoginDataResponse extends ApiResponse<UserData> {}

export interface CreateUserResponse extends ApiResponse<UserData> {}

export interface UserData {
  /** 玩家ID */
  id: string;
  /** 玩家名 */
  name: string;
  /** 金币数量 */
  gold: number;
  /** 当前关卡 */
  currentLevel: number;
  /** 创建时间 */
  createDate: Date;
  /** 购买次数 */
  buyTimes: number;
  /** 购买格子的次数 */
  buyCellTimes: number;
  /** 已解锁士兵列表 */
  unlockFighters: number[];
  /** 在线奖励数值 */
  onlineReward: number;
  /** 完成的引导步骤 */
  finishGuides: string[];
  /** 是否使用过火球 */
  hasUsedFireBall: boolean;
  /** 玩家阵容 */
  formation: Formation[];
}

export interface Formation {
  /** 阵容ID，从1开始 */
  id: number;
  /** 士兵ID,如果为空，就是只买了格子，没买士兵 */
  fighterId?: number;
}
