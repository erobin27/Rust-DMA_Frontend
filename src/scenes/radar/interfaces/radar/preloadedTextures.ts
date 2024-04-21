export interface PreloadedTextures {
  localPlayer?: THREE.Texture;
  enemyPlayer?: THREE.Texture;
  teamPlayer?: THREE.Texture;
  npc?: THREE.Texture;

  sulfur?: THREE.Texture;
  metal?: THREE.Texture;
  stone?: THREE.Texture;

  hazmat?: THREE.Texture;

  crate_normal_2?: THREE.Texture;
  crate_normal_2_food?: THREE.Texture;
  crate_normal_2_medical?: THREE.Texture;
  crate_normal?: THREE.Texture;
  crate_elite?: THREE.Texture;
  bradley_crate?: THREE.Texture;
  heli_crate?: THREE.Texture;
  crate_basic?: THREE.Texture;
  crate_tools?: THREE.Texture;
  supply_drop?: THREE.Texture;
  loot_barrel_1?: THREE.Texture;
  loot_barrel_2?: THREE.Texture;
  oil_barrel?: THREE.Texture;
  foodbox?: THREE.Texture;

  [key: string]: THREE.Texture | undefined;
}
