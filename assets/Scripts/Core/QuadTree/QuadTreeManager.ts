import { _decorator, Canvas, Component, sys, view } from 'cc';
import { QuadEntity } from './QuadEntity';
import { BoundingBox } from './BoundingBox';
import { QuadTreeNode } from './QuadTreeNode';

//
const { ccclass, property } = _decorator;

/**
 * 四叉树管理器组件
 */
@ccclass('QuadEntity')
export class QuadTreeManager extends Component {
  @property({ type: Node })
  rootNode: Node = null;

  @property({ type: Array })
  circles: Array<QuadEntity> = [];

  private quadTree: QuadTreeNode;

  onLoad() {
    this.initQuadTree();
  }

  // 初始化四叉树
  initQuadTree() {
    if (!this.rootNode) return;
    const visibleSize = view.getVisibleSize();
    const visibleWidth = visibleSize.width;
    const visibleHeight = visibleSize.height;
    const bbox = new BoundingBox();
    bbox.x = 0;
    bbox.y = 0;
    bbox.w = visibleWidth;
    bbox.h = visibleHeight;
    this.quadTree = new QuadTreeNode(bbox);

    // 插入所有圆形物体
    this.circles.forEach(circle => {
      this.quadTree.insert(circle);
    });
  }

  // 手动添加物体到四叉树
  addCircle(circle: QuadEntity) {
    this.quadTree.insert(circle);
  }

  // 查询碰撞（示例用法）
  queryCollisions(targetCircle: QuadEntity) {
    const results = [];
    this.quadTree.query(targetCircle, results);
    return results;
  }
}
