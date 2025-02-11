import { _decorator, Component, Node, Vec3, Prefab, instantiate, UITransform, director } from 'cc';
import { LogManager } from '../Core/LogManager';
const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
  @property(Prefab)
  gridPrefab: Prefab = null!; // 格子预制体

  private gridSize: number = 1.5; // 每个格子的大小
  private basePosition: Vec3 = new Vec3(-10, 0, 0); // 初始位置（最下方中间）
  private gridNodes: Node[] = []; // 存储所有格子节点
  private purchasedCount: number = 0; // 购买次数

  onLoad() {
    this.generateGrids(3); // 默认生成3个格子
    const _schedule = this.schedule(() => {
      if (this.purchasedCount >= 7) {
        LogManager.warn(`购买格子次数已达上限，取消自动购买`);
        this.unschedule(_schedule);
        this.unscheduleAllCallbacks();
        return;
      }

      this.purchaseGrid();
    }, 1);
  }

  /** 计算当前格子的位置 */
  private getGridPosition(index: number): Vec3 {
    let layer = 0;
    let width = 3; // 初始宽度
    let height = 3; // 初始高度

    if (index >= 9) {
      width = 4;
      height = 5;
      this.basePosition=new Vec3(-14.5,0,0);
    }
    if (index >= 20) {
      width = 5;
      height = Math.ceil(index / width);
      this.basePosition=new Vec3(-20,0,0);
    }

    layer=Math.floor(index/width);
    let x = this.basePosition.x - layer * this.gridSize;
    let z = 0;
    const middleGap=Math.floor(width/2);   
    const middle=layer*height+1;
    const gap=(index+1)-middle;  
    LogManager.debug(`layer:${layer},middleGap:${middleGap},middle:${middle},gap:${gap}`)
    if(gap===0){
        z=this.basePosition.z;
    }else if(gap===middleGap){
        z=this.basePosition.z-middleGap*this.gridSize;
    }else if(gap===middleGap+1){
        z=this.basePosition.z+middleGap*this.gridSize;
    }
    // this.basePosition.z + (countInLayer - Math.floor(width / 2)) * this.gridSize;
    LogManager.debug(`格子位置:index:${index},x: (${x}, z:${z})`);
    return new Vec3(x, 0, z);
  }

  /** 生成格子 */
  generateGrids(count: number) {
    for (let i = 0; i < count; i++) {
      let gridNode = instantiate(this.gridPrefab);
      gridNode.setPosition(this.getGridPosition(this.gridNodes.length));
      director.getScene().addChild(gridNode);
      this.gridNodes.push(gridNode);
    }
  }

  /** 购买格子 */
  purchaseGrid() {
    let price = Math.floor(100 * Math.pow(1.2, this.purchasedCount));
    // LogManager.debug(`购买格子价格: ${price}金币`);

    this.purchasedCount++;
    this.generateGrids(1);
  }
}
