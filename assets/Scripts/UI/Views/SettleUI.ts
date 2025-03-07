import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BaseUI } from './BaseUI';
import { UIType } from '../Enum/UIEnum';
import { UIManager } from '../UIManager';
import { LogManager } from '../../Core/LogManager';
import { SpriteChange } from '../Common/SpriteChange';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
const { ccclass, property } = _decorator;

export interface SettleUIData {
  result: boolean;
  currentLevel: number;
  gold: number;
}

/**
 * 结算界面
 */
@ccclass('SettleUI')
export class SettleUI extends BaseUI {
  @property(Node)
  public againButton: Node = null;
  // 当前关卡
  @property(Label)
  public currentLevel: Label = null;

  @property(Node)
  public resultBg: Node = null;

  @property(Node)
  public resultTitle: Node = null;

  @property(Label)
  public goldLabel: Label = null;

  protected onLoad(): void {
    this.againButton.on(Node.EventType.TOUCH_END, this.onAgainButtonClick, this);
  }

  public init(data?: SettleUIData): void {
    LogManager.info('SettleUI 初始化', data);
    this.resultBg.getComponent(SpriteChange).changeSprite(data.result ? 0 : 1);
    this.resultTitle.getComponent(SpriteChange).changeSprite(data.result ? 0 : 1);
    this.currentLevel.string = `第${data.currentLevel}关`;
    this.goldLabel.string = data.gold.toString();
  }

  private onAgainButtonClick() {
    LogManager.info('再来一局');
    EventManager.emit(EventName.GAME_RESET);
    UIManager.getInstance().showUI(UIType.GameUI);
    UIManager.getInstance().hideUI(UIType.SettleUI);
  }

  update(deltaTime: number) {}

  protected onDestroy(): void {
    this.againButton.off(Node.EventType.TOUCH_END, this.onAgainButtonClick, this);
  }
}
