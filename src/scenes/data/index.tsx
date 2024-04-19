/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useWebSocket } from "../test/websocket";
import ReactJson from "react-json-view";
import { Box, Button } from "@mui/material";

const DataScene: React.FC = () => {
  const { data, closeConnection } = useWebSocket();

  const [frozenData, setFrozenData] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const toggleFreeze = () => {
    if (!isFrozen) {
      setFrozenData(data ? data : null); // Freeze the current data
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
        console.log("Failed to copy data to clipboard.");
      }
    );
  };

  return (
    <div>
      <h1>Latest WebSocket Data</h1>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <ReactJson
          src={isFrozen ? frozenData : data}
          theme="apathy:inverted"
          collapsed={false}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </div>
      <Box display="flex" gap="5px">
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
      </Box>
    </div>
  );
};

export default DataScene;
