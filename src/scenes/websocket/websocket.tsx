import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { IRustRadarData } from "../radar/interfaces/game/rustRadarData.interface";
import { CommandPayload, GetRecoilResponse } from "../radar/interfaces/data/commandPayload.interface";
import { CommandType } from "../radar/interfaces/data/command.enum";
import { LocalPlayer } from "../radar/interfaces/game/localPlayer.interface";
import { CRYPTO_KEY, decrypt, encrypt, isEncrypted } from "./crypto";

// Create a context
const WebSocketContext = createContext<{
  data: IRustRadarData | null;
  localPlayerData: LocalPlayer | null,
  ids: string[];
  removeIds: string[];
  wsError: string | null;

  messagesPerSecond: number;
  url?: string;
  isConnected: boolean;
  closeConnection: () => void;
  send: (msg: string) => void;
}>({
  data: null,
  localPlayerData: null,
  ids: [],
  removeIds: [],
  wsError: null,

  messagesPerSecond: 0,
  url: "",
  isConnected: false,
  closeConnection: () => {},
  send: () => {},
});

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState(null);
  const [localPlayerData, setLocalPlayerData] = useState({holding: { name: 'none'}});
  const [wsError, setWsError] = useState(null);
  const [ids, setIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [removeIds, setRemoveIds] = useState<string[]>([]);
  const idsRef = useRef<string[]>([]); // Ref to keep track of ids
  const messageCountRef = useRef(0);
  const [messagesPerSecond, setMessagesPerSecond] = useState(0);

  const websocketRef = useRef<WebSocket | null>(null);

  
  // const localMachineIpv4 = "192.168.1.94";
  // const port = "9002";
  // const localMachineIpv4 = "localhost";
  // const port = "8765";
  
  const localMachineIpv4 = import.meta.env.VITE_WEBSOCKET_HOST;
  const port = import.meta.env.VITE_WEBSOCKET_PORT;
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

    const itemIds = data.items.map((item) => item.id)

    return [...playerIds, ...nodeIds, ...lootIds, ...itemIds];
  };

  const findMissingIds = (list1: string[], list2: string[]): string[] => {
    // Use filter to iterate through list1 and keep only the IDs that are not in list2
    const missingIds = list1.filter((id) => !list2.includes(id));

    // if (missingIds.length)
    // console.log("comparing ", { old: list1, new: list2 });
    return missingIds;
  };


  /*
      Update Game Data
      ----------------
      This function is called the most, it is for messages related to updating the game
      items and information.
  */
  const dataUpdate = (data: IRustRadarData) => {
    const newIds = getIdsFromData(data);
            const idsToRemove = findMissingIds(idsRef.current, newIds);
            setData(data as never);
            setIds(newIds);
            if (!(idsToRemove.length === 0 && removeIds.length === 0))
              setRemoveIds(idsToRemove);
            idsRef.current = newIds; // Update the ref's current value each time you setIds
  }

  const getRecoil = (data: GetRecoilResponse) => {
    console.log(data);
    const newLp = { ...localPlayerData, holding: data };
    setLocalPlayerData(newLp);
    console.log(newLp);
  }
  
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
      const data = isEncrypted ? decrypt(event.data, CRYPTO_KEY) : event.data;
      const parsed: CommandPayload = JSON.parse(data);
      switch(parsed.type) {
        case CommandType.NORMAL:
          dataUpdate(parsed.data);
          break;
        case CommandType.RECOIL_GET:
          console.log("get recoil");
          getRecoil(parsed.data);
          break;
        case CommandType.ERR:
          setWsError(parsed.data)
          break;
        default:
          break;
      }
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

  const sendMessage = (msg: string) => {
    console.log(msg);
    const message = isEncrypted ? encrypt(msg, CRYPTO_KEY) : msg
    websocketRef.current?.send(message);
  };

  return (
    <WebSocketContext.Provider
      value={{
        data,
        localPlayerData,
        ids,
        removeIds,
        wsError,

        messagesPerSecond,
        url: websocketUrl,
        isConnected,
        closeConnection,
        send: sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data and close function
export const useWebSocket = () => useContext(WebSocketContext);
