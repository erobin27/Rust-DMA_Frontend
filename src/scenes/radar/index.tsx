import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Radar from "./Radar";
import { SideBar } from "./sidebar";
import {
  RenderLevel,
  Settings,
  SettingsActions,
} from "./interfaces/radar/settings.interface";
import { TopBar } from "./Topbar";

const defaultSettings: Settings = {
  sulfur: true,
  stone: true,
  metal: true,

  // LootContainers
  crate_normal_2: true,
  crate_normal_2_food: true,
  crate_normal_2_medical: true,
  crate_normal: true,
  crate_elite: true,
  heli_crate: true,
  bradley_crate: true,
  crate_basic: true,
  crate_tools: true,
  supply_drop: true,
  loot_barrel_1: true,
  loot_barrel_2: true,
  oil_barrel: true,
  foodbox: true,

  // Items
  // Weapons
  "lmg.m249": true,
  "minigun": true,
  "multiplegrenadelauncher": true,
  "rocket.launcher": true,
  
  "rifle.ak": true,
  "rifle.bolt": true,
  "rifle.l96": true,
  "rifle.lr300": true,
  "rifle.m39": true,
  "rifle.semiauto": true,
  
  "smg.mp5": true,
  "smg.thompson": true,

  "shotgun.double": true, 
  "shotgun.pump": true, 

  "pistol.revolver": true,
  "pistol.m92": true,
  "pistol.python": true,
  "pistol.semiauto": true,

  "explosive.satchel": true,
  "explosive.timed": true,
  "ammo.rocket.basic": true,
  "gunpowder": true,
  "keycard_green": true,
  "keycard_blue": true,
  "keycard_red": true,
  "supply.signal": true,
};

const RadarScene: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(true);
  const [showText, setShowText] = useState<boolean>(true);
  const [renderLevel, setRenderLevel] = useState<RenderLevel>(RenderLevel.BOTH);
  const [rotate, setRotate] = useState<boolean>(false);

  useEffect(() => {}, []);

  const settingsActions: SettingsActions = {
    refresh,
    setRefresh,
    following,
    setFollowing,
    showText,
    setShowText,
    renderLevel,
    setRenderLevel,
    rotate,
    setRotate,
  };

  return (
    <Box display={"flex"} height="100vh" overflow="hidden">
      <SideBar
        settings={settings}
        setSettings={setSettings}
        settingsActions={settingsActions}
      />
      <Box>
        <TopBar settingsActions={settingsActions} />
        <Radar settings={settings} settingsActions={settingsActions} />
      </Box>
    </Box>
  );
};

export default RadarScene;
