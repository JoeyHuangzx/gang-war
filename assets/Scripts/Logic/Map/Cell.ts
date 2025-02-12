import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import { ResourceManager } from '../../Core/ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {

    async start() {
        
    }

    async showEffect(){
        const prefab=await ResourceManager.getInstance().load('prefabs/effect/upLoop01',Prefab);
        const node=instantiate(prefab);
        this.node.addChild(node);
        node.setPosition(0,0);
    }

    update(deltaTime: number) {
        
    }


}


