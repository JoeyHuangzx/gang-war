import { _decorator, CCClass, CCInteger, Component, Enum, Label, math, Node, RichText, Sprite, tween, Vec3 } from 'cc';
import { BaseUI } from './BaseUI';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
import { PlayerData } from '../../Core/PlayerData';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { LogManager } from '../../Core/LogManager';
import { Camera } from '../../Logic/Camera';
import { UserData } from '../../Net/NetApi';
import { LevelManager } from '../../Core/LevelManager';
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

  @property(Label)
  onlineReward: Label = null;

  @property(Label)
  buyCharacter: Label = null;

  @property(Label)
  buySlot: Label = null;

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

  private minAngle: number = -60; // 最小角度
  private maxAngle: number = 60; // 最大角度
  private duration: number = 0.5; // 单次摆动时间
  private swingTween = null; // 缓存 Tween 以便控制

  playerData: PlayerData;
  userData: UserData = null;
  dataMgr: LevelManager = null;

  addListener() {
    //侦听按钮事件
    this.startButton.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    this.rewardButton.on(Node.EventType.TOUCH_END, this.onRewardButtonClick, this);
    this.buyCharacterButton.on(Node.EventType.TOUCH_END, this.onBuyCharacterButtonClick, this);
    this.buySlotButton.on(Node.EventType.TOUCH_END, this.onBuySlotButtonClick, this);
    EventManager.on(EventName.GOLD_UPDATE, this.goldUpdateHandle, this);
    EventManager.on(EventName.ONLINE_REWARD_UPDATE, this.onlineRewardUpdateHandle, this);
  }

  /** 初始化UI，可以传入数据 */
  public init(data?: GameUIData): void {
    this.playerData = PlayerData.getInstance();
    this.userData = this.playerData.UserData;
    this.dataMgr = LevelManager.getInstance();
    LogManager.info('StartUI 初始化', data);
    this.addListener();

    this.updateData();
    this.startSwing();
    this.goldUpdateHandle();
  }

  public updateData() {
    this.levelUnlockTip.string = `<color=#ffffff>第${this.dataMgr.nextUnlockLevel()}关解锁</color><color=#0fff00>${this.dataMgr.nextUnlockCharacter().name}</color>`;
    this.currentLevel.string = `第${this.userData.currentLevel}关`;
    this.ourPower.string = this.dataMgr.calculatePower().toString();
    this.enemyPower.string = this.dataMgr.calculateEnemyPower().toString();
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
  }

  public goldUpdateHandle() {
    this.goldCount.string = `${Math.floor(this.userData.gold)}`;
    this.checkButtonVisible();
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

  // 开始按钮点击事件
  onStartButtonClick() {
    LogManager.info('startButtonClick');
    UIManager.getInstance().showUI(UIType.FightUI);
    UIManager.getInstance().hideUI(UIType.GameUI);
    Camera.instance.startCameraMovement();
  }

  // 领取奖励按钮点击事件
  onRewardButtonClick() {
    if (this.rewardButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('rewardButtonClick');
    this.playerData.updateGold(this.playerData.getOnlineReward());
    this.playerData.reduceOnlineReward();
  }

  // 购买角色按钮点击事件
  onBuyCharacterButtonClick() {
    if (this.buyCharacterButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('buyCharacterButtonClick');
    this.playerData.buyFighter(this.dataMgr.nextUnlockCharacter().ID);
  }

  // 购买槽位按钮点击事件
  onBuySlotButtonClick() {
    if (this.buySlotButton.getComponentInChildren(Sprite).grayscale) return;
    LogManager.info('buySlotButtonClick');
    this.playerData.buyCell();
  }

  update(deltaTime: number) {}

  /** 启动无限摆动 */
  private startSwing(): void {
    if (this.swingTween) return; // 避免重复启动

    this.swingTween = tween(this.pointer)
      .repeatForever(
        tween()
          .to(this.duration, { eulerAngles: new Vec3(0, 0, this.maxAngle) }, { easing: 'sineInOut' }) // 旋转到最大角
          .to(this.duration, { eulerAngles: new Vec3(0, 0, this.minAngle) }, { easing: 'sineInOut' }), // 旋转到最小角
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
    EventManager.off(EventName.GOLD_UPDATE, this.goldUpdateHandle);
  }
}
