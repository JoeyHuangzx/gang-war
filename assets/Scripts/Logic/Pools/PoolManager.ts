// PoolManager.ts
import { _decorator, Node, instantiate, director, Prefab } from 'cc';
const { ccclass } = _decorator;

type PoolInfo = {
    prefab: Prefab;
    activeNodes: Set<Node>;
    inactiveNodes: Node[];
    maxSize: number;
};

@ccclass('PoolManager')
export class PoolManager {
    private static _instance: PoolManager;
    private _pools: Map<string, PoolInfo> = new Map();
    private _poolRoot: Node;

    public static getInstance(): PoolManager {
        if (!this._instance) {
            this._instance = new PoolManager();
            this._instance._poolRoot = new Node('ObjectPoolRoot');
            
            director.getScene()?.addChild(this._instance._poolRoot);
            director.addPersistRootNode(this._instance._poolRoot);
        }
        return this._instance;
    }

    /**
     * 初始化对象池（兼容3.8.4）
     * @param poolName 池名称
     * @param prefab 预制体
     * @param initSize 初始数量
     * @param maxSize 最大容量（0表示无限制）
     */
    initPool(poolName: string, prefab: Prefab, initSize: number = 10, maxSize: number = 0): void {
        if (!this._pools.has(poolName)) {
            const pool: PoolInfo = {
                prefab,
                activeNodes: new Set(),
                inactiveNodes: [],
                maxSize
            };

            // 预创建对象
            for (let i = 0; i < initSize; i++) {
                const node = instantiate(prefab);
                node.parent = this._poolRoot;
                node.active = false;
                pool.inactiveNodes.push(node);
            }

            this._pools.set(poolName, pool);
        }
    }

    /**
     * 从对象池获取对象
     * @param poolName 池名称
     * @param parent 指定父节点
     */
    get(poolName: string, parent?: Node): Node | null {
        const pool = this._pools.get(poolName);
        if (!pool) {
            console.warn(`Pool ${poolName} not initialized!`);
            return null;
        }

        let node: Node;

        if (pool.inactiveNodes.length > 0) {
            node = pool.inactiveNodes.pop()!;
        } else {
            // 检查最大容量限制
            if (pool.maxSize > 0 && pool.activeNodes.size >= pool.maxSize) {
                console.warn(`Pool ${poolName} reached max size!`);
                return null;
            }
            node = instantiate(pool.prefab);
        }

        // 初始化节点
        node.active = true;
        node.parent = parent || this._poolRoot;
        pool.activeNodes.add(node);

        return node;
    }

    /**
     * 回收对象
     * @param poolName 池名称
     * @param node 需要回收的节点
     * @param reset 是否执行重置
     */
    put(poolName: string, node: Node, reset: boolean = true): void {
        const pool = this._pools.get(poolName);
        if (!pool) {
            console.warn(`Pool ${poolName} not found!`);
            return;
        }

        if (!pool.activeNodes.has(node)) {
            console.warn('Trying to recycle unmanaged node!');
            return;
        }

        // 重置节点状态
        if (reset) {
            node.parent = this._poolRoot;
            node.active = false;
            node.setPosition(0, 0, 0);
            node.setRotationFromEuler(0, 0, 0);
            node.setScale(1, 1, 1);
        }

        pool.activeNodes.delete(node);
        pool.inactiveNodes.push(node);
    }

    /**
     * 清空指定对象池
     * @param poolName 池名称
     */
    clearPool(poolName: string): void {
        const pool = this._pools.get(poolName);
        if (pool) {
            [...pool.activeNodes, ...pool.inactiveNodes].forEach(node => node.destroy());
            this._pools.delete(poolName);
        }
    }

    /**
     * 清空所有对象池
     */
    clearAll(): void {
        this._pools.forEach((_, name) => this.clearPool(name));
    }

    /**
     * 获取池统计信息
     */
    getPoolStats(poolName: string): string {
        const pool = this._pools.get(poolName);
        return pool ? 
            `${poolName}: Total=${pool.activeNodes.size + pool.inactiveNodes.length} ` +
            `(Active: ${pool.activeNodes.size}, Inactive: ${pool.inactiveNodes.length})` :
            'Pool not found';
    }
}