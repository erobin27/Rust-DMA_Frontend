import * as THREE from "three";
import {
  FontLoader,
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/Addons.js";
import { Position } from "../interfaces/game/position.interface";
import { ISceneItem } from "../interfaces/radar/sceneItem.interface";

export const alignText = (text: THREE.Mesh, position: THREE.Vector3): void => {
  const textGeo = text.geometry as TextGeometry;
  textGeo.computeBoundingBox();

  // Only compute the translation offsets if needed
  const offsets = {
    x: 0,
    y: 0,
    z: 0,
  };
  if (textGeo.boundingBox) {
    offsets.x = 0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
    offsets.y = 0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
    offsets.z = 0.5 * (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z);
  }

  // Apply the centering offset to the mesh's position
  text.position.x = position.x - offsets.x;
  text.position.y = position.y - offsets.y;
  text.position.z = position.z - offsets.z;
};

// text.position.set(position.x, position.y, 0.1);
// text.geometry.computeBoundingBox();
// if (text.geometry.boundingBox) {
//   // Get the bounding box size
//   const size = text.geometry.boundingBox.getSize(new THREE.Vector3());
//   text.position.x = text.position.x - 0.5 * size.x; // Center horizontally
//   text.position.y = text.position.y - 0.5 * size.y; // Center Vertically
//   text.position.z = position.z;
// }

interface AddTextInput {
  textId: string;
  textString: string;
  color: string;
  parameters: Omit<TextGeometryParameters, "font">;
  position?: Position;
}

export const addText = async (
  input: AddTextInput
): Promise<ISceneItem["text"]> => {
  const loader = new FontLoader();
  const { textId, textString, color, parameters, position } = input;

  return new Promise((resolve) => {
    loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
      const textGeometry = new TextGeometry(textString, {
        ...parameters,
        font: font,
      });

      // After loading the font and creating the text geometry
      textGeometry.computeBoundingBox();
      const offset = textGeometry.boundingBox?.getCenter(new THREE.Vector3()).negate();
      textGeometry.translate(offset?.x || 0, offset?.y || 0, offset?.z || 0);

      const textMaterial = new THREE.MeshBasicMaterial({ color });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(position?.x ?? 0, position?.y ?? 0, position?.z ?? 0.1);
      text.name = textId;
      resolve(text);
    });
  });
};
