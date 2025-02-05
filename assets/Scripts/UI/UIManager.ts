import { _decorator, Component, Prefab, instantiate, Node } from 'cc';
import { UIType } from './enum/UIEnum';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    // 存储各个 UI 预制体
    @property({ type: Prefab })
    startMenuPrefab: Prefab | null = null;

    @property({ type: Prefab })
    gameUIPrefab: Prefab | null = null;

    @property({ type: Prefab })
    endMenuPrefab: Prefab | null = null;

    @property({ type: Prefab })
    victoryMenuPrefab: Prefab | null = null;

    @property({ type: Prefab })
    leaderboardPrefab: Prefab | null = null;

    @property({ type: Prefab })
    toolUIPrefab: Prefab | null = null;

    @property({ type: Prefab })
    unitUIPrefab: Prefab | null = null;

    // 存储各个 UI 节点的映射
    private uiNodes: { [key in UIType]?: Node } = {};
    // 存储 UI 预制体的映射
    private uiPrefabs: { [key in UIType]?: Prefab } = {
        [UIType.START_MENU]: this.startMenuPrefab,
        [UIType.GAME_UI]: this.gameUIPrefab,
        [UIType.END_MENU]: this.endMenuPrefab,
        [UIType.VICTORY_MENU]: this.victoryMenuPrefab,
        [UIType.LEADERBOARD]: this.leaderboardPrefab,
        [UIType.TOOL_UI]: this.toolUIPrefab,
        [UIType.UNIT_UI]: this.unitUIPrefab
    };

    start() {
        // 初始显示开始界面
        this.showUI(UIType.START_MENU);
    }

    // 显示指定类型的 UI
    showUI(uiType: UIType) {
        this.hideAllUI();
        let uiNode = this.uiNodes[uiType];
        if (!uiNode) {
            const prefab = this.uiPrefabs[uiType];
            if (prefab) {
                uiNode = instantiate(prefab);
                this.node.addChild(uiNode);
                this.uiNodes[uiType] = uiNode;
            }
        } else {
            uiNode.active = true;
        }
    }

    // 隐藏所有 UI 界面
    hideAllUI() {
        for (const key in this.uiNodes) {
            const uiNode = this.uiNodes[key as UIType];
            if (uiNode) {
                uiNode.active = false;
            }
        }
    }
}