
export class Constants{

    public static BASE_URL = 'http://localhost:3000';

    public static BASE_FIGHTER = 101;

     //在线奖励相关
     public static ONLINE = {
        MAX_TIME: 1800,            //30分钟
        // MAX_TIME: 60,            //4个小时
        PROFIT_PER_SECOND: 0.01,       //每秒收益 当前买兵价格的1%
        TIME_PER_CIRCLE: 10         //转一圈所需时间
    }
    
    public static STORAGE_KEY = {
        USER_DATA: 'userData',
        GAME_DATA: 'gameData',
        GAME_SETTING: 'gameSetting',
        GAME_SETTING_KEY: {
            SOUND: 'sound',
            MUSIC: 'music'
        } 
    } as const;

}