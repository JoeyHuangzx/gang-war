import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Vec3 } from 'cc';
import { LogManager } from '../Core/LogManager';
import { Quaternion } from '../Common/Utils/Quaternion';
import { Fighter } from '../Logic/Fighters/Fighter';
const { ccclass, property } = _decorator;

@ccclass('ModelTest')
export class ModelTest extends Component {
  @property
  speed: number = 5;

  @property
  angle: number = 10;

  @property(Vec3)
  moveDir: Vec3 = new Vec3(0, 0, 0);

  private isMoving = false;

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    // this.node.getComponent(Fighter).
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.SPACE:
        this.isMoving = true;
        break;
      case KeyCode.KEY_T:
        this.isMoving = false;
        break;
      case KeyCode.KEY_E:
        this.angle = Math.abs(this.angle);
        this.rotate();
        break;
      case KeyCode.KEY_Q:
        this.attackEffect();
        break;
    }
  }

  update(deltaTime: number) {
    if (this.isMoving) {
      this.moveDir = this.node.forward.negative();
      LogManager.debug(this.node.position.toString());
      const newPos = this.node.position.add(this.moveDir.multiplyScalar(this.speed * deltaTime));
      this.node.setWorldPosition(newPos);
      // this.node.translate(this.moveDir.multiplyScalar(this.speed * deltaTime));
      // this.rotate(deltaTime);
    }
  }

  rotateTime = 0;
  rotate() {
    // this.rotateTime += deltaTime;
    this.node.setWorldRotation(Quaternion.RotateY(this.node, this.angle));
  }

  attackEffect() {
    this.node.getComponent(Fighter).attackEffect();
  }
}
