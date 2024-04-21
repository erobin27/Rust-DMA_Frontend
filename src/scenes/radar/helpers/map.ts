import * as THREE from "three";
import { Dimensions } from "../interfaces/radar/dimensions.interface";
import { Position } from "../interfaces/game/position.interface";

export let mapScale: Dimensions = { width: 1, height: 1 };
export let map: THREE.Mesh;

export const convertGamePositionToMap = (position: Position): THREE.Vector3 => {
  const v3: THREE.Vector3 = new THREE.Vector3();
  const customScale = 1;
  const x = position.x * customScale * mapScale.width;
  const y = position.z * customScale * mapScale.height;
  v3.set(x, y, 0.1);

  return v3;
};

export const calculateMapScale = (
  geometry: THREE.PlaneGeometry,
  texture: THREE.Texture
): Dimensions => {
  const mapWidth = geometry.parameters.width;
  const mapHeight = geometry.parameters.height;

  const image = texture.image as HTMLImageElement; // Cast to HTMLImageElement for TypeScript
  const originalWidth = image.width;
  const originalHeight = image.height;

  const xScale = mapWidth / originalWidth;
  const yScale = mapHeight / originalHeight;

  console.log(
    `Original Image Dimensions: ${originalWidth} x ${originalHeight}`
  );
  console.log(`Scale: ${xScale} x ${yScale}`);

  return { width: xScale, height: yScale };
};

export const setupMap = (scene: THREE.Scene): void => {
  // Load and display image
  const loader = new THREE.TextureLoader();
  loader.load("/map/map.png", (texture) => {
    // Image aspect ratio
    const imageAspect = texture.image.height / texture.image.width;

    // Calculate dimensions for the geometry that maintain the image's aspect ratio
    let planeWidth, planeHeight;
    if (window.innerWidth / window.innerHeight > imageAspect) {
      // Window is wider than the image
      planeHeight = window.innerHeight;
      planeWidth = planeHeight * imageAspect;
    } else {
      // Window is taller than the image
      planeWidth = window.innerWidth;
      planeHeight = planeWidth / imageAspect;
    }

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    console.log(`Map Dimensions: ${planeWidth}x${planeHeight}`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setZ(0);
    mesh.name = "MAP";

    // Add mesh to the scene
    scene.add(mesh);
    map = mesh;
    mapScale = calculateMapScale(geometry, texture);
    scene.background = new THREE.Color(0x3b8493);
  });
};
