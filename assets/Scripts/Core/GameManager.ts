import { UIType } from "../UI/Enum/UIEnum";
import { UIManager } from "../UI/UIManager";
import { GameUIData } from "../UI/Views/GameUI";

export class GameManager {
    private static _instance: GameManager;

    private constructor() {
    }

    public static getInstance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    initManagers() {
        // 初始化关卡管理器
        // 初始化兵种管理器
        UIManager.getInstance().showUI(UIType.LoginUI);
    }

    startGame() {
        // 开始游戏逻辑
    }

    pauseGame() {
        // 暂停游戏逻辑
    }

    endGame() {
        // 结束游戏逻辑
    }
}

