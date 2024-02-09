/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISceneItem {
  dot?: THREE.Mesh;
  text?: THREE.Mesh;
  sprite?: THREE.Sprite;
  originalScale?: THREE.Vector3;
  key?: string;
}

export type Category = "players" | "nodes" | "loot";

/*
  players: {
    love: {...}
  },
  nodes: {
    sulfur: {
      "5d84b6e2-47f2-4861-b7c7-30af65b11213": { ... },
      "5d84b6e2-47f2-4861-b7c7-30af65b11213": { ... },
      "5d84b6e2-47f2-4861-b7c7-30af65b11213": { ... },
      "5d84b6e2-47f2-4861-b7c7-30af65b11213": { ... }
    }
  }
*/
export interface ISceneItems {
  players: {
    [playerName: string]: ISceneItem;
  };
  nodes: {
    [nodeId: string]: ISceneItem;
  };
  loot: {
    [lootContainerId: string]: ISceneItem;
  };
  [key: string]: any;
}
