import { _decorator, Component, Node } from 'cc';
import { GameManager } from './Core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
    
    start() {
        GameManager.getInstance().initManagers();
    }

    update(deltaTime: number) {
        
    }
}

