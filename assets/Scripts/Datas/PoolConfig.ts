import { Constants } from '../Global/Constants';

export const PoolConfig = [
  {
    name: Constants.FIGHTER_MODEL.AXE,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.AXE}`,
    initial: 3,
    max: 20,
  },
  {
    name: Constants.FIGHTER_MODEL.ALTMAN,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.ALTMAN}`,
    initial: 3,
    max: 20,
  },
  {
    name: Constants.FIGHTER_MODEL.CATAPULT,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.CATAPULT}`,
    initial: 3,
    max: 10,
  },
  {
    name: Constants.FIGHTER_MODEL.CLOWN,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.CLOWN}`,
    initial: 3,
    max: 10,
  },
  {
    name: Constants.FIGHTER_MODEL.JAVELIN,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.JAVELIN}`,
    initial: 3,
    max: 10,
  },
  {
    name: Constants.FIGHTER_MODEL.SOLDIER,
    path: `${Constants.PREFAB_PATH.FIGHTER_MODEL_DIR}${Constants.FIGHTER_MODEL.SOLDIER}`,
    initial: 3,
    max: 10,
  },
  {
    name: 'fighter',
    path: `${Constants.PREFAB_PATH.FIGHTER}`,
    initial: 3,
    max: 40,
  },
  {
    name: 'upLoop01',
    path: `${Constants.PREFAB_PATH.FIGHTER_EFFECT_01}`,
    initial: 3,
    max: 40,
  },
];
