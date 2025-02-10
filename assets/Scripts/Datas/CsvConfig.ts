

export type csvFileName= 'fighter' | 'level';

/** 角色数据接口 */
export interface FighterData {
  ID: number;          // 角色编号
  name: string;        // 角色名称
  type: number;        // 攻击类型（1 奥特曼 / 2 牛角 / 3 短剑 / 4 标枪 / 5 投石车 / 6 小丑）
  level: number;       // 角色等级
  num: number;         // 角色数量
  color: number;       // 人物颜色（0 正常 1 黄色）
  crown: number;       // 皇冠类型（0 没有皇冠 1 白色皇冠 2 金色皇冠）
  scale: number;       // 是否体型增加（标准为 1）
  attack: number;      // 攻击力
  hp: number;          // 生命值
  attackSpeed: number; // 攻击速度
  range: number;       // 攻击范围
  damageRange: number; // 群伤范围（0 表示单体）
  coin: number;        // 金币掉落
  speed: number;       // 移动速度
  fight: number;       // 战力
  earn: number;        // 自动收益
  desc: string;        // 角色描述
}


// 关卡数据结构
export interface LevelData {
  ID: number;                 // 关卡编号
  formation: string;          // 敌方阵容（格式：敌人ID_数量#位置）
  unlock: string;             // 解锁兵种（逗号分隔的Fighter ID）
  gold: number;               // 通关金币奖励
  coefficient: number;        // 难度系数
}