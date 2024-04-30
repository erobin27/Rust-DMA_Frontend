/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Settings {
  // Ore
  sulfur: boolean;
  stone: boolean;
  metal: boolean;

  // LootContainers
  crate_normal_2: boolean;
  crate_normal_2_food: boolean;
  crate_normal_2_medical: boolean;
  crate_normal: boolean;
  crate_elite: boolean;
  bradley_crate: boolean;
  crate_basic: boolean;
  crate_tools: boolean;
  supply_drop: boolean;
  loot_barrel_1: boolean;
  loot_barrel_2: boolean;
  oil_barrel: boolean;
  foodbox: boolean;

  // Items
  // Weapons
  "lmg.m249": boolean;
  "minigun": boolean;
  "multiplegrenadelauncher": boolean;
  "rocket.launcher": boolean;
  
  "rifle.ak": boolean;
  "rifle.bolt": boolean;
  "rifle.l96": boolean;
  "rifle.lr300": boolean;
  "rifle.m39": boolean;
  "rifle.semiauto": boolean;
  
  "smg.mp5": boolean;
  "smg.thompson": boolean;

  "shotgun.double": boolean; 
  "shotgun.pump": boolean; 

  "pistol.revolver": boolean;
  "pistol.m92": boolean;
  "pistol.python": boolean;
  "pistol.semiauto": boolean;

  "explosive.satchel": boolean;
  "explosive.timed": boolean;
  "ammo.rocket.basic": boolean;
  "gunpowder": boolean;
  "keycard_green": boolean;
  "keycard_blue": boolean;
  "keycard_red": boolean;
  "supply.signal": boolean;

  [key: string]: boolean;
}

export enum RenderLevel {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW',
  BOTH = 'BOTH',
  AUTO = 'AUTO',
}

export interface SettingsActions {
  refresh: boolean;
  setRefresh: any;
  following: boolean;
  setFollowing: any;
  showText: boolean;
  setShowText: any;
  renderLevel: RenderLevel;
  setRenderLevel: any;
}
