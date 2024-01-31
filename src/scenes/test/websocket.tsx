import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

// Create a context
const WebSocketContext = createContext<{
  data: string | null;
  closeConnection: () => void;
}>({ data: null, closeConnection: () => {} });

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [data, setData] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocketRef.current = new WebSocket("ws://192.168.1.19:9002");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocketRef.current.onmessage = (event) => {
      setData(event.data);
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
    <WebSocketContext.Provider value={{ data, closeConnection }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data and close function
export const useWebSocket = () => useContext(WebSocketContext);
