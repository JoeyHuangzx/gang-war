import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Soldier')
export class Soldier extends Component {
    @property(Node)
    shadow:Node=null;

    @property(Node)
    modelParent:Node=null;

    start() {

    }

    initData(modelPrefab:Prefab){
        let model = instantiate(modelPrefab);
        this.modelParent.addChild(model);
        model.setPosition(0,0,0);
    }

    update(deltaTime: number) {
        
    }
}

