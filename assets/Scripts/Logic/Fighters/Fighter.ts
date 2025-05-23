import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { PoolManager } from '../Pools/PoolManager';
import { Constants } from '../../Global/Constants';
import { Quaternion } from '../../Common/Utils/Quaternion';
import { FighterTypeEnum } from '../../Global/FighterTypeEnum';
import { FighterModel } from './FighterModel';
import { FighterAnimationEnum } from './FighterAnimationEnum';
import { FighterData } from '../../Datas/CsvConfig';
import { LogManager } from '../../Core/LogManager';
import { FighterManager } from '../../Core/FighterManager';
import { ResourceManager } from '../../Core/ResourceManager';
import { Effect } from '../Effects/Effect';
import { EventManager } from '../../Core/EventManager';
import { EventName } from '../../Global/EventName';
import { SettleUIData } from '../../UI/Views/SettleUI';
const { ccclass, property } = _decorator;

/**
 * 士兵战斗的主要逻辑都在这里
 */
@ccclass('Fighter')
export class Fighter extends Component {
  @property(Node)
  shadow: Node = null;

  @property(Node)
  modelParent: Node = null;

  fighterModel: FighterModel = null;

  @property
  moveSpeed: number = 3; // 移动速度
  @property
  private attackRange: number = 2; // 攻击范围

  private _hp: number = 0;
  private _damage: number = 0;
  public enemies: Node[] = []; // 敌方小兵列表
  private targetEnemy: Fighter | null = null; // 当前目标敌人
  private isAttacking: boolean = false; // 是否在攻击
  private _isDead: boolean = false;
  public IsDead(): boolean {
    return this._isDead;
  }
  private _isGameOver = false;
  ticker = 0;
  findEnemyDt = 1;
  fighterType: FighterTypeEnum = FighterTypeEnum.Self;
  fighterData: FighterData = null;
  pos = 0;

  start() {
    // this.node.setScale(new Vec3(0.5, 0.5, 0.5));
  }

  initData(fighterData: FighterData, _formationType: FighterTypeEnum, _pos: number): Fighter {
    this.fighterData = fighterData;
    this.pos = _pos;
    const modelName = Constants.FIGHTER_MODEL_TYPE_MAP[fighterData.type];
    LogManager.info('initData model name:', _formationType, modelName);
    let model = PoolManager.getInstance().get(modelName); // instantiate(modelPrefab);
    model.name = fighterData.prefabName;
    this._hp = fighterData.hp;
    this.modelParent.addChild(model);
    model.setPosition(0, 0, 0);

    this._damage = fighterData.attack * FighterManager.getInstance().attackAddition;
    this.fighterType = _formationType;
    if (this.fighterType === FighterTypeEnum.Enemy) {
      this.modelParent.setWorldRotation(Quaternion.GetQuatFromAngle(new Vec3(0, 270, 0)));
    }
    this._isDead = false;
    this.targetEnemy = null;
    this.fighterModel = this.modelParent.getComponentInChildren(FighterModel);
    this.fighterModel.playAnimation(FighterAnimationEnum.Idle);
    EventManager.on(EventName.GAME_OVER, this.gameOver, this);
    return this;
  }

  update(deltaTime: number) {
    if (this._isDead) return;
    this.ticker += deltaTime;
    if (this.targetEnemy && !this._isGameOver) {
      const myPos = this.node.position;
      const targetPos = this.targetEnemy.node.position;
      const distance = Vec3.distance(myPos, targetPos);

      if (distance > this.attackRange) {
        this.moveToTarget(targetPos, deltaTime);
      } else {
        this.fighterModel.playAnimation(FighterAnimationEnum.Attack);
        this.startAttack(); // 进入攻击
      }
    }
  }

  gameStart() {
    this.shadow.active = false;
    this.findEnemy();
  }

  gameOver(data: SettleUIData) {
    this.targetEnemy = null;
    this.isAttacking = false;
    this._isGameOver = true;
    this.fighterModel.playAnimation(data.result ? FighterAnimationEnum.Win : FighterAnimationEnum.Idle);
  }

  findEnemy() {
    this.scheduleOnce(() => {
      if (this._isGameOver) {
        this.unscheduleAllCallbacks();
        return;
      }
      this.isAttacking = false;
      this.targetEnemy = FighterManager.getInstance().findClosestEnemy(this); // 继续寻找新的目标
      if (!this.targetEnemy && !this.targetEnemy?.IsDead) {
        // LogManager.debug('没有目标');
        this.fighterModel.playAnimation(FighterAnimationEnum.Idle);
      }
    }, 1); // 假设攻击间隔 1 秒
  }

  /** 让小兵朝目标移动 */
  private moveToTarget(targetPos: Vec3, dt: number): void {
    const direction = new Vec3();
    Vec3.subtract(direction, targetPos, this.node.position);
    direction.normalize();

    const moveOffset = new Vec3(direction.x * this.moveSpeed * dt, 0, direction.z * this.moveSpeed * dt);

    const worldPos = this.node.position.add(moveOffset);
    this.node.setWorldPosition(worldPos);
    this.fighterModel.playAnimation(FighterAnimationEnum.Run);
  }

  // /** 计算最近的敌人 */
  // public findClosestEnemy(): void {
  //   let closestEnemy: Node | null = null;
  //   let minDistance = Infinity;

  //   for (const enemy of this.enemies) {
  //     const distance = Vec3.distance(this.node.position, enemy.position);
  //     // LogManager.debug(`mid:${distance}`);
  //     if (distance < minDistance) {
  //       minDistance = distance;
  //       closestEnemy = enemy;
  //     }
  //   }

  //   this.targetEnemy = closestEnemy.getComponent(Fighter);
  // }

  /** 进入攻击状态 */
  private startAttack(): void {
    if (this.isAttacking) return;
    this.isAttacking = true;
    // LogManager.debug(`${this.node.name} 开始攻击 ${this.targetEnemy?.name}`);
    this.attackEffect();
    if (this.targetEnemy) {
      // 这里可以添加攻击动画
      this.fighterModel.playAnimation(FighterAnimationEnum.Attack);
      this.targetEnemy.onDamage(this._damage);
    }

    this.findEnemy();
  }

  /**
   * 受到伤害
   */
  public onDamage(_damage: number) {
    // 根据攻击力、攻击距离、攻击类型等因素计算伤害
    // 例如：攻击力 * 攻击距离 / 100
    // LogManager.debug(`${this.node.name} 受到 ${_damage} 点伤害`);
    this._hp -= _damage;
    this._hp = Math.max(0, this._hp);
    if (this._hp <= 0 && !this._isDead) {
      this.die();
    }
  }

  public async attackEffect() {
    ResourceManager.getInstance()
      .load(Constants.PREFAB_PATH.ATTACK_EFFECT, Prefab)
      .then((_prefab: Prefab) => {
        const attackEffect = instantiate(_prefab);
        this.node.addChild(attackEffect);
        attackEffect.setPosition(this.node.position);
        attackEffect.getComponent(Effect).playEffect();
      })
      .catch(error => {
        LogManager.error('加载攻击特效失败', error);
      });
  }

  /**
   * 死亡
   */
  public async die(): Promise<void> {
    if (this.fighterType !== FighterTypeEnum.Self) {
      FighterManager.getInstance().addGold(this.fighterData.coin);
    }
    this._isDead = true;
    this.targetEnemy = null;
    FighterManager.getInstance().removeFighter(this);
    this.fighterModel.setAnimationFinishedCallback(() => {
      FighterManager.getInstance().checkGameResult();
      this.recycle();
    });
    this.fighterModel.playAnimation(FighterAnimationEnum.Dead);
  }

  public recycle() {
    LogManager.debug('recycle:', this.node.name);
    EventManager.off(EventName.GAME_OVER, this.gameOver);
    PoolManager.getInstance().put(this.fighterModel.node.name, this.fighterModel.node);
    PoolManager.getInstance().put(Constants.PREFAB_NAME.FIGHTER, this.node);
  }

  resetData() {
    this.targetEnemy = null;
    this._hp = this.fighterData.hp;
    this._damage = this.fighterData.attack;
    this.node.active = true;
    this.shadow.active = true;
    this.fighterModel.playAnimation(FighterAnimationEnum.Idle);
  }
}
