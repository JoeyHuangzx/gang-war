import { _decorator, Component, input, Input, KeyCode, Node, SkeletalAnimation, Vec3 } from 'cc';
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

  start() {
    this.skeletalAnimation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
    //测试动画播放
    this.playAnimation(FighterAnimationEnum.Idle);
  }

  update(deltaTime: number) {
    this.ticker += deltaTime;
  }

  private onAnimationFinished() {
    this.skeletalAnimation.off(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
  }

  public playAnimation(name: FighterAnimationEnum) {
    if (!this.isAnimationPlaying(name)) {
      this.skeletalAnimation.crossFade(name, 0.3);
      LogManager.debug(`play animation:${name}`);
    }
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

  async waitForAnimationFinished(animationName: FighterAnimationEnum) {
    while (this.skeletalAnimation.getState(animationName).isPlaying) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
