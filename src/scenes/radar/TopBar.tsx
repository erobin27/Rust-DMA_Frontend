/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-pro-sidebar/dist/css/styles.css";
import { Alert, Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../assets/theme";
import {
  RenderLevel,
  SettingsActions,
} from "./interfaces/radar/settings.interface";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import NearMeDisabledIcon from "@mui/icons-material/NearMeDisabled";
import NearMeIcon from "@mui/icons-material/NearMe";
import TitleIcon from "@mui/icons-material/Title";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import { useWebSocket } from "../test/websocket";

export const TopBar = ({
  settingsActions,
}: {
  settingsActions: SettingsActions;
}) => {
  const {
    following,
    setFollowing,
    refresh,
    setRefresh,
    showText,
    setShowText,
    renderLevel,
    setRenderLevel,
  } = settingsActions;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isConnected, url } = useWebSocket();

  return (
    <Box
      color="red"
      sx={{
        position: "absolute",
        // top: "0px" /* Adjust as needed */,
        // left: "0px" /* Adjust as needed */,
        width: "100%" /* Set your desired width */,
        // height: "250px" /* Set your desired height */,
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "red",
      }}
    >
      <Box
        borderRadius="15px"
        sx={{
          margin: "10px",
          padding: "5px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Refresh">
          <IconButton
            color="primary"
            onClick={() => {
              setRefresh(true);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={following ? "Stop Following" : "Follow"}>
          <IconButton
            color="primary"
            onClick={() => {
              setFollowing(!following);
            }}
          >
            {following ? <NearMeDisabledIcon /> : <NearMeIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={showText ? "Disable Text" : "Show Text"}>
          <IconButton
            color="primary"
            onClick={() => {
              setShowText(!showText);
            }}
          >
            {showText ? <FormatClearIcon /> : <TitleIcon />}
          </IconButton>
        </Tooltip>

        {
          // ABOVE
          renderLevel === RenderLevel.ABOVE ? (
            <Tooltip title="Above">
              <IconButton
                color="primary"
                onClick={() => {
                  setRenderLevel(RenderLevel.BELOW);
                }}
              >
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
          ) : // BELOW
          renderLevel === RenderLevel.BELOW ? (
            <Tooltip title="Below">
              <IconButton
                color="primary"
                onClick={() => {
                  setRenderLevel(RenderLevel.BOTH);
                }}
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          ) : // BOTH
          renderLevel === RenderLevel.BOTH ? (
            <Tooltip title="Both">
              <IconButton
                color="primary"
                onClick={() => {
                  setRenderLevel(RenderLevel.AUTO);
                }}
              >
                <SwapVertIcon />
              </IconButton>
            </Tooltip>
          ) : (
            //AUTO
            <Tooltip title="Automatic">
              <IconButton
                color="primary"
                onClick={() => {
                  setRenderLevel(RenderLevel.ABOVE);
                }}
              >
                <HdrAutoIcon />
              </IconButton>
            </Tooltip>
          )
        }
      </Box>
      { !isConnected && <Alert severity="error">Not connected to websocket. {url}</Alert> }
    </Box>
  );
};
