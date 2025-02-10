import { FighterData, LevelData } from "../Datas/CsvConfig";
import { CSVManager } from "./CSVManager";
import { DataManager } from "./DataManager";


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
        DataManager.getInstance().init();
        // 初始化关卡管理器
        // 初始化兵种管理器
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

