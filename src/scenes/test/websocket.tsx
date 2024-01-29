import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Create a context
const WebSocketContext = createContext<string | null>(null);

type WebSocketProviderProps = {
  children: ReactNode; // This types the children prop
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.19:9002");

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Optional: Send data to server
      // socket.send('Hello Server!');
    };

    socket.onmessage = (event) => {
      // console.log("Message from server ", event.data);
      setData(event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, []);

  return (
    <WebSocketContext.Provider value={data}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data
export const useWebSocket = () => useContext(WebSocketContext);
