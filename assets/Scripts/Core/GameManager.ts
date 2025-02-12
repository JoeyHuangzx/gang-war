import { find, Node } from "cc";
import { FighterData, LevelData } from "../Datas/CsvConfig";
import { GridManager } from "../Logic/Map/GridManager";
import { CSVManager } from "./CSVManager";
import { DataManager } from "./DataManager";
import { SoldierManager } from "./SoldierManager";


export class GameManager {
    private static _instance: GameManager;

    public gridManager:GridManager;
    public gameNode:Node=null;

    private constructor() {
    }

    public static getInstance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    initManagers() {
        this.gameNode=find('game');
        
        // 初始化关卡管理器
        // 初始化兵种管理器
        this.gridManager=find('newMap01')?.getComponent(GridManager);
        SoldierManager.getInstance().initData();
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

