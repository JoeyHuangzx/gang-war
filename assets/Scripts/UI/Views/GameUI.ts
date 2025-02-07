import { _decorator, CCClass, CCInteger, Component, Enum, Label, Node, RichText, tween, Vec3 } from 'cc';
import { BaseUI } from './BaseUI';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
const { ccclass, property } = _decorator;

/** GameUI 的数据结构 */
export interface GameUIData {
  gold: number;
  level: number;
}

@ccclass('GameUI')
export class GameUI extends BaseUI<GameUIData> {
  // 金币数
  @property(Label)
  goldCount: Label = null;

  // 当前关卡
  @property(Label)
  currentLevel: Label = null;

  @property(Label)
  ourPower: Label = null;

  @property(Label)
  enemyPower: Label = null;

  // 关卡解锁tip
  @property(RichText)
  levelUnlockTip: RichText = null;

  // 开始按钮
  @property(Node)
  startButton: Node = null;

  @property(Node)
  rewardButton: Node = null;

  @property(Node)
  buyCharacterButton: Node = null;

  @property(Node)
  buySlotButton: Node = null;

  // 战力表指针
  @property(Node)
  pointer: Node = null;

  private minAngle: number = -60;   // 最小角度
  private maxAngle: number = 60;  // 最大角度
  private duration: number = 0.5;  // 单次摆动时间
  private swingTween = null;       // 缓存 Tween 以便控制


  addListener() {
    //侦听按钮事件
    this.startButton.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    this.rewardButton.on(Node.EventType.TOUCH_END, this.onRewardButtonClick, this);
    this.buyCharacterButton.on(Node.EventType.TOUCH_END, this.onBuyCharacterButtonClick, this);
    this.buySlotButton.on(Node.EventType.TOUCH_END, this.onBuySlotButtonClick, this);
  }

  /** 初始化UI，可以传入数据 */
  public init(data?: GameUIData): void {
    console.log("StartUI 初始化", data);
    this.addListener();
    this.goldCount.string = data.gold.toString();
    this.levelUnlockTip.string = '<color=#ffffff>第5关解锁</color><color=#0fff00>xxx</color>';
    this.currentLevel.string = `第${data.level}关`;
    this.ourPower.string = '100';
    this.enemyPower.string = '100';
    this.startSwing();
  }


  // 开始按钮点击事件
  onStartButtonClick() {
    console.log('startButtonClick');
    UIManager.getInstance().showUI(UIType.FightUI);
    UIManager.getInstance().hideUI(UIType.GameUI);
  }

  // 领取奖励按钮点击事件
  onRewardButtonClick() {
    console.log('rewardButtonClick');
  }

  // 购买角色按钮点击事件
  onBuyCharacterButtonClick() {
    console.log('buyCharacterButtonClick');
  }

  // 购买槽位按钮点击事件
  onBuySlotButtonClick() {
    console.log('buySlotButtonClick');
  }

  update(deltaTime: number) {

  }

  /** 启动无限摆动 */
  private startSwing(): void {
    if (this.swingTween) return; // 避免重复启动

    this.swingTween = tween(this.pointer)
      .repeatForever(
        tween()
          .to(this.duration, { eulerAngles: new Vec3(0, 0, this.maxAngle) }, { easing: "sineInOut" }) // 旋转到最大角
          .to(this.duration, { eulerAngles: new Vec3(0, 0, this.minAngle) }, { easing: "sineInOut" }) // 旋转到最小角
      )
      .start();
  }

  /** 停止摆动 */
  public stopSwing(): void {
    if (this.swingTween) {
      this.swingTween.stop();
      this.swingTween = null;
    }
  }

  public clickBottomButton(type: number) {}

  protected onDestroy(): void {
    this.startButton.off(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    this.rewardButton.off(Node.EventType.TOUCH_END, this.onRewardButtonClick, this);
    this.buyCharacterButton.off(Node.EventType.TOUCH_END, this.onBuyCharacterButtonClick, this);
    this.buySlotButton.off(Node.EventType.TOUCH_END, this.onBuySlotButtonClick, this);
  }
}
