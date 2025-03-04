import { BoundingBox } from './BoundingBox';
import { QuadEntity } from './QuadEntity';

// 四叉树节点类
export class QuadTreeNode {
  bbox: BoundingBox;
  objects: Array<QuadEntity> = [];
  children: Array<QuadTreeNode> = [];
  splitThreshold: number = 10;

  constructor(bbox: BoundingBox) {
    this.bbox = bbox;
  }

  // 插入物体
  insert(obj: QuadEntity): boolean {
    if (!this.bbox.intersects(obj.bbox)) return false;

    this.objects.push(obj);

    if (this.objects.length > this.splitThreshold) {
      this.split();
      // 重新分配所有对象到子节点
      this.objects.forEach(obj => {
        if (
          this.children[0].insert(obj) ||
          this.children[1].insert(obj) ||
          this.children[2].insert(obj) ||
          this.children[3].insert(obj)
        ) {
        }
      });
      this.objects = [];
    }
    return true;
  }

  // 分割节点
  split() {
    const { x, y, w, h } = this.bbox;
    const halfW = w / 2;
    const halfH = h / 2;

    this.children = [
      new QuadTreeNode(new BoundingBox(x, y, halfW, halfH)),
      new QuadTreeNode(new BoundingBox(x + halfW, y, halfW, halfH)),
      new QuadTreeNode(new BoundingBox(x, y + halfH, halfW, halfH)),
      new QuadTreeNode(new BoundingBox(x + halfW, y + halfH, halfW, halfH)),
    ];
  }

  // 查询碰撞
  query(obj: QuadEntity, results: Array<[QuadEntity, QuadEntity]>) {
    // 检查当前节点的所有物体
    for (let i = 0; i < this.objects.length; i++) {
      const other = this.objects[i];
      if (obj.bbox.intersects(other.bbox)) {
        results.push([obj, other]);
      }
    }

    // 递归查询子节点
    if (this.children) {
      for (const child of this.children) {
        if (child.bbox.intersects(obj.bbox)) {
          child.query(obj, results);
        }
      }
    }
  }
}
