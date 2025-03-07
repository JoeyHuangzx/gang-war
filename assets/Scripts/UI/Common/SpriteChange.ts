import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 组件化切换sprite里的图片
 */
@ccclass('SpriteChange')
export class SpriteChange extends Component {
  spriteNode: Sprite = null;

  @property({ type: SpriteFrame })
  spriteFrames: SpriteFrame[] = [];

  onLoad() {
    this.spriteNode = this.getComponent(Sprite);
    this.spriteNode.spriteFrame = this.spriteFrames[0];
  }

  changeSprite(index: number) {
    this.spriteNode.spriteFrame = this.spriteFrames[index];
  }

  update(deltaTime: number) {}
}
