import {
  _decorator,
  CameraComponent,
  Component,
  EventTouch,
  geometry,
  Layers,
  Node,
  PhysicsSystem,
  Vec2,
  Vec3,
} from 'cc';
import { LogManager } from '../Core/LogManager';
import { Constants } from '../Global/Constants';
const { ccclass, property } = _decorator;

// TODO ：模型升级合成
/**
 *
 * 角色模型基础拖拽功能
 */
@ccclass('DragController3D')
export class DragController3D extends Component {
  @property(CameraComponent)
  public mainCamera: CameraComponent = null;
  private _ray: geometry.Ray = null;

  private target: Node = null;
  initPos: Vec3 = Vec3.ZERO;
  offset: Vec3 = Vec3.ZERO;
  isDragging: boolean = false;

  start() {
    this.node.on(Node.EventType.TOUCH_START, this.startTouch, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.moveTouch, this);
    this.node.on(Node.EventType.TOUCH_END, this.endTouch, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.endTouch, this);

    if (this.target) {
      this.initPos = this.target.position.clone();
    }
  }

  /**
   * 点击模型
   */
  startTouch(e: EventTouch) {
    LogManager.debug('startTouch');
    this.checkRay(e.getLocation());
    // 转为为屏幕坐标
  }

  /**
   * 拖动模型
   */
  moveTouch(e: EventTouch) {
    if (!this.target) {
      return;
    }
    // LogManager.debug(`moveTouch: ${e.getLocationX()}, ${e.getLocationY()}`);
    this.checkRay(e.getLocation());
  }

  /**
   * 松开模型
   */
  endTouch() {
    if (!this.target) {
      return;
    }
    LogManager.debug('endTouch');
    this.isDragging = false;
    const newPos = Vec3.ZERO;
    this.target.setPosition(newPos);
    this.target = null;
  }

  checkRay(pos: Vec2) {
    this._ray = this.mainCamera.screenPointToRay(pos.x, pos.y, this._ray);
    if (!this._ray) {
      LogManager.error('this._ray is null');
      return;
    }
    const isCheck = PhysicsSystem.instance.raycastClosest(this._ray, Constants.LAYER_ENUM.MODEL);
    if (isCheck) {
      const hitResult = PhysicsSystem.instance.raycastClosestResult;
      const hitNode = hitResult.collider.node;
      const hitPoint = hitResult.hitPoint;
      if (hitNode) {
        LogManager.debug(`hitNode: ${hitNode.name}, hitPoint: ${hitPoint}, hitNode.layer: ${hitNode.layer}`);
        if (hitNode.layer === 1 << Constants.LAYER_ENUM.MODEL && !this.target) {
          this.target = hitNode;
          this.initPos = this.target.position.clone();
        } else if (hitNode.layer === 1 << Constants.LAYER_ENUM.PLANE) {
          LogManager.debug('move--');
          const newPos = hitPoint.clone();
          newPos.y = this.initPos.y;
          this.target.setWorldPosition(newPos);
        }
        // this.target = hitNode;
        // this.initPos = this.target.position.clone();
        // const distance = this.mainCamera.worldToScreen(this.target.worldPosition).z;
        // const worldPos = this.mainCamera.screenToWorld(new Vec3(pos.x, pos.y, distance));
        // this.offset = this.target.worldPosition.clone().subtract(worldPos);
      }
    }
  }

  update(deltaTime: number) {}
}
