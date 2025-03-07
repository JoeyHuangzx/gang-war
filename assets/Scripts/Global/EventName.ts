export const EventName = {
  GAME_START: 'GAME_START',
  GAME_RESET: 'GAME_RESET',
  GAME_OVER: 'GAME_OVER',
  /** 金币更新 */
  GOLD_UPDATE: 'gold_update',
  /** 增加格子 */
  ADD_GRID: 'add_grid',
  /** 生成格子 */
  GENERATE_GRID: 'generate_grid',
  /** 在线奖励更新 */
  ONLINE_REWARD_UPDATE: 'ONLINE_REWARD_UPDATE',
  FIGHT_GOLD_UPDATE: 'FIGHT_GOLD_UPDATE',
} as const;
