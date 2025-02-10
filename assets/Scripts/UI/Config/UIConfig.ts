import { UIType } from '../Enum/UIEnum';

export const UIConfig: Record<UIType, string> = {
  [UIType.LoginUI]: 'prefabs/interface/loginUI',
  [UIType.GameUI]: 'prefabs/interface/gameUI',
  [UIType.FightUI]: 'prefabs/interface/fightUI',
  [UIType.SettleUI]: 'prefabs/interface/settleUI',
  [UIType.RankUI]: 'prefabs/interface/RankUI',
  [UIType.ToolUI]: 'prefabs/interface/ToolUI',
  [UIType.UnitUI]: 'prefabs/interface/UnitUI',
};
