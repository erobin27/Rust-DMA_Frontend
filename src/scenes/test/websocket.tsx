import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import {
  IMessage,
  LootContainerMessage,
  NodeMessage,
} from "../radar/interfaces/game/rustRadarData.interface";
import { Player } from "../radar/interfaces/game/player.interface";

// Create a context
const WebSocketContext = createContext<{
  nodeData: NodeMessage | null;
  lootData: LootContainerMessage | null;
  playerData: Player[] | null;

  refreshPlayers: Player[] | null;

  removeLoot: string[] | null;
  removeNodes: string[] | null;
  removePlayers: string[] | null;

  closeConnection: () => void;
}>({
  nodeData: null,
  lootData: null,
  playerData: null,

  refreshPlayers: null,

  removeLoot: null,
  removeNodes: null,
  removePlayers: null,

  closeConnection: () => {},
});

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [nodeData, setNodeData] = useState<NodeMessage | null>(null);
  const [removeNodes, setRemoveNodes] = useState<string[] | null>(null);

  const [lootData, setLootData] = useState<LootContainerMessage | null>(null);
  const [removeLoot, setRemoveLoot] = useState<string[] | null>(null);

  const [playerData, setPlayerData] = useState<Player[] | null>(null);
  const [refreshPlayers, setRefreshPlayers] = useState<Player[] | null>(null);
  const [removePlayers, setRemovePlayers] = useState<string[] | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocketRef.current = new WebSocket("ws://192.168.1.19:9002");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocketRef.current.onmessage = (event) => {
      const parsed: IMessage = JSON.parse(event.data);
      switch (parsed.type) {
        case "PLAYERS_ADD":
          setPlayerData(parsed.payload);
          break;
        case "PLAYERS_REFRESH":
          setRefreshPlayers(parsed.payload);
          break;
        case "PLAYERS_REMOVE":
          setRemovePlayers(parsed.payload);
          break;

        case "NODES_ADD":
          setNodeData(parsed.payload);
          break;
        case "NODES_REMOVE":
          setRemoveNodes(parsed.payload);
          break;

        case "LOOT_ADD":
          setLootData(parsed.payload);
          break;
        case "LOOT_REMOVE":
          setRemoveLoot(parsed.payload);
          break;
        default:
          console.log("idk", parsed);
      }
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
        nodeData,
        lootData,
        playerData,

        refreshPlayers,

        removeLoot,
        removeNodes,
        removePlayers,

        closeConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket data and close function
export const useWebSocket = () => useContext(WebSocketContext);
