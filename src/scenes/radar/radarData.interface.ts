export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: string;
  name: string;
  team: number;
  bags: number;
  holding: string;
  position: Position;
}

export interface Ore {
  id: string;
  name: string;
  position: Position;
}

export interface IRustRadarData {
  players: Player[];
  nodes: {
    sulfur: Ore[];
    stone: Ore[];
    metal: Ore[];
  };
}
