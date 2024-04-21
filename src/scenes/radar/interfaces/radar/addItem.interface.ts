import { Category } from "./sceneItem.interface";

export interface AddItem {
  scene: THREE.Scene;
  identifier: string;
  position: THREE.Vector3;
  rotation?: number;
  texture: THREE.Texture;
  scale: THREE.Vector3;
  label?: {
    text: string;
    color: string;
    size: number;
    offset?: number;
  };
  zoomFactor?: number;
  layerPosition?: number;
  category: Category;
}
