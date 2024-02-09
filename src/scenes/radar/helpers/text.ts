import * as THREE from "three";
import {
  FontLoader,
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/Addons.js";
import { Position } from "../interfaces/game/position.interface";
import { ISceneItem } from "../interfaces/radar/sceneItem.interface";

export const alignText = (text: THREE.Mesh, position: THREE.Vector3): void => {
  text.position.set(position.x, position.y, 0.1);
  text.geometry.computeBoundingBox();
  if (text.geometry.boundingBox) {
    // Get the bounding box size
    const size = text.geometry.boundingBox.getSize(new THREE.Vector3());
    text.position.x = text.position.x - 0.5 * size.x; // Center horizontally
    text.position.y = text.position.y - 0.5 * size.y; // Center Vertically
    text.position.z = position.z;
  }
};

export const addText = async (
  textString: string,
  color: string,
  parameters: Omit<TextGeometryParameters, "font">,
  position?: Position
): Promise<ISceneItem["text"]> => {
  const loader = new FontLoader();

  return new Promise((resolve) => {
    loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
      const textGeometry = new TextGeometry(textString, {
        ...parameters,
        font: font,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(position?.x ?? 0, position?.y ?? 0, position?.z ?? 0.1);
      resolve(text);
    });
  });
};
