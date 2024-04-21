import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Radar from "./Radar";
import { SideBar } from "./sidebar";
import {
  Settings,
  SettingsActions,
} from "./interfaces/radar/settings.interface";
import { TopBar } from "./Topbar";

const defaultSettings: Settings = {
  sulfur: true,
  stone: true,
  metal: true,

  crate_normal_2: true,
  crate_normal_2_food: true,
  crate_normal_2_medical: true,
  crate_normal: true,
  crate_elite: true,
  bradley_crate: true,
  heli_crate: true,
  crate_basic: true,
  crate_tools: true,
  supply_drop: true,
  loot_barrel_1: true,
  loot_barrel_2: true,
  oil_barrel: true,
};

const RadarScene: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(true);
  const [showText, setShowText] = useState<boolean>(true);

  useEffect(() => {}, []);

  const settingsActions: SettingsActions = {
    refresh,
    setRefresh,
    following,
    setFollowing,
    showText,
    setShowText,
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
