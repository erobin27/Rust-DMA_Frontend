export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  name: string;
  team: number;
  bags: number;
  holding: string;
  position: Position;
}

export interface Ore {
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
