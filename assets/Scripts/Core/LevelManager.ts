import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    private currentLevel: number = 0;

    loadLevel(level: number) {
        // 加载指定关卡的配置文件
        // 根据配置文件生成关卡场景
        this.currentLevel = level;
    }

    nextLevel() {
        // 加载下一关
        this.loadLevel(this.currentLevel + 1);
    }

    restartLevel() {
        // 重新加载当前关卡
        this.loadLevel(this.currentLevel);
    }
}

