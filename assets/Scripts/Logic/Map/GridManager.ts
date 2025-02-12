import { _decorator, Component, Node, Vec3, Prefab, instantiate, UITransform, director, find } from 'cc';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { LogManager } from '../../Core/LogManager';
import { GameManager } from '../../Core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {

  @property(Prefab)
  gridPrefab: Prefab = null!; // 格子预制体
  private gridSize: number = 1.5; // 每个格子的大小
  private basePosition: Vec3 = new Vec3(-10, 0, 0); // 初始位置（最下方中间）
  private gridNodes: Node[] = []; // 存储所有格子节点
  public gridMap: Map<number, Node> = new Map();

  start() {
    EventManager.on(EventName.ADD_GRID,this.addGrid,this);
    // EventManager.on(EventName.GENERATE_GRID,this.generateGrids,this);
  }

  /** 计算当前格子的位置 */
  private getGridPosition(index: number): Vec3 {
    let layer = 0;
    let width = 3; // 初始宽度
    let height = 3; // 初始高度
    let baseIndex = index;
    if (index >= 9) {
      width = 4;
      height = 5;
      baseIndex = index - 9;
      this.basePosition = new Vec3(-14.5, 0, 0);
    }
    if (index >= 50) {
      width = 5;
      height = Math.ceil(index / width);
      baseIndex = index - 50;
      this.basePosition = new Vec3(-20, 0, 0);
    }

    layer = Math.floor(baseIndex / height);
    let x = this.basePosition.x - layer * this.gridSize;
    let z = 0;
    const middleGap = Math.floor(height / 2);
    const middle = layer * height + 1;
    const gap = baseIndex + 1 - middle;
    // LogManager.debug(`layer:${layer},middleGap:${middleGap},middle:${middle},gap:${gap}`);
    if (gap === 0) {
      // 中间位置
      z = this.basePosition.z;
    } else {
      // 3-9 格:以 9 宫格(3X3)为目标，从下方的中间开始增加，再左右依次逐个增加
      if (index < 10) {
        // 左边格子位置比中间位置减-1
        if (gap === middleGap) {
          z = this.basePosition.z - middleGap * this.gridSize;
        } else if (gap === middleGap + 1) {
          // 右边格子位置比中间位置加1
          z = this.basePosition.z + middleGap * this.gridSize;
        }
      } else {
        // 以 20 宫格(4X5)为目标，依旧先从下方的中间开始，再左右依次逐个增加，最后往上增长补满
        if (gap % 2 === 1) {
          const _temp = gap === 1 ? 1 : 2;
          z = this.basePosition.z - _temp * this.gridSize;
        } else {
          const _temp = gap === 2 ? 1 : 2;
          z = this.basePosition.z + _temp * this.gridSize;
        }
      }
    }
    // LogManager.debug(`格子位置:index:${index},x: (${x}, z:${z})`);
    return new Vec3(x, 0, z);
  }

  /** 生成格子 */
  generateGrids(count: number) {
    if(!this.gridPrefab || !GameManager.getInstance().gameNode){
      LogManager.error('gridPrefab or parent is null');
      return;
    }
    for (let i = 0; i < count; i++) {
      let gridNode = instantiate(this.gridPrefab);
      gridNode.setPosition(this.getGridPosition(this.gridNodes.length));
      GameManager.getInstance().gameNode.addChild(gridNode);
      this.gridNodes.push(gridNode);
      this.gridMap.set(this.gridNodes.length, gridNode);
    }
  }

  /** 购买格子 */
  addGrid() {
    this.generateGrids(1);
  }

  protected onDestroy(): void {
    EventManager.off(EventName.ADD_GRID,this.addGrid);
  }
}
