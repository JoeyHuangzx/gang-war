import { _decorator, Component, director, EditBox, Node } from 'cc';
import { GameManager } from './Core/GameManager';
import { LogManager } from './Core/LogManager';
import { DataManager } from './Core/DataManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
  start() {
    //常驻节点
    director.addPersistRootNode(this.node);
    DataManager.getInstance().init();
    director.preloadScene('main', () => {
      LogManager.info('预加载 main 场景完成');
    });
    
  }
}
