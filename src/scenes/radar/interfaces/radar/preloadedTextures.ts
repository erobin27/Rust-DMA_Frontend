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

  // Weapons
  "lmg.m249"?: THREE.Texture;
  "minigun"?: THREE.Texture;
  "multiplegrenadelauncher"?: THREE.Texture;
  "rocket.launcher"?: THREE.Texture;
  
  "rifle.ak"?: THREE.Texture;
  "rifle.bolt"?: THREE.Texture;
  "rifle.l96"?: THREE.Texture;
  "rifle.lr300"?: THREE.Texture;
  "rifle.m39"?: THREE.Texture;
  "rifle.semiauto"?: THREE.Texture;
  
  "smg.mp5"?: THREE.Texture;
  "smg.thompson"?: THREE.Texture;

  "shotgun.double"?: THREE.Texture; 
  "shotgun.pump"?: THREE.Texture; 

  "pistol.revolver"?: THREE.Texture;
  "pistol.m92"?: THREE.Texture;
  "pistol.python"?: THREE.Texture;
  "pistol.semiauto"?: THREE.Texture;

  "explosive.satchel"?: THREE.Texture;
  "explosive.timed"?: THREE.Texture;
  "ammo.rocket.basic"?: THREE.Texture;
  "gunpowder"?: THREE.Texture;
  "keycard_green"?: THREE.Texture;
  "keycard_blue"?: THREE.Texture;
  "keycard_red"?: THREE.Texture;
  "supply.signal"?: THREE.Texture;

  [key: string]: THREE.Texture | undefined;
}
