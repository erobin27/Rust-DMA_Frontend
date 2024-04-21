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
};
