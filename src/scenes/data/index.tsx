/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useWebSocket } from "../test/websocket";
import ReactJson from "react-json-view";
import { Box, Button } from "@mui/material";

const DataScene: React.FC = () => {
  const {
    data,
    closeConnection,
  } = useWebSocket();

  const [frozenData, setFrozenData] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const toggleFreeze = () => {
    if (!isFrozen) {
      setFrozenData(data ? data : null); // Freeze the current data
    }
    setIsFrozen(!isFrozen); // Toggle the frozen state
  };

  console.log(isFrozen ? frozenData : data);
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
          onClick={() => setSelectedData("playerData")}
          disabled={isFrozen}
        >
          Player Data
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setSelectedData("nodeData")}
          disabled={isFrozen}
        >
          Node Data
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setSelectedData("lootData")}
          disabled={isFrozen}
        >
          Loot Data
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={() => setSelectedData("removePlayerData")}
          disabled={isFrozen}
        >
          Remove Player Data
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setSelectedData("removeNodeData")}
          disabled={isFrozen}
        >
          Remove Node Data
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setSelectedData("removeLootData")}
          disabled={isFrozen}
        >
          Remove Loot Data
        </Button>

        <Button variant="contained" color="error" onClick={closeConnection}>
          Disconnect WebSocket
        </Button>
      </Box>
    </div>
  );
};

export default DataScene;
