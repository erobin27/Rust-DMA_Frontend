/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useWebSocket } from "../websocket/websocket";
import ReactJson from "react-json-view";
import { Alert, Box, Button, NativeSelect, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type DataType = "Data" | "Ids" | "Remove Ids";

const DataScene: React.FC = () => {
  const { messagesPerSecond, data, ids, removeIds, isConnected, url, closeConnection } =
    useWebSocket();

  const [frozenData, setFrozenData] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [selected, setSelected] = useState<DataType>("Data");
  const navigate = useNavigate();

  const toggleFreeze = () => {
    if (!isFrozen) {
      switch (selected) {
        case "Data":
          setFrozenData(data ? data : {}); // Freeze the current data
          break;
        case "Ids":
          setFrozenData(ids ? ids : []); // Freeze the current data
          break;
        case "Remove Ids":
          setFrozenData(removeIds ? removeIds : []); // Freeze the current data
          break;
      }
    }
    setIsFrozen(!isFrozen); // Toggle the frozen state
  };

  const copyToClipboard = () => {
    const copied = JSON.stringify(isFrozen ? frozenData : data);
    navigator.clipboard.writeText(copied).then(
      () => {
        console.log("Copied data to clipboard.");
      },
      () => {
        console.error("Failed to copy data to clipboard.");
      }
    );
  };

  return (
    <Box sx={{ padding: "30px", width: "100%" }}>
      {isConnected ? (
        <Alert severity="success">Connected to websocket. {url}</Alert>
      ) : (
        <Alert severity="error">Not connected to websocket. {url}</Alert>
      )}
      <h1>Latest WebSocket Data</h1>
      <Typography variant="h5">{messagesPerSecond} Messages Per Second</Typography>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {(() => {
          switch (selected) {
            case "Data":
              return (
                <ReactJson
                  src={isFrozen ? frozenData : data}
                  theme="apathy:inverted"
                  collapsed={false}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              );
            case "Ids":
              return (
                <ReactJson
                  src={isFrozen ? frozenData : ids}
                  theme="apathy:inverted"
                  collapsed={false}
                  enableClipboard={true}
                  displayDataTypes={false}
                />
              );
            case "Remove Ids":
              return (
                <ReactJson
                  src={isFrozen ? frozenData : removeIds}
                  theme="apathy:inverted"
                  collapsed={false}
                  enableClipboard={true}
                  displayDataTypes={false}
                />
              );
            default:
              return null; // Always include a default return for when none of the cases match
          }
        })()}
      </div>

      <Box display="flex" gap="5px">
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <NativeSelect
            onChange={(e) => {
              setSelected(e.target.value as DataType);
            }}
            sx={{ minWidth: "100px" }}
            disabled={isFrozen}
          >
            <option value={"Data"}>Data</option>
            <option value={"Ids"}>Ids</option>
            <option value={"Remove Ids"}>Remove Ids</option>
          </NativeSelect>
          <Button variant="contained" color="info" onClick={toggleFreeze}>
            {isFrozen ? "Unfreeze Data" : "Freeze Data"}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => copyToClipboard()}
            // disabled={isFrozen}
          >
            Copy
          </Button>
          <Button variant="contained" color="error" onClick={closeConnection}>
            Disconnect WebSocket
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Map
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DataScene;
