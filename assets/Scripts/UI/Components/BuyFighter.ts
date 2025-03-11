import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import { LogManager } from '../../Core/LogManager';
import { BaseUI } from '../Views/BaseUI';
import { LevelManager } from '../../Core/LevelManager';
import { ResourceManager } from '../../Core/ResourceManager';
import { Constants } from '../../Global/Constants';
import { PlayerData } from '../../Core/PlayerData';
import { UIManager } from '../UIManager';
import { UIType } from '../Enum/UIEnum';
const { ccclass, property } = _decorator;

@ccclass('BuyFighter')
export class BuyFighter extends BaseUI {
  @property(Sprite)
  fighterSprite: Sprite = null;

  @property(RichText)
  fightUp: RichText = null;

  @property(Node)
  buyButton: Node = null;

  fighterId = 0;

  start() {
    this.buyButton.on(Node.EventType.TOUCH_END, this.buyFighter, this);
  }

  init() {
    this.fighterId = LevelManager.getInstance().getBuyFighter();
    const fighter = LevelManager.getInstance().getFighterData(this.fighterId);
    const fighterCardType = fighter.type;
    ResourceManager.getInstance()
      .load(`${Constants.TEXTURE_PATH.FIGHTER_TEXTURE_PATH}${fighterCardType}/spriteFrame`, SpriteFrame)
      .then(spriteFrame => {
        this.fighterSprite.spriteFrame = spriteFrame;
      });
    const power = LevelManager.getInstance().calculatePower();
    LogManager.debug(`id:${this.fighterId},power: ${power},fighter: ${fighter.fight}`);
    const up = Math.floor((fighter.fight / power) * 100);
    this.fightUp.string = `<color=#ffffff>战力提升</color><color=#00FF00>${up}%</color>`;
  }

  buyFighter() {
    LogManager.info('buyFighter');
    PlayerData.getInstance().buyFighter(this.fighterId);
    UIManager.getInstance().hideUI(UIType.BuyFighter);
  }

  update(deltaTime: number) {}

  protected onDestroy(): void {
    this.buyButton.off(Node.EventType.TOUCH_END, this.buyFighter, this);
  }
}
