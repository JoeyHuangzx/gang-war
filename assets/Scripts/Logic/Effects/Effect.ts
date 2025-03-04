import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {
  @property(Animation)
  public effectAni: Animation = null;

  @property
  autoDestroy: boolean = false;

  start() {
    if (!this.effectAni) {
      this.effectAni = this.getComponent(Animation);
    }
    this.effectAni.on(Animation.EventType.FINISHED, this.finishedAnimation, this);
  }

  public playEffect(effectName: string = '') {
    if (effectName !== '') {
      this.effectAni.play(effectName);
    } else {
      this.effectAni.play(this.effectAni.defaultClip.name);
    }
  }

  finishedAnimation() {
    if (this.autoDestroy) {
      this.node.destroy();
    }
  }
}
