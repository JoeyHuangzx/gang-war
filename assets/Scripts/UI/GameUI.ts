import { _decorator, CCClass, CCInteger, Component, Enum, Label, Node, RichText } from "cc";
const { ccclass, property } = _decorator;

enum BottomButtonType {
  Pause = 1,
  Sound = 2,
  Music = 3,
  Help = 4,
}

class IBottomButton {
  @property({ type: Enum(BottomButtonType) })
  type: BottomButtonType = BottomButtonType.Help;
  @property({ type: Node })
  btn: Node = null;
}

@ccclass("GameUI")
export class GameUI extends Component {
  // 金币数
  @property(Label)
  goldCount: Label = null;

  // 当前关卡
  @property(Label)
  currentLevel: Label = null;

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


  start() {
    //侦听按钮事件
    this.startButton.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    this.rewardButton.on(Node.EventType.TOUCH_END, this.onRewardButtonClick, this);
    this.buyCharacterButton.on(Node.EventType.TOUCH_END, this.onBuyCharacterButtonClick, this);
    this.buySlotButton.on(Node.EventType.TOUCH_END, this.onBuySlotButtonClick, this);
  }

  // 开始按钮点击事件
  onStartButtonClick() {
    console.log("startButtonClick");
  }

  // 领取奖励按钮点击事件
  onRewardButtonClick() {
    console.log("rewardButtonClick");
  }

  // 购买角色按钮点击事件
  onBuyCharacterButtonClick() {
    console.log("buyCharacterButtonClick");
  }

  // 购买槽位按钮点击事件
  onBuySlotButtonClick() {
    console.log("buySlotButtonClick");
  }

  update(deltaTime: number) {}

  public clickBottomButton(type: number) {}
}
