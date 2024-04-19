import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import {
  IRustRadarData,
} from "../radar/interfaces/game/rustRadarData.interface";

// Create a context
const WebSocketContext = createContext<{
  data: IRustRadarData | null;

  closeConnection: () => void;
}>({
  data: null,
  closeConnection: () => {},
});

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState(null);

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // const localMachineIpv4 = "192.168.1.94";
    // const port = "9002";
    const localMachineIpv4 = "localhost";
    const port = "8765";
    websocketRef.current = new WebSocket(`ws://${localMachineIpv4}:${port}`);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocketRef.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      websocketRef.current?.close();
    };
  }, []);

  const closeConnection = () => {
    websocketRef.current?.close();
  };

  return (
    <WebSocketContext.Provider
      value={{
        data,

        closeConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data and close function
export const useWebSocket = () => useContext(WebSocketContext);
