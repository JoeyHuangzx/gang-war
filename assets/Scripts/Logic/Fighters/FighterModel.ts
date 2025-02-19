import { _decorator, Component,  input, Input, KeyCode, Node, SkeletalAnimation, Vec3 } from 'cc';
import { FighterAnimationEnum } from './FighterAnimationEnum';
import { LogManager } from '../../Core/LogManager';
import { FormationEnum } from '../../Global/FormationEnum';
import { Quaternion } from '../../Common/Utils/Quaternion';
const { ccclass, property } = _decorator;

@ccclass('FighterModel')
export class FighterModel extends Component {
  @property(SkeletalAnimation)
  public skeletalAnimation: SkeletalAnimation = null;

  @property
  moveSpeed: number = 3; // 移动速度
  @property(Number) private attackRange: number = 2; // 攻击范围
  public enemies: Node[] = []; // 敌方小兵列表
  private targetEnemy: Node | null = null; // 当前目标敌人
  private isAttacking: boolean = false; // 是否在攻击
  ticker = 0;
  findEnemyDt = 1;
  formation: FormationEnum = FormationEnum.Self;

  start() {
    this.skeletalAnimation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
    //测试动画播放
    this.playAnimation(FighterAnimationEnum.Idle);
    this.node.setScale(new Vec3(0.5,0.5,0.5));
    if(this.formation === FormationEnum.Enemy){
      this.node.setWorldRotation(Quaternion.GetQuatFromAngle(new Vec3(0,270,0)));
    }
    
  }


  update(deltaTime: number) {
    this.ticker += deltaTime;
    if (this.isAttacking || !this.targetEnemy) return;

    const myPos = this.node.position;
    const targetPos = this.targetEnemy.position;
    const distance = Vec3.distance(myPos, targetPos);

    if (distance > this.attackRange) {
      this.moveToTarget(targetPos, deltaTime);
    } else {
      this.playAnimation(FighterAnimationEnum.Attack);
      this.startAttack(); // 进入攻击
    }
  }

  /** 让小兵朝目标移动 */
  private moveToTarget(targetPos: Vec3, dt: number): void {
    const direction = new Vec3();
    Vec3.subtract(direction, targetPos, this.node.position);
    direction.normalize();

    const moveOffset = new Vec3(direction.x * this.moveSpeed * dt, 0, direction.z * this.moveSpeed * dt);

    const worldPos = this.node.position.add(moveOffset);
    this.node.setWorldPosition(worldPos);
    this.playAnimation(FighterAnimationEnum.Run);
  }

  /** 计算最近的敌人 */
  public findClosestEnemy(): void {
    let closestEnemy: Node | null = null;
    let minDistance = Infinity;

    for (const enemy of this.enemies) {
      const distance = Vec3.distance(this.node.position, enemy.position);
      // LogManager.debug(`mid:${distance}`);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    }

    this.targetEnemy = closestEnemy;
  }

  /** 进入攻击状态 */
  private startAttack(): void {
    this.isAttacking = true;
    // console.log(`${this.node.name} 开始攻击 ${this.targetEnemy?.name}`);

    // 这里可以添加攻击动画
    this.playAnimation(FighterAnimationEnum.Attack);

    this.scheduleOnce(() => {
      // console.log(`${this.node.name} 结束攻击`);
      this.isAttacking = false;
      this.findClosestEnemy(); // 继续寻找新的目标
    }, 1); // 假设攻击间隔 1 秒
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
}
