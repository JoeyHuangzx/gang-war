import { UnitType } from "./enum/UnitEnum";

/**
 * 兵种积累
 */
export class UnitBase {
    type: UnitType;
    level: number;
    attack: number;
    defense: number;

    constructor(type: UnitType, level: number) {
        this.type = type;
        this.level = level;
        // 根据等级初始化攻击力和防御力
        this.attack = level * 10;
        this.defense = level * 5;
    }
}