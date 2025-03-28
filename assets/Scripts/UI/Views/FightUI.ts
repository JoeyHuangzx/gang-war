import { _decorator, BatchingUtility, Component, Label, Node, Sprite } from 'cc';
import { BaseUI } from './BaseUI';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
import { LogManager } from '../../Core/LogManager';
import { Camera } from '../../Logic/Camera';
import { PlayerData } from '../../Core/PlayerData';
import { LevelManager } from '../../Core/LevelManager';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { EffectManager } from '../../Logic/Effects/EffectManager';
import { FightProgress } from '../Components/FightProgress';
const { ccclass, property } = _decorator;

/** FightUI 的数据结构 */
export interface FightUIData {
  selfPower: number;
  enemyPower: number;
}

@ccclass('FightUI')
export class FightUI extends BaseUI {
  //重新游戏按钮
  @property(Node)
  restartButton: Node = null;

  //技能按钮
  @property(Node)
  skillButton: Node = null;

  @property(Label)
  ourPower: Label = null;

  @property(Label)
  enemyPower: Label = null;

  // 金币数
  @property(Label)
  goldCount: Label = null;

  // 当前关卡
  @property(Label)
  currentLevel: Label = null;

  @property(Sprite)
  redProgress: Sprite = null;

  @property(Sprite)
  progressIcon: Sprite = null;

  @property(FightProgress)
  fightProgress: FightProgress = null;

  private _gold = 0;

  start() {
    this.addListener();
  }

  public init(data: FightUIData): void {
    LogManager.info('FightUI 初始化', data);

    this.currentLevel.string = `第${PlayerData.getInstance().UserData.currentLevel}关`;
    this.goldCount.string = this._gold.toString();
    this.updatePower(data);
  }

  private addListener() {
    this.restartButton.on(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.on(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
    EventManager.on(EventName.FIGHT_GOLD_UPDATE, this.updateGold, this);
    EventManager.on(EventName.FIGHT_POWER_UPDATE, this.updatePower, this);
  }

  updatePower(data: FightUIData) {
    this.ourPower.string = data.selfPower.toString();
    this.enemyPower.string = data.enemyPower.toString();
    const power = data.selfPower >= data.enemyPower ? data.selfPower : data.enemyPower;
    const gap = power / (data.selfPower + data.enemyPower);
    this.fightProgress.updateProgress(gap);
  }

  updateGold(data: { gold: number }) {
    this.goldCount.string = data.gold.toString();
  }

  private onRestartButtonClick() {
    LogManager.info('重新开始');
    UIManager.getInstance().showUI(UIType.GameUI);
    UIManager.getInstance().hideUI(UIType.FightUI);

    EventManager.emit(EventName.GAME_RESET);
  }

  private onSkillButtonClick() {
    LogManager.info('技能');
    EffectManager.getInstance().playFireBall();
  }

  update(deltaTime: number) {}

  protected onDestroy(): void {
    this.removeEvent();
  }

  private removeEvent() {
    this.restartButton.off(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.off(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
    EventManager.off(EventName.FIGHT_GOLD_UPDATE, this.updateGold);
  }
}
