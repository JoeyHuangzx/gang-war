import { _decorator, Component, Label, Node } from 'cc';
import { BaseUI } from '../Views/BaseUI';
import { PlayerData } from '../../Core/PlayerData';
const { ccclass, property } = _decorator;

@ccclass('OnlineReward')
export class OnlineReward extends BaseUI {
  @property(Node)
  normalBtn: Node = null;

  @property(Node)
  doubleBtn: Node = null;

  @property(Label)
  normalGold: Label = null;

  @property(Label)
  doubleGold: Label = null;

  playerData: PlayerData = null;

  start() {
    this.normalBtn.on(Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
    this.doubleBtn.on(Node.EventType.TOUCH_END, this.onDoubleBtnClick, this);
  }

  public init(): void {
    this.playerData = PlayerData.getInstance();
    this.normalGold.string = `${Math.floor(this.playerData.getOnlineReward())}`;
    this.doubleGold.string = `${3 * Math.floor(this.playerData.getOnlineReward())}`;
  }

  onNormalBtnClick() {
    this.playerData.updateGold(this.playerData.getOnlineReward());
    this.playerData.reduceOnlineReward();
    this.hide();
  }

  onDoubleBtnClick() {
    this.playerData.updateGold(3 * this.playerData.getOnlineReward());
    this.playerData.reduceOnlineReward();
    this.hide();
  }

  update(deltaTime: number) {}
}
