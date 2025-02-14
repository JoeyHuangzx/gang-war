import { _decorator, Component, input, Input, KeyCode, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraMovement')
export class CameraMovement extends Component {
    // 相机移动速度
    @property
    public moveSpeed = 5;

    // 用于存储按键状态
    private _keys: { [key: number]: boolean } = {};

    start() {
        // 监听按键按下事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyDown, this);
        // 监听按键释放事件
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // 取消按键事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: any) {
        // 记录按键按下状态
        this._keys[event.keyCode] = true;
    }

    onKeyUp(event: any) {
        // 记录按键释放状态
        this._keys[event.keyCode] = false;
    }

    update(deltaTime: number) {
        // 创建一个用于存储移动方向的向量
        let moveDirection = new Vec3(0, 0, 0);

        // 根据按键状态更新移动方向
        if (this._keys[KeyCode.KEY_W]) {
            moveDirection.x += 1;
        }
        if (this._keys[KeyCode.KEY_S]) {
            moveDirection.x -= 1;
        }
        if (this._keys[KeyCode.KEY_A]) {
            moveDirection.z -= 1;
        }
        if (this._keys[KeyCode.KEY_D]) {
            moveDirection.z += 1;
        }

        // 归一化移动方向向量
        moveDirection.normalize();

        // 根据移动方向和速度更新相机位置
        let moveDistance = Vec3.multiplyScalar(new Vec3(), moveDirection, this.moveSpeed * deltaTime);
        const worldPos = Vec3.add(new Vec3(), this.node.position, moveDistance);
        this.node.setWorldPosition(worldPos);
    }
}