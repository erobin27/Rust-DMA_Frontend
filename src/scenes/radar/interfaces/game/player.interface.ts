import { Position } from "./position.interface";

export interface Player {
  id: string;
  name: string;
  team: number;
  bags: number;
  holding: string;
  position: Position;
}
