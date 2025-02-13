import { _decorator, Component, input, Input, KeyCode, Node, SkeletalAnimation, Vec3 } from 'cc';
import { SoldierAnimationEnum } from './SoldierAnimationEnum';
import { LogManager } from '../../Core/LogManager';
const { ccclass, property } = _decorator;

@ccclass('SoldierModel')
export class SoldierModel extends Component {
    @property(SkeletalAnimation)
    public skeletalAnimation: SkeletalAnimation = null;

    @property
    moveSpeed: number = 5; // 移动速度

    private moveDirection: Vec3 = new Vec3(0, 0, 0);

    start() {
        this.skeletalAnimation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        //测试动画播放
        this.playAnimation(SoldierAnimationEnum.Idle);
        // this.scheduleOnce(() => {
        //     this.playAnimation(SoldierAnimationEnum.Run);
        //     this.scheduleOnce(() => {
        //         this.playAnimation(SoldierAnimationEnum.Dead);
        //     }, 3);
        // }, 3);

        input.on(Input.EventType.KEY_PRESSING, this.onKeyDown, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: any) {
        LogManager.debug(event.keyCode)
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
                this.moveDirection.z = 1;
                break;
            case KeyCode.ARROW_DOWN:
                this.moveDirection.z = -1;
                break;
            case KeyCode.ARROW_LEFT:
                this.moveDirection.x = -1;
                break;
            case KeyCode.ARROW_RIGHT:
                this.moveDirection.x = 1;
                break;
        }
    }

    private onKeyUp(event: any) {
        this.playAnimation(SoldierAnimationEnum.Idle);
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
            case KeyCode.ARROW_DOWN:
                this.moveDirection.z = 0;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
                this.moveDirection.x = 0;
                break;
        }
    }

    update(deltaTime: number) {
        if (this.moveDirection.length() > 0) {
            if(!this.isAnimationPlaying(SoldierAnimationEnum.Run)){
                this.playAnimation(SoldierAnimationEnum.Run);
            }
            const moveStep = this.moveDirection.normalize().multiplyScalar(this.moveSpeed * deltaTime);
            LogManager.debug(moveStep.x.toString(),moveStep.y, moveStep.z);
            const worldPos = this.node.position.add(moveStep);
            this.node.setWorldPosition(worldPos);
        }
    }

    private onAnimationFinished() {
        this.skeletalAnimation.off(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
    }

    public playAnimation(name: SoldierAnimationEnum) {
        this.skeletalAnimation.play(name);
    }

    /**
     * 判断指定名称的动画是否正在播放
     * @param animationName 动画名称
     * @returns 如果正在播放返回 true，否则返回 false
     */
    isAnimationPlaying(animationName: SoldierAnimationEnum): boolean {
        if (!this.skeletalAnimation) {
            return false;
        }
        const animationState = this.skeletalAnimation.getState(animationName);
        return animationState && animationState.isPlaying;
    }
}

