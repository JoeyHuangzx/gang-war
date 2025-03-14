import { _decorator, Component, director, input, Input, instantiate, KeyCode, Node, Size, Vec3, view } from 'cc';
import { QuadEntity } from './QuadEntity';
import { BoundingBox } from './BoundingBox';
import { QuadTreeNode } from './QuadTreeNode';

declare global {
  interface Window {
    quadMgr: QuadTreeManager;
  }
}

//
const { ccclass, property } = _decorator;

/**
 * 四叉树管理器组件
 */
@ccclass('QuadTreeManager')
export class QuadTreeManager extends Component {
  public static instance: QuadTreeManager;
  @property(Node)
  rootNode: Node = null;

  @property(QuadEntity)
  circles: QuadEntity[] = [];

  private quadTree: QuadTreeNode;

  onLoad() {
    this.initQuadTree();
    QuadTreeManager.instance = this;
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  onKeyDown(e) {
    if (e.keyCode === KeyCode.KEY_Q) {
      const _circle = instantiate(this.circles[0].node);
      director.getScene().addChild(_circle);
      _circle.setPosition(new Vec3(Math.random() * 20 - 10, 2, Math.random() * 20 - 10));
      _circle.getComponent(QuadEntity).updateBoundingBox();
      this.quadTree.insert(_circle.getComponent(QuadEntity));
    }
  }

  // 初始化四叉树
  initQuadTree() {
    if (!this.rootNode) return;
    /** 3D场景下的x，z范围 */
    const visibleSize = new Size(20, 20); //view.getVisibleSize();
    const visibleWidth = visibleSize.width;
    const visibleHeight = visibleSize.height;
    const bbox = new BoundingBox();
    bbox.updateSize(-10, -10, visibleWidth, visibleHeight, true);
    this.quadTree = new QuadTreeNode(bbox);

    // 插入所有圆形物体
    this.circles.forEach(circle => {
      this.quadTree.insert(circle);
    });
  }

  // 手动添加物体到四叉树
  public addCircle() {
    const circle = new QuadEntity();
    this.quadTree.insert(circle);
  }

  // 查询碰撞（示例用法）
  queryCollisions(targetCircle: QuadEntity) {
    const results = [];
    this.quadTree.query(targetCircle, results);
    return results;
  }
}

const mgr = QuadTreeManager.instance;
window.quadMgr = mgr;
