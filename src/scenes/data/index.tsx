/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useWebSocket } from "../test/websocket";
import ReactJson from "react-json-view";
import { Box, Button } from "@mui/material";

const DataScene: React.FC = () => {
  const {
    playerData,
    nodeData,
    lootData,
    refreshPlayers,
    removeLoot,
    removeNodes,
    removePlayers,
    closeConnection,
  } = useWebSocket();

  const [frozenData, setFrozenData] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>("playerData");

  const toggleFreeze = () => {
    if (!isFrozen) {
      console.log("Freezing: ", selectedData);
      switch (selectedData) {
        case "playerData":
          setFrozenData(playerData ? playerData : null); // Freeze the current data
          break;
        case "nodeData":
          setFrozenData(nodeData ? nodeData : null); // Freeze the current data
          break;
        case "lootData":
          setFrozenData(lootData ? lootData : null); // Freeze the current data
          break;

        case "removePlayerData":
          setFrozenData(removePlayers ? removePlayers : null); // Freeze the current data
          break;
        case "removeNodeData":
          setFrozenData(removeNodes ? removeNodes : null); // Freeze the current data
          break;
        case "removeLootData":
          setFrozenData(removeLoot ? removeLoot : null); // Freeze the current data
          break;
        default:
          console.log("Unsupported", selectedData);
      }
    }
    setIsFrozen(!isFrozen); // Toggle the frozen state
  };

  const getSelectedData = () => {
    switch (selectedData) {
      case "playerData":
        return playerData;
      case "nodeData":
        return nodeData;
      case "lootData":
        return lootData;
      case "removePlayerData":
        return removePlayers;
      case "removeNodeData":
        return removeNodes;
      case "removeLootData":
        return removeLoot;
      default:
        console.log("Unsupported", selectedData);
        return null;
    }
  };

  return (
    <div>
      <h1>Latest WebSocket Data</h1>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <ReactJson
          src={isFrozen ? frozenData : getSelectedData()}
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
