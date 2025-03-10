import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FightProgress')
export class FightProgress extends Component {
  @property(UITransform)
  progress: UITransform = null;

  @property(Node)
  icon: Node = null;

  private total = 215;

  start() {}

  updateProgress(progress: number) {
    this.progress.setContentSize(this.total * progress, 24);
    this.icon.setPosition(this.total * progress - 100, 0);
  }
}
