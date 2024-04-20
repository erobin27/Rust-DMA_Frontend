export interface Settings {
  sulfur: boolean;
  stone: boolean;
  metal: boolean;

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

  [key: string]: boolean;
}
