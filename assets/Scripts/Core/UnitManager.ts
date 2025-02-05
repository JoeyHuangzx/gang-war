import { _decorator, Component, Node } from 'cc';
import { UnitBase } from '../Units/UnitBase';
const { ccclass, property } = _decorator;

@ccclass('UnitManager')
export class UnitManager extends Component {
    createUnit(unitType: string, position: any) {
        // 根据兵种类型创建兵种实例
        // 设置兵种的初始位置
    }

    destroyUnit(unit: any) {
        // 销毁指定的兵种实例
    }

    combineUnits(unit1: any, unit2: any) {
        // 合成两个兵种
        // 生成新的兵种实例
        // 销毁原来的两个兵种实例
        // 检查合成条件：类型相同且等级相同
        if (unit1.type === unit2.type && unit1.level === unit2.level) {
            const newLevel = unit1.level + 1;
            // 创建新的兵种实例
            return new UnitBase(unit1.type, newLevel);
        }
        return null;
    }
}

