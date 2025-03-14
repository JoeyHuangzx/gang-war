// 物体实体组件
import { _decorator, Component } from 'cc';
import { BoundingBox } from './BoundingBox';
const { ccclass, property } = _decorator;

@ccclass('QuadEntity')
export class QuadEntity extends Component {
  radius: number = 0.5;

  bbox: BoundingBox = null;

  // 初始化包围盒
  onLoad() {
    this.bbox = new BoundingBox();
    this.bbox.owner = this.node;
    this.updateBoundingBox();
  }

  updateBoundingBox() {
    const pos = this.node.getPosition();
    this.bbox.updateSize(pos.x - this.radius, pos.z - this.radius, 2 * this.radius, 2 * this.radius);
    // this.bbox.x = pos.x - this.radius;
    // this.bbox.y = pos.y - this.radius;
    // this.bbox.w = 2 * this.radius;
    // this.bbox.h = 2 * this.radius;
  }

  // 当位置改变时更新包围盒
  onPositionChanged() {
    this.updateBoundingBox();
  }
}
