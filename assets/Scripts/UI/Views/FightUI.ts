import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BaseUI } from './BaseUI';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
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

  public init(data?: any): void {
    console.log('FightUI 初始化', data);
    this.addListener();
  }

  private addListener() {
    this.restartButton.on(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.on(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
  }

  private onRestartButtonClick() {
    console.log('重新开始');
    UIManager.getInstance().showUI(UIType.GameUI);
    UIManager.getInstance().hideUI(UIType.FightUI);
  }

  private onSkillButtonClick() {
    console.log('技能');
  }

  update(deltaTime: number) {}

  protected onDestroy(): void {
    this.restartButton.off(Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    this.skillButton.off(Node.EventType.TOUCH_END, this.onSkillButtonClick, this);
  }
}
