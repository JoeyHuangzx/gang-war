export class Constants {
  public static GAME_TEST = {
    isGaming: false,
  };

  public static BASE_URL = 'http://localhost:3000';

  public static BASE_FIGHTER = 101;

  //在线奖励相关
  public static ONLINE = {
    MAX_TIME: 1800, //30分钟
    // MAX_TIME: 60,            //4个小时
    PROFIT_PER_SECOND: 0.01, //每秒收益 当前买兵价格的1%
    TIME_PER_CIRCLE: 10, //转一圈所需时间
  };

  public static PREFAB_NAME = {
    FIGHTER: 'fighter',
  };

  public static LAYER_ENUM = {
    PLANE: 18,
    MODEL: 19,
  };

  /*
   * 1奥特曼/2牛角/3短剑/4标枪/5投石车/6小丑
   */
  public static FIGHTER_MODEL = {
    AXE: 'axe',
    ALTMAN: 'altman',
    CLOWN: 'clown',
    CATAPULT: 'catapult',
    JAVELIN: 'javelin',
    SOLDIER: 'soldier',
  };

  public static FIGHTER_MODEL_TYPE_MAP = {
    1: Constants.FIGHTER_MODEL.AXE,
    2: this.FIGHTER_MODEL.ALTMAN,
    3: this.FIGHTER_MODEL.SOLDIER,
    4: this.FIGHTER_MODEL.JAVELIN,
    5: this.FIGHTER_MODEL.CATAPULT,
    6: this.FIGHTER_MODEL.CLOWN,
  };

  public static PREFAB_PATH = {
    FIGHTER: 'prefabs/fight/fighter',
    FIGHTER_MODEL_DIR: 'prefabs/model/man/',
    FIGHTER_EFFECT_01: 'prefabs/effect/upLoop01',
    ATTACK_EFFECT: 'prefabs/effect/attack01',
  } as const;

  public static TEXTURE_PATH = {
    FIGHTER_TEXTURE_PATH: 'texture/card/',
  };

  public static STORAGE_KEY = {
    USER_DATA: 'userData',
    GAME_DATA: 'gameData',
    GAME_SETTING: 'gameSetting',
    GAME_SETTING_KEY: {
      SOUND: 'sound',
      MUSIC: 'music',
    },
    /** 提示购买格子 */
    SLOT_BUY_HAND_TIP: 'slot_buy_hand_tip',
  } as const;
}
