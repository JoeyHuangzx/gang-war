import { _decorator, Component, director, EditBox, Node } from 'cc';
import { GameManager } from '../../Core/GameManager';
import { LogManager } from '../../Core/LogManager';
import { PlayerData } from '../../Core/PlayerData';
import HttpClient from '../../Net/HttpClient';
import { UserData } from '../../Net/NetApi';
import { Toast } from '../Common/Toast';
import { BaseUI } from './BaseUI';
import { UIType } from '../Enum/UIEnum';
import { UIManager } from '../UIManager';
import { GameUIData } from './GameUI';
import StorageManager from '../../Core/StorageManager';
import { Constants } from '../../Global/Constants';
const { ccclass, property } = _decorator;

@ccclass('LoginUI')
export class LoginUI extends BaseUI {
  @property(EditBox)
  public userName: EditBox = null;

  @property(Node)
  public loginButton: Node = null;

  @property(Node)
  public createUserButton: Node = null;

  @property(Node)
  public resetButton: Node = null;

  start() {
    this.loginButton.on(Node.EventType.TOUCH_END, this.onLoginButtonClick, this);
    this.createUserButton.on(Node.EventType.TOUCH_END, this.onCreateUserButtonClick, this);
    this.resetButton.on(Node.EventType.TOUCH_END, this.reset, this);
    const data = StorageManager.getInstance().getData<UserData>(Constants.STORAGE_KEY.USER_DATA);
    if (data) {
      this.userName.string = data.name;
      PlayerData.getInstance().initData(data);
    }
  }

  update(deltaTime: number) {}

  async onLoginButtonClick() {
    try {
      const data = await HttpClient.getInstance().getUser(this.userName.string);
      LogManager.debug('获取用户信息', data);
      this.enterGame(data.data);
    } catch (error) {
      LogManager.error('获取用户信息失败', error);
      Toast.show(error);
    }
  }

  async onCreateUserButtonClick() {
    const data = await HttpClient.getInstance().createUser(this.userName.string);
    LogManager.debug('创建用户', data);
    this.enterGame(data.data);
    PlayerData.getInstance().savePlayerInfo();
  }

  enterGame(userData: UserData) {
    PlayerData.getInstance().initData(userData);

    director.loadScene('main', () => {
      LogManager.info('加载 main 场景完成');
      GameManager.getInstance().initManagers();
      UIManager.getInstance().showUI<GameUIData>(UIType.GameUI, { gold: 100, level: 1 });
    });
  }

  async reset() {
    const result = await HttpClient.getInstance().resetUser(PlayerData.getInstance().UserData.id);
    LogManager.debug('重置用户数据', result);
    if (result) {
      PlayerData.getInstance().initData(result.data);
      StorageManager.getInstance().deleteData(Constants.STORAGE_KEY.USER_DATA);
      Toast.show('重置成功');
    } else {
      Toast.show('重置失败');
    }
  }
}
