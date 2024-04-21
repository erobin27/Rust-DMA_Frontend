/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { tokens } from "../../assets/theme";
import {
  Settings,
  SettingsActions,
} from "./interfaces/radar/settings.interface";

interface IItem {
  title: string;
  settingsKey: string;
  img: string;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const Item = ({ title, settingsKey, img, settings, setSettings }: IItem) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const enabled = settings[settingsKey];
  const grayScale = enabled ? "grayscale(0%)" : "grayscale(100%)";
  const onClick = () => {
    const update = { ...settings };
    update[settingsKey] = !enabled;
    setSettings(update);
  };
  const textColor = enabled ? colors.greenAccent[500] : colors.grey[900];

  return (
    <MenuItem
      style={{ color: colors.grey[100] }}
      icon={
        <img
          src={img}
          alt="icon"
          style={{ filter: grayScale, width: 40, height: 40 }}
        />
      }
      color={enabled ? undefined : "grey"}
      onClick={onClick}
    >
      <Typography variant="h4" color={textColor}>
        {title}
      </Typography>
    </MenuItem>
  );
};

interface IItemHeading {
  category: string;
  spacing?: string;
}

const ItemHeading = ({ category, spacing }: IItemHeading) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mt={spacing} ml={"5px"}>
      <Typography
        variant="h5"
        color={colors.grey[400]}
        noWrap
        textOverflow="ellipsis"
      >
        {category}
      </Typography>
    </Box>
  );
};

export const SideBar = ({
  settings,
  setSettings,
  settingsActions,
}: {
  settings: Settings;
  setSettings: any;
  settingsActions: SettingsActions;
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Box
      sx={{
        "& .pro-icon-wrapper": {
          backgroundColor: "rgba(255, 255, 255, 0.00) !important",
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,

          "& .pro-sidebar-layout": isCollapsed
            ? { scrollbarWidth: "none" }
            : {
                direction: "rtl", // Right-to-left to move scrollbar to the left
                // Styling the scrollbar
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                },
              },
        },
        "& .pro-sidebar-wrapper": {
          backgroundColor: `transparent !important`,
          flex: 1,
        },
        "& .pro-inner-item": {
          padding: `5px 35px 5px 20px !important`,
        },
        "& .pro-inner-item:hover": {
          color: `#868dfb !important`,
        },
        "& .pro-menu-item:active": {
          color: `#6870fa !important`,
        },
        "#root": {
          display: "flex",
          overflow: "hidden",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuRoundedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  Lovely's Menu
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuRoundedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <ItemHeading category="Nodes" />
            <Item
              title="Sulfur"
              settingsKey="sulfur"
              img="/icons/nodes/sulfur.ore.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Stones"
              settingsKey="stone"
              img="/icons/nodes/stones.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Metal"
              settingsKey="metal"
              img="/icons/nodes/metal.ore.png"
              settings={settings}
              setSettings={setSettings}
            />

            <ItemHeading category="Loot Containers" spacing="40px" />
            <Item
              title="Normal Crate"
              settingsKey="crate_normal_2"
              img="/icons/lootContainers/crate_normal_2.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Food Crate"
              settingsKey="crate_normal_2_food"
              img="/icons/lootContainers/crate_normal_2_food.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Medical Crate"
              settingsKey="crate_normal_2_medical"
              img="/icons/lootContainers/crate_normal_2_medical.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Military Crate"
              settingsKey="crate_normal"
              img="/icons/lootContainers/crate_normal.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Elite Crate"
              settingsKey="crate_elite"
              img="/icons/lootContainers/crate_elite.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Bradley Crate"
              settingsKey="bradley_crate"
              img="/icons/lootContainers/bradley_crate.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Heli Crate"
              settingsKey="heli_crate"
              img="/icons/lootContainers/heli_crate.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Basic Box"
              settingsKey="crate_basic"
              img="/icons/lootContainers/crate_basic.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Tool Box"
              settingsKey="crate_tools"
              img="/icons/lootContainers/crate_tools.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Supply Drop"
              settingsKey="supply_drop"
              img="/icons/lootContainers/supply_drop.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Loot Barrel 1"
              settingsKey="loot_barrel_1"
              img="/icons/lootContainers/loot_barrel_1.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Loot Barrel 2"
              settingsKey="loot_barrel_2"
              img="/icons/lootContainers/loot_barrel_2.png"
              settings={settings}
              setSettings={setSettings}
            />
            <Item
              title="Oil Barrel"
              settingsKey="oil_barrel"
              img="/icons/lootContainers/oil_barrel.png"
              settings={settings}
              setSettings={setSettings}
            />
            {!isCollapsed && (
              <Box pb="30px">
                <ItemHeading category="Settings" />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="10px"
                  padding="10px"
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      settingsActions.setRefresh(true);
                    }}
                  >
                    Refresh
                  </Button>
                  <Button variant="outlined">Deselect All</Button>
                  <Button
                    variant="outlined"
                    color={settingsActions.following ? "error" : "success"}
                    onClick={() => {
                      settingsActions.setFollowing(!settingsActions.following);
                    }}
                  >
                    {settingsActions.following
                      ? "Disable Following"
                      : "Enable Following"}
                  </Button>
                  <Button variant="outlined" color="error">
                    Disconnect
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};
