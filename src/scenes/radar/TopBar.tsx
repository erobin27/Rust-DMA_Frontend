/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../assets/theme";
import { SettingsActions } from "./interfaces/radar/settings.interface";
import RefreshIcon from "@mui/icons-material/Refresh";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import NearMeDisabledIcon from "@mui/icons-material/NearMeDisabled";
import NearMeIcon from "@mui/icons-material/NearMe";
import TitleIcon from "@mui/icons-material/Title";

export const TopBar = ({
  settingsActions,
}: {
  settingsActions: SettingsActions;
}) => {
  const { following, setFollowing, refresh, setRefresh, showText, setShowText } = settingsActions;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
      </Box>
    </Box>
  );
};
