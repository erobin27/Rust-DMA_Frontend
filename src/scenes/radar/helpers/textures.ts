import { PreloadedTextures } from "../interfaces/radar/preloadedTextures";
import * as THREE from "three";

export const preloadedTextures: PreloadedTextures = {};
export const loadTextures = (): void => {
  const textureLoader = new THREE.TextureLoader();
  // Players
  preloadedTextures.localPlayer = textureLoader.load(
    "/icons/custom/player.png"
  );
  preloadedTextures.enemyPlayer = textureLoader.load("/icons/custom/enemy.png");
  preloadedTextures.teamPlayer = textureLoader.load("/icons/custom/team.png");
  preloadedTextures.npc = textureLoader.load("/icons/custom/npc.png");
  preloadedTextures.sleeper = textureLoader.load("/icons/custom/sleeper.png");

  // Nodes
  preloadedTextures.sulfur = textureLoader.load("/icons/nodes/sulfur.ore.png");
  preloadedTextures.metal = textureLoader.load("/icons/nodes/metal.ore.png");
  preloadedTextures.stone = textureLoader.load("/icons/nodes/stones.png");

  //Other
  preloadedTextures.hazmat = textureLoader.load("/icons/hazmatsuit.png");

  // Loot Containers
  preloadedTextures.crate_normal_2 = textureLoader.load(
    "/icons/lootContainers/crate_normal_2.png"
  );
  preloadedTextures.crate_normal_2_food = textureLoader.load(
    "/icons/lootContainers/crate_normal_2_food.png"
  );
  preloadedTextures.crate_normal_2_medical = textureLoader.load(
    "/icons/lootContainers/crate_normal_2_medical.png"
  );
  preloadedTextures.crate_normal = textureLoader.load(
    "/icons/lootContainers/crate_normal.png"
  );
  preloadedTextures.crate_elite = textureLoader.load(
    "/icons/lootContainers/crate_elite.png"
  );
  preloadedTextures.bradley_crate = textureLoader.load(
    "/icons/lootContainers/bradley_crate.png"
  );
  preloadedTextures.heli_crate = textureLoader.load(
    "/icons/lootContainers/heli_crate.png"
  );
  preloadedTextures.crate_basic = textureLoader.load(
    "/icons/lootContainers/crate_basic.png"
  );
  preloadedTextures.crate_tools = textureLoader.load(
    "/icons/lootContainers/crate_tools.png"
  );
  preloadedTextures.supply_drop = textureLoader.load(
    "/icons/lootContainers/supply_drop.png"
  );
  preloadedTextures.loot_barrel_1 = textureLoader.load(
    "/icons/lootContainers/loot_barrel_1.png"
  );
  preloadedTextures.loot_barrel_2 = textureLoader.load(
    "/icons/lootContainers/loot_barrel_2.png"
  );
  preloadedTextures.oil_barrel = textureLoader.load(
    "/icons/lootContainers/oil_barrel.png"
  );
preloadedTextures.foodbox = textureLoader.load(
    "/icons/lootContainers/foodbox.png"
  );

  // WEAPONS
  preloadedTextures["rifle.ak"] = textureLoader.load(
    "/icons/items/rifle.ak.png"
  );
  preloadedTextures["rifle.bolt"] = textureLoader.load(
    "/icons/items/rifle.bolt.png"
  );
  preloadedTextures["rifle.l96"] = textureLoader.load(
    "/icons/items/rifle.l96.png"
  );
  preloadedTextures["rifle.lr300"] = textureLoader.load(
    "/icons/items/rifle.lr300.png"
  );
  preloadedTextures["rifle.m39"] = textureLoader.load(
    "/icons/items/rifle.m39.png"
  );
  preloadedTextures["rifle.semiauto"] = textureLoader.load(
    "/icons/items/rifle.semiauto.png"
  );
  preloadedTextures["smg.mp5"] = textureLoader.load(
    "/icons/items/smg.mp5.png"
  );
  preloadedTextures["smg.thompson"] = textureLoader.load(
    "/icons/items/smg.thompson.png"
  );
  preloadedTextures["shotgun.pump"] = textureLoader.load(
    "/icons/items/shotgun.pump.png"
  );
  preloadedTextures["shotgun.double"] = textureLoader.load(
    "/icons/items/shotgun.double.png"
  );
  preloadedTextures["pistol.python"] = textureLoader.load(
    "/icons/items/pistol.python.png"
  );
  preloadedTextures["pistol.revolver"] = textureLoader.load(
    "/icons/items/pistol.revolver.png"
  );
  preloadedTextures["pistol.semiauto"] = textureLoader.load(
    "/icons/items/pistol.semiauto.png"
  );
  preloadedTextures["pistol.m92"] = textureLoader.load(
    "/icons/items/pistol.m92.png"
  );
  preloadedTextures["rocket.launcher"] = textureLoader.load(
    "/icons/items/rocket.launcher.png"
  );
  preloadedTextures["lmg.m249"] = textureLoader.load(
    "/icons/items/lmg.m249.png"
  );
  preloadedTextures.minigun = textureLoader.load(
    "/icons/items/minigun.png"
  );
  preloadedTextures.multiplegrenadelauncher = textureLoader.load(
    "/icons/items/multiplegrenadelauncher.png"
  );

  // MISC ITEMS
  preloadedTextures["explosive.satchel"] = textureLoader.load(
    "/icons/items/explosive.satchel.png"
  );
  preloadedTextures["explosive.timed"] = textureLoader.load(
    "/icons/items/explosive.timed.png"
  );
  preloadedTextures["ammo.rocket.basic"] = textureLoader.load(
    "/icons/items/ammo.rocket.basic.png"
  );
  preloadedTextures.gunpowder = textureLoader.load(
    "/icons/items/gunpowder.png"
  );
  preloadedTextures.keycard_green = textureLoader.load(
    "/icons/items/keycard_green.png"
  );
  preloadedTextures.keycard_blue = textureLoader.load(
    "/icons/items/keycard_blue.png"
  );
  preloadedTextures.keycard_red = textureLoader.load(
    "/icons/items/keycard_red.png"
  );
  preloadedTextures["supply.signal"] = textureLoader.load(
    "/icons/items/supply.signal.png"
  );
};
