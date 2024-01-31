import React, { useState } from "react";
import { useWebSocket } from "../test/websocket";
import ReactJson from "react-json-view";

const DataScene: React.FC = () => {
  const { data: latestData, closeConnection } = useWebSocket();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [frozenData, setFrozenData] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const toggleFreeze = () => {
    if (!isFrozen) {
      setFrozenData(latestData ? JSON.parse(latestData) : null); // Freeze the current data
    }
    setIsFrozen(!isFrozen); // Toggle the frozen state
  };

  return (
    <div>
      <h1>Latest WebSocket Data</h1>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <ReactJson
          src={
            isFrozen ? frozenData : latestData ? JSON.parse(latestData) : null
          }
          theme="apathy:inverted"
          collapsed={false}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </div>
      <button onClick={toggleFreeze}>
        {isFrozen ? "Unfreeze Data" : "Freeze Data"}
      </button>
      <button onClick={closeConnection}>Disconnect WebSocket</button>
    </div>
  );
};

export default DataScene;
