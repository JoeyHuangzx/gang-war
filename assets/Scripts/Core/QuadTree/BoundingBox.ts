// 组件用于存储物体的包围盒
import { Component, Node, Vec2, Vec3 } from 'cc';
export class BoundingBox extends Component {
  owner: Node = null;

  x: number = 0;

  y: number = 0;

  w: number = 0;

  h: number = 0;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    super();
    // this.owner = owner;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // 获取中心点
  get center() {
    return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
  }

  /**
   * 判断是否相交
   * @param other
   * @returns
   */
  intersects(other: BoundingBox) {
    return !(
      this.x > other.x + other.w ||
      this.y > other.y + other.h ||
      this.x + this.w < other.x ||
      this.y + this.h < other.y
    );
  }
}
