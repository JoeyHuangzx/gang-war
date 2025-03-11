import { _decorator, Animation, Component, Label, Node, Sprite } from 'cc';
import { LogManager } from '../../Core/LogManager';
import { UserData } from '../../Net/NetApi';
import { PlayerData } from '../../Core/PlayerData';
import { LevelManager } from '../../Core/LevelManager';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
import StorageManager from '../../Core/StorageManager';
const { ccclass, property } = _decorator;

/**
 * 主界面下方的购买按钮
 */
@ccclass('StartBottomButton')
export class StartBottomButton extends Component {
  @property(Label)
  onlineReward: Label = null;
  @property(Label)
  buyCharacter: Label = null;
  @property(Label)
  buySlot: Label = null;
  @property(Node)
  rewardButton: Node = null;
  @property(Node)
  buyCharacterButton: Node = null;
  @property(Node)
  buySlotButton: Node = null;
  @property(Node)
  slotTip: Node = null;
  @property(Node)
  handTip: Node = null;

  playerData: PlayerData;
  userData: UserData = null;

  protected onLoad(): void {
    this.playerData = PlayerData.getInstance();
    this.userData = this.playerData.UserData;
  }

  start() {
    this.rewardButton.on(Node.EventType.TOUCH_END, this.onRewardButtonClick, this);
    this.buyCharacterButton.on(Node.EventType.TOUCH_END, this.onBuyCharacterButtonClick, this);
    this.buySlotButton.on(Node.EventType.TOUCH_END, this.onBuySlotButtonClick, this);
    EventManager.on(EventName.ONLINE_REWARD_UPDATE, this.onlineRewardUpdateHandle, this);
  }

  public checkButtonVisible() {
    const isFighterGray = this.userData.gold < this.playerData.getBuyFighterPrice();
    const isCellGray = this.userData.gold < this.playerData.getBuyCellPrice();
    this.buyCharacter.string = this.playerData.getBuyFighterPrice().toString();
    this.buySlot.string = this.playerData.getBuyCellPrice().toString();
    this.setSpriteGray(this.buyCharacterButton, isFighterGray);
    this.setSpriteGray(this.buySlotButton, isCellGray);
    this.onlineRewardUpdateHandle();
    const _formation = this.userData.formation.find(o => o.fighterId === undefined);
    if (!_formation) {
      this.buyCharacter.string = '格子不足';
      this.setSpriteGray(this.buyCharacterButton, true);
    }
    // 金币足够，购买格子提示
    this.slotTip.active = !isCellGray;
    if (!isCellGray && !StorageManager.getInstance().getData('slot_buy_hand_tip')) {
      this.handTip.active = true;
      this.handTip.getComponent(Animation).play();
    } else {
      this.handTip.active = false;
    }
  }

  public onlineRewardUpdateHandle() {
    this.onlineReward.string = `${Math.floor(this.playerData.getOnlineReward())}`;
    this.setSpriteGray(this.rewardButton, this.playerData.getOnlineReward() < 2);
  }

  // sprite置灰
  private setSpriteGray(spriteNode: Node, isGray: boolean) {
    spriteNode.getComponentsInChildren(Sprite).forEach(_sprite => {
      _sprite.grayscale = isGray;
    });
  }

  onRewardButtonClick() {
    if (this.rewardButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('rewardButtonClick');
    UIManager.getInstance().showUI(UIType.OnlineReward);
    // this.playerData.updateGold(this.playerData.getOnlineReward());
    // this.playerData.reduceOnlineReward();
  }

  // 购买角色按钮点击事件
  onBuyCharacterButtonClick() {
    if (this.buyCharacterButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('buyCharacterButtonClick');
    UIManager.getInstance().showUI(UIType.BuyFighter);
    // this.playerData.buyFighter(LevelManager.getInstance().nextUnlockCharacter().ID);
  }

  // 购买槽位按钮点击事件
  onBuySlotButtonClick() {
    if (this.buySlotButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('buySlotButtonClick');
    StorageManager.getInstance().saveData('slot_buy_hand_tip', 'true');
    this.playerData.buyCell();
  }

  update(deltaTime: number) {}
}
