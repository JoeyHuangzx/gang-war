import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends Component {
  @property(Animation)
  public effectAni: Animation = null;

  @property
  autoDestroy: boolean = false;

  private _callback = null;

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

  /**
   * 动画完成事件回调
   */
  public setCallback(callback: Function) {
    this._callback = callback;
  }

  finishedAnimation() {
    this._callback && this._callback();
    if (this.autoDestroy) {
      this.node.destroy();
    }
  }
}
