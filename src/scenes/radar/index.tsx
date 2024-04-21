import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Radar from "./Radar";
import { SideBar } from "./sidebar";
import { Settings } from "./interfaces/radar/settings.interface";

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

  useEffect(() => {}, []);

  const settingsActions = {
    refresh,
    setRefresh,
    following,
    setFollowing,
  };

  return (
    <Box display={"flex"} height="100vh" overflow="hidden">
      <SideBar
        settings={settings}
        setSettings={setSettings}
        settingsActions={settingsActions}
      />
      <Radar settings={settings} settingsActions={settingsActions} />
    </Box>
  );
};

export default RadarScene;
