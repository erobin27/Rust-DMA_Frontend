import { LootContainer } from "./items/lootContainer.interface";
import { Ore } from "./items/ore.interface";
import { Player } from "./player.interface";

export interface LootContainerMessage {
  bradley_crate: LootContainer[];
  codelockedhackablecrate: LootContainer[];
  codelockedhackablecrate_oilrig: LootContainer[];
  crate_ammunition: LootContainer[];
  crate_basic: LootContainer[];
  crate_elite: LootContainer[];
  crate_food_1: LootContainer[];
  crate_food_2: LootContainer[];
  crate_fuel: LootContainer[];
  crate_medical: LootContainer[];
  crate_mine: LootContainer[];
  crate_normal: LootContainer[];
  crate_normal_2: LootContainer[];
  crate_normal_2_food: LootContainer[];
  crate_normal_2_medical: LootContainer[];
  crate_tools: LootContainer[];
  crate_underwater_advanced: LootContainer[];
  crate_underwater_basic: LootContainer[];
  diesel_barrel_world: LootContainer[];
  dm_ammo: LootContainer[];
  dm_c4: LootContainer[];
  dm_construction_resources: LootContainer[];
  dm_construction_tools: LootContainer[];
  dm_food: LootContainer[];
  dm_medical: LootContainer[];
  dm_res: LootContainer[];
  dm_tier1_lootbox: LootContainer[];
  dm_tier2_lootbox: LootContainer[];
  dm_tier3_lootbox: LootContainer[];
  foodbox: LootContainer[];
  giftbox_loot: LootContainer[];
  heli_crate: LootContainer[];
  hiddenhackablecrate: LootContainer[];
  logstash: LootContainer[];
  loot_barrel_1: LootContainer[];
  loot_barrel_2: LootContainer[];
  loot_component_test: LootContainer[];
  loot_trash: LootContainer[];
  minecart: LootContainer[];
  missionlootbox_basic: LootContainer[];
  missionstash: LootContainer[];
  oil_barrel: LootContainer[];
  presentdrop: LootContainer[];
  roadsign1: LootContainer[];
  roadsign2: LootContainer[];
  roadsign3: LootContainer[];
  roadsign4: LootContainer[];
  roadsign5: LootContainer[];
  roadsign6: LootContainer[];
  roadsign7: LootContainer[];
  roadsign8: LootContainer[];
  roadsign9: LootContainer[];
  stocking_large_deployed: LootContainer[];
  stocking_small_deployed: LootContainer[];
  supply_drop: LootContainer[];
  tacklebox: LootContainer[];
  tech_parts_1: LootContainer[];
  tech_parts_2: LootContainer[];
  trash_pile_1: LootContainer[];
  vehicle_parts: LootContainer[];
  visualshelvestest: LootContainer[];
}

export interface NodeMessage {
  sulfur: Ore[];
  stone: Ore[];
  metal: Ore[];
}

export interface DroppedItem {
  id: string;
  name: string;
  position:{
    x: number
    y: number
    z: number
  }
}

export interface IRustRadarData {
  players: Player[];
  nodes: {
    sulfur: Ore[];
    stone: Ore[];
    metal: Ore[];
  };
  loot: LootContainer[];
  items: DroppedItem[]
}
