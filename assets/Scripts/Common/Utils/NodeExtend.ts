import { Node, Sprite, SpriteFrame } from 'cc';
import { ResourceManager } from '../../Core/ResourceManager';

Node.prototype.normalize = function () {
  console.log(this);
};

Node.prototype.setSpriteFrame = function (url) {
  console.log(this);
  const _sprite = this.getComponent(Sprite);
  if (_sprite) {
    try {
      ResourceManager.getInstance()
        .load(url, SpriteFrame)
        .then(value => {
          console.log('value:', value);
          if (value) {
            // _sprite.spriteFrame = value;
          }
        })
        .catch(reason => {
          console.error(reason);
        });
    } catch (error) {
      console.error(error);
    }
  }
};
