import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BaseUI } from './BaseUI';
import { UIType } from '../Enum/UIEnum';
import { UIManager } from '../UIManager';
import { LogManager } from '../../Core/LogManager';
const { ccclass, property } = _decorator;

@ccclass('SettleUI')
export class SettleUI extends BaseUI {
    @property(Node)
    public againButton: Node;
    // 当前关卡 
    @property(Label)
    public currentLevel: Label;

    @property(Sprite)
    public resultSprite: Sprite;

    @property(Label)
    public goldLabel: Label;

    public init(data?: any): void {
        LogManager.info('SettleUI 初始化', data);
        this.againButton.on(Node.EventType.TOUCH_END, this.onAgainButtonClick, this);
    }

    private onAgainButtonClick() {
        LogManager.info('再来一局');
        UIManager.getInstance().showUI(UIType.GameUI);
        UIManager.getInstance().hideUI(UIType.SettleUI);
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.againButton.off(Node.EventType.TOUCH_END, this.onAgainButtonClick, this);
    }
}

