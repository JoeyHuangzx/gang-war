// 组件用于存储物体的包围盒
import { _decorator, Component, CurveRange, director, find, Line, Node, Vec2, Vec3 } from 'cc';

export class BoundingBox {
  owner: Node = null;

  x: number = 0;

  y: number = 0;

  w: number = 0;

  h: number = 0;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0, isCreateLine = false) {
    // this.owner = owner;
    if (w > 0 && h > 0) {
      this.updateSize(x, y, w, h, isCreateLine);
    }
  }

  updateSize(x: number = 0, y: number = 0, w: number = 0, h: number = 0, isCreateLine = false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    isCreateLine && this.createLine();
  }

  // 获取中心点
  get center() {
    return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
  }

  createLine() {
    const quad: Node = find('quad');
    const curveRange = new CurveRange();
    curveRange.mode = 1;
    const posArr = [
      [new Vec3(this.x, 0, this.y), Vec3.ZERO, new Vec3(0, 0, this.h)],
      [new Vec3(this.x, 0, this.y), Vec3.ZERO, new Vec3(this.w, 0, 0)],
      [new Vec3(this.x + this.w, 0, this.y), Vec3.ZERO, new Vec3(0, 0, this.h)],
      [new Vec3(this.x, 0, this.y + this.h), Vec3.ZERO, new Vec3(this.w, 0, 0)],
    ];
    for (let i = 0; i < 4; i++) {
      const _lineNode = new Node();
      quad.addChild(_lineNode);
      const _line: Line = _lineNode.addComponent(Line);
      _lineNode.setPosition(posArr[i][0]);
      const newPos = _lineNode.position.clone().add(new Vec3(0, 2, 0));
      _lineNode.setPosition(newPos);
      _line.positions.push(posArr[i][1]);
      _line.positions.push(posArr[i][2]);

      _line.width = curveRange;
    }
  }

  /**
   * 判断是否相交
   * @param other
   * @returns
   */
  intersects(other: BoundingBox) {
    return other.x - this.x > 0 && other.x - this.x < this.w && other.y - this.y > 0 && other.y - this.y < this.h;
    /*  return !(
      this.x > other.x + other.w ||
      this.y > other.y + other.h ||
      this.x + this.w < other.x ||
      this.y + this.h < other.y
    ); */
  }
}
