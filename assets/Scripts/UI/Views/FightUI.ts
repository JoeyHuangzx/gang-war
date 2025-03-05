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
const { ccclass, property } = _decorator;

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

  dataMgr: LevelManager = null;

  private _gold = 0;

  public init(data?: any): void {
    LogManager.info('FightUI 初始化', data);
    this.dataMgr = LevelManager.getInstance();
    this.addListener();
    this.initData();
  }

  private addListener() {
    this.restartButton.on(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.on(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
    EventManager.on(EventName.FIGHT_GOLD_UPDATE, this.updateGold, this);
  }

  private initData() {
    this.currentLevel.string = `第${PlayerData.getInstance().UserData.currentLevel}关`;
    this.goldCount.string = this._gold.toString();
    this.updateData();
  }

  updateData() {
    this.ourPower.string = this.dataMgr.calculatePower().toString();
    this.enemyPower.string = this.dataMgr.calculateEnemyPower().toString();
  }

  updateGold(gold: number) {
    LogManager.info('更新金币:', gold);
    gold = this.dataMgr.getCurrLevelData().coefficient * gold;
    this._gold += gold;
    this.goldCount.string = this._gold.toString();
  }

  private onRestartButtonClick() {
    LogManager.info('重新开始');
    UIManager.getInstance().showUI(UIType.GameUI);
    UIManager.getInstance().hideUI(UIType.FightUI);
    Camera.instance.endGame();
    EventManager.emit(EventName.GAME_RESET);
  }

  private onSkillButtonClick() {
    LogManager.info('技能');
    EffectManager.getInstance().playFireBall();
  }

  update(deltaTime: number) {}

  protected onDestroy(): void {
    this.restartButton.off(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.off(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
  }
}
