import { _decorator, Component, Node, Quat, Tween, tween, Vec3 } from 'cc';
import { LogManager } from '../Core/LogManager';
import { Quaternion } from '../Utils/Quaternion';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {
  public static instance: Camera = null;

  @property(Node)
  startPoint: Node = null;

  @property(Node)
  gamePoint: Node = null;

  @property(Node)
  target:Node=null;

  // 相机起始位置 A
  @property(Vec3)
  startPosition: Vec3 = new Vec3();
  // 相机目标位置 B
  @property(Vec3)
  endPosition: Vec3 = new Vec3();
  // 相机起始旋转角度 C
  @property(Quat)
  startRotation: Quat = new Quat();
  // 相机目标旋转角度 D
  @property(Quat)
  endRotation: Quat = new Quat();
  // 运镜时间
  @property
  duration: number = 2;
  private cameraTween: Tween<Node> | null = null;

  isLooking=false;

  protected onLoad(): void {
    Camera.instance = this;
  }

  start() {
    // 设置相机初始位置和旋转角度
    this.startPosition = this.startPoint.position;
    this.startRotation = this.startPoint.rotation;
    this.endPosition = this.gamePoint.position;
    this.endRotation = this.gamePoint.rotation;
    // 开始游戏时执行运镜
    // this.startCameraMovement();
  }
  // 开始相机运镜
  startCameraMovement() {
    let _out = Vec3.ONE;
    this.cameraTween = tween(this.node)
      .to(this.duration, { position: this.endPosition,rotation:this.endRotation})
      .call(() => {
        this.isLooking=false;
        // this.node.lookAt(this.target.getPosition(),Vec3.UP);
      })
      .start();
    //   this.isLooking=true;
  }

  protected lateUpdate(dt: number): void {
      if(this.isLooking){
        this.node.lookAt(this.target.getPosition(),Vec3.UP);
      }
  }

  // 游戏结束后相机回归初始状态
  endGame() {
    if (this.cameraTween) {
      this.cameraTween.stop();
    }
    this.node.setPosition(this.startPoint.position);
    this.node.setRotation(this.startPoint.rotation);
    // tween(this.node).to(this.duration, { position: this.startPosition, rotation: this.startRotation }).start();
  }
}
