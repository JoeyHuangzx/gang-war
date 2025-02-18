export enum FighterStatusEnum {
  /** 待机 */
  IDLE = 0,
  /** 冲锋，先向前冲锋一小段路 */
  CHARGE = 1,
  /** 搜索目标 */
  FIND = 2,
  /** 向敌人靠近 */
  MOVE = 3,
  /** 攻击 */
  ATTACK = 4,
  /** 胜利 */
  WIN = 5,
  /** 死亡 */
  DEAD = 6,
}
