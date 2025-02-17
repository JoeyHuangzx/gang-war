// CustomPool.ts
import { _decorator, Node, instantiate, director } from 'cc';
const { ccclass } = _decorator;

type PoolConfig = {
    prefab: Node;
    initSize?: number;
    maxSize?: number;
    createCallback?: (node: Node) => void;
    recycleCallback?: (node: Node) => void;
    destroyCallback?: (node: Node) => void;
};

export class CustomPool {
    // 核心数据结构
    private _available: Node[] = [];
    private _inUse = new Set<Node>();
    private _poolRoot: Node;
    
    // 配置参数
    private readonly config: Required<PoolConfig>;
    
    // 统计信息
    private _totalCreated = 0;
    private _lastExpandTime = 0;

    constructor(config: PoolConfig) {
        // 参数校验
        if (!config.prefab) {
            throw new Error("Pool requires a valid prefab!");
        }

        // 初始化配置
        this.config = {
            initSize: 10,
            maxSize: 1000,
            createCallback: node => node.active = false,
            recycleCallback: node => node.active = false,
            destroyCallback: node => node.destroy(),
            ...config
        };

        // 创建池根节点
        this._poolRoot = new Node(`PoolRoot_${config.prefab.name}`);
        director.getScene()?.addChild(this._poolRoot);

        // 预初始化对象
        this.expandPool(this.config.initSize);
    }

    /**
     * 获取对象（支持自动扩容）
     */
    public get(): Node {
        // 优先使用可用对象
        if (this._available.length > 0) {
            return this.activateNode(this._available.pop()!);
        }

        // 扩容检查
        if (this.canExpand) {
            this.expandPool(Math.ceil(this.totalCount * 0.5));
            return this.activateNode(this._available.pop()!);
        }

        // 创建新对象（突破maxSize的紧急情况）
        console.warn(`Pool exceeding max size, current: ${this.totalCount}`);
        return this.createNode();
    }

    /**
     * 回收对象
     */
    public recycle(node: Node): void {
        if (!this._inUse.has(node)) {
            console.warn("Trying to recycle unknown node");
            return;
        }

        // 执行回收回调
        this.config.recycleCallback(node);
        
        // 重置节点状态
        node.parent = this._poolRoot;
        
        // 移入可用队列
        this._inUse.delete(node);
        this._available.push(node);
    }

    /**
     * 清空对象池
     */
    public clear(immediate = false): void {
        // 处理使用中的对象
        this._inUse.forEach(node => {
            immediate ? this.config.destroyCallback(node) : this.safeRecycle(node)
        });
        
        // 处理可用对象
        this._available.forEach(node => this.config.destroyCallback(node));
        
        // 重置状态
        this._available = [];
        this._inUse.clear();
        this._totalCreated = 0;
    }

    /**
     * 内存优化（缩减池容量）
     */
    public shrink(targetSize: number): void {
        if (targetSize >= this._available.length) return;
        
        const removeCount = this._available.length - targetSize;
        this._available.splice(0, removeCount).forEach(node => {
            this.config.destroyCallback(node);
            this._totalCreated--;
        });
    }

    //============== 状态查询 ==============//
    get totalCount(): number {
        return this._totalCreated;
    }

    get availableCount(): number {
        return this._available.length;
    }

    get inUseCount(): number {
        return this._inUse.size;
    }

    get memorySize(): number {
        return this._totalCreated * this.avgObjectSize;
    }

    //============== 核心逻辑 ==============//
    private expandPool(count: number): void {
        const actualCount = Math.min(
            count,
            this.config.maxSize - this.totalCount
        );

        for (let i = 0; i < actualCount; i++) {
            this._available.push(this.createNode());
        }

        this._lastExpandTime = Date.now();
    }

    private createNode(): Node {
        const node = instantiate(this.config.prefab);
        node.parent = this._poolRoot;
        this.config.createCallback(node);
        this._totalCreated++;
        return node;
    }

    private activateNode(node: Node): Node {
        this._inUse.add(node);
        node.active = true;
        return node;
    }

    private get canExpand(): boolean {
        return this.totalCount < this.config.maxSize;
    }

    private get avgObjectSize(): number {
        // 可根据实际项目添加内存估算逻辑
        return 1024; // 示例值 1KB
    }

    private safeRecycle(node: Node): void {
        if (node.isValid) {
            this.recycle(node);
        } else {
            this._inUse.delete(node);
            this._totalCreated--;
        }
    }
}