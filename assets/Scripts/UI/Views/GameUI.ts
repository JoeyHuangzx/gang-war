import {
  _decorator,
  instantiate,
  Label,
  math,
  Node,
  Prefab,
  profiler,
  RichText,
  Sprite,
  tween,
  UITransform,
  Vec3,
} from 'cc';
import { BaseUI } from './BaseUI';
import { PlayerData } from '../../Core/PlayerData';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { LogManager } from '../../Core/LogManager';
import { Camera } from '../../Logic/Camera';
import { UserData } from '../../Net/NetApi';
import { LevelManager } from '../../Core/LevelManager';
import { Constants } from '../../Global/Constants';
import { ResourceManager } from '../../Core/ResourceManager';
import { StartBottomButton } from '../Components/StartBottomButton';
import { SpriteChange } from '../Common/SpriteChange';
const { ccclass, property } = _decorator;

/** GameUI 的数据结构 */
export interface GameUIData {
  gold: number;
  level: number;
}

/**
 * 开始界面UI
 */
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

  // 战力表指针
  @property(Node)
  pointer: Node = null;

  @property(Node)
  fightTip: Node = null;

  private bottomButton: StartBottomButton = null;

  private minAngle: number = -60; // 最小角度
  private maxAngle: number = 60; // 最大角度
  private duration: number = 3; // 单次摆动时间
  private swingTween = null; // 缓存 Tween 以便控制

  playerData: PlayerData;
  userData: UserData = null;
  dataMgr: LevelManager = null;

  protected onLoad(): void {
    ResourceManager.getInstance()
      .load('prefabs/items/bottomButton', Prefab)
      .then((_prefab: Prefab) => {
        const _bottomNode = instantiate(_prefab);
        this.node.addChild(_bottomNode);
        this.bottomButton = _bottomNode.getComponent(StartBottomButton);
        this.bottomButton.checkButtonVisible();
        this.addListener();
      })
      .catch((error: Error) => {
        LogManager.error('加载prefabs/items/bottomButton失败', error);
      });
  }

  protected start(): void {
    //开始按钮呼吸态
    tween(this.startButton)
      .to(0.7, { scale: new Vec3(1.2, 1.2, 1.2) })
      .to(0.7, { scale: new Vec3(0.9, 0.9, 0.9) })
      .union()
      .repeatForever()
      .start();
    LogManager.warn('draws:', profiler.stats);
    LogManager.warn('draws:', profiler.stats.draws.counter.value);
  }

  addListener() {
    //侦听按钮事件
    this.startButton.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    EventManager.on(
      EventName.GOLD_UPDATE,
      () => {
        this.bottomButton.checkButtonVisible();
        this.goldUpdateHandle();
      },
      this,
    );
  }

  /** 初始化UI，可以传入数据 */
  public init(data?: GameUIData): void {
    this.playerData = PlayerData.getInstance();
    this.userData = this.playerData.UserData;
    this.dataMgr = LevelManager.getInstance();
    LogManager.info('StartUI 初始化', data);
    this.goldUpdateHandle();
    this.updateData();
    this.startSwing();
  }

  public updateData() {
    this.levelUnlockTip.string = `<color=#ffffff>第${this.dataMgr.nextUnlockLevel()}关解锁</color><color=#0fff00>${this.dataMgr.nextUnlockCharacter().name}</color>`;
    this.currentLevel.string = `第${this.userData.currentLevel}关`;
    this.ourPower.string = this.dataMgr.calculatePower().toString();
    this.enemyPower.string = this.dataMgr.calculateEnemyPower().toString();
  }

  public goldUpdateHandle() {
    this.goldCount.string = `${Math.floor(this.userData.gold)}`;
  }

  // 开始按钮点击事件
  onStartButtonClick() {
    LogManager.info('startButtonClick');
    LogManager.debug(`角度：${this.pointer.eulerAngles.z}`);
    const range = Math.abs(this.pointer.eulerAngles.z);
    let spriteIndex = 0;
    let _attackAddition = 1;
    if (range < 65 && range >= 30) {
      spriteIndex = 0;
      _attackAddition = 1;
    } else if (range < 30 && range >= 10) {
      spriteIndex = 1;
      _attackAddition = 1.2;
    } else if (range < 10) {
      spriteIndex = 2;
      _attackAddition = 1.5;
    }
    this.fightTip.active = true;
    this.fightTip.getComponent(SpriteChange).changeSprite(spriteIndex);
    tween(this.fightTip)
      .by(0.5, { position: new Vec3(0, 80, 0) })
      .call(() => {
        this.fightTip.position = Vec3.ZERO;
        this.fightTip.active = false;
        EventManager.emit(EventName.GAME_START, { attackAddition: _attackAddition });
      })
      .start();
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
    this.removeEvent();
  }

  private removeEvent() {
    this.startButton.off(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    EventManager.off(EventName.GOLD_UPDATE, this.goldUpdateHandle);
  }
}
