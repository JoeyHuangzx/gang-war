import {
  _decorator,
  Animation,
  AnimationClip,
  Component,
  input,
  Input,
  KeyCode,
  Node,
  SkeletalAnimation,
  SkeletalAnimationState,
  Vec3,
} from 'cc';
import { FighterAnimationEnum } from './FighterAnimationEnum';
import { LogManager } from '../../Core/LogManager';
import { FighterTypeEnum } from '../../Global/FighterTypeEnum';
import { Quaternion } from '../../Common/Utils/Quaternion';
const { ccclass, property } = _decorator;

@ccclass('FighterModel')
export class FighterModel extends Component {
  @property(SkeletalAnimation)
  public skeletalAnimation: SkeletalAnimation = null;
  ticker = 0;
  findEnemyDt = 1;

  private _animationFinished: Function = null;

  onEnable() {
    this.skeletalAnimation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
    this.playAnimation(FighterAnimationEnum.Idle);
  }

  update(deltaTime: number) {
    this.ticker += deltaTime;
  }

  private onAnimationFinished(type: Animation.EventType, state: SkeletalAnimationState) {
    if (this._animationFinished) {
      this._animationFinished();
    }

    this.skeletalAnimation.off(Animation.EventType.FINISHED, this.onAnimationFinished, this);
  }

  public setAnimationFinishedCallback(callback: Function) {
    this._animationFinished = callback;
  }

  public playAnimation(name: FighterAnimationEnum) {
    if (!this.isAnimationPlaying(name)) {
      this.skeletalAnimation.play(name);
    }
  }

  protected onDisable(): void {
    this._animationFinished = null;
  }

  /**
   * 判断指定名称的动画是否正在播放
   * @param animationName 动画名称
   * @returns 如果正在播放返回 true，否则返回 false
   */
  isAnimationPlaying(animationName: FighterAnimationEnum): boolean {
    if (!this.skeletalAnimation) {
      return false;
    }
    const animationState = this.skeletalAnimation.getState(animationName);
    return animationState && animationState.isPlaying;
  }
}
