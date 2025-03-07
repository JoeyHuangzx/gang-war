import { _decorator, Component, Node } from 'cc';
import { UnitManager } from '../Core/UnitManager';
import { UnitType } from '../Units/enum/UnitEnum';
import { UnitBase } from '../Units/UnitBase';
import HttpClient from '../Net/HttpClient';
import { UserData } from '../Net/NetApi';
import { UIManager } from '../UI/UIManager';
import { UIType } from '../UI/Enum/UIEnum';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
  async start() {
    /*    const allUsers = await HttpClient.getInstance().getUsers();
    console.log(allUsers); */
    // const users = await HttpClient.getInstance().getUser(1);
    // const users = await HttpClient.getInstance().updateUser('1',{name:'hzx',currentLevel:3});
    // const users = await HttpClient.getInstance().deleteUser('0');
    // console.log(users);
    // UIManager.getInstance().showUI(UIType.GAME_UI);
    const node4: ListNode = { val: 4, next: null };
    const node3: ListNode = { val: 3, next: node4 };
    const node2: ListNode = { val: 2, next: node3 };
    const node1: ListNode = { val: 1, next: node2 };
    // console.log(this.reverseList(node1));
  }

  reverseList(head: ListNode | null): ListNode | null {
    // 基础步骤：空链表或单节点链表无需反转
    if (head === null || head.next === null) {
      console.log(`null`);
      return head;
    }
    console.log(`reverseList head: ${head.val}, head.next: ${head.next.val}`);
    // 归纳假设：反转剩余链表得到新头节点
    const newHead = this.reverseList(head.next);
    console.log(`newHead: ${newHead?.val}`);
    // 递推步骤：将当前节点连接到反转后的链表末尾
    head.next.next = head;
    head.next = null;
    // console.log(` head.next: ${head.next.val}`);
    return newHead;
  }

  update(deltaTime: number) {}

  unitCombineTest() {
    // 创建两个相同类型和等级的兵种
    const unit1 = new UnitBase(UnitType.SOLDIER, 1);
    const unit2 = new UnitBase(UnitType.SOLDIER, 1);

    // 创建单位管理器实例
    const unitManager = new UnitManager();

    // 尝试合成兵种
    const newUnit = unitManager.combineUnits(unit1, unit2);

    if (newUnit) {
      console.log(`合成成功！新兵种类型：${newUnit.type}，等级：${newUnit.level}`);
    } else {
      console.log('合成失败，不满足合成条件。');
    }
  }
}
