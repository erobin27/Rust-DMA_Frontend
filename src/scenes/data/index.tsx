import React, { useState } from "react";
import { useWebSocket } from "../test/websocket";

const DataScene: React.FC = () => {
  const latestData = useWebSocket();
  const [frozenData, setFrozenData] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const toggleFreeze = () => {
    if (!isFrozen) {
      setFrozenData(latestData); // Freeze the current data
    }
    setIsFrozen(!isFrozen); // Toggle the frozen state
  };

  // Beautify JSON data
  const beautifyJson = (data: string | null) => {
    if (!data) return null;
    try {
      const parsedData = JSON.parse(data);
      return JSON.stringify(parsedData, null, 2); // Indent with 2 spaces
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      return "Invalid JSON data";
    }
  };

  return (
    <div>
      <h1>Latest WebSocket Data</h1>
      <pre
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        {beautifyJson(isFrozen ? frozenData : latestData)}
      </pre>
      <button onClick={toggleFreeze}>
        {isFrozen ? "Unfreeze Data" : "Freeze Data"}
      </button>
    </div>
  );
};
export default DataScene;
