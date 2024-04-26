import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { IRustRadarData } from "../radar/interfaces/game/rustRadarData.interface";

// Create a context
const WebSocketContext = createContext<{
  data: IRustRadarData | null;
  ids: string[];
  removeIds: string[];

  messagesPerSecond: number;
  url?: string;
  isConnected: boolean;
  closeConnection: () => void;
}>({
  data: null,
  ids: [],
  removeIds: [],

  messagesPerSecond: 0,
  url: "",
  isConnected: false,
  closeConnection: () => {},
});

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState(null);
  const [ids, setIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [removeIds, setRemoveIds] = useState<string[]>([]);
  const idsRef = useRef<string[]>([]); // Ref to keep track of ids
  const messageCountRef = useRef(0);
  const [messagesPerSecond, setMessagesPerSecond] = useState(0);

  const websocketRef = useRef<WebSocket | null>(null);

  
  const localMachineIpv4 = "192.168.1.94";
  const port = "9002";
  // const localMachineIpv4 = "localhost";
  // const port = "8765";
  const websocketUrl = `ws://${localMachineIpv4}:${port}`;

  const getIdsFromData = (data: IRustRadarData): string[] => {
    const playerIds = data.players.map((player) => player.id);

    const nodeIds = Object.values(data.nodes).reduce(
      (acc: string[], category) => {
        if (Array.isArray(category)) {
          acc.push(...category.map((node) => node.id));
        }
        return acc;
      },
      []
    );

    const lootIds = data.loot.map((loot) => loot.id)

    return [...playerIds, ...nodeIds, ...lootIds];
  };

  const findMissingIds = (list1: string[], list2: string[]): string[] => {
    // Use filter to iterate through list1 and keep only the IDs that are not in list2
    const missingIds = list1.filter((id) => !list2.includes(id));

    // if (missingIds.length)
    // console.log("comparing ", { old: list1, new: list2 });
    return missingIds;
  };

  useEffect(() => {
    websocketRef.current = new WebSocket(websocketUrl);

    const interval = setInterval(() => {
      setMessagesPerSecond(messageCountRef.current);
      messageCountRef.current = 0;  // Reset counter every second
    }, 1000);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    websocketRef.current.onmessage = (event) => {
      messageCountRef.current++;
      const parsed = JSON.parse(event.data);
      const newIds = getIdsFromData(parsed);


      const idsToRemove = findMissingIds(idsRef.current, newIds);
      setData(parsed);
      setIds(newIds);

      if (!(idsToRemove.length === 0 && removeIds.length === 0))
        setRemoveIds(idsToRemove);

      idsRef.current = newIds; // Update the ref's current value each time you setIds
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    websocketRef.current.onclose = () => {
      clearInterval(interval);
      console.log("WebSocket disconnected");
    };

    return () => {
      clearInterval(interval);
      websocketRef.current?.close();
      setIsConnected(false);
    };
  }, []);

  const closeConnection = () => {
    websocketRef.current?.close();
    setIsConnected(false);
  };

  return (
    <WebSocketContext.Provider
      value={{
        data,
        ids,
        removeIds,

        messagesPerSecond,
        url: websocketUrl,
        isConnected,
        closeConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data and close function
export const useWebSocket = () => useContext(WebSocketContext);
