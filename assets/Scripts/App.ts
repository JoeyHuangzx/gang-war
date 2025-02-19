import { _decorator, Component, director, EditBox, Node } from 'cc';
import { GameManager } from './Core/GameManager';
import { LogManager } from './Core/LogManager';
import { LevelManager } from './Core/LevelManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
  start() {
    //常驻节点
    director.addPersistRootNode(this.node);

    //预加载场景
    this.preLoad();
  }

  preLoad() {
    LevelManager.getInstance().loadData();
    GameManager.getInstance().initPool();
    director.preloadScene('main', () => {
      LogManager.info('预加载 main 场景完成');
    });
  }
}
