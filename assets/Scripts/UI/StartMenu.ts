import { _decorator, Component, Node, Button } from 'cc';
import { UIType } from './enum/UIEnum';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property({ type: Button })
    startButton: Button | null = null;

    start() {
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);
        }
    }

    onStartButtonClick() {
        const uiManager = this.node.scene.getComponentInChildren('UIManager') as UIManager;
        if (uiManager) {
            uiManager.showUI(UIType.GAME_UI);
        }
    }
}